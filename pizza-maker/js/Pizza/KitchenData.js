//////////////////////////////////////////////////////////////////////////////////////////////////
// Kitchen Data (hard-coded but soon read from JSON and created/modified via importer and editor)
//////////////////////////////////////////////////////////////////////////////////////////////////
var KitchenData = {

    Rules: { 
        MAX_TOPPINGS_PER_PIZZA: 10,
        MAX_CHEESES_PER_PIZZA: 1,
        RADIUS_OF_TOPPINGS_WITHIN_CRUST: 0.4,       // TODO: get this from Anthony/art specs
    },
 
    //["Common", "R2", "Rare", "Super Rare", "Extremely"],

    // Brittle: the name field here must match exactly to the runtime scatterTable data.
    // at pizza make time the chosen scatter here is used to look into that table for the correct scatter method.
    ScatterMethods: [
        {name: "Random", rarityLevel: 1},
        {name: "Spiral", rarityLevel: 2},
        {name: "Face", rarityLevel: 3},  
        {name: "Spokes", rarityLevel: 2},     
        {name: "Concentric Circles", rarityLevel: 2},                
    ],

    // TODO: refactor these so that boxes crusts, sauces, cheeses contains variant objects, each with different rarities.
    Boxes: [
        // Variant
        {
            name: "Box with waxpaper",
            rarityLevel: 4,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/0500-base-box-redcheckerpaper.png"],
            sizeMinMax: [1.0, 1.0],
            countMinMax: [1,1],
            rotationMinMax: [0,0]
        },
        {
            name: "Box without waxpaper",
            rarityLevel: 1,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/0000-base-box-cardboard.png"],
            sizeMinMax: [1.0, 1.0],
            countMinMax: [1,1],
            rotationMinMax: [0,0]
        }
    ],

    WaxPapers: [

    ],

    Crusts: [
        {
            name: "Thick",
            rarityLevel: 1,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/1100-base-crust-thick.png"],
            sizeMinMax: [1.0, 1.0],
            countMinMax: [1,1],
            rotationMinMax: [-3.14159,3.14159]
        },
        {
            name: "Thin",
            rarityLevel: 1,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/1000-base-crust-thin.png"],
            sizeMinMax: [1.0, 1.0],
            countMinMax: [1,1],
            rotationMinMax: [-3.14159,3.14159]
        },  
    ],


    Sauces: [ 
        {
            name: "Tomato",
            rarityLevel: 1,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/rarepizzas-120-sauce-r0-tomato-v0.png"],
            sizeMinMax: [1.0, 1.0],
            countMinMax: [1,1],
            rotationMinMax: [-3.14159,3.14159] 
        }, 
        {
            name: "BBQ",
            rarityLevel: 2,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/rarepizzas-2-sauce-r2-bbq-v0.png"],
            sizeMinMax: [1.0, 1.0],
            countMinMax: [1,1],
            rotationMinMax: [-3.14159,3.14159] 
        }, 
        {
            name: "Mayo Squirt",
            rarityLevel: 3,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/rarepizzas-130-squirt-r0-mayosquirt-v0.png"],
            sizeMinMax: [1.0, 1.0],
            countMinMax: [1,1],
            rotationMinMax: [-3.14159,3.14159] 
        },          
        {
            name: "Pesto",
            rarityLevel: 3,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/2100-base-sauce-pesto.png"],
            sizeMinMax: [1.0, 1.0],
            countMinMax: [1,1],
            rotationMinMax: [-3.14159,3.14159]
        }, 
        {
            name: "Pixel Pesto",
            rarityLevel: 4,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/2110-base-sauce-pixelpesto.png"],
            sizeMinMax: [1.0, 1.0],
            countMinMax: [1,1],
            rotationMinMax: [-3.14159,3.14159]
        },        
        {
            name: "Deep Space",
            rarityLevel: 5,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/2900-base-sauce-deepspace.png"],
            sizeMinMax: [1.0, 1.0],
            countMinMax: [1,1],
            rotationMinMax: [-3.14159,3.14159]
        },
    ],

    Cheeses: [
        {
            name: "Mozzarella",
            rarityLevel: 1,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/3000-base-cheese-mozzarella.png"],
            sizeMinMax: [1.0, 1.0],
            countMinMax: [1,1],
            rotationMinMax: [-3.14159,3.14159]
        }, 
        {
            name: "Vegan",
            rarityLevel: 3,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/3100-base-cheese-vegan.png"],
            sizeMinMax: [1.0, 1.0],
            countMinMax: [1,1],
            rotationMinMax: [-3.14159,3.14159]
        },                                    
    ],

    Toppings: [
        {
            name: "Pepperoni",
            rarityLevel: 1,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/4000-topping-meat-pepperoni.png"],
            sizeMinMax: [0.1, 0.15],
            countMinMax: [25,50],
            rotationMinMax: [-3.14159,3.14159]
        },
        {
            name: "Salami",
            rarityLevel: 2,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/4650-topping-meat-salami.png"],
            sizeMinMax: [0.2, 0.25],
            countMinMax: [25,50],
            rotationMinMax: [-3.14159,3.14159]
        },
        {
            name: "Special Salami",
            rarityLevel: 4,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/4660-topping-meat-salami.png"],
            sizeMinMax: [0.2, 0.25],
            countMinMax: [25,50],
            rotationMinMax: [-3.14159,3.14159]
        },         
        {
            name: "Turkey Sausage",
            rarityLevel: 2,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/4950-topping-meat-turkeysausage.png"],
            sizeMinMax: [0.08, 0.12],
            countMinMax: [5,12],
            rotationMinMax: [-3.14159,3.14159]
        },
        {
            name: "Tomato",
            rarityLevel: 1,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/5000-topping-fruit-tomato.png"],
            sizeMinMax: [0.25, 0.4],
            countMinMax: [25,50],
            rotationMinMax: [-3.14159,3.14159]
        }, 
        {
            name: "Watermelon",
            rarityLevel: 4,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/5250-topping-fruit-watermelon.png"],
            sizeMinMax: [0.05, 0.1],
            countMinMax: [5,10],
            rotationMinMax: [-3.14159,3.14159]
        }, 
        {
            name: "Special Watermelon",
            rarityLevel: 5,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/5260-topping-fruit-watermelon.png"],
            sizeMinMax: [0.05, 0.1],
            countMinMax: [5,10],
            rotationMinMax: [-3.14159,3.14159]
        }, 
        {
            name: "Watermelon",
            rarityLevel: 4,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/5270-topping-fruit-watermelon.png"],
            sizeMinMax: [0.05, 0.1],
            countMinMax: [5,10],
            rotationMinMax: [-3.14159,3.14159]
        }, 
        {
            name: "Watermelon",
            rarityLevel: 3,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/5280-topping-fruit-watermelon.png"],
            sizeMinMax: [0.05, 0.1],
            countMinMax: [5,10],
            rotationMinMax: [-3.14159,3.14159]
        },
        {
            name: "Crickets",
            rarityLevel: 5,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/6100-topping-bugs-crickets.png"],
            sizeMinMax: [0.03, 0.08],
            countMinMax: [6,12],
            rotationMinMax: [-3.14159,3.14159]
        },                         
        {
            name: "Astronaut",
            rarityLevel: 5,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/6500-toppings-space-astronaut.png"],
            sizeMinMax: [0.05, 0.15],
            countMinMax: [1,2],
            rotationMinMax: [-3.14159,3.14159]
        },
        {
            name: "Lunar Landing",
            rarityLevel: 4,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/6510-toppings-space-lunarlander.png"],
            sizeMinMax: [0.05, 0.15],
            countMinMax: [1,1],
            rotationMinMax: [-3.14159,3.14159]
        },      
        {
            name: "Snap Rocks",
            rarityLevel: 4,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/6800-topping-candy-snaprocks.png"],
            sizeMinMax: [0.05, 0.09],
            countMinMax: [1,3],
            rotationMinMax: [-3.14159,3.14159]
        },
        {
            name: "Snap Rocks",
            rarityLevel: 5,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/6801-topping-candy-snaprocks.png"],
            sizeMinMax: [0.05, 0.09],
            countMinMax: [1,3],
            rotationMinMax: [-3.14159,3.14159]
        },
        {
            name: "Snap Rocks",
            rarityLevel: 4,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/6802-topping-candy-snaprocks.png"],
            sizeMinMax: [0.05, 0.09],
            countMinMax: [1,3],
            rotationMinMax: [-3.14159,3.14159]
        },
        {
            name: "Snap Rocks",
            rarityLevel: 4,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/6803-topping-candy-snaprocks.png"],
            sizeMinMax: [0.05, 0.09],
            countMinMax: [1,3],
            rotationMinMax: [-3.14159,3.14159]
        },
        {
            name: "Shrimp",
            rarityLevel: 2,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/6000-topping-seafood-shrimp.png"],
            sizeMinMax: [0.05, 0.1],
            countMinMax: [5,10],
            rotationMinMax: [-0.5, 0.5]
        },  
        {
            name: "Pop Logo",
            rarityLevel: 4,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/8100-extra-special-poplogo.png"],
            sizeMinMax: [0.1, 0.2],
            countMinMax: [1,2],
            rotationMinMax: [-0.3,0.3]
        },   
        {
            name: "Pop Logo",
            rarityLevel: 5,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/8101-extra-special-poplogo.png"],
            sizeMinMax: [0.1, 0.2],
            countMinMax: [1,2],
            rotationMinMax: [-0.3,0.3]
        },   
        {
            name: "Worm",
            rarityLevel: 4,
            imageUrls: ["http://www.oxbone.com/Pizza/Images/Ingredients/6150-topping-bugs-worms.png"],
            sizeMinMax: [0.05, 0.1],
            countMinMax: [3, 6],
            rotationMinMax: [-3.14159,3.14159]
        }, 
    ],

}

