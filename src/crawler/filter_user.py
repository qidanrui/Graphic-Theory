import requests
from bs4 import BeautifulSoup
import os
import json
import re
import pickle

class proxy():
    def __init__(self, file_name):
        self.proxy_pool = [val.strip() for val in open("file_name").readlines()]
        self.num = len(self.proxy_pool)
        self.current = 0
    
    def getIp():
        temp = self.proxy_pool[self.current]
        self.num += 1
        return temp

file_list = os.listdir("../../data/raw_data/movie")
user = pickle.load(open("user_info200", "r"))
num_wish = []
num_collect = []
length = 0
for file_name in file_list[10:]:
    print file_name
    data = json.load(open("../../data/raw_data/movie/" + file_name, "r"))
    for val in data["review"]:
      try:
        r = requests.get(val["author"]["link"])
        soup = BeautifulSoup(r.text, "html.parser")
        tag_wish = soup.find("a", attrs={"href":"https://movie.douban.com/people/" + val["author"]["link"].split("/")[-2] + "/wish"})
        tag_collect = soup.find("a", attrs={"href":"https://movie.douban.com/people/" + val["author"]["link"].split("/")[-2] + "/collect"})
        if tag_wish and tag_collect:
            num_wish = int(re.findall("\d+", tag_wish.text)[0])
            num_collect = int(re.findall("\d+", tag_collect.text)[0])
            if num_collect > 500 and num_wish > 50:
                user[val["author"]["link"].split("/")[-2]] = {"num_wish":num_wish, "wish_link":tag_wish.attrs["href"], "collect_link":tag_collect.attrs["href"], "num_collect":num_collect}
                length = len(user)
                print str(length)+ "/1000"
        if length % 200 == 0:
            pickle.dump(user, open("../../data/raw_data/user_info/user_info" + str(length+200) + ".pkl", "w"))
        if(length >= 1000):
            break
      except Exception as reason:
        print reason
        continue
    if(length >= 1000):
        break
print len(user)
pickle.dump(user, open("../../data/raw_data/user_info/user_info.pkl", "w"))
