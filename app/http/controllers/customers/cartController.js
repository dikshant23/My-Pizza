const res = require("express/lib/response")

function cartController(){
    return {
        index: function(req,res){
            res.render('customers/cart')
        },
        update: function(req,res){

            //if cart is empty
           if(!req.session.cart) {
              // console.log("erfaefewfwef")
               req.session.cart = {
                  items: {},
                  totalQty: 0,
                  totalPrice: 0 
               }
               

               
           } 
           let cart = req.session.cart;
               //console.log(cart.items);
             if(!cart.items[req.body._id])
             {
                 cart.items[req.body._id] = {
                     item: req.body,
                     qty: 1
                 }
           
             cart.totalQty = cart.totalQty + 1;
             cart.totalPrice = cart.totalPrice + req.body.price;
              
             }
             else
             {
                 cart.items[req.body._id].qty = cart.items[req.body._id].qty +1;
                 cart.totalQty = cart.totalQty +1;
                 cart.totalPrice = cart.totalPrice + req.body.price; 
             }
             //console.log(req.cookie)
             return res.json({totalQty: req.session.cart.totalQty})
               
        }
    }
}


module.exports = cartController;