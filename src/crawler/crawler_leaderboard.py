import requests
from bs4 import BeautifulSoup
import sys
import time
import pickle

movie = []
movie_one_page = 25
start_index = [0, 25, 50, 75, 100, 125, 150, 175, 200, 225]
for i in start_index:
    r = requests.get("https://movie.douban.com/top250?start=" + str(i) + "&filter=")
    soup = BeautifulSoup(r.text, "html.parser")
    data = soup.find_all("li")
    num_of_li = len(data)
    start_li = num_of_li - movie_one_page
    for j in xrange(start_li, num_of_li):
        a_tag = data[j].find_all("a")
        url_movie = a_tag[0].attrs["href"]
        print data[j].find("span", attrs={"class":"title"}).text
        poster_image = a_tag[0].find_all("img")
        poster = []
        for val in poster_image:
            poster.append(val.attrs["src"])
        movie.append({"movie_url":url_movie, "poster":poster})
    time.sleep(1)
print(len(movie))
pickle.dump(movie, open("./top250url.pkl", "w"))
