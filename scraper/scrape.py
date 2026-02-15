import pandas as pd
import llm_analysis as llm_analysis
import json
import Snippet 

df = pd.read_csv('/Users/michaelzewdie/CS/Hackathon/minnehack/web/src/app/api/test.csv')
# for tweet in df:
#     llm_analysis = llm_analysis(tweet)
#     snippet = snippet(
#         id=tweet[id]
#     )
tweet4 = df[4:5]
text = df.text[4]
Id = tweet4.id
result = llm_analysis.llm_analysis(text)
raw = result['choices'][0]['message']['content']
json = json.loads(raw)
summary = json['summary']
tags = ['tags']
location = json['location']
tradegy = json['Tradegy']
print(json['summary'], json['tags'], json['location'], json['Tradegy'])
snippet = Snippet(timestamp=1.0,summary=summary, text=text, created_by='today',verified=True,lat=1.00,Long=9.0,tags=[result['tags']])






    