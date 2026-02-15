import json
clean = []

with open('/Users/michaelzewdie/CS/Hackathon/minnehack/scraper/tweets.json', 'r') as file:
    data = json.load(file)
#tweet['tragedy'] != 'false' 
for tweet in data:
    if tweet['tragedy'] != 'false' and tweet.get('latitude') != None and tweet.get('longitude') != None and tweet.get('location') != 'Hiroshima':
        clean.append(tweet)

with open('/Users/michaelzewdie/CS/Hackathon/minnehack/scraper/cleantweet.json', 'w') as file:
    json.dump(clean, file, indent=4)

        


