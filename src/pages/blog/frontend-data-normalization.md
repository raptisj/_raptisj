---
layout: "../../layouts/BlogPost.astro"
title: "Frontend Data Normalization"
pubDate: "2020-10-29"
description: "Simplify your complex data structures"
minutes: 5
---

Many times in our applications we are dealing with complex state that contains deep nesting. This makes it difficult to work with since we have to make many manipulations to present our data the way we want. What we commonly do is normalize our data.

This has many benefits:

- We get a more flat structure, meaning that we are not dealing with deep nesting as much.
- Our data structure consists primarily of objects that have their own id. Relationships are being created with id.
- We avoid data duplication.

There are libraries that can help with this like [Normalizr](https://github.com/paularmstrong/normalizr) where you automate the process and have more options, but in this article we are going to do it by hand with plain JavaScript.

> **Note:** This is a well know pattern in Redux to simplify your state and treat it more like a database. We will cover this in a future article.

In our state below, notice that we have an array of object that each object has it's own array of objects as well.

```javascript
const posts = [
  {
    id: "1",
    name: "name 1",
    body: "Lorem ipsum . . .",
    comments: [{ id: "11", comment: "Lorem comment . . ." }],
    author: "Joe Doe",
    data: "2020-10-20",
  },
  {
    id: "2",
    name: "name 2",
    body: "Lorem ipsum . . .",
    comments: [
      { id: "12", comment: "Lorem comment . . ." },
      { id: "13", comment: "Lorem comment . . ." },
      { id: "14", comment: "Lorem comment . . ." },
    ],
    author: "Marry Doe",
    data: "2020-10-20",
  },
  {
    id: "3",
    name: "name 3",
    body: "Lorem ipsum . . .",
    comments: [
      { id: "15", comment: "Lorem comment . . ." },
      { id: "16", comment: "Lorem comment . . ." },
    ],
    author: "Anna Doe",
    data: "2020-10-20",
  },
  {
    id: "4",
    name: "name 4",
    body: "Lorem ipsum . . .",
    comments: [{ id: "17", comment: "Lorem comment . . ." }],
    author: "Jim Doe",
    data: "2020-10-20",
  },
]
```

Let's say we want to find a specific comment from a specific post.

One thing we might do is first find the post we want and then chain another higher order function to find the comment we are looking for. The example below it's not that bad but imagine working with lots of data. You can save some operations by normalizing your data.

> **Note:** This has something to do with **BigO** notation. Simply put, **BigO** notation tells you the number of operations an algorithm will make. We will cover this in a future article as well.

```javascript
const findComment = posts
  .find(post => post.id === "2")
  .comments.find(comment => comment.id === "12")
```

Here we are using a `reduce` higher order function to assign an object to a certain key. In our case we associate each object with a key which is it's own `id`.

Eventually we want to have a `posts` object that contains an `byId` object of each post and an `allIds` array with all the posts ids

```javascript
const normalizedPosts = posts.reduce((data, item) => {
  data[item.id] = item
  return data
}, {})

const postIds = posts.map(post => post.id)

const state = { posts: { byId: normalizedPosts, allIds: postIds } }
console.log(state)
```

<div class="filename">output:</div>

```javascript
 {
	posts: {
		byId: {
			"1": {
				id: "1",
				name: "name 1",
				body: "Lorem ipsum . . .",
				comments: [{id: "11", comment: "Lorem comment . . ."}],
				author: "Joe Doe",
				data: "2020-10-20"
			},
			"2": {
				id: "2",
				name: "name 2",
				body: "Lorem ipsum . . .",
				comments: [
					{id: "12", comment: "Lorem comment . . ."},
					{id: "13", comment: "Lorem comment . . ."},
					{id: "14", comment: "Lorem comment . . ."}
				],
				author: "Marry Doe",
				data: "2020-10-20"
			},

			. . .
			allIds: ["1", "2", "3", "4"]
		}
	}
}
```

Instead of looping an array we can access a specific post by id.

```javascript
console.log(state.posts.byId[2])
```

<div class="filename">output:</div>

```javascript
 {
	id: "2",
	name: "name 2",
	body: "Lorem ipsum . . .",
	comments: [
		{id: "12", comment: "Lorem comment . . ."},
		{id: "13", comment: "Lorem comment . . ."},
		{id: "14", comment: "Lorem comment . . ."}
	],
	author: "Marry Doe",
	data: "2020-10-20"
 },
```

And if we want to access all posts we do it with the `allIds` arrays.

```javascript
console.log(state.posts.allIds.map(id => state.posts.byId[id]))
```

<div class="filename">output:</div>

```javascript
[{…}, {…}, {…}, {…}]
```

Notice that in each object of `posts` we have a comments array. Wouldn't it be nice if that was normalized to?

One way to approach this is normalizing the comments first and then the post itself.

Now doing all the normalization within the reduce method is a bit verbose. We can abstract it to it's own reusable function named `normalizeBy`.

```javascript
const normalizeBy = key => {
  return (data, item) => {
    data[item[key]] = item
    return data
  }
}

const normalizedPostsAndComments = posts
  .map(p => ({ ...p, comments: p.comments.reduce(normalizeBy("id"), {}) }))
  .reduce(normalizeBy("id"), {})

console.log(normalizedPostsAndComments[2].comments[12])
```

If we log it to console the output will look something like be this.

<div class="filename">output:</div>

```javascript
"2" : {
	id: "2",
	name: "name 2",
	body: "Lorem ipsum . . .",
	comments: {
		"12": {id: "12", comment: "Lorem comment . . ."},
		"13": {id: "13", comment: "Lorem comment . . ."},
		"14": {id: "14", comment: "Lorem comment . . ."}
	},
	author: "Marry Doe",
	data: "2020-10-20"
},
```

We can further abstract our state by separating our comments from within the post and keep an array of comments that belong to a post. We are going to keep the `comments` arrays though in each post but only contain the id of each comment.

```javascript
const nomalizedComments = posts
  .map(post => post.comments)
  .flat()
  .reduce(normalizeBy("id"), {})

const commentIds = posts
  .map(post => post.comments)
  .flat()
  .map(comment => comment.id)

const nomalizedPosts = posts
  .map(post => ({
    ...post,
    comments: post.comments.map(comment => comment.id),
  }))
  .reduce(normalizeBy("id"), {})

const postIds = posts.map(post => post.id)

const state = {
  posts: {
    byId: nomalizedPosts,
    allIds: postIds,
  },
  comments: {
    byId: nomalizedComments,
    allIds: commentIds,
  },
}

console.log(state)
```

<div class="filename">output</div>

```javascript
 {
	posts: {
		byId: {
			"1": {
				id: "1",
				name: "name 1",
				body: "Lorem ipsum . . .",
				comments: ["11"],
				author: "Joe Doe",
				data: "2020-10-20"
			},
			"2": {
				id: "2",
				name: "name 2",
				body: "Lorem ipsum . . .",
				comments: ["12". "13", "14"],
				author: "Marry Doe",
				data: "2020-10-20"
			},
			"3": {
				id: "3",
				name: "name 3",
				body: "Lorem ipsum . . .",
				comments: ["15", "16"],
				author: "Anna Doe",
				data: "2020-10-20"
			},
			"4": {
				id: "4",
				name: "name 4",
				body: "Lorem ipsum . . .",
				comments: ["17"],
				author: "Jim Doe",
				data: "2020-10-20"
			}
		},
		allIds: ["1", "2", "3", "4"]
	},
	comments: {
		byId: {
			"11": {id: "11", comment: "Lorem comment . . ." },
			"12": {id: "12", comment: "Lorem comment . . ." },
			"13": {id: "13", comment: "Lorem comment . . ." },
	 	  "14": {id: "14", comment: "Lorem comment . . ." }
			"15": {id: "15", comment: "Lorem comment . . ." },
			"16":	{id: "16", comment: "Lorem comment . . ." }
			"17": {id: "17", comment: "Lorem comment . . ." },
		}.
		allIds: ["11", "12", "13", "14", "15", "16", "17"]
	}
}
```

Now we can access

- a specific post or comment
- all the posts or comments
- all the comments of a specific post

```javascript
// 1
console.log(state.posts.byId[2])
console.log(state.comments.byId[13])

// 2
console.log(state.posts.allIds.map(id => state.posts.byId[id]))

// 3
console.log(
  state.posts.byId[2].comments.map(commentId => state.comments.byId[commentId])
)
```

Data normalization makes complex state more manageable. This is an example of how to approach data normalization so you can build on top of this. This is in no way _the right way_ of doing things but it will give you an overview.

Now go and make the complex, simple.
