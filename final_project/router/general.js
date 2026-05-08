const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if( username && password) {
        if(isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. You can now login!"});
        } else {
            return res.status(409).json({message: "User already exist!"});
        }
    }
    return res.status(400).json({message: "Unable to register. Username and password are required."});
});

// Get the book list available in the shop
public_users.get('/books',function (req, res) {
    return res.status(200).json({
        message: "This is a list of books that are available",
        books: books
    });
});

// Get book details based on ISBN
public_users.get('/books/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json({
    message: `You requested the book with isbn: ${isbn}`,
    books: isbn
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author; 
  const booksByAuthor = [];
  const bookKeys = Object.keys(books);
  for (let key of bookKeys) {
    if(books[key].author === author) {
        booksByAuthor.push(books[key]);    
    }
}

if (booksByAuthor.length > 0) {
    return res.json(booksByAuthor);
} else {
   return res.status(404).json({message: "No books found for this author"}); 
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const booksByTitle = [];

  for (let key of bookKeys) {
    if (books[key].title === title) {
        booksByTitle.push(books[key]);
    }
  }

  if (booksByTitle.length > 0) {
    return res.json(booksByTitle);
  } else {
    return res.status(404).json({message: "No books found based on title"});
  }
});

//  Get book review
public_users.get('/reviews/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    return res.json(book.reviews);
  } else {
    return res.status(404).json({message: "Reviews not found for this ISBN"});
  }
});
const axios = require('axios');

function getBooks() {
    axios.get('')
    .then(response => {
        console.log("Books available:", response.data);
    });
}
public_users.get('/axios/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
  
    try {
      const response = await axios.get(`https://justbringit4-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/${isbn}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
  });

  public_users.get('/axios/author/:author', async (req, res) => {
    const author = req.params.author;
  
    try {
      const response = await axios.get(`https://justbringit4-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books/author/${author}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
  });
  
  public_users.get('/axios/title/:title', async (req, res) => {
    const title = req.params.title;
  
    try {
      const response = await axios.get(`https://justbringit4-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books/title/${title}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
  });
module.exports = { getBooks };
module.exports.general = public_users;
