import os
from flask import Blueprint, Flask, render_template, request, jsonify, redirect
from flask_sqlalchemy import Model, SQLAlchemy
import flask
import stripe
import json
import ast
import bcrypt
import requests_oauthlib
from requests_oauthlib.compliance_fixes import facebook_compliance_fix
from model.tables import UsersModel
from config import db
from product import product, get_products

services = Blueprint('services',__name__)

FB_CLIENT_ID = '629425321308895'
FB_CLIENT_SECRET = '063a075b18f2632c296081895811ed42'

FB_AUTHORIZATION_BASE_URL = "https://www.facebook.com/dialog/oauth"
FB_TOKEN_URL = "https://graph.facebook.com/oauth/access_token"

FB_SCOPE = ["email"]

@services.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        email = request.form.get('email') 
        password = request.form.get('password')
        print(email)
        print(password)
        try:
            user=UsersModel.query.filter_by(email=email).first()
            hashedpasswd =  user.password #hashedpassword
            passwd = str.encode(password)
            check = bcrypt.checkpw(passwd, hashedpasswd.encode("utf-8"))
            if check:
                print("The passwords match.")
                print(user.email)
                result =get_products()
                return render_template('index.html', data=result, user_data = user)
            else:
                print("The passwords do not match.")
        except:
            return render_template('login.html')
    return render_template('login.html')


@services.route('/socialogin', methods=['POST', 'GET'])
def socialogin():
    data = json.loads(request.data)
    if request.method == 'POST':
        print(data)
        result =get_products()
        return render_template('index.html', data=result)

    return render_template('index.html')


def password_generation(password):
    
    passwd = str.encode(password)
    hashed = bcrypt.hashpw(passwd, bcrypt.gensalt())
    print(hashed)
    return hashed

def check_password(password, hashedpasswd):
    if bcrypt.checkpw(password, hashedpasswd):
        return True
    else:
        return False


@services.route("/fb-login")
def fb_login():
    URL = request.url_root.strip("/")
    facebook = requests_oauthlib.OAuth2Session(
        FB_CLIENT_ID, redirect_uri=URL + "/fb-callback", scope=FB_SCOPE
    )
    authorization_url, _ = facebook.authorization_url(FB_AUTHORIZATION_BASE_URL)

    return flask.redirect(authorization_url)


@services.route("/fb-callback")
def callback():
    URL = request.url_root.strip("/")
    facebook = requests_oauthlib.OAuth2Session(
        FB_CLIENT_ID, scope=FB_SCOPE, redirect_uri=URL + "/fb-callback"
    )

    facebook = facebook_compliance_fix(facebook)

    facebook.fetch_token(
        FB_TOKEN_URL,
        client_secret=FB_CLIENT_SECRET,
        authorization_response=flask.request.url,
    )

    facebook_user_data = facebook.get(
        "https://graph.facebook.com/me?fields=id,name,email,picture{url}"
    ).json()

    email = facebook_user_data["email"]
    name = facebook_user_data["name"]
    picture_url = facebook_user_data.get("picture", {}).get("data", {}).get("url")
    result =get_products()
    return render_template('index.html', data=result, user_data = facebook_user_data)