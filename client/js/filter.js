
// ************************************************
// Filtering API
// ************************************************

function loadData(productdata){
	var output = "";
	for (var i in productdata) {
		output += "<div class='item' data-product style='float: left; width: 200px;'>"
			+ "<article class='product'>"
			+ "<a href='/getproduct?priceid=" +productdata[i].priceid+ "'data-url'>"
			+ "<img src="+ productdata[i].images+" class='img-fluid' data-img></a>"
			+ "<div class='price-group'>"
			+ "<div class='price'><span class='currency' data-product-currency>$</span> <span data-product-price>"+productdata[i].price+"</span></div>"
			+ "</div>"
			+ "<h3><a>"+productdata[i].name.split(".").pop().replace(/_/g , " ")+"</a></h3>"
			+ "<div class='btngroup'>"
			+ "<a type='button' class='add-to-cart btn btn-sm btn-secondary' title='Add to Cart' data-id=" + productdata[i].id + " data-name="+productdata[i].name+" data-price="+productdata[i].price+"></i> Add to cart</a>"
			+ "</div>"
			+ "</article>"
			+ "</div>"
		}
	
	document.getElementById('products').innerHTML=output;

}

function getRadioVal(form, name) {
	var val;
	var radios = form.elements[name];
    // loop through list of radio buttons
    for (var i=0, len=radios.length; i<len; i++) {
        if ( radios[i].checked ) { // radio checked?
            val = radios[i].value; // if so, hold its value in val
            break; // and break out of for loop
        }
    }
    return val; // return value of checked radio or undefined if none checked
}

function filterData(type) {
	console.log(type)
	if (type){
		var filtered_data = productdata.filter( element => element.metadata.type ==type)
		loadData(filtered_data)
		cloth_type=type
		
	}else{
		loadData(productdata)
		cloth_type="all"
	}
	
	
}

$(document).on('change', '.filter-option', function() {
	var filtered_data
	var checkbox_result =[]
	var radio_result = $("input[type='radio']:checked").val()
	$("input[type='checkbox']:checked").each( function(){
		checkbox_result.push($(this).val());
	});
	console.log(checkbox_result)

	var arr = radio_result.split("-")
	arr = arr.map(Number);
	console.log(cloth_type)

	if(cloth_type=="all"){
		if (checkbox_result === undefined || checkbox_result.length == 0) {
			filtered_data = productdata.filter( element => element.price > arr[0] && element.price <arr[1])
		}else{
			filtered_data = productdata.filter(element => element.price > arr[0] && element.price <arr[1] && checkbox_result.includes(element.metadata.brand));
		}
		console.log(filtered_data)
	}else if(cloth_type!="all"){
		if (checkbox_result === undefined || checkbox_result.length == 0) {
			filtered_data = productdata.filter( element => element.price > arr[0] && element.price <arr[1] && element.metadata.type ==cloth_type)
		}else{
			filtered_data = productdata.filter( element => element.price > arr[0] && element.price <arr[1] && element.metadata.type ==cloth_type && checkbox_result.includes(element.metadata.brand))
		}
		
	}else{
		filtered_data=productdata
	}
	
	
	loadData(filtered_data)
	
});