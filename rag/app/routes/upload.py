from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core import loader, embedder
from app.core.pinecone_client import index
import uuid

router = APIRouter()

@router.post("/upload", status_code=201)
async def upload_pdf(user_id: str, file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    pdf_bytes = await file.read()
    chunks = loader.pdf_to_chunks(pdf_bytes)
    if not chunks:
        raise HTTPException(status_code=400, detail="No text found in PDF.")
    embeddings = embedder.embed_texts(chunks)

    old_results = index.query(
        vector=embeddings[0],  
        filter={"user_id": {"$eq": user_id}},
        top_k=1000,  
        include_metadata=False,
    )
    old_ids = [match["id"] for match in old_results.get("matches", [])]
    if old_ids:
        index.delete(ids=old_ids)
  
    vectors = []
    for i, (chunk, emb) in enumerate(zip(chunks, embeddings)):
        vector_id = str(uuid.uuid4())
        vectors.append({
            "id": vector_id,
            "values": emb,
            "metadata": {"user_id": user_id, "chunk_index": i, "chunk": chunk},
        })
    index.upsert(vectors=vectors)
    return {"message": f"Uploaded and indexed {len(chunks)} chunks for user {user_id}."}
