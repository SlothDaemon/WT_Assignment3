var express = require('express');
var router = express.Router();

const Joi = require('joi');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var dbFile = path.resolve(__dirname, '../sql/html5.db')
var db = new sqlite3.Database(dbFile);


router.get('/load', function(req, res){
    console.log("Data send from assessment");
    var data = { 
        name:'John', 
        age:30,
        city:'New York'
    };
    res.send(data);
})

module.exports = router;

