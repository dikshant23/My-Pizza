import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'
//import { initStripe } from './stripe'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(pizza) {
   axios.post('/update-cart', pizza).then(res => {
       cartCounter.innerText = res.data.totalQty
       new Noty({
           type: 'success',
           timeout: 1000,
           text: 'Item added to cart',
           progressBar: false,
       }).show();
   }).catch(err => {
       new Noty({
           type: 'error',
           timeout: 1000,
           text: 'Something went wrong',
           progressBar: false,
       }).show();
   })
}

addToCart.forEach((btn) => {
   btn.addEventListener('click', (e) => {
       let pizza = JSON.parse(btn.dataset.pizza)
       updateCart(pizza)
   })
})

// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
   setTimeout(() => {
       alertMsg.remove()
   }, 2000)
}

initAdmin();

// Change order status
let statuses = document.querySelectorAll('.status_line')
//console.log(statuses)
let order = document.querySelector('#hiddenInput') ? document.querySelector('#hiddenInput').value : null;
order = JSON.parse(order);

//console.log(order)
function updateStatus(order){
let stepCompleted = true;
statuses.forEach((status) => {
    let dataProp = status.dataset.status
    if(stepCompleted)
    {
        //console.log(order.status)
        status.classList.add('step-completed')
    }
    
    if(dataProp === order.status){
        console.log(dataProp)
        stepCompleted = false
        if(status.nextElementSibling)
      {  status.nextElementSibling.classList.add('current')}
    }
})
}
updateStatus(order);