import os
from flask import Flask, render_template, request, jsonify
import stripe
import json
import ast

stripe_keys = {
  'secret_key': os.environ['STRIPE_SECRET_KEY'],
  'publishable_key': os.environ['STRIPE_PUBLISHABLE_KEY']
}

stripe.api_key = stripe_keys['secret_key']

app=Flask(__name__,template_folder='../client', static_url_path='', static_folder='../client')

@app.route('/checkout', methods=['GET'])
def checkout():
    return render_template('checkout.html', key=stripe_keys['publishable_key'])


@app.route('/', methods=['GET'])
def main():
    #data = stripe.Product.list( active=True)
    result =get_products()

    return render_template('index.html', data=result)

@app.route('/getproduct', methods=['GET'])
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




@app.route('/payment_intents/<string:id>/shipping_change', methods=['POST'])
def update_payment_intent(id):
    data = json.loads(request.data)
    print ("inside update  payment intent")
    print (id)
    print (data["shipping"])
    try:
        payment_intent = stripe.PaymentIntent.modify(
            id,
            shipping=data["shipping"],
            idempotency_key=id
        )

        return jsonify({'paymentIntent': payment_intent})
    except Exception as e:
        return jsonify(e), 403


@app.route('/create-payment-intent', methods=['POST'])
def create_payment():
    total_amount = 0
    items= {}
    my_json = request.data.decode('utf8')
    data = json.loads(my_json)
    print ("TEST DATA")
    print (data)
    
    processed_data = ast.literal_eval(data)
    for i in range(len(processed_data)):
      total_amount+=processed_data[i]["price"] * processed_data[i]["count"]
      print(total_amount)
      items[processed_data[i]["name"]]  = "{Quantity=" + str(processed_data[i]["count"])  + "}, {Unit_Price=" + str(processed_data[i]["price"]) + "}, {Subtotal=" \
        +  str(processed_data[i]["total"]) + "}"
      
    print("insider payment route!")
    print (data)
    print(total_amount)
    amount = calculate_order_amount(total_amount)
     
    # Create a PaymentIntent with the order amount and currency
    intent = stripe.PaymentIntent.create(
      amount = amount,
      currency='usd',
      payment_method_types=["card"],
      metadata=items
      
      
    )
    try:
        # Send publishable key and PaymentIntent details to client
        return jsonify({'publishableKey': os.getenv('STRIPE_PUBLISHABLE_KEY'), 'clientSecret': intent.client_secret})
        # Create new Order 
        
    except Exception as e:
        return jsonify(error=str(e)), 403


def calculate_order_amount(total):
    return total*100


def get_products ():
    myList = ["price_1GqLlRFswqvdSoNHi27H2wLV","price_1GqLiAFswqvdSoNHjv4R6scY","price_1GqY8eFswqvdSoNHVSRzEQdn","price_1GqYAcFswqvdSoNH1uReU4kN"]
    result =[]
    for i in myList:
        priceobj = stripe.Price.retrieve(i)
        product= stripe.Product.retrieve(priceobj.product)
        data = product
        data["price"] = priceobj.unit_amount/100
        data["priceid"] =i
        result.append(data)
    return result


if __name__ == '__main__':
  app.run(host='0.0.0.0', debug=True)