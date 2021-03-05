import csv
import json

def mk_layers(start, end):
  return {'layer '+str(start): None for start in range (start,end)}

# space of all possible recipes? Unclear from meeting notes, unused for now
recipe_index = []

# abstract ingredient
ingredient = {}

""" Categories of ingredients NB have one to many relationship with layers
Currently bucketing as simple solution to rarity will be multiple copies of
a single ingredient to the bucket for a category of ingredients"""
buckets = {
  'box': [],
  'waxpaper': [],
  'crust': [],
  'sauce': [],
  'cheese': [],
  'toppings': [],
  'extras': []
}

# Mapping of which ingredient types match to which pizza layers - not one to one
types_to_layers = {
  'box': [0],
  'waxpaper': [1],
  'crust': [2],
  'sauce': [3],
  'cheese': [4],
  'toppings': [5,6],
  'extras': [7]
}

""" class Base:
  def __init__(self, ):
  
""" 
# A blank recipe template
class Recipe:
  def __init__(self, name, desc, temp, time, base, toppings, extras):
    self.recipeLongName = name
    self.description = desc
    self.ovenTemp = temp
    self.cookTime = time
    self.base = base
    self.toppings = toppings
    self.extras = extras  


""" recipe = {
  'recipeLongName': '',
  'description': '',
  'ovenTemp': '',
  'cookTime': '',
  'base': mk_layers(0,5),
  'toppings': mk_layers(5,7),
  'extras': mk_layers(7,8)
} """

def mk_recipe(Recipe, buckets):
  for layer in recipe['base']:
    layer

def mk_description(recipe):
  """takes a pizza recipe with defined layers and gives it a description"""
  return recipe

def allocate_to_bucket(ingredient, buckets):
  for bucket in buckets:
      if int(ingredient['unique'][1]) in types_to_layers[bucket]:
        buckets[bucket].append(ingredient)

# Horrible function I know, will turn it into something nice iteratively
def fill_buckets(ingredients, buckets):
  """buckets each ingredient item according to middle digit of the 'unique' field"""
  for ingredient in ingredients:
    allocate_to_bucket(ingredient, buckets)

def main():
  with open('ingredients-db.csv', mode='r') as file:
    ingredients = csv.DictReader(file)
    fill_buckets(ingredients, buckets)

if __name__ == "__main__":
  main()