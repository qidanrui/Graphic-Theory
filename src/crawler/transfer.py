import json
from bs4 import BeautifulSoup
import os
import pickle
import codecs

range_data = range(995, 996)
for i in range_data:
    user_data = dict()
    user_data["collect_list"] =[]
    file_list = os.listdir("../../data/raw_data/user_info/user" + str(i) + "/collect")
    for file_name in file_list:
        if ".txt" in file_name:
            html_data = BeautifulSoup(codecs.open("../../data/raw_data/user_info/user"+str(i)+"/collect/"+file_name, "r", "utf-8").read(), "html.parser")
            items = html_data.find_all("div", attrs={"class":"item"})
            for val in items:
              try:
                new_movie = dict()
                temp = val.find_all("li")
                if len(temp) < 3:
                    new_movie["rating"] = temp[1].find("span").attrs["class"][0]
                elif len(temp) > 3:
                    new_movie["rating"] = temp[2].find("span").attrs["class"][0]
                else:
                    tt = temp[2].find("span").attrs["class"][0]
                    if tt == 'comment':
                        new_movie["rating"] = temp[1].find("span").attrs["class"][0]
                    else:
                        new_movie["rating"] = tt
                new_movie["link"] = val.find("a").attrs["href"]
                new_movie["number"] = new_movie["link"].split("/")[-2]
                new_movie["name"] = val.find("em").text
                if len(new_movie["rating"]) > 6:
                    new_movie["rating"] = int(new_movie["rating"][6])
                else:
                    new_movie["rating"] = -1
                user_data["collect_list"].append(new_movie)
              except Exception as reason:
                print val.find("em").text
                print i
                print file_name
    user_data["wish_list"] =[]
    file_list = os.listdir("../../data/raw_data/user_info/user" + str(i) + "/wish")
    for file_name in file_list:
        if ".txt" in file_name:
            html_data = BeautifulSoup(codecs.open("../../data/raw_data/user_info/user"+str(i)+"/wish/"+file_name, "r", "utf-8").read(), "html.parser")
            items = html_data.find_all("div", attrs={"class":"item"})
            for val in items:
                new_movie = dict()
                new_movie["link"] = val.find("a").attrs["href"]
                new_movie["number"] = new_movie["link"].split("/")[-2]
                new_movie["name"] = val.find("em").text
                user_data["wish_list"].append(new_movie)
    user_data["no"] = i
                
    json.dump(user_data, codecs.open("../../data/raw_data/processed_user/user"+str(i)+".json", "w", "utf-8"))

