const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { authenticatedUser } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();


app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(authenticatedUser(username, password)) {
        // Generated JWT access token
        let accesstoken = jwt.sign({
            data: password
    }, 'access', {expiresIn: 60 * 60 }); 
    // This stores the access token and username in session
    req.session.autherization ={
        accesstoken, username
    }
    return res.status(200).send('User successfully logged in! ');
} else {
    return res.status(400).json({message: "Invalid login. Check username and password"});
}
});
 
const PORT = process.env.PORT || 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
