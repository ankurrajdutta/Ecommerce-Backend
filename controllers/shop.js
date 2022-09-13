const Product = require('../models/product');
const Cart = require('../models/cart');

const ITEMS_PER_PAGE=2;

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      // res.render('shop/product-list', {
      //   prods: products,
      //   pageTitle: 'All Products',
      //   path: '/products'
      // });
      res.json({products,success:true})
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  const page=req.query.page;

  Product.findAll().then(numProducts=>{
    return Product.findAll({
      offset: ((page - 1) * ITEMS_PER_PAGE),
      limit: ITEMS_PER_PAGE
  })
  })
    .then(products => {
      // res.render('shop/index', {
      //   prods: products,
      //   pageTitle: 'Shop',
      //   path: '/'
      // });
      res.json(products);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          // res.render('shop/cart', {
          //   path: '/cart',
          //   pageTitle: 'Your Cart',
          //   products: products
          // });
          res.json({products,success:true})
        })
        .catch(err=>res.status(500).json({success:false,message:"something went wrong"}));
    })
    .catch(err=>res.status(500).json({success:false,message:"something went wrong"}));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.status(200).json({success:true, message:'Successfully added'})
    }).catch(()=>{
      res.status(500).json({success:false,message:'Something Wrong'})
    })
     
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.postOrder=(req,res,next)=>{
  let orderDetails;
  let fetchedCart;
  req.user.getCart().then(cart=>{
    fetchedCart=cart;
    return cart.getProducts();
  }).then(products=>{
    return req.user.createOrder()
    .then(order=>{
      orderDetails=order;
      return order.addProduct(
        products.map(product=>{
          product.orderItem={quantity:product.cartItem.quantity};
          return product;
        }))
    })
  })
  .then(result=>{
    fetchedCart.setProducts(null);
    res.status(200).json({orderDetails:orderDetails});
  })
}

exports.getOrder = (req, res, next) => {
  req.user.getOrders({include: ['products']})
  .then(orders => {
      res.status(200).json(orders)
  })
  .catch(err => console.log(err));
}
