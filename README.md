# News Hub

Sample branch of news hub stuff.

### Dependencies

run command:

```
pip install -r requirements.txt
```

### Running/Testing

Clone repo
touch ./server/constants.json
Inside constants.json add line:

```
{
    'babel_key': 'YOUR_BABEL_KEY'
}
```

Starting server
cd ./server && python server.py

Test local
localhost:5000/sysinfo?field={search_field}

Postman:
localhost:5000/sysinfo
Key: field, Value: {search_field}
