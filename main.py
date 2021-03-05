import csv
import json

def mk_layers(start, end):
  return {'layer '+str(start): None for start in range (start,end)}

# space of all possible recipes? Unclear from meeting notes, unused for now
recipe_index = []

# abstract ingredient
ingredient = {}

# items from db for making a pizza recipe, thrown into buckets
base = {
  'box': [],
  'waxpaper': [],
  'crust': [],
  'sauce': [],
  'cheese': []
}
toppings = []
extras = []
buckets = {
  'base': base,
  'toppings': toppings,
  'extras': extras
}
  
# A blank recipe template
recipe = {
  'recipeLongName': '',
  'description': '',
  'ovenTemp': '',
  'cookTime': '',
  'base': mk_layers(0,5),
  'toppings': mk_layers(5,7),
  'extras': mk_layers(7,8)
}

# Do I need a buckets to layers mapping later?

def mk_description(recipe):
  """takes a pizza recipe with defined layers and gives it a description"""
  return recipe

# Horrible function I know, will turn it into something nice iteratively
def fill_buckets(ingredients, buckets):
  """buckets each ingredient item according to middle digit of the 'unique' field"""
  for ingredient in ingredients:
    if int(ingredient['unique'][1]) == 0:
      buckets['base']['box'].append(ingredient)
    elif int(ingredient['unique'][1]) == 1:
      buckets['base']['waxpaper'].append(ingredient)
    elif int(ingredient['unique'][1]) == 2:
      buckets['base']['crust'].append(ingredient)
    elif int(ingredient['unique'][1]) == 3:
      buckets['base']['sauce'].append(ingredient)
    elif int(ingredient['unique'][1]) == 4:
      buckets['base']['cheese'].append(ingredient)
    elif 4 < int(ingredient['unique'][1]) < 7:
      buckets['toppings'].append(ingredient)
    elif int(ingredient['unique'][1]) == 7:
      buckets['extras'].append(ingredient)
    else:
      print ("invalid ingredient layer code") # replace later with something neater

def main():
  with open('ingredients-db.csv', mode='r') as file:
    ingredients = csv.DictReader(file)
    fill_buckets(ingredients, buckets)

if __name__ == "__main__":
  main()