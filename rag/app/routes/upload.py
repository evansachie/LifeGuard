from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.UploadUserDocs import upload_user_docs
from app.core.loader import loader
from app.core.pinecone_client import index
import uuid

router = APIRouter()

@router.post("/upload", status_code=201)
async def upload_pdf(user_id: str, file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    doc_splits = await loader(file)
    if not doc_splits:
        raise HTTPException(status_code=400, detail="No text found in PDF.")
    

    try:
        dummy_embedding = [0.0] * 1536 
        
        old_results = index.query(
            vector=dummy_embedding,  
            filter={"user_id": {"$eq": user_id}},
            top_k=10000,  
            include_metadata=False,
        )
        
        old_ids = [match["id"] for match in old_results.get("matches", [])]
        if old_ids:
            index.delete(ids=old_ids)
    
    except Exception as e:
        print(f"Error deleting old vectors: {e}")

    upload_user_docs(doc_splits, user_id)

    return {"message": f"Uploaded and indexed {len(doc_splits)} chunks for user {user_id}."}
