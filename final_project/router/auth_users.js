const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
	let userswithsamename = users.filter((user)=>{
			return user.username === username
		});
		if(userswithsamename.length > 0){
			return false;
		} else {
			return true;
		}
}

const authenticatedUser = (username,password)=>{ //returns boolean
	let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

	let review = req.query.review;
	let currentSessionusername = req.session.authorization["username"];

	let book = books[isbn]

	if (book) { //Check is friend exists
			
			//if DOB the DOB has been changed, update the DOB 
			if(review) {
				book["reviews"][currentSessionusername] = review;
			}

			books[isbn]=book;
			res.send(`Book with the isbn  ${isbn} updated.`);
	}
	else{
			res.send("Unable to find book!");
	}
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;

	let currentSessionusername = req.session.authorization["username"];

	if(isbn){
		delete books[isbn]["reviews"][currentSessionusername];
	}
	
  // Update the code here
  res.send(`The review for the book ${isbn} posted by the user ${currentSessionusername} deleted.`);
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
