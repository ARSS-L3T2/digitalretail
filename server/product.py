import os
from flask import Blueprint, Flask, render_template, request, jsonify
import stripe
import json
import ast
import tables
from app import db
from model.tables import ProductModel

product = Blueprint('product',__name__)


@product.route('/getproduct', methods=['GET'])
def getProduct():
    priceid = request.args.get('priceid')
    print(priceid)
    priceobj = stripe.Price.retrieve(priceid)
    product= stripe.Product.retrieve(priceobj.product)
    data = product
    data["price"] = priceobj.unit_amount/100
    data["priceid"] =priceid
    print(data)
    return render_template('product.html', data=data)


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

