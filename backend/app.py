from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import smtplib 
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import jwt  
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import DATABASE_URL
from models import User

engine = create_engine(DATABASE_URL)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session=Session()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "X-API-KEY"],
)

users={}
SECRET_KEY = "your_secret_key" 

class Usertype(BaseModel):
    email: str
    password: str

@app.get("/")
async def home():
    return {"message": "Welcome to FastAPI"}

def generate_verification_token(email: str):
    expiration = datetime.utcnow() + timedelta(hours=1)  
    token = jwt.encode({"email": email, "exp": expiration}, SECRET_KEY, algorithm="HS256")
    return token


def send_verification_email(email: str, token: str):
    sender_email = "xxoliverytxx@gmail.com" 
    receiver_email = email
    subject = "Verify your email"
    verification_link = f"http://localhost:8000/api/verify_email/{token}" 

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject
    body = f"Click the link to verify your email: {verification_link}"
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465) 
        server.login(sender_email,"wzhu kvqk nptu mcuv")  
        server.sendmail(sender_email, receiver_email, msg.as_string())
        server.quit()
    except Exception as e:
        print(f"Failed to send email: {str(e)}")

@app.post("/api/register")
async def register(user: Usertype):
    if user.email in users:
        raise HTTPException(status_code=400, detail="User already exists")

    users[user.email] = {"password": user.password, "verified": False}

    verification_token = generate_verification_token(user.email)

    send_verification_email(user.email, verification_token)

    return {"message": "Registration successful. Please check your email to verify your account."}

@app.get("/api/verify_email/{token}")
async def verify_email(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email = payload.get("email")
        if email not in users:
            raise HTTPException(status_code=400, detail="Invalid token")

        users[email]["verified"] = True

        add_user=User(email=email,password=users[email]["password"])
        session.add(add_user)
        session.commit()

        return {"message": "Email verified successfully. You can now proceed to profile setup."}
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid token")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
