from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort

from cnews.auth import login_required
from cnews import config.py

bing_key = config.bing_key

bp = Blueprint('news', __name__)

@bp.route('/')
def index():
    return "Hello"
    #return render_template('news/index.html')


@login_required
def view_news():
    return "Hello2"