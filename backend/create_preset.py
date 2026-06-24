import os
import requests
from requests.auth import HTTPBasicAuth

CLOUD_NAME = "b5jefiqz"
API_KEY = "522271644567994"
API_SECRET = "s9vd9dnQRBubr8xYVSgazwmmpZU"

url = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/upload_presets"
data = {
    "name": "canteen_unsigned_preset",
    "unsigned": True,
    "folder": "canteen_uploads"
}

response = requests.post(url, auth=HTTPBasicAuth(API_KEY, API_SECRET), data=data)
if response.status_code in [200, 201]:
    print("SUCCESS: Preset created")
elif "Already exists" in response.text:
    print("SUCCESS: Preset already exists")
else:
    print(f"ERROR: {response.text}")
