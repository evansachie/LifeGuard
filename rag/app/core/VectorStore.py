from dotenv import load_dotenv
from langchain_pinecone import PineconeVectorStore
from langchain_huggingface import HuggingFaceEndpointEmbeddings
import os

load_dotenv()
class VectorStoreManager:
    
    def __init__(self):
        self.hf_api_key = os.getenv("HUGGINGFACEHUB_API_KEY")
        self.pinecone_index_name = os.getenv("PINECONE_INDEX_NAME")
        self._embedding = HuggingFaceEndpointEmbeddings(
            huggingfacehub_api_token=self.hf_api_key,
            model="BAAI/bge-large-en-v1.5"
        )

    @property
    def embedding(self):
        return self._embedding

    def get_vectorstore(self):
        return PineconeVectorStore(
            index_name=self.pinecone_index_name,
            embedding=self._embedding,
        )
    
    def get_retriever(self, **kwargs):
        vectorstore = self.get_vectorstore()
        return vectorstore.as_retriever(**kwargs)
    
    def upload_documents(self, doc_splits, user_id):
        for i, doc in enumerate(doc_splits):
            if not hasattr(doc, "metadata"):
                doc.metadata = {}
            doc.metadata["user_id"] = user_id
            doc.metadata["chunk_index"] = i
        
        vectorstore = PineconeVectorStore.from_documents(
            documents=doc_splits,
            embedding=self._embedding,
            index_name=self.pinecone_index_name,
        )
        
        return vectorstore

vector_store_manager = VectorStoreManager()

