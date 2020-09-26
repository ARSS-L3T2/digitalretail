import os
from flask import Blueprint, Flask, render_template, request, jsonify
from flask_sqlalchemy import Model, SQLAlchemy
import stripe
import json
import ast
import configparser

config = configparser.ConfigParser()
config.read(os.path.join(os.path.dirname(__file__), 'model', 'config.ini'))

POSTGRES_URL = os.environ['POSTGRES_URL']
POSTGRES_USER = os.environ['POSTGRES_USER']
POSTGRES_PW = os.environ['POSTGRES_PW']
POSTGRES_DB = os.environ['POSTGRES_DB']
STRIPE_SECRET_KEY = os.environ['STRIPE_SECRET_KEY']
STRIPE_PUBLISHABLE_KEY = os.environ['STRIPE_PUBLISHABLE_KEY']

DB_URL = 'postgresql://{user}:{pw}@{url}/{db}'.format(user=POSTGRES_USER,pw=POSTGRES_PW,url=POSTGRES_URL,db=POSTGRES_DB)

stripe_keys = {
  'secret_key': os.environ['STRIPE_SECRET_KEY'],
  'publishable_key': os.environ['STRIPE_PUBLISHABLE_KEY']
}

stripe.api_key = stripe_keys['secret_key']

db = SQLAlchemy()


