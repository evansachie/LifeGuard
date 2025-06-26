from pydantic import BaseModel

class AskRequest(BaseModel):
    user_id: str
    question: str
