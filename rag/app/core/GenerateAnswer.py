from langgraph.graph import MessagesState
from langchain.chat_models import init_chat_model
from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv("app/.env")


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
response_model = init_chat_model("openai:gpt-4-0613", temperature=1)

GENERATE_PROMPT = (
    "You are a health assistant that provides friendly,detailed and engaging answers. Use the following report excerpts to answer the question."
    "Use the following pieces of retrieved context to answer the question. If the user asks any question assume, you are doctor with the user health report as context "
    "If you need context to answer the question AND THERE'S NO CONTEXT, ask the user to upload the report for some context."
    "for instance, if the user asks 'What's my weight?', if you don't have information about the user's weight in the context, encourage the user to upload a health report.Don't answer"
    "Stick to your purpose . Don't answer questions that are not for health and fitness assistants. \n"

    "Question: {question} \n"
    "Context: {context}"
)


def generate_answer(state: MessagesState):
    """Generate an answer."""
    question = state["messages"][0].content
    context = state["messages"][-1].content

    print("context\n", context)
    prompt = GENERATE_PROMPT.format(question=question, context=context)
    response = response_model.invoke([{"role": "user", "content": prompt}])
    return {"messages": [response]}



