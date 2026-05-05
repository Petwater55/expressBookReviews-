const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
    return users.some(user => user.username === username && user.password === password);  
};

//only registered users can login task 7
regd_users.post("/customer/login", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required"});
  }
  if (authenticatedUser(username, password)) {
    const accesstoken = jwt.sign({ username: username}, 'access', { expiresIn: '1h' });
    req.session.authorization = {
        accesstoken, 
        username
    };

  return res.status(200).json({message: "User successfully logged in", accesstoken });
} else {
    return res.status(401).json({message: "Invalid username or password"});
}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
