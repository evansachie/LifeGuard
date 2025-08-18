from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
import tempfile
import os

async def process_document(file):

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(await file.read())
        temp_file_path = temp_file.name
    
    try:
        # Load and process document
        loader = PyPDFLoader(temp_file_path)
        documents = loader.load()
        
        # Split documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        
        doc_splits = text_splitter.split_documents(documents)
        
        return doc_splits
    
    finally:
        os.unlink(temp_file_path)

