var express = require('express');
var app = express();

var client;
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb+srv://admin:admin@motedu.fbj4y.mongodb.net/test", function(error, dbclient){
    if(!error){
        console.log("MongoDb - connection established");
    }
    else{
        console.log("MongoDb - connection error");
        console.log(error);
    }

    client = dbclient;
});


app.listen(3000, function(){
    console.log("listening on 3000");
});

app.get('/', function(req, res){
    console.log("HTTP get request '/'");
    res.send("Hello There");
})

app.get('/createPlayer', async(req, res) => {
    console.log("HTTP get request '/createPlayer'");
    
    var name = req.query['name'];
    var score = req.query['score'];

    var collection = client.db('mydb').collection('players');

    try{
        user = await collection.findOne({name : name});
        if(user == null){
            collection.insertOne({name: name, score: score});
            res.send("player Created");
        }
        else{
            res.send("Player already exists");
        }

        
    }
    catch(someError){
        res.send("Player NOT created");
        console.log(someError);
    }
})

app.get('/readPlayer', function(req, res){
    console.log("HTTP get request '/readPlayer'");
    
    var name = req.query['name'];

    var collection = client.db('mydb').collection('players');


    collection.findOne({name: name}, function(findError, result){
        if(!findError){
            console.log("No Errors");
        }
        else{
            console.log(findError);
        }

        if(!result){
            res.send("Player not found");
        }
        else{
            console.log(result);
            res.send(result);
        }
    });
})

app.get('/updatePlayer', function(req, res){
    console.log("HTTP get request '/updatePlayer'");
    
    var name = req.query['name'];
    var score = req.query['score'];

    var collection = client.db('mydb').collection('players');

    try{
        collection.updateOne({name: name}, {$set: {score: score}});
    }
    catch{
        console.log("Error, could not update player");
    }
});