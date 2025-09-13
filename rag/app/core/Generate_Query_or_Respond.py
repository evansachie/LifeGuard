from dotenv import load_dotenv
from langgraph.graph import MessagesState
from langchain.chat_models import init_chat_model
from app.core.GetUserRetrieverTool import get_user_retriever_tool
import os

load_dotenv()
response_model = init_chat_model("groq:llama-3.1-8b-instant", temperature=0)


def generate_query_or_respond(state: MessagesState):
    """Call the model to generate a response based on the current state. Given
    the question, it will decide to retrieve using the retriever tool, or simply respond to the user.
    """
    user_id = state.get("user_id")  
    retriever_tool = get_user_retriever_tool(user_id)
    response = (
        response_model
        .bind_tools([retriever_tool])
        .invoke(state["messages"])
    )
    return {"messages": [response]}


input = {
    "messages": [
        {
            "role": "user",
            "content": "What's the users age?"
        }
    ]
}


