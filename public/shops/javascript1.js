const removeCartItem=document.getElementsByClassName('btn-danger');

for(var i=0;i<removeCartItem.length;i++){
    var button=removeCartItem[i];
    button.addEventListener('click',removeItem)
}
 var quantityInputs=document.getElementsByClassName('cart-quantity-input');
for(var i=0;i<removeCartItem.length;i++){
        var input=quantityInputs[i];
        input.addEventListener('change',quantityChange)
    }

document.getElementsByClassName('btn-purchase')[0].addEventListener('click',purchase)

var cart=document.getElementsByClassName('right')[0];
document.getElementById('seethecart').addEventListener('click',()=>{
    cart.classList.toggle('active')
})

var cartBtn=document.getElementById('cartbtn');
cartBtn.addEventListener('click',()=>{
    cart.classList.toggle('active')
})

const musiccontent=document.getElementsByClassName('music-content')[0];
var cartItems=document.getElementsByClassName('cart-items')[0];

window.addEventListener('DOMContentLoaded',()=>{
    axios.get('http://34.208.16.149:3000/?page=1').then((data)=>{
       console.log(data)
       if(data.request.status==200){
            const products=data.data;
            products.forEach(element => {
                const prodHtml=document.createElement('div');
                prodHtml.innerHTML= 
                `<h4 class="shopTitle">${element.title}</h4>
                <div class="image">
                    <img src="${element.imageUrl}" alt="tape">
                </div>
                <div class="buy">
                    <span class="price">$${element.price}</span>
                    <button class="addtocart" onClick="addToCart(${element.id})">ADD TO CART</button>
                </div>`;
                prodHtml.classList.add('Album');
                prodHtml.getElementsByClassName('addtocart')[0].addEventListener('click',addtToCartClicked);
                musiccontent.append(prodHtml);
            });
        }
    }).catch(err=>console.log(err));


    axios.get('http://34.208.16.149:3000/cart').then(data=>{
        console.log('data')
        console.log(data)
        if(data.request.status==200){
            const cartprod=data.data.products;
            if(cartprod.length>0){
                cartprod.forEach(ele=>{
                    const Childdiv=document.createElement('div');
                    Childdiv.innerHTML=`<div class="cart-item cart-column">
                    <img class="cart-item-image" src="${ele.imageUrl}" width="100" height="100">
                    <span class="cart-item-title">${ele.title}</span>
                </div>
                <span class="cart-price cart-column">$${ele.price}</span>
                <div class="cart-quantity cart-column">
                    <input class="cart-quantity-input" type="number" value="${ele.cartItem.quantity}">
                    <button class="btn btn-danger" type="button">X</button>
                </div>`;
                Childdiv.classList.add('cart-row');
                Childdiv.getElementsByClassName('cart-quantity-input')[0].addEventListener('change',quantityChange);
                Childdiv.getElementsByClassName('btn-danger')[0].addEventListener('click',removeItem)
                cartItems.append(Childdiv);
                updateCartTotal();
    
                })
            }else{
                console.log(document.getElementById('cartPurchaseBtn'))
                document.getElementById('cartPurchaseBtn').style.display="none";
            }
        }
       

            
      
    }).catch(err=>{console.log('catchCart');
       
        console.log(err)})
    
})

document.getElementById('cartPurchaseBtn').addEventListener('click',placeOrder);

function placeOrder(){
    axios.post('http://34.208.16.149:3000/orders').then(orderDetails => {
        console.log(orderDetails.data.orderDetails);
        alert(`Order successfully placed with id:${orderDetails.data.orderDetails.id}`).catch(err=>console.log(err));
    })
}

function addToCart(productId){
    axios.post('http://34.208.16.149:3000/cart',{productId:productId}).then(res=>{
 
        if(res.status==200){
            
            notify(res.data.message);
        }
    }).catch(err=>notify(res.data.message));
}

function notify(message){
    const notif=document.createElement('div');
    notif.classList.add('toast');
    notif.innerText=`${message}`;
    container.appendChild(notif);

    setTimeout(()=>{
        notif.remove();
    },3000)
}


