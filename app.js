const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const { getDB, connect, getPrimaryKey } = require("./db");
const { Collection } = require("mongoose");
const collection = "TasksDB";
const app = express();

app.use(cors()); // Use this after the variable declaration

// parses json data sent to us by the user
app.use(bodyParser.json());

// serve static html file to user(path.join(__dirname,'index.html'));
app.get("/", (req, res) => {
  res.status(200).json({ success: true });
});
// update
app.put("/tasks/:id", (req, res) => {
  const TaskID = req.params.id;
  getDB()
    .collection(collection)
    .findOneAndUpdate(
      { _id: getPrimaryKey(TaskID) },
      { $set: { 
        Grade: req.body.Grade,
        Title: req.body.Title,
        Description: req.body.Description,
      } 
      },
      { returnOriginal: false },
      (err, result) => {
        if (err) console.log(err);
        else {
          res.status(200).json({
            success: true,
            data: result,
          });
        }
      }
    );
  });
 
// read
app.get("/tasks", (req, res) => {
  // get all blank documents within our blank collection
  // send back to user as json
  getDB()
    .collection(collection)
    .find({})
    .toArray((err, documents) => {
      if (err) console.log(err);
      else {
        res.status(200).json({
          success: true,
          data: documents,
        });
      }
    });
});

// update
app.put("/tasks/:id", (req, res) => {
  const TaskID = req.params.id;
  getDB()
    .collection(collection)
    .findOneAndUpdate(
      { _id: getPrimaryKey(TaskID) },
      { $set: { 
        Grade: req.body.Grade,
        Title: req.body.Title,
        Description: req.body.Description,
      } 
      },
      { returnOriginal: false },
      (err, result) => {
        if (err) console.log(err);
        else {
          res.status(200).json({
            success: true,
            data: result,
          });
        }
      }
    );
  });
// get by id
app.get("/tasks/:id", (req, res) => {
  const TaskID = req.params.id;
  getDB()
    .collection(collection)
    .findOne(
      { _id:    getPrimaryKey(TaskID)    },
      (err, result) => {
        if (err) console.log(err);
        else {
          res.status(200).json({
            success: true,
            data: result,
          });
        }
      }
    );
  });

//create
app.post("/tasks", (req, res, next) => {
  // Document to be inserted
  const userInput = req.body;
  getDB()
    .collection(collection)
    .insertOne(userInput, (err, result) => {
      if (err) {
        const error = new Error("Failed to insert Document");
        error.status = 400;
        next(error);
      } else {
        res.status(200).json({
          result: result,
          document: result.ops[0],
          msg: "Successfully inserted blank!!!",
          error: null,
        });
      }
    });
});

//delete
app.delete("/tasks/:id", (req, res) => {
  // Primary Key of blank Document
  const TaskID = req.params.id;
  // Find Document By ID and delete document from recordgetPrimaryKey(StudentID)
  getDB()
    .collection(collection)
    .findOneAndDelete({ _id: getPrimaryKey(TaskID) }, (err, result) => {
      if (err) console.log(err);
      else res.status(200).json(result);
    });
});

// Middleware for handling Error
// Sends Error Response Back to User
app.use((err, req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    'Access-Control-Allow-Origin', '*',
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  res.status(err.status | 500).json({
    error: {
      message: err.message,
    },
  });
});


//Connect to the db
connect((err) => {
    // If err unable to connect to database
    // End application
    if (err) {
      console.log("unable to connect to database");
      process.exit(1);
    }
    // Successfully connected to database
    // Start up our Express Application
    // And listen for Request
    else {
      app.listen(3004, () => {
        console.log("connected to database, app listening on port 3004");
      });
    }
  });