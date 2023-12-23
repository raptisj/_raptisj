---
layout: "../../layouts/BlogPost.astro"
title: "Darkmode with React Context API(Classes and Hooks)"
pubDate: "2019-08-06"
minutes: 7
---

Darkmode is a small little feature that is pretty common these days. Now I'm not writing this article on why it's cool but I think this is a nice opportunity to learn some concepts that come with this. And it's actually the first example that I came across and made me understand how the React Context API works. First we will do this using Class components and then we will move to functional ones using Hooks.
This article was inspired by reading the docs(really?)

## Prerequisites:

- Have Node.js and npm installed globally.

- Know the basics of React.

## What is the Context API?(Quickly)

The Context API is a way to control/handle the state of our application. A central place for all of our data.
Now you will say that '_isn't Redux for that_'? And yes Redux does all of that.
You would prefer to use Context API though over something like Redux if you are dealing with a smaller application, where Redux might be a bit of an overkill.

Lets create our darkmode-app and learn as we go.

## With Classes

First create you React app with the usual command.

```
npx create-react-app darkmode-app
```

Our file structure will look something like this.

```
assets
    |__ sun.svg
    |__ moon.svg
components
    |__ Navbar.js
    |__ MainBody.js
    |__ ToogleTheme.js
contexts
    |__ThemeContext.js
```

Three components in a components folder and one in a contexts folder. The later will be our single source of truth. Also we will have an assets folder for our moon and sun icons.

Some css for basic styling. I use scss so go ahead and `npm install node-sass` as well. Don't forget to change the extension in index.js from .css to .scss.

Our `Navbar` component ...

```javascript
import React, { Component } from "react";
import ToggleTheme from "./ToggleTheme";

class Navbar extends Component {
  render() {
    return (
      <div className="navbar">
        <h1>Navbar</h1>
        <ToggleTheme />
      </div>
    );
  }
}

export default Navbar;
```

... and our `MainBody` component.

```javascript
import React, { Component } from "react";

class MainBody extends Component {
  render() {
    return (
      <div>
        <div className="main-body">
          <h1>MainBody</h1>
          <h2>Subtitle</h2>
          <p>. . . </p>
        </div>
      </div>
    );
  }
}

export default MainBody;
```

Now you might have guessed it. Our state that will control in what mode we are(darkmode / lightmode) must be global and accessible from everywhere. So our changing color theme logic will live in the `ThemeContext.js` file.

```javascript
import React, { Component, createContext } from "react";

export const ThemeContext = createContext();

class ThemeContextProvider extends Component {
  state = {
    lightTheme: true,
  };

  toggleTheme = () => {
    this.setState({ islightTheme: !this.state.lightTheme });
  };

  render() {
    const { children } = this.props;
    return (
      <ThemeContext.Provider
        value={{ ...this.state, toggleTheme: this.toggleTheme }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }
}

export default ThemeContextProvider;
```

Above we imported `React` and `createContext`. `createContext` creates a Context object. We store that in a const named ThemeContext.

We create a component named `ThemeContextProvider`. This component's state will contain our global data. In this case if `lightTheme` is true or false.

To provide our components with the necessary data we have the Provider tag that surrounds the components that we want to pass the data to.

In our render function above we are returning our ThemeContext object we created and give it the Provider tag. We pass a value property that accepts the data we want to pass. In this case we pass an object with our state and functions(in our case `toggleTheme` function toggles our state).

Inside we destructure the children prop that refers to our child components. The ones we are nesting in our `App.js` file.

Looks like this.

```javascript
import React from "react";
import Navbar from "./components/Navbar";
import MainBody from "./components/MainBody";
import ThemeContextProvider from "./contexts/ThemeContext";

function App() {
  return (
    <div className="App">
      <ThemeContextProvider>
        <Navbar />
        <MainBody />
      </ThemeContextProvider>
    </div>
  );
}

export default App;
```

We provided our data all over our application using Provider with the ThemeContext object. Now we have to catch the data from each of our components. We do this using the Consumer tag.

In our `ToggleTheme` component we import the `ThemeContext` object.(NOT the `ThemeContextProvider` component) and wrap our JSX inside the render function with the ThemeContext.Consumer tag.

```javascript
import React, { Component } from "react";
import sun from "../assets/sun.svg";
import moon from "../assets/moon.svg";
import { ThemeContext } from "../contexts/ThemeContext";

class ToggleTheme extends Component {
  state = {
    icon: false,
  };

  iconChange = () => {
    this.setState({ icon: !this.state.icon });
  };

  render() {
    return (
      <ThemeContext.Consumer>
        {(context) => {
          return (
            <div className="toggle__box">
              <span>
                {this.state.icon ? (
                  <img src={moon} className="moon-icon" />
                ) : (
                  <img src={sun} className="sun-icon" />
                )}
              </span>
              <div className="toggle__btn" onClick={context.toggleTheme}>
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={this.iconChange}
                />
                <div className="circle"></div>
                <div className="layer"></div>
              </div>
            </div>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}

export default ToggleTheme;
```

