import requests

url = "http://localhost:8000/api/auth/register"
payload = {
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "password123"
}

try:
    response = requests.post(url, json=payload)
    print("Status Code:", response.status_code)
    print("Response:", response.text)
except Exception as e:
    print("Connection error:", e)
