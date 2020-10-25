import os
from flask import Blueprint, Flask, render_template, request, jsonify, session
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
app.config["SECRET_KEY"] = config.SECRET_KEY
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
  if 'USERNAME' in session:
    user_email = session.get("USERNAME")
    return render_template('index.html', data=result, user_data =user_email)
  return render_template ('index.html', data=result)



if __name__ == '__main__':
  app.run(host='0.0.0.0', debug=True, ssl_context='adhoc', threaded=True)


