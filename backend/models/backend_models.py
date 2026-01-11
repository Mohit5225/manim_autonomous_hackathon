from pydantic import BaseModel, Field, EmailStr, BeforeValidator
from typing import Optional, Annotated
from datetime import datetime

 
PyObjectId = Annotated[str, BeforeValidator(str)]

class User(BaseModel):
 
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    
    clerk_id: str = Field(..., description="The ID from Clerk")
    email: EmailStr
    first_name: Optional[str] = None
    role: str = "student"
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

 
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {datetime: lambda v: v.isoformat()},
    }