const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
function authController(){

   const _getRedirectUrl = (req) => {
      return req.user.role === 'admin' ? '/admin/orders' : 'customer/orders'
   }
    return {
        login : function(req,res){
           res.render('auth/login')
        },
        postLogin : function(req,res,next){
         passport.authenticate('local',(err, user, info) => {
            if(err) {
               req.flash('error',info.message)
               return next(err);
            }

            if(!user) {
               req.flash('error',info.message)
               return res.redirect('/login');
            }

            req.logIn(user, (err)=>{
             if(err) {
             req.flash('error',info.message)
             return next(err)
            }


             return res.redirect(_getRedirectUrl(req));
            })
            
         })(req, res, next)
        },
        register : function(req,res){
            res.render('auth/register')
         },
         postRegister : async function(req,res){  //async cuz we have to hash the pass first so that it would be await
           const {name, email ,password } = req.body;

           //validate
           if(!name || !password || !email) {
           req.flash('error',"All fields are required")
           req.flash('name',name);
           req.flash('email',email)
           return res.redirect('/register');
            }
           
            //check if email exists
            User.exists({ email: email}, (err, result) => {
               if(result) {
                  console.log("exists")
                  req.flash('error',"Email already exists")
                  req.flash('name',name);
                  req.flash('email',email) 

                  return res.reidrect('/register')
               }
            })
           //hash pass
           const hashedPassword = await bcrypt.hash(password, 10);
            //create user

            const user = new User({
               name,
               email,
               password : hashedPassword           //gotta encrypt pass before saving in db
            })
          
           //console.log(user)
             user.save();
            res.redirect('/');

           //console.log(req.body)
         },
         logout: async (req,res) => {
             await req.logout()
             //console.log("wbu")
              res.redirect('/login');
              return;
         }
    }
}


module.exports = authController