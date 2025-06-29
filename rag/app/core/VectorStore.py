from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
from app.core.OpenAI import client
import os

vectorstore = PineconeVectorStore(
    index_name=os.getenv("PINECONE_INDEX_NAME"),
    embedding=OpenAIEmbeddings(),
)
retriever = vectorstore.as_retriever()
