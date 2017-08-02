const express = require('express');
// you'll need to use `queryString` in your `gateKeeper` middleware function
const queryString = require('query-string');


const app = express();


// For this challenge, we're hard coding a list of users, because
// we haven't learned about databases yet. Normally, you'd store
// user data in a database, and query the database to find
// a particular user.
//
// ALSO, for this challenge, we're storing user passwords as
// plain text. This is something you should NEVER EVER EVER 
// do in a real app. Instead, always use cryptographic
// password hashing best practices (aka, the tried and true
// ways to keep user passwords as secure as possible).
// You can learn mroe about password hashing later
// here: https://crackstation.net/hashing-security.htm
const USERS = [
  {id: 1,
   firstName: 'Joe',
   lastName: 'Schmoe',
   userName: 'joeschmoe@business.com',
   position: 'Sr. Engineer',
   isAdmin: true,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  {id: 2,
   firstName: 'Sally',
   lastName: 'Student',
   userName: 'sallystudent@business.com',
   position: 'Jr. Engineer',
   isAdmin: true,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  {id: 3,
   firstName: 'Lila',
   lastName: 'LeMonde',
   userName: 'lila@business.com',
   position: 'Growth Hacker',
   isAdmin: false,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  {id: 4,
   firstName: 'Freddy',
   lastName: 'Fun',
   userName: 'freddy@business.com',
   position: 'Community Manager',
   isAdmin: false,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  }
];

// SECOND METHOD I TRIED
// Compare the array's userName and password properties with the values from the header
// function findUser(array, userNameKey, userPasswordKey, userName, password) {
//   for(const i = 0; i < array.length; i++) {
//     if(array[i][userNameKey] === userName && array[i][userPasswordKey] === password) {
//       return i;
//     } else {
//       return null;
//     }
//   }
// }

// write a `gateKeeper` middleware function that:
//  1. looks for a 'x-username-and-password' request header
//  2. parses values sent for `user` and `pass` from 'x-username-and-password'
//  3. looks for a user object matching the sent username and password values
//  4. if matching user found, add the user object to the request object
//     (aka, `req.user = matchedUser`)
function gateKeeper(req, res, next) {
  // Look for a user object on the request. Not a default property, so we must add it in middleware
  // Check to see if there is a header called x-username-and-password
  // Get the value from the header, and parse the string into separate variables
  // Check to see if there is an object in the array of users that has both of those matching variables for user and pw
  // If the user is found, set the req.user equal to the object from USERS
  // If the user is not found, set the req.user equal to null
  
  console.log('headers', req.headers);
  const credentialsHeaderName = 'x-username-and-password';
  const userNamePassHeader = req.get(credentialsHeaderName);
  const {user, pass} = queryString.parse(userNamePassHeader);
  req.user = USERS.find((userInArray) => userInArray.userName === user && userInArray.password === pass);
  // Had a lot of trouble figuring out the .find syntax. How can I separate this into its own function?
  
  
  // SECOND METHOD I TRIED
  // const userFound = findUser(USERS, 'userName', 'password', user, pass);
  // if(userFound !== null) {
  //   req.user = USERS[userFound];
  //   console.log('fdsa',USERS[userFound]);
  // } else {
  //   req.user = null;
  // }
  
  next();
}

app.use(gateKeeper);
// Add the middleware to your app!

// this endpoint returns a json object representing the user making the request,
// IF they supply valid user credentials. This endpoint assumes that `gateKeeper` 
// adds the user object to the request if valid credentials were supplied.
app.get("/api/users/me", (req, res) => {
  // send an error message if no or wrong credentials sent
  if (req.user === undefined) {
    return res.status(403).json({message: 'Must supply valid user credentials'});
  }
  // we're only returning a subset of the properties
  // from the user object. Notably, we're *not*
  // sending `password` or `isAdmin`.
  const {firstName, lastName, id, userName, position} = req.user;
  return res.json({firstName, lastName, id, userName, position});
});

app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${process.env.PORT}`);
});
