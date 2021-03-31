
const api_url = 'https://webacademy.se/fakestore/';
let products = [];

//Fetcha produkterna från API och lägg skicka till funktionen createProducts som lägger upp objekten på sidan
async function getStore(){
  const response = await fetch(api_url);
  const data = await response.json();
  console.log(data);
  for(let i = 0; i < data.length; i++){
    let tempID = data[i].id;
    let tempName = data[i].title;
    let tempDesc = data[i].description;
    let tempImage = data[i].image;
    let tempPrice = data[i].price;
    let newProduct = 
      {
        id: tempID,
        name: tempName,
        price: tempPrice,
        inCart: 0
      };
    products.push(newProduct);
    let tempHeader = "p"+tempID;
    let tempImg = "img"+tempID;
    let tempList = "l"+tempID;
    let tempPris = "pris"+tempID;
    createProducts(tempName, tempDesc, tempImg, tempImage, tempHeader, tempList, tempPris, tempPrice);
    }
}
getStore();

//Skapa upp produktsobjekten på websidan
function createProducts(tempName, tempDesc, tempImg, tempImage, tempHeader, tempList, tempPris, tempPrice){
  document.getElementById(tempHeader).innerHTML = tempName;
  document.getElementById(tempImg).src = tempImage;
  document.getElementById(tempList).innerHTML = tempDesc;
  document.getElementById(tempPris).innerHTML = 'Pris: ' +tempPrice + 'kr';
}



//Lägg till eventlistener till alla knappar och lägg till en produkt i varukorgen varje gång man klickar
let productButtons = document.querySelectorAll('.btn');

for(let i = 0; i<productButtons.length; i++){
  productButtons[i].addEventListener('click', () => {
      addProductToCart(products[i]);
   })
}

//Kontrollerar och ändrar antalet produkter i varukorgen och skickar sedan vidare produkten till updateCart-funktionen som sparar ned vilken produkt som lagts till i localstorage
function addProductToCart(product){
  let productNumbers = localStorage.getItem('cartNumbers');
  productNumbers = parseInt(productNumbers);

  if(productNumbers ){
    localStorage.setItem('cartNumbers', productNumbers + 1);
    document.querySelector('.Cart span').textContent = productNumbers + 1;
  }
  else{
    localStorage.setItem('cartNumbers', 1)
    document.querySelector('.Cart span').textContent = 1;
  }

  updateLSCart(product);
}

//Skapar upp lista med produkter(objekt) som läggs till i localstorage
function updateLSCart(product){
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);
  if(cartItems != null){
    if(cartItems[product.name] == undefined){
      cartItems = {
        ...cartItems,
        [product.name]: product
      }
    }
    cartItems[product.name].inCart += 1;
  }
  else{
    product.inCart = 1;
    cartItems = {
      [product.name]: product 
    }
  }
  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

//Ladda ned datat från localstorage varje gång webbsidan öppnas(Fyll i varukorgen)
function loadCartOnStart(){
  let productNumbers = localStorage.getItem('cartNumbers');
  if(productNumbers){
    document.querySelector('.Cart span').textContent = productNumbers;
  }

}
loadCartOnStart();


//Visa upp produkter i varukorgen vid utcheckning 
function displayCart(){
  let itemsInCart = localStorage.getItem("productsInCart");
  itemsInCart = JSON.parse(itemsInCart);

  let productContainer = document.querySelector(".product-cart");
  if(itemsInCart && productContainer){
    productContainer.innerHTML = '';
    Object.values(itemsInCart).map(item =>{
      productContainer.innerHTML += 
      `<div class="prod-name">
      <p>Produkt: ${item.name} - Pris: ${item.price}kr <br> Antal: ${item.inCart}
      </p></div>`
              
    })
  }           
}
displayCart();


//Räkna ut totalt pris för alla föremål i varukorgen
function calculatePrice(){
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let totalPrice = 0; 

  Object.values(cartItems).map(item =>{
    totalPrice += item.price*item.inCart;
  })
  document.querySelector('.totalPrice span').textContent = totalPrice;
}
calculatePrice();

//Lägg till eventlistner för submitBtn under input-forms. Kontrollera att användaren skrivit in värden i alla fält. Om allt är ifyllt så skickas en alert och localstorage clearas. 
let submitBtn = document.getElementById("SubmitBtn");
submitBtn.addEventListener('click', function(){

  let formValidated = false;
  let inputName = document.getElementById("InputName"); 
  let inputPhone = document.getElementById("InputPhone");
  let inputEmail = document.getElementById("InputEmail");
  let inputAdress = document.getElementById("InputAdress");
  console.log(inputName.value);
  
  if( inputName.value == "") {
     alert( "Vänligen skriv in ditt namn!" );
     inputName.focus() ;
     formValidated =  false;
  }
  else if( inputPhone.value == "" ) {
     alert( "Vänligen skriv in ditt telefonnummer!" );
     inputPhone.focus() ;
     formValidated = false;
  }
  else if( inputEmail == "") {
     alert( "Vänligen skriv in din email!" );
     inputEmail.focus() ;
     formValidated = false;
  }
  else if( inputAdress.value == "" ) {
     alert( "Vänligen skriv in din address" );
     inputAdress.focus();
     formValidated = false;
  } 
  else{
    formValidated = true;
  }

  if(formValidated == true){
    alert("Tack för din beställning!");
    window.localStorage.clear();
  }

});