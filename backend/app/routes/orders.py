from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
import uuid
import datetime
from app.database import get_db
from app.models.order import OrderCreate, OrderSchema, OrderItem
from app.routes.live_token import notify_token_update
from app.routes.auth import get_current_user
from app.config import settings
from app.utils.razorpay_utils import razorpay_client, verify_razorpay_signature
from app.utils.qr_utils import generate_base64_qr
from bson import ObjectId

router = APIRouter()

class RazorpayOrderRequest(BaseModel):
    amount: float

class RazorpayVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    items: List[OrderItem]
    total_price: float

@router.post("/create_razorpay_order")
async def create_razorpay_order(req: RazorpayOrderRequest, current_user: str = Depends(get_current_user)):
    try:
        # Amount is in paisa (multiply by 100)
        order_amount = int(req.amount * 100)
        order_currency = 'INR'
        
        razorpay_order = razorpay_client.order.create(dict(
            amount=order_amount,
            currency=order_currency,
            payment_capture='1'
        ))
        return {
            "razorpay_order_id": razorpay_order['id'],
            "amount": order_amount,
            "currency": order_currency,
            "key_id": settings.RAZORPAY_KEY_ID
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify_payment")
async def verify_payment(req: RazorpayVerifyRequest, current_user: str = Depends(get_current_user)):
    try:
        db = get_db()
        
        # 1. Verify Signature
        is_valid = verify_razorpay_signature(req.razorpay_order_id, req.razorpay_payment_id, req.razorpay_signature)
        
        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid payment signature")
            
        # 2. Generate QR Token and Base64 QR Image
        qr_token = str(uuid.uuid4())
        qr_code_base64 = generate_base64_qr(qr_token)
        
        # 3. Create Order
        total_orders = await db.orders.count_documents({})
        token_number = total_orders + 1

        new_order = OrderSchema(
            user_id=current_user,
            items=req.items,
            total_price=req.total_price,
            token_number=token_number,
            status="Preparing",
            payment_status="Paid",
            payment_method="Razorpay",
            razorpay_order_id=req.razorpay_order_id,
            razorpay_payment_id=req.razorpay_payment_id,
            razorpay_signature=req.razorpay_signature,
            qrToken=qr_token,
            qr_code=qr_code_base64,
            created_at=datetime.datetime.utcnow()
        )

        await db.orders.insert_one(new_order.model_dump())
        
        # 4. Broadcast to KDS
        await notify_token_update(token_number=token_number, status="Preparing")
        
        return {
            "message": "Payment verified and order placed successfully",
            "token_number": token_number,
            "qr_code": qr_code_base64
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Backend Error: {str(e)}")

# Keep the old / endpoint for Cash payments if necessary
@router.post("/", status_code=201)
async def place_order(order: OrderCreate, current_user: str = Depends(get_current_user)):
    db = get_db()
    total_orders = await db.orders.count_documents({})
    token_number = total_orders + 1

    new_order = OrderSchema(
        user_id=current_user,
        items=order.items,
        total_price=order.total_price,
        token_number=token_number,
        status="Preparing",
        payment_status=order.payment_status,
        payment_method=order.payment_method
    )
    await db.orders.insert_one(new_order.model_dump())
    await notify_token_update(token_number=token_number, status="Preparing")
    return {"message": "Order placed successfully", "token_number": token_number}

@router.get("/history")
async def get_user_history(current_user: str = Depends(get_current_user)):
    db = get_db()
    cursor = db.orders.find({"user_id": current_user}).sort("created_at", -1)
    orders = await cursor.to_list(length=100)
    for order in orders:
        order["_id"] = str(order["_id"])
    return orders

@router.get("/analytics")
async def get_analytics(current_user: str = Depends(get_current_user)):
    db = get_db()
    total_orders = await db.orders.count_documents({})
    
    # Total Revenue
    pipeline = [{"$group": {"_id": None, "total_revenue": {"$sum": "$total_price"}}}]
    result = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = result[0]["total_revenue"] if result else 0

    # Revenue by Date (last 7 days)
    rev_date_pipeline = [
        {"$group": {
            "_id": { "$dateToString": { "format": "%Y-%m-%d", "date": "$created_at" } },
            "revenue": { "$sum": "$total_price" }
        }},
        {"$sort": {"_id": 1}},
        {"$limit": 7}
    ]
    rev_date_res = await db.orders.aggregate(rev_date_pipeline).to_list(7)
    revenue_by_date = [{"date": r["_id"], "revenue": r["revenue"]} for r in rev_date_res]

    # Top Products
    top_prod_pipeline = [
        {"$unwind": "$items"},
        {"$group": {"_id": "$items.name", "quantity": {"$sum": "$items.quantity"}}},
        {"$sort": {"quantity": -1}},
        {"$limit": 5}
    ]
    top_prod_res = await db.orders.aggregate(top_prod_pipeline).to_list(5)
    top_products = [{"name": r["_id"], "sales": r["quantity"]} for r in top_prod_res]

    # Category Sales
    cat_sales_pipeline = [
        {"$unwind": "$items"},
        {"$group": {"_id": {"$ifNull": ["$items.category", "Uncategorized"]}, "sales": {"$sum": "$items.quantity"}}}
    ]
    cat_sales_res = await db.orders.aggregate(cat_sales_pipeline).to_list(20)
    category_sales = [{"name": r["_id"], "value": r["sales"]} for r in cat_sales_res]

    return {
        "total_orders": total_orders, 
        "total_revenue": total_revenue,
        "revenue_by_date": revenue_by_date,
        "top_products": top_products,
        "category_sales": category_sales
    }

@router.get("/active")
async def get_active_orders(current_user: str = Depends(get_current_user)):
    db = get_db()
    cursor = db.orders.find({"status": {"$ne": "Completed"}}).sort("created_at", 1)
    orders = await cursor.to_list(length=200)
    for order in orders:
        order["_id"] = str(order["_id"])
    return orders

@router.put("/{order_id}/status")
async def update_order_status(order_id: str, new_status: str):
    db = get_db()
    updated_order = await db.orders.find_one_and_update(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": new_status}},
        return_document=True
    )
    if not updated_order:
        raise HTTPException(status_code=404, detail="Order not found")
    await notify_token_update(token_number=updated_order["token_number"], status=new_status)
    return {"message": f"Order status updated to {new_status}"}

class QRVerifyRequest(BaseModel):
    qr_token: str

@router.post("/verify_qr")
async def verify_qr(req: QRVerifyRequest):
    db = get_db()
    
    # Find the order with this QR token that hasn't been completed yet
    order = await db.orders.find_one({"qrToken": req.qr_token})
    
    if not order:
        raise HTTPException(status_code=404, detail="Invalid QR code or order not found")
        
    if order["status"] == "Completed":
        raise HTTPException(status_code=400, detail="Order has already been collected")
        
    if order["status"] != "Ready":
        raise HTTPException(status_code=400, detail=f"Order is not ready yet. Current status: {order['status']}")
        
    # Mark as collected
    updated_order = await db.orders.find_one_and_update(
        {"_id": order["_id"]},
        {"$set": {
            "status": "Completed", 
            "collected_at": datetime.datetime.utcnow()
        }},
        return_document=True
    )
    
    await notify_token_update(token_number=updated_order["token_number"], status="Completed")
    
    return {
        "message": "QR Verified! Order collected.",
        "token_number": updated_order["token_number"],
        "items": updated_order["items"]
    }