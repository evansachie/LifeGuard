from dotenv import load_dotenv
from openai import OpenAI
import os


load_dotenv("app/.env")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))