from fastapi import APIRouter, UploadFile, Form
from app.core.VectorStore import vector_store_manager
from app.core.UploadUserDocs import process_document 

router = APIRouter()

@router.post("/upload")
async def upload_pdf(
    file: UploadFile,
    user_id: str = Form(...)
):
    try:
        doc_splits = await process_document(file)
      
        vectorstore = vector_store_manager.upload_documents(doc_splits, user_id)
        
        return {
            "message": f"Successfully uploaded {len(doc_splits)} document chunks",
            "user_id": user_id,
            "chunks": len(doc_splits)
        }
    
    except Exception as e:
        return {"error": str(e)}, 500