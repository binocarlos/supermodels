supermodels
===========

![Build status](https://api.travis-ci.org/binocarlos/supermodels.png)

dot notation get/set for an object or array of objects

## installation

```
$ npm install supermodels
```

## usage

supermodels returns a function that can read and write to an object using dot notation:

```js
var supermodels = require('supermodels');

var data = {
	name:'Starship Enterprise',
	address:{
		street:'Hanger 7',
		city:'London'
	}
}

var supermodel = supermodels(data);

supermodel('address.postcode', 'SW12');

console.log(supermodel('address.postcode'));

// SW12

console.log(data);

/*
	{
		name:'Starship Enterprise',
		address:{
			street:'Hanger 7',
			city:'London',
			postcode:'SW12'
		}
	}
*/
```

#### dot notation

when you write values using dot notation and they do not exist - objects will be inserted in order to write the value:

```js
var data = {}

var supermodel = supermodels(data);

supermodel('a.b.c', 10);

console.log(data);

/*
	{
		a:{
			b:{
				c:10
			}
		}
	}
*/
```

#### array data
the data can also be an array:

```js
var supermodels = require('supermodels');

var arr = [{
	name:'Starship Enterprise'
},{
	name:'Millenium Falcon'
}]

var supermodel = supermodels(arr);
```

#### array read
When you read from an array based supermodel - it will return the value of the first model in the array:

```js
var name = supermodel('name');

console.log(name);

// Starship Enterprise
```

#### array write

When you write to an array based supermodel - it will write to all models in the array:

```js
supermodel('speed', 200);

console.log(arr);

/*
	[{
		name:'Starship Enterprise',
		speed:200
	},{
		name:'Millenium Falcon',
		speed:200
	}]
*/
```

#### class property access

mymodel.js:

```js
var supermodels = require('supermodels');

module.exports = MyClass;

// a class that has an array as a named property
function MyClass(arr){
  this.modelarray = arr;
}

function getmodels(){
	return this.modelarray;
}

// create a function that updates objects living in modelarray
MyClass.prototype.attr = supermodels(getmodels);

// create a function that updates nested objects living in modelarray
MyClass.prototype.address = supermodels(getmodels, 'address');

// create a function that updates nested properties living in modelarray
MyClass.prototype.postcode = supermodels(getmodels, 'address.postcode', true);
```

Then create a new instance:

```js
var Model = require('./mymodel.js');

var data = [{
	name:'HQ',
	address:{
		city:'London',
		postcode:'SW12'
	}
},{
	name:'Accounts',
	address:{
		city:'Bristol,
		postcode:'BS1'
	}
}]

var instance = new Model(data)
```

Our instance can update all models in the list at once:

```js
instance.attr('test', 10);

console.log(instance.modelarray);

data.forEach(function(model){
	console.log(model.test);
})

/*

// 10
// 10

*/
```

It will return the value of the first model on reading:

```js
console.log(instance.attr('address.city'));

// London
```

#### nested attributes

Access functions allow nested attributes:

```js
instance.address('top.middle.bottom', 12);


console.log(data[1]);

/*
{
	name:'Accounts',
	test:10,
	address:{
		city:'Bristol,
		postcode:'BS1',
		top:{
			middle:{
				bottom:12
			}
		}
	}
}
*/
```

## api

#### `supermodels(data, [path], [type]);`

Return an accessor function that will modify data.

Data can be a an object, an array or a function.

Path is a dot notation for the property in the data to modify.

If data is an object - it will be converted to an array with one element.

If data is an array - it will be used directly.

If data is a function - it will be called each time to provide the data.

type can be one of:

 * true - which means 'primitive'
 * primitive - return a function that will read and write one value - supermodel(value)
 * object - return a function that will read and write objectvalues - supermodel(name, value)
 * remove - return a function that will delete an object property - supermodel()
 * array:add - return a function that inserts a primitive into an array (if it does not exist) - supermodel(value)
 * array:remove - return a function that removes a primitive from an array - supermodel(value)
 * array:has - return a function that tells you if a value is in the array - supermodel(value)
 * has - return a function that tells you if the model has the property - supermodel(path)
 * is - return a function that tells you if the models property is a value - supermodel(value)

A primitive:

```js
var data = {
	title:'Test'
}
var prop = supermodels(data, 'title', true);

console.log(prop());

// Test

prop('apples');

console.log(prop());

// apples

```

A removal function:

var data = {
	address:{
		postcode:'SW12'
	}
}

var remover = supermodels(data, 'address', 'remove');

remover();

console.log(data);

/*
 {

 }
*/


## license

MIT
