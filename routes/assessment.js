var express = require('express');
var router = express.Router();

const Joi = require('joi');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var dbFile = 'public/sql/html5.db';
var db = new sqlite3.Database(dbFile);
var path = require('path');

router.get('/load', function(req, res){
    console.log("Data send to assessment");
    var data = '{ "name":"John", "age":30, "city":"New York"}';
    res.send(data);
})

module.exports = router;

