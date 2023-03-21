//Cart
let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');
let cartCount = document.querySelector('#cart-count');
//Open Cart
cartIcon.onclick = () =>{
    cart.classList.add('active');
};
//Close Cart
closeCart.onclick = () =>{
    cart.classList.remove('active');
};

//Cart Working JS
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

//Making Function
function ready(){
    //Remove Items From Cart
    var reomveCartButtons = document.getElementsByClassName("cart-remove");
    console.log(reomveCartButtons);
    for (var i = 0; i < reomveCartButtons.length; i++){
        var button = reomveCartButtons[i]
        button.addEventListener("click", removeCartItem);
    }
    //Quantity Changes
    var quantityInputs = document.getElementsByClassName("cart-quantity");
    for (var i = 0; i < quantityInputs.length; i++ ) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }
    //Add To Cart
    var addCart = document.getElementsByClassName("add-cart");
    for (var i = 0; i < addCart.length; i++){
        var button = addCart[i];
        button.addEventListener("click", addCartClicked);
    }
    //Buy button Work
    document
        .getElementsByClassName("btn-buy")[0]
        .addEventListener("click", buyButtonClicked);
    loadCart();
}
//Load Cart
function loadCart() {
    if (localStorage.getItem("cart")) {
        var cartItems = JSON.parse(localStorage.getItem("cart"));
        for (var i = 0; i < cartItems.length; i++) {
            var item = cartItems[i];
            addProductToCart(item.title, item.price, item.productImg, item.selectedValue);
        }
        updatetotal();
        cartCount.innerHTML = cartItems.length;
    }
}

//Save Cart
function saveCart() {
    var cartItems = [];
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var titleElement = cartBox.getElementsByClassName("cart-product-title")[0];
        var priceElement = cartBox.getElementsByClassName("cart-price")[0];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        var selectedElement = cartBox.getElementsByClassName("selected-value")[0];
        var title = titleElement.innerText;
        var price = priceElement.innerText;
        var quantity = quantityElement.value;
        var selected = selectedElement.innerText;
        var productImg = cartBox.getElementsByClassName("cart-img")[0].src;
        cartItems.push({
            title: title,
            price: price,
            quantity: quantity,
            selectedValue: selected,
            productImg: productImg
        });
    }
    localStorage.setItem("cart", JSON.stringify(cartItems));
    console.log(localStorage);
}
//Buy Button
function buyButtonClicked(){
    var cartContent = document.getElementsByClassName("cart-content")[0];
    if (cartContent.childElementCount > 0) {
        var products = [];
        var cartBoxes = cartContent.getElementsByClassName("cart-box");
        for (var i = 0; i < cartBoxes.length; i++){
            var cartBox = cartBoxes[i];
            var titleElement = cartBox.getElementsByClassName("cart-product-title")[0];
            var priceElement = cartBox.getElementsByClassName("cart-price")[0];
            var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
            var selectedElement = cartBox.getElementsByClassName("selected-value")[0];
            var title = titleElement.innerText;
            var price = priceElement.innerText;
            var quantity = quantityElement.value;
            var selected = selectedElement.innerText;
            products.push(`${title} (${selected}) x ${quantity} (${price}) `);
        }
        var message = "Hola, quiero hacer un pedido de los siguientes productos:\n\n " + products.join(",\n\n");
        var url = "https://wa.me/3515418960/?text=" + message;
        window.open(url);
        while (cartContent.hasChildNodes()){
            cartContent.removeChild(cartContent.firstChild);
        }
        updatetotal();
        cartCount.innerHTML = 0;
    } else {
        alert("Tu carrito esta vacio");
    }
}
//Remove Items From Cart
function removeCartItem(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal();
    cartCount.innerHTML = --cartCount.innerHTML;
    saveCart();
}
//Quantity Changes
function quantityChanged(event){
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updatetotal();
}
//Add To Cart
function addCartClicked (event){
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    var price = shopProducts.getElementsByClassName("price")[0].innerText;
    var productImg = shopProducts.getElementsByClassName("product-img")[0].src;
    var selectElement = document.getElementById("product-select");
    var selectedValue = selectElement.options[selectElement.selectedIndex].value;
    addProductToCart(title, price, productImg, selectedValue);
    updatetotal();
    cartCount.innerHTML = ++cartCount.innerHTML;
    saveCart(title, price, productImg, selectedValue);
    
}
function addProductToCart(title, price, productImg, selectedValue) {
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemsNames = cartItems.getElementsByClassName("selected-value");
    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == selectedValue){
        alert("Ya has añadido este artículo al carrito");
        cartCount.innerHTML = --cartCount.innerHTML;
        return;
        }
    }

var cartBoxContent = `
            <img src="${productImg}" alt="" class="cart-img">
            <div class="detail-box">
                <div class="cart-product-title">${title}</div>
                <div class="cart-price">${price}</div>
                <input type="number" value="1" class="cart-quantity">
                <div class="selected-value">${selectedValue}</div>
            </div>
            <!--Remove Cart-->
            <i class='bx bxs-trash-alt cart-remove'></i>`
cartShopBox.innerHTML = cartBoxContent;
cartItems.append(cartShopBox);
cartShopBox
    .getElementsByClassName("cart-remove")[0]
    .addEventListener("click", removeCartItem);
cartShopBox
    .getElementsByClassName("cart-quantity")[0]
    .addEventListener("change", quantityChanged);
}
//Update Total
function updatetotal(){
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++){
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName("cart-price")[0];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        var price = parseFloat(priceElement.innerText.replace("$", ""));
        var quantity = quantityElement.value;
        total = total + price * quantity;
    }
        //If price Contain some Cents Value
        total = Math.round(total * 100) / 100;

        document.getElementsByClassName('total-price')[0].innerText = '$' + total;
    
}
var iconNumber = document.getElementById('cart-icon');