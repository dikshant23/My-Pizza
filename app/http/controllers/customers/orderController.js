const Order = require('../../../models/order')
const moment = require('moment')
function  orderController() {
    return {
        store: async function(req,res){
          // console.log(req.body);
          //validate request
          const {phone,address} = req.body
          if(!phone || !address) {
          req.flash('error',"All feilds are required");
          return res.redirect('/cart');
        
        }

        const order = new Order({
            customerId : req.user._id,
            items: req.session.cart.items,
            phone: phone,
            address: address
        })
        console.log("order");
         
        await order.save();
        req.flash('success',"order placed successfully");
        delete req.session.cart
        res.redirect('/')
        },

        index: async function(req,res){
            const orders = await Order.find({ customerId: req.user._id }, null, 
                {sort: { 'createdAt': -1}});
                res.header('Cache-Control', 'no-store')
                res.render('customers/orders', { orders: orders, moment: moment })
        },
        show: async function(req,res){
            const order = await Order.findById(req.params.id)

            //authorize user
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder',{order});
            }
            
            return res.redirect('/')
        }
    }
}


module.exports = orderController