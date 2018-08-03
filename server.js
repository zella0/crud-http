var fs = require('fs');
var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());

function uniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
};


//  - Get route for getting all users
app.get('/users', function(req, res) {
  fs.readFile('./storage.json', 'utf8', function(err, data) {
    if (err) throw err;
    if (data.length === 0) {
      var userObj = {
        users: []
      };
      res.json(userObj)
    }else{
      res.json(JSON.parse(data));
    }
  })
})


//  - Get route for getting a user by id
app.get('/users/:id', function(req, res) {
  let userParam = req.params.id;
  fs.readFile('./storage.json', 'utf8', function(err, data) {
    if (err) throw err;
    let usersData = JSON.parse(data);
    let selectedUser = usersData.users.filter((curVal) => {
      return curVal.id.toLowerCase() === userParam.toLowerCase();
    })
    if (selectedUser.length === 0) {
      console.log('Route not found');
      return res.sendStatus(400);
    }
    res.json(selectedUser);
  })
})


//  - Update route for updating a user by id
app.put('/users/:id', function(req, res) {
  let userParam = req.params.id;
  let userObjRequest = {
    id: uniqueId(),
    name: req.body.name,
    email: req.body.email,
    state: req.body.state
  };

  fs.readFile('./storage.json', 'utf8', function(err, data) {
    if (err) throw err;
    var userObj = JSON.parse(data); //now it is a userObject
    userObj.users = userObj.users.map((curVal) => {
      if (curVal.id.toLowerCase() === userParam.toLowerCase()) {
        curVal = userObjRequest;
      }
      return curVal;
    })
    if (userObj.users.length === 0) {
      console.log('Route not found');
      return res.sendStatus(400);
    }
    console.log(userObj.users);
    var json = JSON.stringify(userObj); //convert it back to json
    fs.writeFile('./storage.json', json, 'utf8'); // write it back
    res.json(userObj);
  });
})


//  - Create route for creating new users
app.post('/createUser', function(req, res) {
  let userObjRequest = {
    id: uniqueId(),
    name: req.body.name,
    email: req.body.email,
    state: req.body.state
  };

  fs.readFile('./storage.json', 'utf8', function(err, data) {
    if (err) throw err;
    if (data.length === 0) {
      var userObj = {
        users: []
      };
    } else {
      var userObj = JSON.parse(data); //now it an userObject
    }
    userObj.users.push(userObjRequest); //add some data
    console.log(userObj);
    var json = JSON.stringify(userObj); //convert it back to json
    fs.writeFile('./storage.json', json, 'utf8'); // write it back
  });
  res.json(userObjRequest);
});


//  - Delete route for deleting a user by id
app.delete('/users/:id', function(req, res) {
  let userParam = req.params.id;

  fs.readFile('./storage.json', 'utf8', function(err, data) {
    if (err) throw err;
    var userObj = JSON.parse(data); //now it is a userObject
    userObj.users = userObj.users.filter((curVal) => {
      return curVal.id.toLowerCase() !== userParam.toLowerCase();
    })
    if (userObj.users.length === 0) {
      console.log('Route not found');
      return res.sendStatus(400);
    }
    var json = JSON.stringify(userObj); //convert it back to json
    fs.writeFile('./storage.json', json, 'utf8'); // write it back
    res.json(userObj);
  });
});


app.listen(port, function() {
  console.log('Listening on', port);
});
