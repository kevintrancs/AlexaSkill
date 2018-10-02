import json
import requests
from flask import Flask, Response
from bs4 import BeautifulSoup
from flask import json
from flask import request
from flask.logging import default_handler
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

with open('../server/constants.json') as f:
    CONSTANTS = json.load(f)

if __name__ == "__main__":
    #0.0.0.0 cause public and shit
    app.run(host='0.0.0.0', port=8080)