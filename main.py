import csv
import json
import random

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

def mk_layers(start, end):
  return {'layer '+str(start): None for start in range (start,end)}


def pour_bucket(dict, layer, buckets):
  """Finds the right bucket for a layer based on dict mapping, removes a 
  random item from bucket, assigns it to the layer, and returns layer"""
  for bucket in buckets:
    if int(layer[-1]) in dict[bucket]:
      choice = random.choice(buckets[bucket])
      buckets[bucket].remove(choice)
      return choice 

def pour_buckets(dict, layers, buckets):
  for layer in layers:
    layers[layer] = pour_bucket(dict, layer, buckets)
  return layers

class Recipe:
  def __init__(self, buckets, name=None, desc=None, temp=None, time=None):
    self.recipeLongName = name
    self.description = desc
    self.ovenTemp = temp
    self.cookTime = time
    self.base = pour_buckets(types_to_layers, mk_layers(0,5), buckets)
    self.toppings = pour_buckets(types_to_layers, mk_layers(5,7), buckets)
    self.extras = pour_buckets(types_to_layers, mk_layers(7,8), buckets)


def mk_description(recipe):
  """takes a pizza recipe with defined layers and gives it a description"""
  return recipe

def allocate_to_bucket(ingredient, buckets):
  for bucket in buckets:
      if int(ingredient['unique'][1]) in types_to_layers[bucket]:
        buckets[bucket].append(ingredient)

def fill_buckets(ingredients, buckets):
  """buckets each ingredient item according to middle digit of the 'unique' field"""
  for ingredient in ingredients:
    allocate_to_bucket(ingredient, buckets)

def main():
  with open('ingredients-db.csv', mode='r') as f:
    ingredients = csv.DictReader(f)
    fill_buckets(ingredients, buckets)
  recipe = Recipe(buckets)
  with open('recipe.json', mode='w', encoding='utf-8') as f:
    f.write(json.dumps(recipe.__dict__))

if __name__ == "__main__":
  main()