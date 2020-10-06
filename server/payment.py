import os
from flask import Blueprint, Flask, render_template, request, jsonify
import stripe
import json
import ast



payment = Blueprint('payment',__name__)

@payment.route('/payment_intents/<string:id>/shipping_change', methods=['POST'])
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


@payment.route('/create-payment-intent', methods=['POST'])
def create_payment():
    total_amount = 0
    items= {}
<<<<<<< HEAD
    print(request.data)
    my_json = request.data.decode('utf8')

=======
    my_json = request.data.decode('utf8')
>>>>>>> dev
    data = json.loads(my_json)
    print (data)
    
    processed_data = ast.literal_eval(data)
    for i in range(len(processed_data)):
      total_amount+=processed_data[i]["price"] * processed_data[i]["count"]
      print(total_amount)
      items[processed_data[i]["name"]]  = "{Customer_email=" + str(processed_data[i]["username"])  + "}, {Quantity=" + str(processed_data[i]["count"])  + "}, {Unit_Price=" + str(processed_data[i]["price"]) + "}, {Subtotal=" \
        +  str(processed_data[i]["total"]) + "}"
      
    print("inside payment route!")
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

@payment.route('/checkout', methods=['GET'])
def checkout():
    return render_template('checkout.html', key=stripe_keys['publishable_key'])
<<<<<<< HEAD
=======

def create_custmer(email):
    
    return "hello"
>>>>>>> dev
