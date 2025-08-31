# main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pywebpush import webpush, WebPushException
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
import os

# Load environment variables (VAPID keys, email)
load_dotenv()

VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY")
VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY")
VAPID_EMAIL = os.getenv("VAPID_EMAIL", "mailto:jashwanthbavandlapalli@gmail.com")

if not VAPID_PUBLIC_KEY or not VAPID_PRIVATE_KEY:
    raise ValueError("⚠️ Missing VAPID keys in .env file")

# FastAPI app setup
app = FastAPI()

# Allow frontend (React) to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temporary store for subscriptions
subscriptions: List[dict] = []

# Pydantic model for subscription
class Subscription(BaseModel):
    endpoint: str
    keys: dict

@app.get("/")
def root():
    return {"message": "FastAPI Push Notification Backend is running 🚀"}

@app.get("/vapid_public_key")
def get_vapid_key():
    """Send the public VAPID key to frontend"""
    return {"vapidPublicKey": VAPID_PUBLIC_KEY}

@app.post("/subscribe")
async def subscribe(subscription: Subscription):
    """Save subscription sent from frontend"""
    if subscription.dict() not in subscriptions:
        subscriptions.append(subscription.dict())
    return {"message": "✅ Subscription saved!"}

@app.post("/send_notification")
async def send_notification(request: Request):
    """Send notification to all subscribers"""
    data = await request.json()
    payload = data.get("message", "Hello from FastAPI 👋")

    failed = []
    for sub in subscriptions:
        try:
            webpush(
                subscription_info=sub,
                data=payload,
                vapid_private_key=VAPID_PRIVATE_KEY,
                vapid_claims={"sub": VAPID_EMAIL},
            )
        except WebPushException as ex:
            print("❌ WebPush error:", repr(ex))
            failed.append(sub)

    return JSONResponse(
        {"message": f"Sent notification to {len(subscriptions) - len(failed)} subscribers"}
    )

# To run the app: uvicorn main:app --reload