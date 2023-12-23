---
layout: "../../layouts/BlogPost.astro"
title: "Using Destructuring in JavaScript"
pubDate: "2020-08-27"
description: "Harness the power of ES6"
minutes: 5
---

Since ES6(ES2015 Edition) was introduce to the JavaScript language, we get to use some cool features when working with arrays and objects. One of them is destructuring. With destructuring we can assign items from an array or object properties as variables.
Using destructuring will make our code a lot more readable and cleaner.

## Object Destructuring

Object destructuring in it’s simplest form could be something like this. Say we have an object of a person and want to use it’s properties as variables.
Instead of declaring a variable using the traditional way(`let name = person.name`), we can specify our variable names within curly brackets and set it equal to the objects name. This will create a name and age variable.

```javascript
const person = { name: "John", age: 32 }
const { name, age } = person

console.log(name) // 'John'
console.log(age) // 32
```

Instead of using strictly the original variable names, we can rename them by adding the new name after a colon `(:)`.

```javascript
const person = { name: "John", age: 32 }
const { name: username, age: yearsOld } = person

console.log(username) // 'John'
console.log(yearsOld) // 32
```

Another thing you might find interesting is that you can assign default values in case you get an unwanted value like _undefined_.

````javascript
const person = { name: "John", age: 32 }
const { name = "Mark", age, married = false } = person

console.log(name) // 'John'
console.log(age) // 32
console.log(married) // false

const person = { name: undefined, age: 32 }

console.log(name) // 'Mark'
console.log(age) // 32
console.log(married) // false```
````

We can combine assigning default values and new variables names.

```javascript
const person = { name: "John", age: 32 }
const {
  name: username = "Mark",
  age: yearsOld,
  married: isMarried = false,
} = person

console.log(username) // 'John'
console.log(yearsOld) // 32
console.log(isMarried) // false
```

A very common use case is destructuring parameters when passed in functions. We pass the whole object as a function parameter and choose what exact arguments we want to accept. If you are working with React you probably see this all the time.

```javascript
const person = {
  name: "John",
  age: 32,
  married: true,
  job: { title: "engineer", yearsExperience: 3 },
}
function getAge({ age }) {
  return age
}
function getJobTitle({ name, job: { title } }) {
  return `${name} is an ${title}`
}
console.log(getAge(person)) // 32
console.log(getJobTitle(person)) // 'John is an engineer'
```

Like we saw above we can pass default values in parameter functions as well.

```javascript
function getUser({ name = "new user", married = false } = {}) {
  console.log(name, married)
}

getUser({ name: "John", married: true })
```

You will notice that we assign the object we are destructuring to another object as a default parameter. The reason for this is because with out it we couldn’t just call the function with out any parameters. We assign it to an empty object so it defaults to something.

We can also destructuring on complex objects with nested arrays an extract what we need.

```javascript
const person = {
  name: "John",
  age: 32,
  married: true,
  children: [
    {
      name: "Anna",
      age: 4,
    },
  ],
  job: { title: "engineer", yearsExperience: 3 },
}

let {
  name: parentName,
  children: [{ name: childrenName }],
} = person

console.log(parentName) // 'John'
console.log(childrenName) // 'Anna'
```

## Array Destructuring

Array destructuring looks very much like object destructuring. But since we don’t have key, value pairs the variable naming follows an index like approach. Instead of (`let first = names[0]`) we do . .

```javascript
const names = ["John", "Mark", "Anna", "Nick"]
const [first, second] = names
console.log(first) // 'John'
console.log(second) // 'Mark'
```

Similarly when working with nested arrays.

```javascript
const names = ["John", ["Mark", "Joanna"], "Anna", "Nick"]
const [first, [second, third], forth, fifth] = names

console.log(first) // 'John'
console.log(second) // "Mark"
console.log(third) // "Joanna"
console.log(forth) // 'Anna'
console.log(fifth) // "Nick"
```

Like objects we can assign a variable without declaration and pass default values.

```javascript
const [first, second] = ["John", "Mark"]
console.log(first) // 'John'
console.log(second) // 'Mark'

const [first = "Someone", second = "Anyone"] = ["John"]
console.log(first) // 'John'
console.log(second) // 'Anyone'
```

We can also ignore some values by using a comma instead of actually naming the variable.
Here we skip the second and the third value by adding two commas after the normal comma.

```javascript
const names = ["John", "Mark", "Anna", "Nick"]
const [first, , , second] = names
console.log(first) // 'John'
console.log(second) // 'Nick'
```

## Spread and Rest

When destructuring an array, you can group it's remaining elements into a variable. This is called the _rest pattern_ with the syntax of three dots (`. . .`). In the example below `myName` is the first name from the `name` array and `...otherNames` is a variable with the remaining elements.

There is also the opposite effect called _spread_ which unpacks an arrays elements. It has the same syntax as rest(`. . .`).

```javascript
const names = ["John", "Anna", "Mark", "Lisa"]

const [myName, ...otherNames] = names // using rest

console.log(myName) // "John"
console.log(otherNames) // ["Anna", "Mark", "Lisa"]

const newNames = ["Michael", ...otherNames] // using spread
console.log(newNames) // ["Michael", "Anna", "Mark", "Lisa"]
console.log(names) // ["John", "Anna", "Mark", "Lisa"]
```

> **Note**: The original _names_ array won't be mutated.

Similarly in objects.

```javascript
const person = {
  name: "John",
  age: 32,
  married: true,
  job: { title: "engineer", yearsExperience: 3 },
}

const { name, age, ...rest } = person // using rest
console.log(name) // 'John'
console.log(age) // 32
console.log(rest) // {married: true, job: { title: 'engineer', yearsExperience: 3 }
```

You can also use the _rest parameter_ when working with functions. Again using the same dot syntax, will create an array of all the arguments, no matter the length.

```javascript
function restNames(...args) {
  console.log(args) // ["John", "Anna", "Mark", "Lisa"]
}

restNames("John", "Anna", "Mark", "Lisa")
```

Same goes with function calls and _spread_. You can spread the parameters you pass into a function.

```javascript
function spreadData(name, age, job) {
  return `${name} is ${age} and he is a ${job}}.`
}

let userData = ["John", 32, "developer"]

let user = spreadData(...userData)
console.log(user) // "John is 32 and he is a developer."
```

## String Destructuring

You can also use destructuring with string characters or split words with string methods. Possible use cases might be . . .

```javascript
const name = "this is a string"
const [one, two, ...rest] = name
console.log(one) // "t"
console.log(two) // "h"
console.log(rest) // "i", "s", " ", "i", "s", " ", "a", " ", "s", "t", "r", "i", "n", "g"

const [firstName, lastName] = "Joe Doe".split(" ")

console.log(firstName) // "Joe"
console.log(lastName) // "Doe"
```

Other examples are extracting the length of a string.

```javascript
const name = "My name is John!!"

const { length: nameLength } = name
console.log(nameLength) // 17
```

And getting all the characters of a string into an array.

```javascript
const string = "This is a string"

const characterArray = [...string]

console.log(characterArray) // ["T", "h", "i", "s", " ", "i", "s", " ", "a", " ", "s", "t", "r", "i", "n", "g"]
```

That's it. Now go ahead and use these feature in your code. It will make you code all cleaner and nicer looking.
