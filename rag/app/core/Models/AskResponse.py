from pydantic import BaseModel 

class AskResponse(BaseModel):
    answer: str
