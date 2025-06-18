import os
from pinecone import Pinecone, ServerlessSpec

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "health-reports")
PINECONE_CLOUD = os.getenv("PINECONE_CLOUD", "aws")           
PINECONE_REGION = os.getenv("PINECONE_REGION", "us-west-2")   


pc = Pinecone(api_key=PINECONE_API_KEY)


if PINECONE_INDEX_NAME not in [idx.name for idx in pc.list_indexes()]:
    pc.create_index(
        name=PINECONE_INDEX_NAME,
        dimension=1536,
        metric='cosine',
        spec=ServerlessSpec(
            cloud=PINECONE_CLOUD,
            region=PINECONE_REGION
        )
    )


index = pc.Index(PINECONE_INDEX_NAME)
