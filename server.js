/**
 * Created by zwf on 17-3-13.
 */

'use strict';

var express = require('express'),
    routes = require('./app/routes/index.js'),
    mongo = require('mongodb').MongoClient;

var mongoose = require('mongoose')

var path = require('path');
var petData = require('./app/controllers/petData');
var userData = require('./app/controllers/userData');
var petShopNameData = require('./app/controllers/petShopNameData')
var kindData = require('./app/controllers/kindData');
var requestData = require('./app/controllers/requestData')
var adviceData = require('./app/controllers/adviceData')
var orderData = require('./app/controllers/petOrderData')
var manageData = require('./app/controllers/manageData');

var bodyParser = require('body-parser');
//var ejs = require('ejs')

var app = express();
app.use(bodyParser.urlencoded({extended: true,limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Cache-Control");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");

    res.header("X-Powered-By",' 3.2.1');
    next()
})

app.use('/petData',petData);
app.use('/userInfo',userData);
app.use('/petShop',petShopNameData);
app.use('/kindInfo',kindData);
app.use('/request',requestData);
app.use('/advice',adviceData)
app.use('/petOrder',orderData)
app.use('/manageInfo',manageData)


mongoose.connect('mongodb://localhost:27017/admin', function (err, db) {

    if (err) {
        throw new Error('Database failed to connect!');
    } else {
        console.log('MongoDB successfully connected on port 27017.');
    }

    app.use('/public', express.static(process.cwd() + '/public'));
    app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

    routes(app, db);

    app.listen(4000, function () {
        console.log('Listening on port 4000...');
    });

});