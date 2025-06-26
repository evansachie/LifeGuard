from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from fastapi import UploadFile
import fitz  


async def loader(file: UploadFile):

    content = await file.read()
    

    pdf_document = fitz.open(stream=content, filetype="pdf")

    documents = []
    for page_num in range(pdf_document.page_count):
        page = pdf_document[page_num]
        text = page.get_text()
        
        
        doc = Document(
            page_content=text,
            metadata={
                "source": file.filename,
                "page": page_num
            }
        )
        documents.append(doc)
    
    pdf_document.close()
    
    # Split documents
    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        chunk_size=100, chunk_overlap=50
    )
    doc_splits = text_splitter.split_documents(documents)
    
    return doc_splits

