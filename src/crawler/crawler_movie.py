import requests
from bs4 import BeautifulSoup
import pickle
import time
import json

    
def process_movie_info(content, item):
    title = content.find("h1")
    item["name"] = title.find_all("span")[0].text
    item["year"] = title.find_all("span")[1].text
    
    
    info_raw = content.find(id="info")
    information = {}
    info = info_raw.find_all("span")
    information["director"] = []
    span_list = info[2].find_all("a")
    for val in span_list:
        information["director"].append(val.text)
        
    information["screenwriter"] = []
    span_list = info[5].find_all("a")
    for val in span_list:
        information["screenwriter"].append(val.text)
        
    information["actor"] = []
    span_list = info[8].find_all("a")
    for val in span_list:
        information["actor"].append(val.text)   

    information["type"] = []
    span_list = info_raw.find_all("span", property="v:genre")
    for val in span_list:
        information["type"].append(val.text)
    lines_content = info_raw.text.split("\n")
    information["country"] = lines_content[5].split(":")[1].strip().split("/")
    information["language"] = lines_content[6].split(":")[1].strip().split("/")
    information["time"] = lines_content[7].split(":")[1].strip().split("/")
    information["length"] = lines_content[8].split(":")[1].strip().split("/")
    information["alias"] = lines_content[9].split(":")[1].strip().split("/")
    information["imdb"] = info_raw.find("a", rel="nofollow").attrs["href"]
    item["information"] = information
    
    
    interest = {}
    interest_raw = content.find(id="interest_sectl")
    interest["rate"] = interest_raw.find("strong", attrs={"property":"v:average"}).text
    interest["rating_people_num"] = interest_raw.find("span", attrs={"property":"v:votes"}).text
    temp_rating_per = interest_raw.find_all("span", attrs={"class":"rating_per"})
    interest["rating_per"] = [val.text for val in temp_rating_per]
    temp_rating_better = interest_raw.find("div", attrs={"class":"rating_betterthan"}).find_all("a")
    interest["rating_better"] = [val.text for val in temp_rating_better]
    item["interest"] = interest
    
    
    related_info_raw = content.find("div", attrs={"class":"related-info"})
    related_info = related_info_raw.find("span", attrs={"property":"v:summary"}).text
    item["related_info"] = related_info
    
    
    photo_list = content.find(id="related-pic").find_all("li")
    photo = [{"alt": val.find("img").attrs["alt"], "src": val.find("img").attrs["src"], "ref": val.find("a").attrs["href"]} for val in photo_list]
    item["photo"] = photo
    
    
    award_list = content.find_all("ul", attrs={"class":"award"})
    award = [" ".join([val1.text for val1 in val.find_all("li")]) for val in award_list]
    item["award"] = award
    
    
    related_movie_list = content.find_all("dd")
    related_movie = [{"name": val.text, "url":val.find("a").attrs["href"].split("?")[0]} for val in related_movie_list]
    item["related_movie"] = related_movie
    


def process_review(url_str, item):
    num_page = 10;
    review_list = []
    for i in xrange(num_page):
        r = requests.get(url_str + str(i * 20))
        soup = BeautifulSoup(r.text, "html.parser")
        reviews = soup.find_all("div", attrs={"typeof":"v:Review"})
        for val in reviews:
            review_list.append({"title": {"name":val.find("a", attrs={"class":"title-link"}).text, "link": val.find("a", attrs={"class":"title-link"}).attrs["href"]}, "author":  {"name":val.find("span", attrs={"property":"v:reviewer"}).text, "link": val.find("a", attrs={"class":"author"}).attrs["href"]}})
            if val.find("span", attrs={"property":"v:rating"}):
                review_list[-1]["rating"] = val.find("span", attrs={"property":"v:rating"}).attrs["class"][0][-2]
            else:
                review_list[-1]["rating"] = "undefined"
        time.sleep(0.1)
    item["review"] = review_list
                


def process_comment(url_str, item):
    num_page = 10
    comment_list = []
    for i in xrange(num_page):
        r = requests.get(url_str + "comments?start=" + str(i * 20) + "&limit=20&sort=new_score")
        soup = BeautifulSoup(r.text, "html.parser")
        comments = soup.find_all("div", attrs={"class":"comment"})
        for val in comments:
            comment_list.append({"author": {"name": val.find("span", attrs={"class":"comment-info"}).find("a").text, "link": val.find("span", attrs={"class":"comment-info"}).find("a").attrs["href"]}, "vote_num": val.find("span", attrs={"class":"comment-vote"}).find("span").text })
            rating_span = val.find("span", attrs={"class":"comment-info"}).find("span")
            if rating_span and len(rating_span.attrs["class"]) > 1:
                comment_list[-1]["rating"] = rating_span.attrs["class"][0][-2]
            else:
                comment_list[-1]["rating"] = "undefined"
        time.sleep(1)
    item["comment"] = comment_list



url_list = pickle.load(open("./top250url.pkl", "r"))
index = 61
for item in url_list[60:]:
    try:
        r = requests.get(item["movie_url"])
        soup = BeautifulSoup(r.text, "html.parser")
        content = soup.find(id="content")
        process_movie_info(content, item)
        process_review(item["movie_url"] + "reviews?start=", item)
        process_comment(item["movie_url"], item)
        file_out = open("../../data/movie/movie"+str(index)+".json", "w")
        json.dump(item, file_out)
        file_out.close()
        index += 1
        time.sleep(1)
    except Exception as reason:
        print "error movie_id: " + str(index)
        print reason
        index += 1
        continue
