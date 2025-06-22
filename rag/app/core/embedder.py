import os
import dotenv
from openai import OpenAI
dotenv.load_dotenv("app/.env")



client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

EMBED_MODEL = "text-embedding-ada-002"

def embed_texts(text_list: list[str]) -> list[list[float]]:
    if not text_list:
        return []
    
    response = client.embeddings.create(
        model=EMBED_MODEL,
        input=text_list
    )
    return [record.embedding for record in response.data]
