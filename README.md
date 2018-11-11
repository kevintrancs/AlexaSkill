# News Hub

Sample branch of news hub stuff.

### Dependencies

Postman:
Use postman to test API
Download: https://www.getpostman.com/

Formatter(python): autopep8

Get all python packages
Run command:

```
pip install -r requirements.txt
```

### Running/Testing

Create constants.json file in ./server/
and add

```
{
    'babel_key': 'YOUR_BABEL_KEY'
    'news_api_key': 'YOUR_NEWS_API_KEY'
}
```

_Will soon make more refined endpoints_
Starting Babel-search server

```
cd ./server && python server.py
localhost:5000/sysinfo?field={search_field}
```

Starting NewsAPI pipeline-search server

```
cd ./pipeline && python news.py
localhost:8080/api?search={search_field}
```

### Django RESTFUL

Django restful API is up, can query from dynamoDB, only have category in, no error checks but it works

```

```

Todo:
alot lol
