const Order = require('../../../models/order')

function statusController() {
    return {
        update: function(req,res){
           Order.updateOne({_id: req.body.orderId}, { status: req.body.status}, (err,data)=> {
            if(err) {
                console.log("error line 8")
                return res.redirect('/admin/orders');
            }  
            return res.redirect('/admin/orders');
           })
        }
    }
}

module.exports = statusController