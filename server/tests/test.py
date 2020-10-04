import unittest
import logging
import json
import os
import sys
from os import path
sys.path.append( path.dirname( path.dirname( path.abspath(__file__) ) ) )
from app import app
from flask_sqlalchemy import Model, SQLAlchemy
import app
import config
import stripe
from config import db

class TestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.app.test_client()
        POSTGRES_URL = os.environ['POSTGRES_URL']
        POSTGRES_USER = os.environ['POSTGRES_USER']
        POSTGRES_PW = os.environ['POSTGRES_PW']
        POSTGRES_DB = os.environ['POSTGRES_DB']
        STRIPE_SECRET_KEY = os.environ['STRIPE_SECRET_KEY']
        STRIPE_PUBLISHABLE_KEY = os.environ['STRIPE_PUBLISHABLE_KEY']
        SECRET_KEY =os.environ['SECRET_KEY']
        DB_URL = 'postgresql://{user}:{pw}@{url}/{db}'.format(user=POSTGRES_USER,pw=POSTGRES_PW,url=POSTGRES_URL,db=POSTGRES_DB)

    def test_index_page_status(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)

    def test_login_page_status(self):
        response = self.app.get('/login')
        self.assertEqual(response.status_code, 200)

    def test_registration_page_status(self):
        response = self.app.get('/registration')
        self.assertEqual(response.status_code, 200)

    def test_index(self):
        response = self.app.get('/')
        result = response.data.decode()
        self.assertIn("price_",result)

    def test_successful_login(self):
        response = self.app.post('/login', data={
            'email': 'admin@gmail.com', 'password': 'password'})
        result = response.data.decode()
        self.assertIn("admin@gmail.com",result)

    def test_unsuccessful_login(self):
        response = self.app.post('/login', data={
            'email': 'admin@gmail.com', 'password': '1234!'})
        result = response.data.decode()
        self.assertIn("Login with your social media account",result)

    def test_get_users(self):
        response = self.app.get('/getusers')
        data = json.loads(response.get_data(as_text=True))
        self.assertTrue(data[0])

    def test_create_payment(self):
        data =b'"[{\\"username\\":\\"admin@gmail.com\\",\\"name\\":\\"Blue_T-Shirt\\",\\"price\\":15,\\"count\\":2,\\"total\\":\\"30.00\\"},{\\"username\\":\\"admin@gmail.com\\",\\"name\\":\\"Marvel_White_T-Shirt\\",\\"price\\":35,\\"count\\":1,\\"total\\":\\"35.00\\"}]"'
        response = self.app.post('/create-payment-intent', data=data)
        self.assertEqual(response.status_code, 200)

    def test_getcart_data_by_email(self):
        data = "admin@gmail.com"
        response = self.app.get('/getcartdatabyemail?email='+data)
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__' :
    unittest.main()