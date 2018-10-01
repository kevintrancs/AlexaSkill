# Just sample grabbing sysnet ids nothing too sick...

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

with open('./constants.json') as f:
    CONSTANTS = json.load(f)

@app.route("/sysinfo", methods=['GET'])
def fullLemma():
    """
    Gets the full lemmas based off that search result
    ----------
    Returns
    -------
    Response
        Uh not error checking so whatever ima assume it always works
        json of list of full lemmas from search field
    """
    json_id = get_sys_ids(request.args.get('field'))
    senses_url = "https://babelnet.io/v5/getSynset?id={}&key={}" 
    r = requests.get(senses_url.format(json_id[0]['id'], CONSTANTS['babel_key']))
    res = r.json()
    full = []
    for item in res['senses']:
        full.append(item['properties']['fullLemma'])
    return Response(json.dumps({'fullLemma': full}), status=200, mimetype='application/json')

def get_sys_ids(search):
    """
    Gets json of lemma from babel net
    ----------
    field: String
        The lemma we searching for
    ----------
    Returns
    JSON of that lemma
    -------
    Response
        id, some other stuff...
    """
    sample_url = "https://babelnet.io/v5/getSynsetIds?lemma={}&searchLang={}&key={}"
    r = requests.get(sample_url.format(search, "EN", CONSTANTS['babel_key']))
    res = r.json()
    return res

if __name__ == "__main__":
    #0.0.0.0 cause public and shit
    app.run(host='0.0.0.0')