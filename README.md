# 🍽️ Smart Canteen Order System

A modern, production-ready web application that allows college students to order food online, pay securely via Razorpay, and collect items using dynamic QR codes — eliminating physical queues and optimizing kitchen operations.

## ✨ Features

### Student Portal
* **Modern Menu:** Browse food categories with a sleek, responsive UI and dynamic search/filtering.
* **Smart Cart:** Add/remove items with real-time total calculation.
* **Razorpay Checkout:** Secure, integrated payment gateway supporting UPI, Cards, and Netbanking.
* **Order Tracking & QR Collection:** View live order status ("Preparing" -> "Ready"). Receive a dynamic QR Code upon payment for secure counter collection.

### Admin & Kitchen Portal
* **Admin Dashboard:** View live sales and revenue analytics, manage menu items dynamically, and broadcast global order statuses.
* **QR Scanner:** Built-in web scanner (`html5-qrcode`) to securely verify student collection QR codes and mark orders as "Completed".
* **Kitchen Display System (KDS):** Live auto-updating dashboard using WebSockets to track incoming orders, aggregate product counts, and bump orders to "Ready".

## 🛠️ Technology Stack

**Frontend:**
* React (Vite)
* Tailwind CSS
* Razorpay Checkout JS
* html5-qrcode
* Axios

**Backend:**
* FastAPI (Python)
* MongoDB (Motor Asyncio)
* WebSockets (Live token updates)
* Razorpay Python SDK
* qrcode & PyJWT

---

## 🚀 Setup & Installation

### Prerequisites
* Python 3.9+
* Node.js v16+
* MongoDB running locally or a MongoDB Atlas URI
* Razorpay Test Account

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=mongodb://localhost:27017
   JWT_SECRET=your_super_secret_key_change_this_in_production
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

5. Run the FastAPI server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```
   *The backend will run on `http://localhost:8000`*

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_WS_URL=ws://localhost:8000/ws/tokens
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`*

---

## 📸 Usage Flow

1. **Register/Login:** Create a new student account.
2. **Order:** Browse the Menu, add items to the cart, and click "Checkout".
3. **Pay:** Complete the payment using the Razorpay test environment.
4. **Kitchen:** Open the KDS (`/kds`) to view the incoming order and bump it to "Ready".
5. **Collect:** The student views their QR Code in their Order History. The Admin opens the Admin Panel, opens the Scanner, and scans the QR code to hand over the food.