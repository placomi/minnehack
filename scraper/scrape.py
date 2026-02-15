import pandas as pd
import llm_analysis as llm_analysis
import Process
import json


df = pd.read_csv('/Users/michaelzewdie/CS/Hackathon/minnehack/scraper/train.csv')
df = df[['text']]
results = []

count = 0
for tweet in df[5000:6000].itertuples():
    count += 1
    print(count)
    result = llm_analysis.llm_analysis(tweet.text)
    raw = result['choices'][0]['message']['content']
    print(raw)
    if raw[3] == False:
        raw[3] = 'tragedy'
    thejson = json.loads(raw)
    if thejson.get('tragedy') == False:
        thejson['tragedy'] = 'false'
    location = thejson['location']
    thejson['latitude'] = Process.latlong(location)[0]
    thejson['longitude'] = Process.latlong(location)[1]
    thejson['text'] = tweet.text
    results.append(thejson)
    with open('/Users/michaelzewdie/CS/Hackathon/minnehack/scraper/tweets3.json', 'w') as file:
        json.dump(results, file, indent=4)
print(results)








    







    