// A reference to Stripe.js
var stripe;

// Other variables
var total_amount = 0
var orderData = localStorage.getItem("object_name");

//function to save shopping cart data to DB
function saveshoppingcartDB() {
	var data = localStorage.getItem("object_name");
	fetch("/savecartdata", {
		method: "POST",
		headers: {
		  "Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	  }).then(function(response) {
		console.log(response)
	});

}

// Function to parse order data from index.html
function loaddata() {
  
  const orderItems = document.getElementById('order-items');
  const orderTotal = document.getElementById('order-total');
  var data = localStorage.getItem("object_name");
  console.log(data);
  var transformed_data = JSON.parse(data);
  transformed_data.forEach(function (obj) {
    console.log(obj.total)
    parsed_amount = parseInt(obj.total,10);
    total_amount += parsed_amount 

    // create elements
    let lineItem = document.createElement('div');
    lineItem.classList.add('line-item');
    lineItem.innerHTML = `
      <div class="label">
        <p class="product">${obj.name.split(".").pop().replace(/_/g , " ")}</p>
      </div>
      <p class="count">${obj.count} x $${obj.price}</p>
      <p class="price">$${obj.total}</p>`;
    orderItems.appendChild(lineItem);
    
  });
  // set subtotal  amount  
  orderTotal.querySelector('[data-subtotal]').innerText = "$" + total_amount
  // set total amount
  orderTotal.querySelector('[data-total]').innerText = "$" + total_amount

}

fetch("/create-payment-intent", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(orderData)
})
  .then(function(result) {
    return result.json();
  })
  .then(function(data) {
    return setupElements(data);
  })
  .then(function({ stripe, card, clientSecret }) {
    document.querySelector("button").disabled = false;

    // Handle form submission.
    var form = document.getElementById("payment-form");


    form.addEventListener("submit", function(event) {
      event.preventDefault();
      // Initiate payment when the submit button is clicked
      pay(stripe, card, clientSecret);
    });
  });

// Set up Stripe.js and Elements to use in checkout form
var setupElements = function(data) {
  stripe = Stripe(data.publishableKey);
  var elements = stripe.elements();
  var style = {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };

  var card = elements.create("card", { style: style });
  card.mount("#card-element");

  return {
    stripe: stripe,
    card: card,
    clientSecret: data.clientSecret
  };
};

/*
 * Calls stripe.confirmCardPayment which creates a pop-up modal to
 * prompt the user to enter extra authentication details without leaving your page
 */
var pay = function(stripe, card, clientSecret) {
  changeLoadingState(true);

  // Initiate the payment.
  // If authentication is required, confirmCardPayment will automatically display a modal
  stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: card
      }
    })
    .then(function(result) {
      if (result.error) {
        // Show error to your customer
        showError(result.error.message);
      } else {
        // The payment has been processed!
        updatePaymentIntentWithShipping(clientSecret)
        orderComplete(clientSecret);
      }
    });
};

/* ------- Update payment with address ------- */
async function updatePaymentIntentWithShipping(clientSecret){
  const form = document.getElementById('payment-form');
  const country = form.querySelector('select[name=country] option:checked').value;
  const name = form.querySelector('input[name=name]').value;
  const email = form.querySelector('input[name=email]').value;
  const shipping = {
    name,
    address: {
      line1: form.querySelector('input[name=address]').value,
      city: form.querySelector('input[name=city]').value,
      postal_code: form.querySelector('input[name=postal_code]').value,
      state: form.querySelector('input[name=state]').value,
      country,
    },
  };
  stripe.retrievePaymentIntent(clientSecret).then(function(result){
    console.log(result.paymentIntent.id)
    paymentIntentID= result.paymentIntent.id
    console.log(country);
    (async () => {
      console.log("example")
      const rawResponse = await fetch(`payment_intents/${paymentIntentID}/shipping_change`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({

          shipping:shipping
          
        }),
      });
      console.log(rawResponse)
    })();
    
  });  
}

/* ------- Post-payment helpers ------- */

/* Shows a success / error message when the payment is complete */
var orderComplete = function(clientSecret) {
  // Just for the purpose of the sample, show the PaymentIntent response object
  stripe.retrievePaymentIntent(clientSecret).then(function(result) {
    var paymentIntent = result.paymentIntent;
    var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);

    document.querySelector(".sr-payment-form").classList.add("hidden");
    document.querySelector("pre").textContent = paymentIntentJson;

    document.querySelector(".sr-result").classList.remove("hidden");
    setTimeout(function() {
      document.querySelector(".sr-result").classList.add("expand");
    }, 200);

    changeLoadingState(false);
  });
  sessionStorage.removeItem("shoppingCart")
};

var showError = function(errorMsgText) {
  changeLoadingState(false);
  var errorMsg = document.querySelector(".sr-field-error");
  errorMsg.textContent = errorMsgText;
  setTimeout(function() {
    errorMsg.textContent = "";
  }, 4000);
};

// Show a spinner on payment submission
var changeLoadingState = function(isLoading) {
  if (isLoading) {
    document.querySelector("button").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("button").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};