var addtocartButtons=document.getElementsByClassName('addtocart');
console.log('Hi')
console.log(addtocartButtons);
for(var i=0;i<addtocartButtons.length;i++){
    var button=addtocartButtons[i];
    button.addEventListener('click',addtToCartClicked);
}


function addtToCartClicked(e){
   var button=e.target;
   var shopItem=button.parentElement.parentElement;
  
   var title=shopItem.getElementsByClassName('shopTitle')[0].innerText
   var price=shopItem.getElementsByClassName('price')[0].innerText;
   var imageSrc=shopItem.getElementsByClassName('image')[0].firstElementChild.src
   console.log(title,price,imageSrc)

    addItemToCart(title,price,imageSrc);
    showNotification(title);

}
var container=document.getElementsByClassName('notification-container')[0]

function showNotification(title){
    const notif=document.createElement('div');
    notif.classList.add('toast');
    notif.innerText=`${title} is added to cart`;
    container.appendChild(notif);

    setTimeout(()=>{
        notif.remove();
    },3000)
}

function purchase(){
   
    var cartItems=document.getElementsByClassName('cart-items')[0];
    while(cartItems.hasChildNodes()){
        cartItems.removeChild(cartItems.firstChild);
    }
    alert('Thank you for purchase');
    updateCartTotal();

}

function addItemToCart(title,price,imageSrc){
    var cartRow=document.createElement('div');
    var cartItems=document.getElementsByClassName('cart-items')[0];
    var cartItemsNames=cartItems.getElementsByClassName('cart-item-title');
    for(var i=0;i<cartItemsNames.length;i++){
        if(cartItemsNames[i].innerText == title){
            alert('This item is already added to Cart')
            return;
        }
    }
    var cartRowContents=`<div class="cart-item cart-column">
    <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
    <span class="cart-item-title">${title}</span>
</div>
<span class="cart-price cart-column">${price}</span>
<div class="cart-quantity cart-column">
    <input class="cart-quantity-input" type="number" value="1">
    <button class="btn btn-danger" type="button">X</button>
</div>`;
    cartRow.innerHTML=cartRowContents;
    cartRow.classList.add('cart-row')
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click',removeItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change',quantityChange)
}

function removeItem(e){
    var buttonClicked=e.target;
    console.log(buttonClicked)
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

function quantityChange(e){
    var input=e.target;
    if(isNaN(input.value) || input.value<=0){
        input.value=1
    }
    updateCartTotal();
}

function updateCartTotal(){
    var CartItemContainer=document.getElementsByClassName('cart-items')[0];
    var cartRows=CartItemContainer.getElementsByClassName('cart-row');
    var total=0;
    for(var i=0;i<removeCartItem.length;i++){
        var cartRow=cartRows[i]
        var priceElement=cartRow.getElementsByClassName('cart-price')[0];
        var quantityElemeent=cartRow.getElementsByClassName('cart-quantity-input')[0];
        var price=parseFloat(priceElement.innerText.replace('$',''));
        var quantity=quantityElemeent.value;
        total=total+(price*quantity);
        

    }
    total=Math.round(total*100)/100;
    document.getElementsByClassName('cart-total-price')[0].innerText='$'+total
}

const paginationBtns=document.getElementsByClassName('pagination-btn');
for(var i=0;i<paginationBtns.length;i++){
    paginationBtns[i].addEventListener('click',showProds);
}
function showProds(e){
    var pagenumber=e.target.value;
    axios.get(`http://34.208.16.149:3000/?page=${pagenumber}`).then(data=>{
        console.log(data);
        musiccontent.innerHTML=''
        if(data.request.status==200){
            const products=data.data;
            products.forEach(element => {
                const prodHtml=document.createElement('div');
                prodHtml.innerHTML= 
                `<h4 class="shopTitle">${element.title}</h4>
                <div class="image">
                    <img src="${element.imageUrl}" alt="tape">
                </div>
                <div class="buy">
                    <span class="price">$${element.price}</span>
                    <button class="addtocart" onClick="addToCart(${element.id})">ADD TO CART</button>
                </div>`;
                prodHtml.classList.add('Album');
                prodHtml.getElementsByClassName('addtocart')[0].addEventListener('click',addtToCartClicked);
                musiccontent.append(prodHtml);
            });
        }
        

    }).catch(err=>console.log(err));
}