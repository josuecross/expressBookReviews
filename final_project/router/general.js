const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (username && password) {
		if (isValid(username)) { 
			users.push({"username":username,"password":password});
			return res.status(200).json({message: "User successfully registred. Now you can login"});
		} else {
			return res.status(404).json({message: "User already exists!"});    
		}
	} 
	return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
	const readBooks = new Promise((resolve,reject)=>{
    resolve(JSON.stringify(books, null, 4))
	});

	readBooks.then((queryBooks) => {
    return res.send(queryBooks);
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

	const readBooks = new Promise((resolve,reject)=>{
    const isbn = req.params.isbn;
		resolve(JSON.stringify(books[isbn], null, 4))
	});

	readBooks.then((queryBooks) => {
    return res.send(queryBooks);
  })

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

	const readBooks = new Promise((resolve,reject)=>{
		const author = req.params.author;

    const keys = Object.keys(books);

    let filteredBooks = [];

    keys.forEach(key => {
        if(books[key]["author"] === author){
            filteredBooks.push(books[key])
        }    
    });

		resolve(JSON.stringify(filteredBooks, null, 4))
	});

	readBooks.then((queryBooks) => {
    return res.send(queryBooks);
  })

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here

	const readBooks = new Promise((resolve,reject)=>{
		const title = req.params.title;

		const keys = Object.keys(books);

		let filteredBooks = [];

		keys.forEach(key => {
				if(books[key]["title"] === title){
						filteredBooks.push(books[key])
				}    
		});

		resolve(JSON.stringify(filteredBooks, null, 4))
	});

	readBooks.then((queryBooks) => {
    return res.send(queryBooks);
  })
	
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
	const isbn = req.params.isbn;

  return res.send(JSON.stringify(books[isbn]["reviews"], null, 4));
});

module.exports.general = public_users;
