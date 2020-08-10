from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask import Flask
from app import db


class ProductModel(db.Model):
    __tablename__ = 'products'

    productid = db.Column(db.String, primary_key=True)
    name = db.Column(db.String())
    imageurl  = db.Column(db.String())

    def __init__(self, name, imageurl):
        self.name = name
        self.imageurl = imageurl

    def __repr__(self):
        return '<id {}>'.format(self.productid)

    def serialize(self):
        return {
            'productid': self.productid, 
            'name': self.name,
            'imageurl': self.imageurl
        }

class UsersModel(db.Model):
    __tablename__ = 'users'

    email = db.Column(db.String, primary_key=True)
    name = db.Column(db.String())
    first_name  = db.Column(db.String())
    last_name  = db.Column(db.String())

    def __init__(self, email, name, first_name, last_name):
        self.email = email
        self.name = name
        self.first_name = first_name
        self.last_name = last_name

    def __repr__(self):
        return '<id {}>'.format(self.email)

    def serialize(self):
        return {
            'email': self.email, 
            'name': self.name,
            'first_name': self.first_name,
            'last_name': self.last_name
        }