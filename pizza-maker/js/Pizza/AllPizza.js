/////////////////////////////////////////////////////////////////////////////////
//
// Pizza
// Jamie Davis
// 2021
//
/////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////
// The Rand function
//////////////////////////////////////
// TODO: a better rand func?
// it needs to be cross platform, cross-language, etc.
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// hash function
function hash(str) {
    var hash = 0, i, chr;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
  

//////////////////////////////////
// Utils
//////////////////////////////////
function randomRange(rand, min, max) 
{
    return Math.round(((rand() * (max - min)) + min));
}

function randomRangeFloat(rand, min, max) 
{
    return ((rand() * (max - min)) + min);
}

var PI = 3.14159;
var TWO_PI = 2.0 * PI;
function randomPointOnDisk(rand, centerX, centerY, radius)
{
    var theta = TWO_PI * rand();
    var r = Math.sqrt(rand());
    var x = centerX + r * radius * Math.cos(theta);
    var y = centerY + r * radius * Math.sin(theta);
    return [x,y];
}


/////////////////////////////////////////////////////////////////
// Scatters
/////////////////////////////////////////////////////////////////

// Scatter methods table
// could make a ScatterFactory, and each scatter a derived Scatter class, then
// keep track if it all that way. Better design. TODO for later.
var scatterTable = {
    "Random": randomScatter,
    "Spiral": spiralScatter,   
    "Smiley": smileyScatter,
    "Spokes": spokesScatter,    
    "Concentric Circles": concentricCirclesScatter  
};

function randomScatter(rand, count, renderObjList, KitchenData) {
    var ret = [];
    for (var i = 0; i < count; i++)
    {
        // subtract scale radius from the crust radius so the topping will fit inside (somewhat, it could still be rotate further out, but okay)
        ret.push(randomPointOnDisk(rand, 0.0, 0.0, KitchenData.Rules.RADIUS_OF_TOPPINGS_WITHIN_CRUST - renderObjList[i].scale / 2.0));
    }
    return ret;
}

function spiralScatter(rand, count, renderObjList, KitchenData) {
    // 
    // r=a + b * angle
    // 
    // choose a rate that angle moves and rate that radius increases
    // TODO: these should be part of scatter method data??
    var angleVel = randomRangeFloat(rand, -3.0, 3.0) * PI / count;
    var maxRadius = KitchenData.Rules.RADIUS_OF_TOPPINGS_WITHIN_CRUST - renderObjList[0].scale / 2.0;       // max radius will be outer edge of crust minus scale of first element. not exactly correct, but close enough. we will adjust the actual instance in further if necessary.
    var rVel = randomRangeFloat(rand, 1, 2) * maxRadius / count
    var currAngle = randomRangeFloat(rand, 0, TWO_PI);
    var currR = 0;
    var ret = [];
    for (var i = 0; i < count; i++)
    {
        currR = Math.min(currR, KitchenData.Rules.RADIUS_OF_TOPPINGS_WITHIN_CRUST - renderObjList[i].scale / 2.0);

        // rotate currR thru currAngle. that is position
        var x = currR * Math.cos(currAngle);
        var y = currR * Math.sin(currAngle);

        // accum
        currAngle += angleVel;
        currR += rVel;

        ret.push([x,y]);
    }
    return ret;
}



function smileyScatter(rand, count, renderObjList, KitchenData) {
    var ret = [];
    
    var used = 0;

    // place left eye
    if (used < count)
    {
        var len = (KitchenData.Rules.RADIUS_OF_TOPPINGS_WITHIN_CRUST - renderObjList[used].scale / 2.0) / 1.5;
        var angle = -3 * PI / 4;

        var x = len * Math.cos(angle);
        var y = len * Math.sin(angle);

        ret.push([x,y]);
        used++;
    }

    // place right eye
    if (used < count)
    {
        var len = (KitchenData.Rules.RADIUS_OF_TOPPINGS_WITHIN_CRUST - renderObjList[used].scale / 2.0) / 1.5;
        var angle = -PI / 4;

        var x = len * Math.cos(angle);
        var y = len * Math.sin(angle);

        ret.push([x,y]);
        used++;
    }

    // place smile
    var startX = -.25;

    var numSteps = count - used;
    for (var i = 0; i < numSteps; i++)
    {
        var x = startX + i * (0.5 / numSteps);
        var y = 0.25;
        ret.push([x,y]);
    }

    return ret;
}

function spokesScatter(rand, count, renderObjList, KitchenData) {
    var ret = [];

    // calculate number of spokes
    // calculate number of points per spoke
    const MIN_POINTS_PER_SPOKE = 2;
    const MAX_POINTS_PER_SPOKE = 6;
    var maxPerSpoke = randomRange(rand, MIN_POINTS_PER_SPOKE, MAX_POINTS_PER_SPOKE);
    var numSpokes = 2;
    var numPointsPerSpoke = Math.floor(count / numSpokes);
    while (numPointsPerSpoke > maxPerSpoke)
    {
        numSpokes++;
        numPointsPerSpoke = Math.floor(count / numSpokes);
    }

    // now calculate the excess (how many more we have than we will scatter on the spokes)
    var extra = count - (numSpokes * numPointsPerSpoke);


    var iCount = 0;
    // HACK: for now put extras in the middle, but later may want to randomize it
    for  (var iExtra = 0; iExtra < extra; iExtra++)
    {
        ret.push([0,0]);
        iCount++;
    }

    // if count > 0
    if (numSpokes * numPointsPerSpoke > extra)
    { 
        // for each point on a spoke
        var maxRadius = KitchenData.Rules.RADIUS_OF_TOPPINGS_WITHIN_CRUST - renderObjList[0].scale / 2.0;       // max radius will be outer edge of crust minus scale of first element. not exactly correct, but close enough. we will adjust the actual instance in further if necessary.
  
        var rInc = maxRadius / numPointsPerSpoke;
        var angInc = TWO_PI / numSpokes;
        var angStart = randomRange(rand, 0, PI);
        for (var iPoint = 0; iPoint < numPointsPerSpoke; iPoint++)
        {
            var len = (iPoint + 1) * rInc;

            // adjust len so obj fits inside the play area
            len = Math.min(len, KitchenData.Rules.RADIUS_OF_TOPPINGS_WITHIN_CRUST - renderObjList[iCount].scale / 2.0);

            // for each spoke
            for (var iSpoke = 0; iSpoke < numSpokes; iSpoke++)
            {
                // choose angle
               var angle = angStart + iSpoke * angInc;

                // calculate point
                var x = len * Math.cos(angle);
                var y = len * Math.sin(angle);
                ret.push([x,y]);
                iCount++;         
            }
        }   

    }
    return ret;

}

function concentricCirclesScatter(rand, count, renderObjList, KitchenData) {
    var ret = [];

    // calculate number of circles
    // calculate number of points per circle
    const MIN_POINTS_PER_CIRCLE = 3;
    const MAX_POINTS_PER_CIRCLE = 6;
    var maxPerCircle = randomRange(rand, MIN_POINTS_PER_CIRCLE, MAX_POINTS_PER_CIRCLE);
    var numCircles = 2;
    var numPointsPerCircle = Math.floor(count / numCircles);
    while (numPointsPerCircle > maxPerCircle)
    {
        numCircles++;
        numPointsPerCircle = Math.floor(count / numCircles);
    }

    // now calculate the excess (how many more we have than we will scatter on the circles)
    var extra = count - (numCircles * numPointsPerCircle);


    var iCount = 0;
    // HACK: for now put extras in the middle, but later may want to randomize it
    for  (var iExtra = 0; iExtra < extra; iExtra++)
    {
        ret.push([0,0]);
        iCount++;
    }

    // if count > 0
    if (numCircles * numPointsPerCircle > extra)
    { 
        // for each circle
        var maxRadius = KitchenData.Rules.RADIUS_OF_TOPPINGS_WITHIN_CRUST - renderObjList[0].scale / 2.0;       // max radius will be outer edge of crust minus scale of first element. not exactly correct, but close enough. we will adjust the actual instance in further if necessary.

        var rInc = maxRadius / numCircles;
        var angInc = TWO_PI / numPointsPerCircle;
        var angStart = randomRange(rand, 0, PI);
        for (var iCircle = 0; iCircle < numCircles; iCircle++)
        {
            var len = (iCircle + 1) * rInc;
            angStart += iCircle * angInc / numCircles;  // stagger the concentric circles a little, otherwise would look like spokess
            // adjust len so obj fits inside the play area
            len = Math.min(len, KitchenData.Rules.RADIUS_OF_TOPPINGS_WITHIN_CRUST - renderObjList[iCount].scale / 2.0);
        
            // for each point on a circle
            for (var iPoint = 0; iPoint < numPointsPerCircle; iPoint++)
            {
                // choose angle
               var angle = angStart + iPoint * angInc;

                // calculate point
                var x = len * Math.cos(angle);
                var y = len * Math.sin(angle);
                ret.push([x,y]);
                iCount++;         
            }
        }   

    }
    return ret;

}

//////////////////////////////////////////////////
// Display List
//////////////////////////////////////////////////
const DL_VERSION = 1;
function generateDisplayList(pizza, KitchenData) {
    // this will output a normalized display list
    // it may include a texture dictionary as well

    var displayBundle = {};
    var textureToIndexMap = new Map();
    displayBundle.textureList = [];
    displayBundle.displayList = [];
    displayBundle.version = DL_VERSION;

    // now generate renderables and push onto list
    var renderObj = {};

    // box
    renderObj = {};
    var box = KitchenData.Boxes[pizza.boxIndex];
    renderObj = createAndAppendRenderObjFromVariant(pizza.rand, box, displayBundle, textureToIndexMap);   
    displayBundle.displayList.push(renderObj);

    // crust
    renderObj = {};
    var crust = KitchenData.Crusts[pizza.crustIndex];
    renderObj = createAndAppendRenderObjFromVariant(pizza.rand, crust, displayBundle, textureToIndexMap);   
    displayBundle.displayList.push(renderObj);

    // sauce
    for (var i = 0; i < pizza.sauceIndices.length; i++)
    {
        renderObj = {};
        var sauceIndex = pizza.sauceIndices[i];     
        var sauce = KitchenData.Sauces[sauceIndex];
        renderObj = createAndAppendRenderObjFromVariant(pizza.rand, sauce, displayBundle, textureToIndexMap); 
        displayBundle.displayList.push(renderObj);
    }  
    
    // cheese
    for (var i = 0; i < pizza.cheeseIndices.length; i++)
    {  
        renderObj = {};
        var cheeseIndex = pizza.cheeseIndices[i];
        var cheese = KitchenData.Cheeses[cheeseIndex];
        renderObj = createAndAppendRenderObjFromVariant(pizza.rand, cheese, displayBundle, textureToIndexMap); 
        displayBundle.displayList.push(renderObj);
    }  

    // Toppings
    for (var i = 0; i < pizza.toppingIndices.length; i++)
    {
        var toppingIndex = pizza.toppingIndices[i];
        var topping = KitchenData.Toppings[toppingIndex];

        // TODO: later the count might be embedded in the dna, so it will be calculated in the make() function
        var toppingCount = randomRange(pizza.rand, topping.countMinMax[0], topping.countMinMax[1]);

        // scatter
        // TODO: move this to the make function
        var scatterIndex = KITCHEN_chooseItem(KitchenData.ScatterMethods, randomRangeFloat(pizza.rand, 0.0, 1.0));
        var scatter = scatterTable[KitchenData.ScatterMethods[scatterIndex].name];

        var toppingRenderObjs = [];
        for (var iCount = 0; iCount < toppingCount; iCount++)
        {
            renderObj = createAndAppendRenderObjFromVariant(pizza.rand, topping, displayBundle, textureToIndexMap, scatter);  
            toppingRenderObjs.push(renderObj); 
        }

        // now call scatter to get positions, then append them
        var positions = scatter(pizza.rand, toppingCount, toppingRenderObjs, KitchenData);
        // TODO: assert positions.length == toppingCount
        for (var iCount = 0; iCount < toppingCount; iCount++)
        {
            renderObj = toppingRenderObjs[iCount];
            renderObj.center = positions[iCount];
            displayBundle.displayList.push(renderObj);
        }
    }

    return displayBundle;

}

function createAndAppendRenderObjFromVariant(rand, variant, displayBundle, textureToIndexMap) {
    var renderObj = {};
    var imageIndex = randomRange(rand, 0, variant.imageUrls.length - 1);  

    // see if texture name is already in list
    var textureListIndex;
    if (textureToIndexMap.has(variant.imageUrls[imageIndex]) == true)
    {
        textureListIndex = textureToIndexMap.get(variant.imageUrls[imageIndex]);
    }
    else{
        // add to list and map
        textureListIndex = displayBundle.textureList.length;
        displayBundle.textureList.push(variant.imageUrls[imageIndex]);
        textureToIndexMap.set(variant.imageUrls[imageIndex], textureListIndex);
    }
    renderObj.textureIndex = textureListIndex;

    // set scale
    renderObj.scale = randomRangeFloat(rand, variant.sizeMinMax[0], variant.sizeMinMax[1]);
    // set rotation
    if (variant.rotationMinMax == undefined)
        renderObj.rotation = 0;
    else
        renderObj.rotation = randomRangeFloat(rand, variant.rotationMinMax[0], variant.rotationMinMax[1]);  

    renderObj.center = [0.0, 0.0];        

    return renderObj;
}


///////////////////////////
// char encoding
//  TODO: make this a class
///////////////////////////

const encodingString = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.";
var charToNumMap = new Map();
for (var i = 0; i < encodingString.length; i++)
  charToNumMap.set(encodingString[i], i);

function isInEncodingSet(c) {
    if (charToNumMap.has(c) == true)
        return true;
    else
        return false;
}

function encodeNumToChar(num) {
    if (num < 0 || num >= encodingString.length)
    {
        console.log("ERROR! out of range.");
        return 0;
    }
    return encodingString[num];
}

function decodeCharToNum(c) {
    return charToNumMap.get(c);
}


/////////////////////////////////////////
// Encoder class
/////////////////////////////////////////
function Encoder(str) {
    this.encodingString = str;
    this.MAX_NUM = this.encodingString.length;  // max number that can be encoded 
    this.charToNumMap = new Map();
    for (var i = 0; i < this.encodingString.length; i++)
        this.charToNumMap.set(this.encodingString[i], i);

    // calc max bits stored in each char
    this.MAX_BITS = 0;
    var x = this.MAX_NUM;
    while (x > 0)
    {
        this.MAX_BITS++;  
        x = Math.floor(x / 2);
    }
}

Encoder.prototype.contains = function(chr) {
    return this.charToNumMap.has(chr);
}

Encoder.prototype.encodeNumber = function(num) {
    if (num < 0 || num >= this.encodingString.length)
    {
        console.log("ERROR! out of range.");
        return 0;
    }
    return this.encodingString[num];
}

Encoder.prototype.decodeChar = function(chr) {
    return this.charToNumMap.get(chr);
}


////////////////////
// Bitfield
////////////////////

function Bitfield(str) {
    this.encodedString = str;
    this.BITS_PER_CHAR = 6;
}

Bitfield.prototype.growBy = function(len) {
    this.encodedString = this.encodedString.padEnd(30, "0");
}

Bitfield.prototype.getString = function(len) {
    return this.encodedString;
}



Bitfield.prototype.setCharAt = function(str,index,chr) {
    if(index > str.length-1) 
    {
        return str;
    }
    return str.substring(0,index) + chr + str.substring(index+1);
}

// 0 <= bitIndex <= BITS_PER_CHAR - 1
Bitfield.prototype.getBit = function(bitIndex) 
{
    // check if within range
    var charIndex = Math.floor(bitIndex / this.BITS_PER_CHAR);
    if (charIndex >= str.length)
    {
        console.log("bit out of range.");
        return -1;
    }

    var decoded = decodeCharToNum(this.encodedString[charIndex]);
    return (decoded & (1 << bitIndex));

}


Bitfield.prototype.setBit = function(bitIndex, val) 
{
    // check if within range
    var charIndex = Math.floor(bitIndex / this.BITS_PER_CHAR);
    if (charIndex >= this.encodedString.length)
    {
        console.log("bit out of range.");
        return -1;
    }

    var localBitIndex = bitIndex % this.BITS_PER_CHAR;
    var decoded = decodeCharToNum(this.encodedString[charIndex]);
    var newNum = (decoded & ~(1 << localBitIndex)) | (val << localBitIndex);
    var newChar = encodeNumToChar(newNum);
    this.encodedString = this.setCharAt(this.encodedString,charIndex,newChar);
}

Bitfield.prototype.DEBUG_printOnBits = function() 
{
    console.log("print on bits for: " + this.encodedString);
    // for each char in the encoded string..
    for (var iChar = 0; iChar < this.encodedString.length; iChar++)
    {
        var c = this.encodedString[iChar];
        var num = decodeCharToNum(c);

        var localBitIndex = 0;
        while (num > 0)
        {
            var actualBitIndex = iChar * this.BITS_PER_CHAR + localBitIndex;
            if (num % 2 == 1)
                console.log("bit " + actualBitIndex + " is set.");
            num = num >> 1;
            localBitIndex++;
        }
    }
}


Bitfield.prototype.countOnBits = function() 
{
    var numOnBits = 0;
    // for each char in the encoded string..
    for (var iChar = 0; iChar < this.encodedString.length; iChar++)
    {
        var c = this.encodedString[iChar];
        var num = decodeCharToNum(c);
        var localBitIndex = 0;
        while (num > 0)
        {
            var actualBitIndex = iChar * this.BITS_PER_CHAR + localBitIndex;
            if (num % 2 == 1)
                numOnBits++;
            num = num >> 1;
            localBitIndex++;
        }
    }
    return numOnBits;
}

Bitfield.prototype.getOnBits = function() 
{
    var onBits = [];
    // for each char in the encoded string..
    for (var iChar = 0; iChar < this.encodedString.length; iChar++)
    {
        var c = this.encodedString[iChar];
        var num = decodeCharToNum(c);
        var localBitIndex = 0;
        while (num > 0)
        {
            var actualBitIndex = iChar * this.BITS_PER_CHAR + localBitIndex;
            if (num % 2 == 1)
                onBits.push(actualBitIndex);
            num = num >> 1;
            localBitIndex++;
        }
    }
    return onBits;
}

// HACK function. Should probably go with KitchenData, since that's where the probability values are cooked.
function KITCHEN_chooseItem(items, diceRoll) {
    // binary search the items list
    var lo = 0;
    var hi = items.length - 1;

    //console.log(items);
    //console.log(diceRoll);
    while (lo <= hi) {
        //console.log("lo = " + lo + " and hi = " + hi);
        var mid = Math.floor(lo + (hi - lo) / 2);
        if (diceRoll == items[mid].probabilityTier)
            return mid;
        else
        if (diceRoll > items[mid].probabilityTier)
            lo = mid + 1;  
        else
        {
            if (lo == mid)
                return mid;
            else
                hi = mid;    
        }    
    }
    return hi;
}



//////////////////////////////////////////
// Pizza
//////////////////////////////////////////
function Pizza() {
    this.DNA_DELIM = '_';
}

Pizza.prototype.makeRandom = function(overrides, KitchenData) 
{
    var pizzaDNA = 0;

    // don't use the pizza rand to create topping indices as then it won't match up with the 
    // rand on the other side when a pizza is created from the same seed
    var localRand = mulberry32(Date.now() - 100);

    // choose box
    this.boxMask = new Bitfield("00");
    var index = KITCHEN_chooseItem(KitchenData.Boxes, randomRangeFloat(localRand, 0.0, 1.0));
    this.boxMask.setBit(index, 1);  

    // TODO: paper underlayment?
    this.paperMask = new Bitfield("00");

    // randomly choose crust
    this.crustMask = new Bitfield("00");
    index = KITCHEN_chooseItem(KitchenData.Crusts, randomRangeFloat(localRand, 0.0, 1.0));
    this.crustMask.setBit(index, 1);

    // randomly choose sauce
    this.sauceMask = new Bitfield("00");
    index = KITCHEN_chooseItem(KitchenData.Sauces, randomRangeFloat(localRand, 0.0, 1.0));
    this.sauceMask.setBit(index, 1);

    // randomly choose cheeses
    this.cheeseMask = new Bitfield("00");
    var numCheeses = randomRange(localRand, 0, KitchenData.Cheeses.length);
    for (var iCheese = 0; iCheese < numCheeses; iCheese++)
    {
        index = KITCHEN_chooseItem(KitchenData.Cheeses, randomRangeFloat(localRand, 0.0, 1.0));
        this.cheeseMask.setBit(index, 1);
    }

    // randomly choose toppings
    // TODO: take into account rarity, etc.
    //this.toppingIndices = [];
    this.toppingMask = new Bitfield("");
    this.toppingMask.growBy(30);
    var numToppings = randomRange(localRand, 0, KitchenData.Toppings.length);
    for (var iTopping = 0; iTopping < numToppings; iTopping++)
    {
        index = KITCHEN_chooseItem(KitchenData.Toppings, randomRangeFloat(localRand, 0.0, 1.0));
        this.toppingMask.setBit(index, 1); 

        // TODO: choose a scatter for this topping

        // TODO: choose num instances of this topping (may query scatter for min/max range, otherwise use the topping one)
    }

    // choose and seed random generator
    this.seed = Date.now(); // TODO: choose better seed?
    this.rand = mulberry32(this.seed); 

    // HACK for now set derivative values
    this.HACK_setDerivativeValues();

    this.dna = this.calculateDNA();
    return this.dna;
}

Pizza.prototype.makeFromDna = function(dna) 
{
    // DNA is like this:
    // OVERALL:  "version" + "dna" + "_" + seed
    // version:
    //      - 2 chars (major and minor)
    // dna:
    //      - 2 chars for box mask
    //      - 2 chars for paper mask
    //      - 2 chars for crust mask
    //      - 2 chars for sauce mask
    //      - 2 chars for cheese mask
    //      - 30 chars for topping mask  (6 toppings per char = 180 possible toppings)
    //      - for each selected element above (boxes, papers, crusts, sauces, cheeses, toppings):
    //              - 2 chars:
    //                     - first char is instance count
    //                      - 2nd char:
    //                          - first 3 bits are rare variant index (r1 - r5)
    //                          - 2nd 3 bits are scatter method index

    // first, we can check to see if any character is outside our encoding char set.
    //    (EXCEPT FOR OUR DELIM "_")
    //   if so it's illegal.
    // TODO: break this out to static class function
    for (var iChar = 0; iChar < dna.length; iChar++)
    {
        var c = dna[iChar];
        if ((isInEncodingSet(c) == false) && (c != this.DNA_DELIM))
        {
            console.log("illegal dna.");
            return -1;
        }
    }

    // here break off the seed
    const tokens = dna.split(this.DNA_DELIM);
    if (tokens.length != 2)
    {
        console.log("illegal dna.");
        return -1;
    }
    this.seed = parseInt(tokens[1]);

    // read version
    this.version = dna.substring(0, 2);
    // TODO: READING THE REST DEPENDS ON WHICH VERSION IT IS!
    this.boxMask = new Bitfield(dna.substring(2, 4));   
    this.paperMask = new Bitfield(dna.substring(4, 6));  
    this.crustMask = new Bitfield(dna.substring(6, 8)); 
    this.sauceMask = new Bitfield(dna.substring(8, 10));     
    this.cheeseMask = new Bitfield(dna.substring(10, 12)); 
    this.toppingMask = new Bitfield(dna.substring(12, 42)); 

    
    // HACK for now set derivative values
    this.HACK_setDerivativeValues();

    // TODO: read the per-ingredient settings (2 chars per)
    // if any are missing then we will just randomly select HERE AND NOW (basically, updating the dna string)

    // create rand from seed
    this.rand = mulberry32(this.seed); 

    // if we got this far then it's a valid dna, so assign it
    this.dna = dna;
}

// HACK for now set derivative values
Pizza.prototype.HACK_setDerivativeValues = function() {
        // LATER WE CAN DEPRECATE THESE since they are derivatives of  the masks above, but for now use them.
    // box
    var boxIndices = this.boxMask.getOnBits();
    // for now support 1 box
    if (boxIndices.length < 1)
    {
        console.log("illegal dna.");
        return -1;
    }
    this.boxIndex = boxIndices[0];
    // TODO: validate this is within range!

    // TODO: we don't use paper (yet)

    // crust
    var crustIndices = this.crustMask.getOnBits();
    // for now support 1 crust
    if (crustIndices.length < 1)
    {
        console.log("illegal dna.");
        return -1;
    }
    this.crustIndex = crustIndices[0];
    // TODO: validate this is within range!

    // sauces
    this.sauceIndices = this.sauceMask.getOnBits();

    // cheeses
    this.cheeseIndices = this.cheeseMask.getOnBits();  

    // toppings
    this.toppingIndices = this.toppingMask.getOnBits();   

}



Pizza.prototype.calculateDNA = function() {
    // for now, a string:
    var dna = "";

    this.CURRENT_VERSION_MAJOR = 0;
    this.CURRENT_VERSION_MINOR = 1;   
    dna += encodeNumToChar(this.CURRENT_VERSION_MAJOR);
    dna += encodeNumToChar(this.CURRENT_VERSION_MINOR);

    dna += this.boxMask.getString();
    dna += this.paperMask.getString();
    dna += this.crustMask.getString();
    dna += this.sauceMask.getString();
    dna += this.cheeseMask.getString();
    dna += this.toppingMask.getString();
    // TODO: per-ingredient settings (instance count, rarity index, scatter method index)

    dna += this.DNA_DELIM;
    dna += this.seed;

    return dna;


/*    
    dna += encodeNumToChar(this.boxIndex);
    dna += encodeNumToChar(this.crustIndex);

    // TODO: for the indices, use bitfields encoded into chars.

    // TODO: encode into char
    dna += encodeNumToChar(this.sauceIndices.length);
    for (var i = 0; i < this.sauceIndices.length; i++)
        dna += encodeNumToChar(this.sauceIndices[i]);
    // TODO: encode into char
    dna += encodeNumToChar(this.cheeseIndices.length);    
    for (var i = 0; i < this.cheeseIndices.length; i++)
        dna += encodeNumToChar(this.cheeseIndices[i]); 
    // TODO: encode into char
    dna += encodeNumToChar(this.toppingIndices.length);    
    for (var i = 0; i < this.toppingIndices.length; i++)
        dna += encodeNumToChar(this.toppingIndices[i]); 

    // seed
    dna += this.seed;

    // return
    return dna;
*/  
}


Pizza.prototype.generateIngredientsData = function(KitchenData) {
    var ingredientsData = {};
    ingredientsData.box = {name: KitchenData.Boxes[this.boxIndex].name, probability: KitchenData.Boxes[this.boxIndex].absoluteProbability};
    ingredientsData.crust = {name: KitchenData.Crusts[this.crustIndex].name, probability: KitchenData.Crusts[this.crustIndex].absoluteProbability}; 
    ingredientsData.sauces = [];
    for (var iSauce = 0; iSauce < this.sauceIndices.length; iSauce++) {
        var sauce = KitchenData.Sauces[this.sauceIndices[iSauce]];
        ingredientsData.sauces.push({name: sauce.name, probability: sauce.absoluteProbability});
    } 
    ingredientsData.cheeses = [];
    for (var iCheese = 0; iCheese < this.cheeseIndices.length; iCheese++) {
        var cheese = KitchenData.Cheeses[this.cheeseIndices[iCheese]];
        ingredientsData.cheeses.push({name: cheese.name, probability: cheese.absoluteProbability});
    } 
    ingredientsData.toppings = [];
    for (var iTopping = 0; iTopping < this.toppingIndices.length; iTopping++) {
        var topping = KitchenData.Toppings[this.toppingIndices[iTopping]];
        ingredientsData.toppings.push({name: topping.name, probability: topping.absoluteProbability});
    }  
    
    return ingredientsData;
}

// util func
function getDisplayableProbability(fraction) {
    return (Math.round(fraction * 1000) / 10);
}

Pizza.prototype.calculatePizzaProbability = function(ingredientsData) {
    // keep track of overall pizza ingredients probability
    // this does NOT (yet) include dice rolls for num toppings (some might have different chances than others),
    // num instances, and scatter type.
    // that's a TODO: for at pizza making time and for here.
    // TODO: store this directly in the return object. 
    var pizzaIngredientsProbability = 1.0;

    // crust
    pizzaIngredientsProbability *= ingredientsData.crust.probability;
    // sauces
    for (var i = 0; i < ingredientsData.sauces.length; i++) {
      pizzaIngredientsProbability *= ingredientsData.sauces[i].probability;
    }

    // cheeses
    for (var i = 0; i < ingredientsData.cheeses.length; i++) {
        pizzaIngredientsProbability *= ingredientsData.cheeses[i].probability;
    }  

    // toppings
    for (var i = 0; i < ingredientsData.toppings.length; i++) {
        pizzaIngredientsProbability *= ingredientsData.toppings[i].probability;
    }  

    // box
    pizzaIngredientsProbability *= ingredientsData.box.probability;

    // return
    return pizzaIngredientsProbability;
}

Pizza.prototype.generatePizzaDescription = function(ingredientsData) {

    var desc = "";

    // crust
    desc = "A " + ingredientsData.crust.name + " crust ";
    desc += " (" + getDisplayableProbability(ingredientsData.crust.probability) + "%)";
    // sauces
    for (var i = 0; i < ingredientsData.sauces.length; i++) {
      if (i == 0)
        desc += " with ";
      desc += ingredientsData.sauces[i].name;
      desc += " (" + getDisplayableProbability(ingredientsData.sauces[i].probability) + "%)";
      if (i == ingredientsData.sauces.length - 2)
        desc += " and ";

      if (i < ingredientsData.sauces.length - 2)
        desc += ", ";
    
      if (i == ingredientsData.sauces.length - 1)        
        desc += " sauce";
    }

    // cheeses
    for (var i = 0; i < ingredientsData.cheeses.length; i++) {
    if (i == 0)
        desc += " covered with ";
    desc += ingredientsData.cheeses[i].name;
    desc += " (" + getDisplayableProbability(ingredientsData.cheeses[i].probability) + "%)";
    if (i == ingredientsData.cheeses.length - 2)
        desc += " and ";

    if (i < ingredientsData.cheeses.length - 2)
        desc += ", ";
    
    if (i == ingredientsData.cheeses.length - 1)        
        desc += " cheese";

    }  

    // toppings
    for (var i = 0; i < ingredientsData.toppings.length; i++) {
    if (i == 0)
        desc += " and smothered with ";
    desc += ingredientsData.toppings[i].name;
    desc += " (" + getDisplayableProbability(ingredientsData.toppings[i].probability) + "%)";
    if (i == ingredientsData.toppings.length - 2)
        desc += " and ";
    if (i < ingredientsData.toppings.length - 2)
        desc += ", ";
    }  

    // box
    desc += ", all carefully packed in a " + ingredientsData.box.name;
    desc += " (" + getDisplayableProbability(ingredientsData.box.probability) + "%)"; 

    desc += "!";

    return desc;
  }



///////////////////////////////////////////////////
// exports
///////////////////////////////////////////////////
exports.Pizza = Pizza
exports.generateDisplayList = generateDisplayList
exports.randomScatter = randomScatter
exports.mulberry32 = mulberry32
exports.randomRange = randomRange
exports.randomRangeFloat = randomRangeFloat
exports.randomPointOnDisk = randomPointOnDisk


