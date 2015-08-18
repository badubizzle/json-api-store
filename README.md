# JSON API Store [![Build Status](https://travis-ci.org/haydn/json-api-store.svg?branch=master)](https://travis-ci.org/haydn/json-api-store)

JSON API Store takes [JSON API](http://jsonapi.org) data and creates plain
JavaScript objects for the resources it describes. It will link-up
relationships automatically and update both sides of reciprocal relationships
when either side is modified.

## Usage

At the moment you need to do your own AJAX requests, but there are plans to add
AJAX methods to create, read, update and destroy resources in the future. For
now you can just push the responses from your own requests to the store:

```javascript

// Define the "categories" type.
Store.types["categories"] = {
  title: Store.attr(),
  products: Store.hasMany({ inverse: "category" })
};

// Define the "products" type.
Store.types["products"] = {
  title: Store.attr(),
  category: Store.hasOne()
};

// Create a new store instance.
var store = new Store();

// Add data - this can just be the response from a GET request to your API.
store.push({
  "data": {
    "type": "products",
    "id": "1",
    "attributes": {
      "title": "Example Book"
    },
    "relationships": {
      "category": {
        "data": {
          "type": "categories",
          "id": "1"
        }
      }
    }
  },
  "included": [
    {
      "type": "categories",
      "id": "1",
      "attributes": {
        "title": "Books"
      }
    }
  ]
});

// Get the product from the store.
var product = store.find("products", "1");
// Get the category from the store.
var category = store.find("categories", "1");

product.title; // "Example Book"
category.title; // "Books"

product.category === category; // true
category.products[0] === product; // true

```

## Installing

Grab the `lib/store.js` file (Bower / NPM options coming soon).

## Documentation

Documentation is available in the `docs` directory. It can be re-generated with
[esdoc](https://esdoc.org/):

```
esdoc -c esdoc.json
```

## Tests

You can run tests once-off with NPM:

```
npm test
```

Alternatively, you can run tests in watch mode using
[nodemon](http://nodemon.io):

```
nodemon node_modules/jasmine/bin/jasmine.js
```

## Building

You can rebuild the the output from the source using
[babel](https://babeljs.io):

```
babel src/store.js -m umd --module-id Store --compact true --no-comments -o lib/store.js
```

## Roadmap

- better type definitions (define per instance and optionally use classes)
- support for pluralisations/pseudonyms
- online documentation / website
- NPM/Bower packages
- automated release process
- create, read, update & destroy AJAX methods
- event listeners for listening to changes
- a way to query the local data?
- isomorphic?
- support for links & pagination
