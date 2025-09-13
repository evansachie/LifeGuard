from dotenv import load_dotenv
from openai import OpenAI
import os


load_dotenv()

client = OpenAI(api_key=os.getenv("GROQ_API_KEY"),
                base_url="https://api.groq.com/openai/v1")