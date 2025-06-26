from app.core.GetUserRetrieverTool import get_user_retriever_tool

def retrieve_node(state):
    user_id = state.get("user_id")
    retriever_tool = get_user_retriever_tool(user_id)
    last_msg = state["messages"][-1] if state["messages"] else {}
    query = ""
    tool_call_id = None

    
    if hasattr(last_msg, "tool_calls") and last_msg.tool_calls:
        query = last_msg.tool_calls[0]["args"]["query"]
        tool_call_id = last_msg.tool_calls[0]["id"]
    elif hasattr(last_msg, "content"):
        query = last_msg.content

    tool_result = retriever_tool.invoke(query)

    new_message = {
        "role": "tool",
        "content": tool_result,
        "tool_call_id": tool_call_id  
    }

    return {
        **state,
        "messages": state["messages"] + [new_message],
    }
