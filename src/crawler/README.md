This is the instruction of running crawler.

file running order: crawler_leaderboard.py (crawl top 250 movie information)
                    crawler_movie.py (crawl top 250 movie complete information)
                    filter_user.py (filter user who watched and commented on the movie and get their information)
                    crawler_user.py (get user information)
                    transfer.py (extract user comment rating of each movie he watched)

Then we select movies and get similarity. The selected movies are save in user_collect_movie.pkl (pickle file). The comment of every user is saved in user_commnet.npy (numpy file). The final edge and vertex result is save in /data/simialrity.json
