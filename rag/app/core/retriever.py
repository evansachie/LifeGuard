import numpy as np

def find_similar_chunks(query_vec: list[float], doc_embeddings: np.ndarray, top_k: int = 3) -> list[int]:

    if doc_embeddings.size == 0:
        return []

    q = np.array(query_vec)

    dot_products = np.dot(doc_embeddings, q) 
 
    doc_norms = np.linalg.norm(doc_embeddings, axis=1)
    q_norm = np.linalg.norm(q)

    if q_norm == 0 or np.any(doc_norms == 0):

        cosine_sim = dot_products 
    else:
        cosine_sim = dot_products / (doc_norms * q_norm)
 
    top_k_indices = np.argsort(cosine_sim)[::-1][:top_k]  
    return top_k_indices.tolist()
