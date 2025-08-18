from app.core.VectorStore import vector_store_manager
from langchain.tools.retriever import create_retriever_tool

def get_user_retriever_tool(user_id):
   
    user_retriever = vector_store_manager.get_retriever(
        search_kwargs={"filter": {"user_id": {"$eq": user_id}}}
    )

    retriever_tool = create_retriever_tool(
        user_retriever,
        name="retrieve_health_data",
        description="Search and return information about user that will help answer the question being asked.",
    )
    return retriever_tool