// TODO: move this function to KitchenData prep/export/authoring tool.
// it will iterate all items in an array, normalize probabalities and 
// calculate a non-decreasing probability tier for each.
function cookProbabilities(items) {
    // first calculate the total probability
    var total = 0.0;
    for (var i = 0; i < items.length; i++){
        var item = items[i];
        var rarityLevel = item.rarityLevel;
        // sanity check
        if (rarityLevel == undefined || rarityLevel == null)
        rarityLevel = 1;
        else
        if (rarityLevel < 1)
        rarityLevel = 1;

        // map rarity level to relative probability (relative to 1)
        item.relativeProbability = 1 / (Math.pow(2, rarityLevel - 1));
        total += item.relativeProbability;
    }

    // now go back back and calculate/set the absolute probability and the non-decreasing probability tier
    var tier = 0.0
    for (var i = 0; i < items.length; i++){
        var item = items[i];
        item.absoluteProbability = item.relativeProbability / total;
        tier += item.absoluteProbability;
        item.probabilityTier = tier;
    }
  }
  

function HACK_prepKitchenData() {
    // cook probabilities
    cookProbabilities(KitchenData.Boxes);
    cookProbabilities(KitchenData.Crusts);
    cookProbabilities(KitchenData.Sauces);
    cookProbabilities(KitchenData.Cheeses);
    cookProbabilities(KitchenData.Toppings);     
    cookProbabilities(KitchenData.ScatterMethods);
}

// move these
exports.KitchenData = KitchenData
exports.HACK_prepKitchenData = HACK_prepKitchenData
