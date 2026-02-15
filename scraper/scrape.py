import pandas as pd
import llm_analysis as llm_analysis
import Process
import json


df = pd.read_csv('/Users/michaelzewdie/CS/Hackathon/minnehack/scraper/test.csv')
df = df[['text']]
results = []

for tweet in df[0:5].itertuples():
    result = llm_analysis.llm_analysis(tweet.text)
    raw = result['choices'][0]['message']['content']
    thejson = json.loads(raw)
    location = thejson['location']
    thejson['latitude'] = Process.latlong(location)[0]
    thejson['longitude'] = Process.latlong(location)[1]
    thejson['text'] = tweet.text
    results.append(thejson)
print(results)



    
# tweet4 = df[4:5]
# text = df.text[4]
# Id = tweet4.id
# result = llm_analysis.llm_analysis(text)
# raw = result['choices'][0]['message']['content']
# thejson = json.loads(raw)
# summary = thejson['summary']
# location = thejson['location']
# lat = Process.latlong(location)[0]
# Long = Process.latlong(location)[1]
# thejson['text'] = text
# thejson['latitude'] = lat
# thejson['longitude'] = Long

# # snippet = Snippet.Snippet(timestamp=1.0,summary=summary, text=text, created_by='Me',verified=True,lat=lat,Long=Long,tags=tags)
# # print(snippet)
# pretty_json_string = json.dumps(thejson, indent=4)
# print(pretty_json_string)






    