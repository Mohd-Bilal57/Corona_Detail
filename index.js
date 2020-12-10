const express = require("express");
const http = require("https");
const bodyParser = require("body-parser");
const app = express()
require('dotenv').config();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", 'ejs');

app.get("/",function(req, res){
    res.render("index" )
});

app.post("/", function(req, res){
	const country = req.body.country;
	const api_key = process.env.API_KEY;

    const options = {
	"method": "GET",
	"hostname": "covid-19-data.p.rapidapi.com",
	"port": null,
	"path": "/country?name=" + country,
	"headers": {
		"x-rapidapi-key": api_key,
		"x-rapidapi-host": "covid-19-data.p.rapidapi.com",
		"useQueryString": true
	}
};

const request = http.request(options, function (response) {
	const chunks = [];

	response.on("data", function (chunk) {
		chunks.push(chunk);
	});

	response.on("end", function () {
		const body = Buffer.concat(chunks);
		const JSONbody = JSON.parse(body)
		const country = JSONbody[0].country;
		const cases = JSONbody[0].confirmed;
		const recovered = JSONbody[0].recovered;
		const critical = JSONbody[0].critical;
		const deaths = JSONbody[0].deaths;
		res.render("detail", {country: country, cases : cases,
							 recovered : recovered, critical : critical,
							 deaths : deaths });
	});
});

request.end();

})



app.listen("3000", function(){
    console.log("Server is running at 3000")
})