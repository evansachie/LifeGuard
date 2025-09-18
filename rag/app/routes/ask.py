from fastapi import APIRouter
from app.core.Models.AskResponse import AskResponse
from app.core.Models.AskRequest import AskRequest
from app.core.Graph import graph

router = APIRouter()



@router.post("/ask", response_model=AskResponse)
async def ask_question(req: AskRequest):
    rag_input = {
        "messages": [
            {"role": "user", "content": req.question}
        ],
        "rewrite_count": 0,
        "user_id": req.user_id, 
    }

    graph_output = graph.invoke(rag_input)
    response = graph_output["messages"][-1].content.strip()

    return AskResponse(answer=response)
