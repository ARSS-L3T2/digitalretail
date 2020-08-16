import os
from flask import Blueprint, Flask, render_template, request, jsonify
from flask_sqlalchemy import Model, SQLAlchemy
import stripe
import json
import ast
import configparser
import config
from config import db

app=Flask(__name__,template_folder='../client', static_url_path='', static_folder='../client')
app.config['SQLALCHEMY_DATABASE_URI'] = config.DB_URL
app.config['TEMPLATES_AUTO_RELOAD'] = True
db = SQLAlchemy(app)

from userdata import userdata
from payment import payment
from services import services
from product import product, get_products

app.register_blueprint(userdata)
app.register_blueprint(payment)
app.register_blueprint(product)
app.register_blueprint(services)


@app.route('/', methods=['GET'])
def main():
    result =get_products()
    return render_template('index.html', data=result)

if __name__ == '__main__':
  app.run(host='0.0.0.0', debug=True, ssl_context='adhoc')


