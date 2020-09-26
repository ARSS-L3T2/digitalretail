// ************************************************
// Shopping Cart API
// ************************************************



var shoppingCart = (function () {
	// =============================
	// Private methods and propeties
	// =============================
	cart = [];
	var uname = document.getElementById("username").innerText

	uname = uname.trim();
	

	console.log(uname)
	// Constructor
	function Item(username, name, price, count) {
		this.username = username
		this.name = name;
		this.price = price;
		this.count = count;
	}


	// Save cart
	function saveCart() {
		var uname = document.getElementById("username").innerText
		uname =uname.trim()
		localStorage.setItem(uname, JSON.stringify(cart));
	}

	// Load cart
	async function loadCart() {
		
		console.log("LOAD CART")
		var uname = document.getElementById("username").innerText
		uname = uname.trim();
	
		if (localStorage.getItem(uname) === null) {
			console.log("check null")
			const cartdata= await getshoppingcartDB(uname);
			cart = cartdata
			
		}else{
			//cartresponse = JSON.parse(localStorage.getItem(uname));
			cart = JSON.parse(localStorage.getItem(uname));
			console.log("check not null")

		}
	
		
		
		
	}


	//console.log(localStorage.getItem("shoppingCart"))
	/*
	if (localStorage.getItem("shoppingCart") != null) {
		loadCart();
	}*/
	
	loadCart()
	// =============================
	// Public methods and propeties
	// =============================
	var obj = {};

	// Add to cart
	obj.addItemToCart = function (name, price, count) {
		for (var item in cart) {
			if (cart[item].name === name) {
				cart[item].count++;
				saveCart();
				saveshoppingcartDB();
				return;
			}
		}
		uname = uname.trim();
		var item = new Item(uname, name, price, count);
		console.log("inside add item")
		console.log(count)
		cart.push(item);
		saveCart();
		saveshoppingcartDB();
	}
	obj.addMultipleItemsToCart = function (name, price, count) {
		for (var item in cart) {
			if (cart[item].name === name) {
				cart[item].count += count;
				saveCart();
				return;
			}
		}
		uname = uname.trim();
		var item = new Item(uname, name, price, count);
		console.log("inside add item")
		console.log(count)
		cart.push(item);
		saveCart();
		saveshoppingcartDB();
	}

	// Set count from item
	obj.setCountForItem = function (name, count) {
		for (var i in cart) {
			if (cart[i].name === name) {
				cart[i].count = count;
				break;
			}
		}
		saveCart();
	};
	// Remove item from cart
	obj.removeItemFromCart = function (name) {
		for (var item in cart) {
			if (cart[item].name === name) {
				cart[item].count--;
				if (cart[item].count === 0) {
					cart.splice(item, 1);
				}
				break;
			}
		}
		saveCart();
		saveshoppingcartDB();
	}

	// Remove all items from cart
	obj.removeItemFromCartAll = function (name) {
		for (var item in cart) {
			if (cart[item].name === name) {
				cart.splice(item, 1);
				break;
			}
		}
		saveCart();
		saveshoppingcartDB();
	}

	// Clear cart
	obj.clearCart = function () {
		cart = [];
		saveCart();
	}

	// Count cart 
	obj.totalCount = function () {
		var totalCount = 0;
		for (var item in cart) {
			totalCount += cart[item].count;
		}
		return totalCount;
	}

	// Total cart
	obj.totalCart = function () {
		var totalCart = 0;
		for (var item in cart) {
			totalCart += cart[item].price * cart[item].count;
		}
		return Number(totalCart.toFixed(2));
	}

	// List cart
	obj.listCart = function () {
		var cartCopy = [];
		for (i in cart) {
			item = cart[i];
			itemCopy = {};
			for (p in item) {
				itemCopy[p] = item[p];

			}
			itemCopy.total = Number(item.price * item.count).toFixed(2);
			cartCopy.push(itemCopy)
		}
		return cartCopy;
	}

	// cart : Array
	// Item : Object/Class
	// addItemToCart : Function
	// removeItemFromCart : Function
	// removeItemFromCartAll : Function
	// clearCart : Function
	// countCart : Function
	// totalCart : Function
	// listCart : Function
	// saveCart : Function
	// loadCart : Function
	return obj;
})();


// *****************************************
// Triggers / Events
// ***************************************** 
// Add item

