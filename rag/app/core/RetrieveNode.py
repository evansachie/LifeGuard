from app.core.GetUserRetrieverTool import get_user_retriever_tool

def retrieve_node(state):
    user_id = state.get("user_id")
    retriever_tool = get_user_retriever_tool(user_id)
    print("retriever_tool", retriever_tool)
    last_msg = state["messages"][-1] if state["messages"] else {}
    query = ""

    
    if hasattr(last_msg, "tool_calls") and last_msg.tool_calls:
        query = last_msg.tool_calls[0]["args"]["query"]
    elif hasattr(last_msg, "content"):
        query = last_msg.content
    print(f"Query received: {query}")
    tool_result = retriever_tool.invoke(query)
    print(f"Docs found: {tool_result}")

    return {
        **state,  # preserve all previous keys
        "retrieved_chunks": tool_result,  
    }
