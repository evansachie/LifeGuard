import fitz
import math

def pdf_to_chunks(pdf_bytes: bytes, chunk_size: int = 1000, chunk_overlap: int = 200) -> list[str]:

    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    full_text = ""
    for page in doc:
        full_text += page.get_text()  
    doc.close()

    full_text = full_text.strip().replace("\r", " ")

    if not full_text:
        return []
    chunks = []
    start = 0
    while start < len(full_text):
        end = start + chunk_size
        chunk = full_text[start:end]

        chunks.append(chunk)
        if end >= len(full_text):
            break

        start = end - chunk_overlap
    return chunks
