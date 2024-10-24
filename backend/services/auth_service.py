from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

mongodb_url = os.getenv("mongodb_url")
client = MongoClient(mongodb_url)
db = client["auth_db"]
users_collection = db["users"]


def get_auth_(params):

    def signup(email, password, organization=None):
        if users_collection.find_one({"email": email}):
            return {"success": False, "message": "User already exists"}

        hashed_password = generate_password_hash(password)
        user_data = {
            "email": email,
            "password": hashed_password,
            "organization": organization,
        }
        users_collection.insert_one(user_data)
        return {"success": True, "message": "User registered successfully"}
    import jwt
    from datetime import datetime, timedelta

    SECRET_KEY = "1"  # Replace with your actual secret key

    def create_token(email):
        expiration = datetime.utcnow() + timedelta(minutes=30)  # Token valid for 1 hour
        
        token = jwt.encode({"email": email, "exp": expiration}, SECRET_KEY, algorithm="HS256")
        return token

    def signin(email, password):
        user = users_collection.find_one({"email": email})
        if not user:
            return {"success": False, "message": "Invalid email"}

        if not check_password_hash(user["password"], password):
            return {"success": False, "message": "Password is incorrect"}
        
        token = create_token(email)
        
        return {
            "success": True,
            "message": "User signed in successfully",
            "organization": user.get("organization"),
            "token": token
        }
   
    if params.isSignUp:
        rlt = signup(params.email, params.password, params.organization)
        return rlt
    else:
        rlt = signin(params.email, params.password)
        return rlt
