from fastapi import APIRouter
from services.auth_service import get_auth_
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class AuthParams(BaseModel):
    email: str
    password: str
    organization: Optional[str]
    isSignUp: bool

@router.post("/auth")
async def get_auth(params: AuthParams):
    print(params)
    rlt = get_auth_(params)

    return rlt