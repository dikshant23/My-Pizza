const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')
function init(passport) {
   passport.use(new LocalStrategy({ usernameField: 'email'}, async (email,password, done) => {   //when we login we recieved email pass with this
     
    //check if email exists
    const user = await User.findOne({email: email});
    if(!user) {
        return done(null, false, { message: 'no user with this email'})
    }
     

    //if found
    bcrypt.compare(password, user.password).then(match => {
        if(match) {
            return done(null, user, { message: 'no user with this email'})
        }
        return done(null, false, { message: 'wrong credentials'})
    }).catch(err => {
        return done(null, false, { message: 'Something went wrong'})
    })

   }))

  // convert a whole session into a single id
   passport.serializeUser((user,done) => {
    return done(null, user._id)
   })


   //get whole user using single id
   passport.deserializeUser((id,done) => {
       User.findById(id, (err, user) => {
           done(err,user)
       })
   })
}



module.exports = init