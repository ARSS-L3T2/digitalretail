import os
from flask import Blueprint, Flask, render_template, request, jsonify, session
import stripe
import json
import ast
#import tables
from app import db
from model.tables import ProductModel
from model.tables import CartsModel
from model.tables import UsersModel

product = Blueprint('product',__name__)


@product.route('/getproduct', methods=['GET'])
def getProduct():
    user_email = session.get("USERNAME")
    priceid = request.args.get('priceid')
    print(priceid)
    priceobj = stripe.Price.retrieve(priceid)
    product= stripe.Product.retrieve(priceobj.product)
    data = product
    data["price"] = priceobj.unit_amount/100
    data["priceid"] =priceid
    print(data)
    return render_template('product.html', data=data, user_data = user_email)


def get_products ():
    product_data=ProductModel.query.all()
    productids =[]
    result=[]
    #myList = ["price_1GqLlRFswqvdSoNHi27H2wLV","price_1GqLiAFswqvdSoNHjv4R6scY","price_1GqY8eFswqvdSoNHVSRzEQdn","price_1GqYAcFswqvdSoNH1uReU4kN"]
    for product in product_data:
        productids.append(product.productid)        
    
    
    for i in productids:
        priceobj = stripe.Price.retrieve(i)
        product= stripe.Product.retrieve(priceobj.product)
        data = product
        data["price"] = priceobj.unit_amount/100
        data["priceid"] =i
        result.append(data)
    return result

#https://localhost:5000/getcartdatabyemail?email=leexhadrian@gmail.com
@product.route("/getcartdatabyemail",methods=['GET'])
def get_cart_data ():
    email = request.args.get('email')
    
    cart_data=CartsModel.query.filter_by(email=email).first()
    print(cart_data.cartdata)
    return jsonify(cart_data.cartdata)

@product.route('/savecartdata', methods=['POST'])
def save_cart_data ():
    print("INSIDE SAVE CART")
    my_json = request.data.decode('utf8')
    data = json.loads(my_json)
    processed_data = ast.literal_eval(data)
    print(processed_data)
    username = processed_data[0]["username"]
    print(processed_data)
    user_data=CartsModel.query.filter_by(email=username).first()
    print(user_data)
    if user_data is not None:
        print(processed_data)
        user_data.cartdata=processed_data
        db.session.commit()
        db.session.close()
    else:
        cart_data = CartsModel(username,processed_data)
        db.session.add(cart_data)
        db.session.commit()
        db.session.close()
    #db.session.add(cart_data)
    #db.session.commit()
    return "saved_data"
