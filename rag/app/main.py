import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import OpenAIEmbeddings
from app.routes.upload import router as upload_router
from app.routes.ask import router as ask_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Health And Fitness Assistant",
    description="Ask questions about uploaded health PDF reports.",
    version="1.0.0"
)


app.add_middleware(
CORSMiddleware,
    allow_origins=["https://lifeguard-vq69.onrender.com", "http://localhost:80/docs", "http://localhost:3000", "https://lifeguard-vert.vercel.app"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(upload_router, prefix="/api")
app.include_router(ask_router, prefix="/api")

# import os, sys
# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# print("Python looks for modules in these locations:")
# for path in sys.path:
#     print(f"- {path}")