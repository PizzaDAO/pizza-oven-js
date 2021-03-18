var http = require("http");
var url = require('url');

const {Pizza, generateDisplayList} = require('./js/Pizza/AllPizza.js');
const {KitchenData, HACK_prepKitchenData} = require('./js/Pizza/KitchenData.js');

// TODO HACK
// since we don't have a KitchenData prep tool yet...
HACK_prepKitchenData();

http.createServer(function(request, response) {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Max-Age": 2592000, // 30 days
        
        "Content-Type": "application/json",
      };

    response.writeHead(200, headers);

    // return object (jsonified)
    var ret = {};

    var q = url.parse(request.url, true);
    var qdata = q.query; 
    var dna = qdata.dna;

    // make pizza
    var pizza = new Pizza();
    if (dna == null || dna == undefined)
      pizza.makeRandom({}, KitchenData);
    else
      pizza.makeFromDna(dna);  

    if (pizza.dna == null || pizza.dna == undefined || pizza.dna == false)
    {
      ret = {error: "illegal dna."};
    } 
    else {

      ret.dna = pizza.dna;

      // generate display list
      ret.displayBundle = generateDisplayList(pizza, KitchenData);

      // generate marketing data
      ret.ingredientsData = pizza.generateIngredientsData(KitchenData);
      ret.pizzaProbability = pizza.calculatePizzaProbability(ret.ingredientsData);   
      ret.description = pizza.generatePizzaDescription(ret.ingredientsData);

    }

    // output json
    response.end(JSON.stringify(ret));
  }).listen(80);
  