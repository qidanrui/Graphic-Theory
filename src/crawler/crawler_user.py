import requests
from bs4 import BeautifulSoup
import pickle
import time
import random
import os
import codecs

class Proxy():
    def __init__(self, lines):
        self.proxy_pool = [val.strip() for val in lines]
        self.num = len(self.proxy_pool)
        self.current = 0
    
    def getIp(self):
        temp = self.proxy_pool[self.current]
        self.current += 1
        if self.current >= self.num:
            self.current = 0
        return temp

def process_wish(user_name, num, item, user_num, ip_pool):
    try:
        wish_list = [];
        for i in xrange(0, num, 15):
            r = requests.get("https://movie.douban.com/people/" + user_name + "/wish?start="+str(i)+"&sort=time&rating=all&filter=all&mode=grid",headers={"user-agent":'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:43.0) Gecko/20100101 Firefox/43.0'}), proxies={"http":ip_pool.getIp(), "https":ip_pool.getIp()})
            file_out = codecs.open("./user/user" + str(user_num) + "/wish/page"+str(i)+ ".txt","w", "utf-8")
            print r.status_code
            file_out.write(r.text)
            file_out.close()
            soup = BeautifulSoup(r.text, "html.parser")
            movie_list = soup.find_all("div", attrs={"class":"item"})
            for val in movie_list:
                movie = {"link":val.find("a").attrs["href"], "name":val.find("em").text}
                movie["number"] = movie["link"].split("/")[-2]
                wish_list.append(movie)
            time.sleep(random.random())
        item["wish_list"] = wish_list
        time.sleep(0.1)
    except Exception as reason:
        print reason


def process_collect(user_name, num, item, user_num, ip_pool):
    try:
        collect_list = [];
        for i in xrange(0, num, 15):
            r = requests.get("https://movie.douban.com/people/"+user_name+"/collect?start="+str(i)+"&sort=time&rating=all&filter=all&mode=grid", headers={"user-agent":'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:43.0) Gecko/20100101 Firefox/43.0'}, proxies={"http":ip_pool.getIp(), "https":ip_pool.getIp()})
            print r.status_code
            file_out = codecs.open("./user/user" + str(user_num) + "/collect/page"+str(i)+ ".txt","w","utf-8")
            print r.status_code
            file_out.write(r.text)
            file_out.close()
            soup = BeautifulSoup(r.text, "html.parser")
            movie_list = soup.find_all("div", attrs={"class":"item"})
            for val in movie_list:
                movie = {"link":val.find("a").attrs["href"], "name":val.find("em").text}
                movie["number"] = movie["link"].split("/")[-2]
                movie["rating"] = val.find_all("li")[-1].find("span").attrs["class"][0]
                collect_list.append(movie)
            time.sleep(random.random())
        item["collect_list"] = collect_list
    except Exception as reason:
        print reason   
        

if __name__ == "__main__":
    user_list = pickle.load(open("./user_info.pkl", "r"))
    index = 0
    start_index = 0
    lines = open("./valid_proxy.txt", "r").readlines()
    ip_pool1 = Proxy(lines)
    for val in user_list:
        if(index < start_index):
            index += 1
            continue
        os.mkdir("../../data/raw_data/user_info/user"+str(index+1))
        os.mkdir("../../data/raw_data/user_info/user"+str(index+1) + "/wish")
        os.mkdir("../../data/raw_data/user_info/user"+str(index+1) + "/collect")
        process_wish(val, user_list[val]["num_wish"], user_list[val], index+1, ip_pool1)
        process_collect(val, user_list[val]["num_collect"], user_list[val], index+1, ip_pool1)
        user_list[val]["name"] = val
        index += 1
        pickle.dump(user_list[val], open("../../data/raw_data/user_info/user"+str(index)+".pkl", "w"))
        print str(index) + "/1000"
