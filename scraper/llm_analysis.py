import requests, json
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('GPT_API_KEY')


def llm_analysis(text):
    api_key = os.getenv('GPT_API_KEY')
    response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    },
    data= json.dumps({
        "model": "openai/gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": "You are a specialized dataextraction agent. Your task is to analyze a single tweet and extract meta data that you will return as a json. Summary: a consise one sentence summary of the tweet, "
                "tags: list everything with hashtags but remove the hashtags. Make sure it is a list. Empty if there are no hashtags, location: the location of the issue of the tweet, JUST have 1 location. If there are two location pick one, tragedy: True if what the tweet is talking about is a tragedy, and False otherwise. ONLY return a json like "
                "'summary': string, 'tags': list[string], 'location': string, 'tragedy': boolean "
            },
        {
            "role": "user",
            "content": [
            {
                "type": "text",
                "text": f"{text}"
            },
            
            ]
        }
        ]
    })
    )
    return response.json()

