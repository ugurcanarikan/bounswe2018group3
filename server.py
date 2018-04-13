import json
import os

import tornado.web
import tornado.websocket
import tornado.httpserver
import tornado.ioloop
from tornado.ioloop import IOLoop
from jinja2 import Environment, FileSystemLoader, TemplateNotFound

import pandas as pd

import tweepy as tp
from tweepy import OAuthHandler

#Write all functions in this class.
#Please use comments and necessary format like in example function.
#****EXAMPLE FUNCTION*****
#Function for searching tweets.
#Author: Recep Deniz Aksoy
def search_tweet(word):
    consumer_key = "" # API key
    consumer_secret = "" # API secret

    #Getting auth using consumer_token and consumer_secret as auth variable.
    auth = OAuthHandler(consumer_key, consumer_secret) 
    api = tp.API(auth)
    #Using tp.Cursor function get 10 tweets which have bogazici in it.
    data = tp.Cursor(api.search, q= word, languages = 'tr', tweet_mode = 'extended').items(10)
    #Printing all 10 tweets.
    raw_table = []
    for tweet in data:
            raw_table.append(tweet._json['full_text'])
    table = pd.DataFrame.from_dict(raw_table)

    return table

#A function that collects trending topics for given location
#Author: Onur Varkıvanç
def trending_topics(wloc = 1):
    consumer_key = "" # API key
    consumer_secret = "" # API secret

    #Getting auth using consumer_token and consumer_secret as auth variable.
    auth = OAuthHandler(consumer_key, consumer_secret) 
    api = tp.API(auth)

    #Get trending topics for the given location (default value is worldwide, 1) 
    trends = api.trends_place(wloc)
    #Printing the names of the topics
    raw_table = []
    for trend in trends[0]['trends']:
        raw_table.append(trend['name']) #may require checking for unicode characters
    table = pd.DataFrame.from_dict(raw_table)
    return table

class TemplateRendering:
    def render_template(self, template_name, variables={}):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        template_path = dir_path+"/templates"
        template_dirs = [ template_path ]

        env = Environment(
            loader = FileSystemLoader(template_dirs),
            auto_reload=True,
            autoescape=False
        )
        env.globals['S'] = '/static'

        try:
            template = env.get_template(template_name)
        except TemplateNotFound:
            raise TemplateNotFound(template_name)

        content = template.render(variables)

        return content

class resultHandler(tornado.web.RequestHandler, TemplateRendering):
    def post(self):
        method_type = self.get_argument('method_type')
        username = self.get_argument('username')
        val1 = self.get_argument('val1')
        val2 = self.get_argument('val2')
        if(method_type == "search"):
            #Search word in val1 field.
            table = search_tweet(val1);
            self.write(self.render_template('result.html', variables = {'result' : table.to_html(index = False)}))
        elif(method_type == "tt"):
            #If no location argument is passed to the function, it shows the worldwide results.
            table = trending_topics();
            self.write(self.render_template('result.html', variables = {'result' : table.to_html(index = False)}))
        #elif(method_type == "search_user"):
            #Search user function etc..


 
class IndexPageHandler(tornado.web.RequestHandler, TemplateRendering):
    def get(self):

        self.write(self.render_template("index.html"))



class Application(tornado.web.Application):
    def __init__(self):

        handlers = [
            (r'/', IndexPageHandler),
            (r'/index.html', IndexPageHandler),
            (r'/result', resultHandler)
#            (r'/logs/(.*)',logsHandler),
#	    (r'/reports/(.*)',tornado.web.StaticFileHandler,{'path':"./reports/"})
        ]
 
        settings = {
            'template_path': 'templates',
            'static_path': 'static'
        }
        tornado.web.Application.__init__(self, handlers, **settings)
 
if __name__ == '__main__':
    pd.set_option('display.max_colwidth', -1)
    ws_app = Application()
    server = tornado.httpserver.HTTPServer(ws_app)
    server.listen(9090)
    tornado.ioloop.IOLoop.instance().start()













