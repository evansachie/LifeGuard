from langgraph.graph import MessagesState
from langchain.chat_models import init_chat_model

response_model = init_chat_model("groq:llama-3.1-8b-instant", temperature=0)

REWRITE_PROMPT = (
    "Look at the input and try to reason about the underlying semantic intent / meaning.\n"
    "Here is the initial question:"
    "\n ------- \n"
    "{question}"
    "\n ------- \n"
    "Formulate an improved question:"
)


def rewrite_question(state: dict):
    messages = state["messages"]
    question = messages[0].content
    prompt = REWRITE_PROMPT.format(question=question)
    response = response_model.invoke([{"role": "user", "content": prompt}])
    rewrite_count = state.get("rewrite_count", 0) + 1
    
    new_state = dict(state)
    new_state["messages"] = [{"role": "user", "content": response.content}]
    new_state["rewrite_count"] = rewrite_count

    return new_state


