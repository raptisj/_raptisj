---
layout: "../../layouts/BlogPost.astro"
title: "Common Array Methods"
pubDate: "2019-09-26"
description: "Using push, pop, find and more"
minutes: 2
---

In this article we are going to see some more array methods like concat, push, slice, splice, find and more.

With out any more talking. Lets makes this clear, once and for all.

## push()

`push()` does exactly what it says. It pushes new elements in an existing array.

```javascript
let names = ["Miles", "John", "Anna", "Nick"];

names.push("Paul");

console.log(names); // ['Miles', 'John', 'Anna', 'Nick', 'Paul']
```

Note that our initial array was mutated. This leads us to our next array method and difference between the two.

## concat()

`concat()` also adds a new element but to a new array we specified. It doesn't mutate the initial one.
If we try to `concat()` something to the initial array it will simply return the array unchanged.

```javascript
let names = ["Miles", "John", "Anna", "Nick"];

names.concat("Paul");

console.log(names); // ['Miles', 'John', 'Anna', 'Nick']
```

but

```javascript
const newNames = names.concat("Paul");

console.log(newNames); // ['Miles', 'John', 'Anna', 'Nick', 'Paul']
```

## pop()

`pop()` removes the last element from an array. Pretty straight forward.

```javascript
let names = ["Miles", "John", "Anna", "Nick"];

names.pop();

console.log(names); // ['Miles', 'John', 'Anna']
```

## slice()

`slice()` returns a portion of an array in a new array. It takes two parameters. Where we want to specify our starting and ending point. The numbers are index based so the ending point is not included.

```javascript
let names = ["Miles", "John", "Anna", "Nick"];

const someNames = names.slice(0, 2);

console.log(someNames); // ['Miles', 'John']
```

## splice()

Unlike `push()` where the new item it's being added at the end of the array, the `splice()` method updates the array by either removing a specific element or adding a new element in a specific place in an array.

```javascript
let names = ["Miles", "John", "Anna", "Nick"];

names.splice(2, 0, "Paul");

console.log(names); // ['Miles', 'John', 'Paul', 'Anna', 'Nick']
```

The 2 in this examples specifies the index position, where you want your element to be added. The 0 means to add, if 1 it will replace. The third parameters is the element we want to insert. If no value is provided it will remove that element.

```javascript
//replace

names.splice(2, 1, "Paul");

console.log(names); // ['Miles', 'John', 'Paul', 'Nick']
```

```javascript
// remove

names.splice(2, 1);

console.log(names); // ['Miles', 'John', 'Nick']
```

## find()

`find()` method returns the first value of the array that matches a certain condition.
In this case we find the first name in the array with four letters.

```javascript
let names = ["Miles", "John", "Anna", "Nick"];

const findName = names.find((n) => n.length === 4);

console.log(findName); // John
```
