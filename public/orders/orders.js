const orderDetails=document.getElementsByClassName('orderDetails')[0];

window.addEventListener('DOMContentLoaded',()=>{
    axios.get('http://34.208.16.149:3000/orders').
    then(res=>{
        var data=res.data;
        console.log(data);
        if(data.length>0){
            data.forEach(element => {
                const bodyDiv=document.createElement('div');
                console.log(element.id);
                var products=element.products;
                console.log(products);
                const productsArray=[];
                products.forEach(ele=>{
                    console.log(ele.title);
                    productsArray.push(ele.title);
                    
                })
                bodyDiv.innerHTML=`<h2>Order Id-${element.id}</h2>
                <br>
                Products Ordered- ${productsArray}<br>`;
                bodyDiv.classList.add('order-content')
                orderDetails.append(bodyDiv);
            });
        }else{
            const bodyDiv=document.createElement('div');
            bodyDiv.innerHTML=`<h2>Nothing Ordered</h2>`
            bodyDiv.classList.add('order-content')
            orderDetails.append(bodyDiv);
        }



      
    })
    .catch(err=>console.log(err))
})