Our `Consumer` expects a function. We pass our context and return our JSX
Note that with onClick we fire the toggleTheme function.

We also have some local state to show the proper icon based on the state of our theme.
With onChange we call the `iconChange` function that controls which icon should be shown.

In `Navbar.js` we will change the background color on darktheme. We are going to apply a className based on our `lightTheme`'s state.

Again we import ThemeContext and apply it with the `Consumer`.

```javascript
import React, { Component } from "react";
import ToggleTheme from "./ToggleTheme";
import { ThemeContext } from "../contexts/ThemeContext";

class Navbar extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {(context) => {
          const theme = !context.lightTheme ? " darkmode" : "";
          return (
            <div className={"navbar" + theme}>
              <h1>Navbar</h1>
              <ToggleTheme />
            </div>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}

export default Navbar;
```

We store a conditional statement in a const named `theme` and pass it as a className.
The same applies for our `MainBody` component.

```javascript
import React, { Component } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

class MainBody extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {(context) => {
          const theme = !context.lightTheme ? " darkmode" : "";
          return (
            <div className={"" + theme}>
              <div className="main-body">
                <h1>MainBody</h1>
                <h2>Subtitle</h2>
                <p>. . . </p>
              </div>
            </div>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}

export default MainBody;
```

## With Hooks
Now let's rewrite this using Hooks. I personally prefer this way since it's easier to reason about and cleaner for the eye.
Hooks provide us with special functions. There are many but we will use two.

> ### useState()
> will allow us to use state in functional components.

> ### useContext()
> will allow us to consume context in functional component.

Our `Navbar.js` component will change like this.

```javascript
import React, { Component, useContext } from "react";
import ToggleTheme from "./ToggleTheme";
import { ThemeContext } from "../contexts/ThemeContext";

const Navbar = () => {
  const { lightTheme } = useContext(ThemeContext);
  const theme = !lightTheme ? " darkmode" : "";
  return (
    <div className={"navbar" + theme}>
      <h1>Navbar</h1>
      <ToggleTheme />
    </div>
  );
};

export default Navbar;
```

We import the `useContext` function on top and instead of wrapping our content in a `Consumer` we destructure the state. (In our case the lightTheme).
And that's it.

The same will apply for `MainBody.js`.

```javascript
import React, { Component, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

const MainBody = () => {
  const { lightTheme } = useContext(ThemeContext);
  const theme = !lightTheme ? " darkmode" : "";

  return (
    <div className={"" + theme}>
      <div className="main-body">
        <h1>MainBody</h1>
        <h2>Subtitle</h2>
        <p>. . .</p>
      </div>
    </div>
  );
};

export default MainBody;
```

Going forward in our `ToggleTheme` component we import `useContext` and `useState` as well.
With `useContext` we grab the toggleTheme function and with `useState` we set the state of our icon.
icon is the default and with `setIcon` we pass the new value.(takes place in the iconChange function).

```javascript
import React, { Component, useState, useContext } from "react";
import sun from "../assets/sun.svg";
import moon from "../assets/moon.svg";
import { ThemeContext } from "../contexts/ThemeContext";

const ToggleTheme = () => {
  const { toggleTheme } = useContext(ThemeContext);
  const [icon, setIcon] = useState(true);

  const iconChange = () => {
    let newIcon = !icon;
    setIcon(newIcon);
  };

  return (
    <div className="toggle__box">
      <span>
        {icon ? (
          <img src={moon} className="moon-icon" />
        ) : (
          <img src={sun} className="sun-icon" />
        )}
      </span>
      <div className="toggle__btn" onClick={toggleTheme}>
        <input type="checkbox" className="checkbox" onChange={iconChange} />
        <div className="circle"></div>
        <div className="layer"></div>
      </div>
    </div>
  );
};

export default ToggleTheme;
```

Note in our returned JSX we don't use the `this` keyword.

Lastly in our `ThemeContext`.

```javascript
import React, { Component, createContext, useState } from "react";

export const ThemeContext = createContext();

const ThemeContextProvider = (props) => {
  const [lightTheme, setLightTheme] = useState(true);

  const toggleTheme = () => {
    setLightTheme(!lightTheme);
  };
  const { children } = props;
  return (
    <ThemeContext.Provider value={{ lightTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
```

Again we set and change the state with `useState`. And again note that we don't use the `this` keyword.

That was it. Now you have the basic logic down. So get to work and try things of your own. That is the best way to learn.

The sooner you hit a wall the better. Trust me.