function addAnItemToCart(name, price){
	
	event.preventDefault();
	var name = name
	console.log(name);
	var price = Number(price);
	console.log(price);
	shoppingCart.addItemToCart(name, price, 1);
	displayCart();
	$('.toast').toast('show');
	

}

$(document).on('click', '.add-to-cart', function (event) {
	event.preventDefault();
	
	var name = $(this).data('name');
	console.log(name);
	var price = Number($(this).data('price'));
	console.log(price);
	shoppingCart.addItemToCart(name, price, 1);
	displayCart();
	$('.toast').toast('show');
 })


$('.add-to-cart-multiple').click(function (event) {

	event.preventDefault();
	var productQuantity = document.getElementById("productQuantity")
	var quantity = parseInt(document.getElementById("productQuantity").value);
	if (!productQuantity.checkValidity()) {
		$('.productnotification').append("<div class='alert alert-danger alert-dismissable'>\
								<button type='button' class='close' data-dismiss='alert' \
								aria-hidden='true'>&times;</button>We dont have so much stock today:(  </div>")

	} else if (productQuantity.checkValidity() && !isNaN(quantity) && quantity > 0) {
		console.log("get quantity")
		console.log(quantity)
		var name = $(this).data('name');
		console.log(name)
		//currentcount = shoppingCart.totalCount()
		//newcount  =currentcount +quantity
		var price = Number($(this).data('price'));
		shoppingCart.addMultipleItemsToCart(name, price, quantity);
		displayCart();

	}


});



// Clear items
$(document).on('click', '.clear-cart', function (event) {
	var uname = document.getElementById("username").innerText
	shoppingCart.clearCart();
	localStorage.removeItem(uname);
	displayCart();

});

// checkout and redirect
$(document).on('click', '.order-checkout', function (event) {
	console.log("checkout")
	//window.localStorage.removeItem('data');
	data = JSON.stringify(shoppingCart.listCart())
	console.log(data)
	localStorage.setItem("object_name", data);
	window.location.href = '/checkout.html';

});

function passdata() {
	return 300
}

function displayCart() {
	var cartArray = shoppingCart.listCart();
	console.log(cartArray)
	var output = "";
	
	for (var i in cartArray) {
		output += "<tr>"
			+ "<td>" + cartArray[i].name.split(".").pop().replace(/_/g, " ") + "</td>"
			+ "<td>(" + cartArray[i].price + ")</td>"
			+ "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>"
			+ "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
			+ "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"
			+ "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
			+ " = "
			+ "<td>" + cartArray[i].total + "</td>"
			+ "</tr>";
	}
	$('.show-cart').html(output);
	$('.total-cart').html(shoppingCart.totalCart());
	$('.total-count').html(shoppingCart.totalCount());
	$('.cart-items').html(shoppingCart.totalCount())

}



// Delete item button

$('.show-cart').on("click", ".delete-item", function (event) {

	var name = $(this).data('name')
	shoppingCart.removeItemFromCartAll(name);
	displayCart();


})


// -1
$('.show-cart').on("click", ".minus-item", function (event) {

	var name = $(this).data('name')
	shoppingCart.removeItemFromCart(name);
	displayCart();

})

// +1
$('.show-cart').on("click", ".plus-item", function (event) {
	var name = $(this).data('name')
	test = $(this)
	console.log(test)
	shoppingCart.addItemToCart(name);
	displayCart();

})

// Item count input
$('.show-cart').on("change", ".item-count", function (event) {
	var name = $(this).data('name');
	var count = Number($(this).val());
	shoppingCart.setCountForItem(name, count);
	displayCart();

});

displayCart();

var showError = function (errorMsgText) {
	var errorMsg = document.getElementById("sr-field-error");
	errorMsg.textContent = errorMsgText;
	setTimeout(function () {
		errorMsg.textContent = "";
	}, 4000);

};

// saving cart DB database backend
function saveshoppingcartDB() {
	var data = JSON.stringify(shoppingCart.listCart())
	console.log(data)
	fetch("/savecartdata", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	}).then(function (response) {
		console.log(response)
	});

}

async function getshoppingcartDB(email) {

	let params = {
		"email": email
	};

	let query = Object.keys(params)
		.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
		.join('&');

	let url = '/getcartdatabyemail?' + query;

	const response = await fetch(url);
	return await response.json()

}