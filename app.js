const express=require('express');
const https = require("https");
const bodyParser = require("body-parser");

const app= express();
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){

    res.sendFile(__dirname + "/index.html");

     });

app.post("/",function(req,res){

    console.log("Calculating ");
    const city = req.body.cityName;
    const apiKey="2cad68f1dcb2bfcab5efbbbd699d8484";
    const unit = "metric";
    const api = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey+"&units="+unit;
    https.get(api,function(response){
    console.log(response.statusCode);
    response.on("data",function(data){
        const ans = JSON.parse(data);
        const temp = ans.main.temp;
        const cloud = ans.weather[0].description;
        const icon = ans.weather[0].icon;
        const url = "http://openweathermap.org/img/wn/"+ icon +"@2x.png";
    // console.log(weather);
        res.write("<p>The weather is currently " + cloud + "<p>  ");
        res.write("<h1>The Temperature in " + city +" is " + temp + " degrees</h1>" );
        res.write("<img src=" + url +">");
        res.send();
});

    
    // res.send(req.body);
});

});







// res.send("Hello"); only one res.send

app.listen(3000,function(){

    console.log("Server Started Successfully : 3000");
});