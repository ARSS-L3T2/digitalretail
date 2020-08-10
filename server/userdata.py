import os
from flask import Blueprint, current_app, Flask, render_template, request, jsonify
from flask_sqlalchemy import Model, SQLAlchemy
import stripe
import json
import ast
from model.tables import UsersModel
from app import db

userdata = Blueprint('userdata',__name__)

@userdata.route("/getusers",methods=['GET'])
def get_all_users():
    user_data=UsersModel.query.all()
    for user in user_data:
        print (user.email)
    return  jsonify([e.serialize() for e in user_data])


@userdata.route("/getusers/<email_>",methods=['GET'])
def get_user_by_email(email_):
    user_data=UsersModel.query.filter_by(email=email_).first()
    return jsonify(user_data.serialize())

@userdata.route("/adduser",methods=['POST'])
def add_new_user():
    my_json = request.data.decode('utf8')
    data = json.loads(my_json)
    #new_user = UsersModel(email=data['email'], name=data['name'], first_name=data['firstname'], last_name=data['lastname'])
    new_user = UsersModel(data['email'],"","","")
    db.session.add(new_user)
    db.session.commit()
    print(data['email'])
    return "hello"