from django.shortcuts import get_object_or_404, render
import requests
from django.http import HttpResponse
from .models import Article
from django.utils import timezone


subscription_key = 'cdcdb31d1f2c4d119dcb4e029e0d4a81'
search_url = "https://api.cognitive.microsoft.com/bing/v7.0/news/search"
search_term = "Microsoft"

headers = {"Ocp-Apim-Subscription-Key" : subscription_key}
params  = {"q": search_term, "textDecorations": True, "textFormat": "HTML"}
response = requests.get(search_url, headers=headers, params=params)
response.raise_for_status()
search_results = response.json()

'''
# Create your views here.
X_Mashape_Key = 'Kp6DwgaRO2mshsLyD4qC94IT6eH5p13NIr4jsnzcaStrJ662Lm'

count = 10
q = "Tiger%20Woods"
autoCorrect = True

response=requests.get("https://contextualwebsearch-websearch-v1.p.mashape.com/api/Search/WebSearchAPI?q={}&count={}&autocorrect={}".format(q, count, autoCorrect),
headers={
    "X-Mashape-Key": "Kp6DwgaRO2mshsLyD4qC94IT6eH5p13NIr4jsnzcaStrJ662Lm",
    "Accept": "application/json"
}).json()

for article in search_results["value"]:
    url = article["url"]
    title = article["title"]
    description = article["description"]
    keywords = webPage["provider"]["name"]
    datePublished = webPage["datePublished"]

    imageUrl = webPage["image"]["url"]
    imageHeight = webPage["image"]["url"]
    imageWidth = webPage["image"]["width"]

    thumbnail = webPage["image"]["thumbnail"]
    thumbnailHeight = webPage["image"]["thumbnailHeight"]
    thumbnailWidth = webPage["image"]["thumbnailWidth"]

    outputtext = "Url: %s. Title: %s. Published Date:%s. " % (url, title, datePublished)
    #output.append(outputtext)

    #return HttpResponse(output)
    #return HttpResponse("Url: %s. Title: %s. Published Date:%s. " % (url, title, datePublished))
'''

def index(request):
    for article in search_results["value"]:
        article_instance = Article()
        url = article["url"]
        title = article["name"]
        datePublished = article["datePublished"]
        article_instance.article_title = "%s" % (title)
        article_instance.article_url = "%s" % (url)
        article_instance.article_pub_date = timezone.now()
        article_instance.save()

    article_list = Article.objects.all()
    context = {'article_list': article_list}
    return render(request, 'homepage/articles.html', context)

def detail(request, article_id):
    article = get_object_or_404(Article, pk = article_id)
    return render(request, 'homepage/detail.html', {'article': article})
