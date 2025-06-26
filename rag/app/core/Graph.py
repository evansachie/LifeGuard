from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import tools_condition
from langgraph.prebuilt import ToolNode
from app.core.Generate_Query_or_Respond import generate_query_or_respond
from app.core.Models.GraphState import GraphState
from app.core.RetrieveNode  import retrieve_node
from app.core.RewriteQuery import rewrite_question
from app.core.GenerateAnswer import generate_answer
from app.core.GradeDocuments import grade_documents


def post_retrieve_router(state: dict):
    if state.get("rewrite_count", 0) >= 4:
        return "generate_answer"

    return grade_documents(state)


workflow = StateGraph(GraphState)

workflow.add_node(generate_query_or_respond)
workflow.add_node("retrieve", retrieve_node)

workflow.add_node(rewrite_question)
workflow.add_node(generate_answer)

workflow.add_edge(START, "generate_query_or_respond")

workflow.add_conditional_edges(
    "generate_query_or_respond",
   
    tools_condition,
    {
       
        "tools": "retrieve",
        END: END,
    },
)


workflow.add_conditional_edges(
    "retrieve",
    post_retrieve_router,
)

workflow.add_edge("rewrite_question", "retrieve")
workflow.add_edge("generate_answer", END)


graph = workflow.compile()

state = {"messages": [{"role": "user", "content": "..." }]}


question = "Is my weight good?"
rag_input = {
    "messages": [
        {"role": "user", "content": question}
    ],
    "rewrite_count": 0,
    "user_id": 1
}

# for chunk in graph.stream(rag_input):
#     for node, update in chunk.items():
#         print(f"Update from node: {node}")
#         print(update["messages"][-1])

# print(graph.invoke(rag_input)["messages"][-1].content)
