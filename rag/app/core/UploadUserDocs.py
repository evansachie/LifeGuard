import os, dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
dotenv.load_dotenv(".env")

def upload_user_docs(doc_splits, user_id):
   
    for i, doc in enumerate(doc_splits):
        if not hasattr(doc, "metadata"):
            doc.metadata = {}
        doc.metadata["user_id"] = user_id
        doc.metadata["chunk_index"] = i 

    
    vectorstore = PineconeVectorStore.from_documents(
        documents=doc_splits,
        embedding=OpenAIEmbeddings(),
        index_name=os.getenv("PINECONE_INDEX_NAME"),
    )


