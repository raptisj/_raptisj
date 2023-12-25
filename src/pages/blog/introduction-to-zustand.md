---
layout: "../../layouts/BlogPost.astro"
title: "Introduction to Zustand"
pubDate: "2022-03-02"
description: "The simplest state management system there is"
minutes: 5
---

State management in React has been the subject of discussion for ages and it sure has evolved over the years. With the addition of React Hooks being the main turning point, there was kinda of a renaissance in how we think about state. There are many different state management systems that take different approaches, some notoriously verbose while others are more minimal. One such system is [Zustand](https://github.com/pmndrs/zustand).

Zustand is an unopinionated, barebones, lightweight state management. It uses hooks as its primary pattern on interacting with the state. One key point is significant less boilerplate compared to other state management systems out there.

Mind that we don’t mess with wrapping our app with Providers and all that jazz, although Zustand gives you this option.

In this post we are going to create a small that will have the following functionally:

- Add and remove todos
- Display some users coming from an API
- Have a dark theme that is persisted through each refresh

If you want to jump straight to the [code here.](https://github.com/raptisj/zustand-play)

First let's install Zustand.

```jsx
npm install zustand
```

In our `src` folder we will create a file called `store.js` where we will set up our applications store. You import the `create` method from Zustand in order to create your store hook. You use `set` to merge your new state to the old state. A typical store setup might look something like this. As you can see besides the `todos` array we also added all the actions we going to use for adding and removing todos. In our case, we will add some initial state as well.

```jsx
// store.js
import create from "zustand"

const initialState = [
  {
    id: Math.floor(Math.random() * 100) + 1,
    title: "Go to the gym",
  },
  {
    id: Math.floor(Math.random() * 100) + 1,
    title: "Buy coffee",
  },
]

export const useStore = create(set => ({
  todos: initialState,
  addTodo: todo => set(state => ({ todos: [...state.todos, todo] })),
  removeTodo: id =>
    set(state => ({ todos: state.todos.filter(todo => todo.id !== id) })),
  removeAllTodos: () => set({ todos: [] }),
}))
```

Now to consume the state you simply use the hooks and select all or part of the state you want to use.

```jsx
// App.js

...

const todos = useStore(state => state.todos)
const addTodo = useStore(state => state.addTodo)

const [inputValue, setInputValue] = useState('')

const onChange = (e) => {
	setInputValue(e.target.value)
}

const onSubmit = (e) => {
  e.preventDefualt();

  const todo = {
    id: Math.floor(Math.random() * 100) + 1,
    title: inputValue
  }

  addTodo(todo)
  setInputValue('')
}

<div>
  Hello Zustand
  <form onSubmit={onSubmit}>
    <input value={inputValue} onChange={onChange} />
  </form>

  <ul>
    {todos.map(todo => (
      <li key={todo.id}>{todo.title}</li>
    ))}
  </ul>
</div>

...
```

Zustand recommends using selectors with `useCallback` in order to memoize them and avoid unnecessary re-renders. Alternatively, you can define the selector outside the component instead of using `useCallback`.

```jsx
const todos = useStore(useCallback(state => state.todos, []))
```

```jsx
const selector = state => state.todos

function App() {
	const todos = useStore(selector)
	...
```

## Async Actions

Zustand handles async actions quite nicely just as you would normally do. Here we are going to fetch some todos and displayed them as well. In order to keep things tidy, we will split our store into slices. This will be the way to go if your application scales.

```jsx
const TODOS_API_URL = "https://jsonplaceholder.typicode.com/todos"

const asyncTodosSlice = set => ({
  asyncTodos: [],
  loading: true,
  fetchTodos: async () => {
    const response = await fetch(TODOS_API_URL)
    set({ asyncTodos: await response.json(), loading: false })
  },
})

export const useAsyncStore = create(asyncTodosSlice)
```

```jsx

...

const asyncTodos = useAsyncStore(useCallback(state => state.asyncTodos, []))
const loading = useAsyncStore(state => state.loading)
const fetchTodos = useAsyncStore(state => state.fetchTodos)

useEffect(() => {
  fetchTodos()
}, [fetchTodos])

return (
  <>

    <h2>Async Todos</h2>

    {loading && 'loading todos . . .'}

    <ul>
      {asyncTodos.map(todo => (
        <li key={todo.id}>
          {todo.title}
        </li>
      ))}
    </ul>
  </>

...
```

## Split Stores Into Slices

If your application grows in size the complexity grows exponentially as well. Zustand gives you this option as well to organize and split your stores to be more manageable. If you have worked with Redux you might be familiar with `combineReducers` where you merge all your state objects into one. If you merge them into one you then have something that looks like this.

```jsx

...

const todosSlice = (set, get) => ({
  todos: initialState,
  addTodo: (todo) => set(state => ({ todos: [...state.todos, todo] })),
  removeTodo: (id) => set(state => ({ todos: state.todos.filter(todo => todo.id !== id) })),
  removeAllTodos: () => set({ todos: [] })
})

const asyncTodosSlice = (set) => ({
  asyncTodos: [],
  loading: true,
  fetchTodos: async () => {
    const response = await fetch(TODOS_API_URL)
    set({ asyncTodos: await response.json(), loading: false })
  }
})

const rootSlice = (set, get) => ({
  ...todosSlice(set, get),
  ...asyncTodosSlice(set, get),
});

export const useStore = create(rootSlice);
```

Now we want to create a way for users to toggle between dark and light mode, all while being persisted to `localStorage`. Zustand offers us the `persist` method. By default it uses `localStorage` but you can use anything you like really.

```jsx
import create from "zustand"
import { persist } from "zustand/middleware"

const settingsSlice = set => ({
  dark: false,
  toggleDarkMode: () => set(state => ({ dark: !state.dark })),
})

export const useSettings = create(persist(settingsSlice, { name: "settings" }))
```

For `sessionStorage` usage, you can assign it as such.

```jsx

{
	name: "todos" ,
	getStorage: () => sessionStorage,
}
```

## Devtools

Very much like so we have the Redux tools in order to debug and see our state, Zustand uses Redux devtools under the hood. You import the devtools middleware and wrap your slice very much so like you do with `persist`.

In our case we are going to have a settings slice that we will store information regarding our theme and functionality to change it.

```jsx
import { devtools, persist } from "zustand/middleware"

const settingsSlice = set => ({
  dark: false,
  toggleDarkMode: () => set(state => ({ dark: !state.dark })),
})

export const useSettings = create(
  devtools(persist(settingsSlice, { name: "settings" }))
)
```

Note that we previously used the `persist` middleware so now we wrap that in our `devtools` as well.

Now let’s refactor things a bit. Or take a look at the end result straight away.

```markdown
src
-- components
-- AsyncTodos.js
-- Form.js
-- Todos.js
```

<details>
<summary>store.js</summary>
<br>

```jsx
import create from "zustand"
import { devtools, persist } from "zustand/middleware"

const TODOS_API_URL = "https://jsonplaceholder.typicode.com/todos"

const initialState = [
  {
    id: Math.floor(Math.random() * 100) + 1,
    title: "Go to the gym",
  },
  {
    id: Math.floor(Math.random() * 100) + 1,
    title: "Buy coffee",
  },
]

const todosSlice = (set, get) => ({
  todos: initialState,
  addTodo: todo => set(state => ({ todos: [...state.todos, todo] })),
  removeTodo: id =>
    set(state => ({ todos: state.todos.filter(todo => todo.id !== id) })),
  removeAllTodos: () => set({ todos: [] }),
})

const asyncTodosSlice = set => ({
  asyncTodos: [],
  loading: true,
  fetchTodos: async () => {
    const response = await fetch(TODOS_API_URL)
    set({ asyncTodos: await response.json(), loading: false })
  },
})

const settingsSlice = set => ({
  dark: false,
  toggleDarkMode: () => set(state => ({ dark: !state.dark })),
})

const rootSlice = (set, get) => ({
  ...todosSlice(set, get),
  ...asyncTodosSlice(set, get),
})

export const useStore = create(devtools(rootSlice))
export const useSettings = create(
  devtools(persist(settingsSlice, { name: "settings" }))
)
```

</details>

<details>
<summary>App.js</summary>
<br>

```jsx
import "./App.css"
import { useEffect } from "react"
import { useStore, useSettings } from "./store"
import AsyncTodos from "./components/AsyncTodos"
import Todos from "./components/Todos"
import Form from "./components/Form"

function App() {
  const removeAllTodos = useStore(state => state.removeAllTodos)
  const dark = useSettings(state => state.dark)
  const toggleDarkMode = useSettings(state => state.toggleDarkMode)

  useEffect(() => {
    if (dark) {
      document.querySelector("body").classList.add("dark")
    } else {
      document.querySelector("body").classList.remove("dark")
    }
  }, [dark])

  return (
    <div className="App">
      <h1>Hello Zustand</h1>

      <button onClick={toggleDarkMode}>Toggle theme</button>
      <button onClick={removeAllTodos}>Clear all</button>

      <Form />
      <Todos />
      <hr />
      <AsyncTodos />
    </div>
  )
}

export default App
```

</details>

<details>
<summary>App.css</summary>
<br>

```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 1rem;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}

ul {
  list-style: none;
  padding: 0;
}

.dark {
  background-color: #282c34;
  color: white;
}
```

</details>

<details>
<summary>Todos.js</summary>
<br>

```jsx
import { useCallback } from "react"
import { useStore } from "../store"

const Todos = () => {
  const todos = useStore(useCallback(state => state.todos, []))
  const removeTodo = useStore(state => state.removeTodo)

  return (
    <>
      <h2>Todos</h2>
      <p>{todos.length} todos in the list</p>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <button onClick={() => removeTodo(todo.id)}>X</button>
            {todo.title}
          </li>
        ))}
      </ul>
    </>
  )
}

export default Todos
```

</details>

<details>
<summary>AsyncTodos.js</summary>
<br>

```jsx
import { useEffect, useCallback } from "react"
import { useStore } from "../store"

const AsyncTodos = () => {
  const asyncTodos = useStore(useCallback(state => state.asyncTodos, []))
  const loading = useStore(state => state.loading)
  const fetchTodos = useStore(state => state.fetchTodos)

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  return (
    <>
      <h2>Async Todos</h2>

      {loading && "loading todos . . ."}

      <ul>
        {asyncTodos.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </>
  )
}

export default AsyncTodos
```

</details>

<details>
<summary>Form.js</summary>
<br>

```jsx
import { useState } from "react"
import { useStore } from "../store"

const Form = () => {
  const addTodo = useStore(state => state.addTodo)

  const [inputValue, setInputValue] = useState("")

  const onChange = e => {
    setInputValue(e.target.value)
  }

  const onSubmit = e => {
    e.preventDefault()

    if (!inputValue) return

    const todo = {
      id: Math.floor(Math.random() * 100) + 1,
      title: inputValue,
    }

    addTodo(todo)
    setInputValue("")
  }

  return (
    <form onSubmit={onSubmit}>
      <input value={inputValue} onChange={onChange} />
    </form>
  )
}

export default Form
```

</details>

<br />

In general Zustand is a joy to work with, providing us with all the bare necessities out of the box. If you want something more intricate you might consider other well established tools out there. For further resources about Zustand you can take a look at the [documentation](https://github.com/pmndrs/zustand) with many, easy to understand, examples.
