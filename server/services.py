import os
from flask import Blueprint, Flask, render_template, request, jsonify
import stripe
import json
import ast


services = Blueprint('services',__name__)

@services.route('/login', methods=['GET'])
def login():
    return render_template('login.html')