// ************************************************
// Shopping Cart API
// ************************************************
var shoppingCart = (function() {
	// =============================
	// Private methods and propeties
	// =============================
	cart = [];
	
	// Constructor
	function Item(name, price, count) {
	  this.name = name;
	  this.price = price;
	  this.count = count;
	}
	
	
	// Save cart
	function saveCart() {
	  sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
	}
	
	  // Load cart
	function loadCart() {
	  cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
	}
	if (sessionStorage.getItem("shoppingCart") != null) {
	  loadCart();
	}
	
  
	// =============================
	// Public methods and propeties
	// =============================
	var obj = {};
	
	// Add to cart
	obj.addItemToCart = function(name, price, count) {
	  for(var item in cart) {
		if(cart[item].name === name) {
		  cart[item].count ++;
		  saveCart();
		  return;
		}
	  }
	  var item = new Item(name, price, count);
	  console.log("inside add item")
	  console.log(count)
	  cart.push(item);
	  saveCart();
	}
	obj.addMultipleItemsToCart = function(name, price, count) {
		for(var item in cart) {
		  if(cart[item].name === name) {
			cart[item].count +=count;
			saveCart();
			return;
		  }
		}
		var item = new Item(name, price, count);
		console.log("inside add item")
		console.log(count)
		cart.push(item);
		saveCart();
	  }	

	// Set count from item
	obj.setCountForItem = function(name, count) {
	  for(var i in cart) {
		if (cart[i].name === name) {
		  cart[i].count = count;
		  break;
		}
	  }
	  saveCart();
	};
	// Remove item from cart
	obj.removeItemFromCart = function(name) {
		for(var item in cart) {
		  if(cart[item].name === name) {
			cart[item].count --;
			if(cart[item].count === 0) {
			  cart.splice(item, 1);
			}
			break;
		  }
	  }
	  saveCart();
	}
  
	// Remove all items from cart
	obj.removeItemFromCartAll = function(name) {
	  for(var item in cart) {
		if(cart[item].name === name) {
		  cart.splice(item, 1);
		  break;
		}
	  }
	  saveCart();
	}
  
	// Clear cart
	obj.clearCart = function() {
	  cart = [];
	  saveCart();
	}
  
	// Count cart 
	obj.totalCount = function() {
	  var totalCount = 0;
	  for(var item in cart) {
		totalCount += cart[item].count;
	  }
	  return totalCount;
	}
  
	// Total cart
	obj.totalCart = function() {
	  var totalCart = 0;
	  for(var item in cart) {
		totalCart += cart[item].price * cart[item].count;
	  }
	  return Number(totalCart.toFixed(2));
	}
  
	// List cart
	obj.listCart = function() {
	  var cartCopy = [];
	  for(i in cart) {
		item = cart[i];
		itemCopy = {};
		for(p in item) {
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

  $('.add-to-cart').click(function(event) {
	  
	event.preventDefault();
	
	var name = $(this).data('name');
	console.log(name);
	var price = Number($(this).data('price'));
	console.log(price);
	shoppingCart.addItemToCart(name, price, 1);
	displayCart();
	$('.toast').toast('show');
	
	
	
  });

  $('.add-to-cart-multiple').click(function(event) {
	
	event.preventDefault();
	var productQuantity = document.getElementById("productQuantity")
	var quantity = parseInt(document.getElementById("productQuantity").value);
	if (!productQuantity.checkValidity()){
		$('.productnotification').append("<div class='alert alert-danger alert-dismissable'>\
								<button type='button' class='close' data-dismiss='alert' \
								aria-hidden='true'>&times;</button>We dont have so much stock today:(  </div>")

	}else if (productQuantity.checkValidity() && !isNaN(quantity) && quantity>0){
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
  $('.clear-cart').click(function() {
	shoppingCart.clearCart();
	displayCart();
	
  });
  
  // checkout and redirect
  $('.order-checkout').click(function() {
	console.log("checkout")
	window.localStorage.removeItem('data');
	data = JSON.stringify(shoppingCart.listCart())
	console.log(data)
	localStorage.setItem("object_name",data);
	window.location.href = '/checkout.html'; 
	
  });

  function passdata(){
	  return 300
  }
  
  function displayCart() {
	var cartArray = shoppingCart.listCart();
	var output = "";
	for(var i in cartArray) {
	  output += "<tr>"
		+ "<td>" + cartArray[i].name.split(".").pop().replace(/_/g , " ") + "</td>" 
		+ "<td>(" + cartArray[i].price + ")</td>"
		+ "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>"
		+ "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
		+ "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"
		+ "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
		+ " = " 
		+ "<td>" + cartArray[i].total + "</td>" 
		+  "</tr>";
	}
	$('.show-cart').html(output);
	$('.total-cart').html(shoppingCart.totalCart());
	$('.total-count').html(shoppingCart.totalCount());
	$('.cart-items').html(shoppingCart.totalCount())

  }
  


  // Delete item button
  
  $('.show-cart').on("click", ".delete-item", function(event) {

	var name = $(this).data('name')
	shoppingCart.removeItemFromCartAll(name);
	displayCart();
	

  })
  
  
  // -1
  $('.show-cart').on("click", ".minus-item", function(event) {

	var name = $(this).data('name')
	shoppingCart.removeItemFromCart(name);
	displayCart();
	
  })

  // +1
  $('.show-cart').on("click", ".plus-item", function(event) {
	var name = $(this).data('name')
	test = $(this)
	console.log(test)
	shoppingCart.addItemToCart(name);
	displayCart();
	
  })
  
  // Item count input
  $('.show-cart').on("change", ".item-count", function(event) {
	 var name = $(this).data('name');
	 var count = Number($(this).val());
	shoppingCart.setCountForItem(name, count);
	displayCart();
	
  });
  
  displayCart();
  
  var showError = function(errorMsgText) {
	var errorMsg = document.getElementById("sr-field-error");
	errorMsg.textContent = errorMsgText;
	setTimeout(function() {
	  errorMsg.textContent = "";
	}, 4000);

  };