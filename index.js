const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
var path = require("path");
const user = require("./User");
const fs = require("fs");

const app = express();

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  }
});

mongoose
  .connect("mongodb://127.0.0.1:27017/userprofile")
  .then(() => console.log("DONE"));
var upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.post("/saveimage", upload.single("img"), (req, res) => {
  console.log("Body", req.file);
  if (req.file) {
    res.send({
      msg: "File saved",
      filepath: "http://localhost:9000/" + req.file.path
    });
  } else {
    res.status(500).send({ msg: "Nofile." });
  }
});

app.post("/user", (req, res) => {
  const User = new user({
    name: req.body.name,
    email: req.body.email,
    img: req.body.file
  });
  User.save()
    .then(result => {
      res.send({ result });
    })
    .catch(err => {
      res.send({ err });
    });
});

app.get("/user", (req, res) => {
  user
    .find()
    .then(result => {
      res.send({ result });
    })
    .catch(err => {
      res.send({ err });
    });
});
app.get("/user/:id", (req, res) => {
  user
    .find({
      _id: req.params.id
    })
    .then(result => {
      res.send({ result });
    })
    .catch(err => {
      res.send({ err });
    });
});
app.put("/user/:id", (req, res) => {
  user
    .update(
      {
        _id: req.params.id
      },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          img: req.body.file
        }
      }
    )
    .then(result => {
      res.send({ result });
    })
    .catch(err => {
      res.send({ err });
    });
});
app.delete("/user/:id", (req, res) => {
  console.log(req.params, req.query);
  const filename = req.query.file.split("uploads/")[1];
  fs.unlinkSync("./uploads/" + filename);
  user
    .deleteOne({
      _id: req.params.id
    })
    .then(result => {
      res.send({ result });
    })
    .catch(err => {
      res.status(500).send({ err });
    });
});
app.listen(9000, () => {
  console.log("API is running");
});
