---
layout: "../../layouts/BlogPost.astro"
title: "React Folder Structure for Scalable Applications"
pubDate: "2023-12-26"
description: "Scale React applications to infinity"
minutes: 7
---

> Boring is good. You don’t want to have too much excitement because excitement usually means big bugs. — Linus Torvalds

If you’ve been working with React you should have seen by now a myriad of ways to structure an app.

If you are dealing with a small project this is virtually a non-problem but if you have a large one in your hands then the folder structure plays a detrimental role in keeping your sanity.

I've seen and worked with quite a few React codebases so I have a sense of common pitfalls and know how much it sucks to work with a messy codebase. I also admit this to be an opinionated approach, but from what I've seen so far it works pretty well in the real world.

Before writing any folders and files you have to think what your guiding principle is gonna be. Are you going to organize based on _general meaning_ or take a more _feature centric_ approach?

Meaning is when you have a folder and add everything that seems similar. For example, components is such a file. You can add components here to no end. All components fulfill the meaning of what is to be a “component”. Same with a utils folder. One way to combat the chaos would be to have subfolders with a page's name so you can have _some_ separation. Let’s say you have three pages: `Home`, `Post`, and `Contact`. You can place their “special” components like so:

```json
-- components
---- home
------ widget.js
------ hero.js
---- post
------ postInteractions.js
------ postFooter.js
---- contant
------ contactForm.js
```

The same goes with a `utils` folder as well. Let’s say you have two entities in your app: `User`, `Post`, and also have some generic string formatting utils. How would you go about doing this?

Be honest. Probably this.

```json
-- utils
---- userUtils.js
---- postUtils.js
---- stringFormatting.js
```

For small-scale applications, this might work with no problem, but for large ones, the _generic_ _meaning_ approach starts to crumble with each folder getting ever larger. That's why I think the _feature centric_ approach is better. Even for mid-size projects.

The general rule of the feature centric approach is that anything specific to a feature(which can be thought of as a section as well) goes within the feature folder and anything generic or global goes into the outer directories. The feature folder will end up resembling a minified version of our app which will give you an immediate sense of control.

```json
-- components // generic components
-- utils // generic utils
-- hooks // generic hooks
-- features
---- signUp
------ components // specific components
------ hooks // specific hooks
------ utils // specific utils
------ api // specific api wrappers around core services
---- userProfile
------ etc...
------ etc...
```

This has many benefits. Especially when you are adding, moving around, or removing features.

Each feature folder will be entirely responsible for fetching its data and upon deletion, all the dependencies of the feature will be gone with it. No leftovers. You will move features with greater confidence since it all comes down to one import, that brings an isolated part of your codebase into action.

You might say _ok, I got something you didn’t think about_. What if we have two similar features, like `signUp` and `signIn`? Should we pull components up a level or duplicate them?

In most cases, you should duplicate since most components would be generic(forms, same layout, etc.).

> Having duplication that is easy to reason is far preferable over an abstraction.

Or…

Having duplication that is easy to reason is far preferable over a mild abstraction that has a hidden potential to grow in complexity.

An alternative to the above could be to combine the two into a larger feature called `authentication`.

Recap rules:

- You can move a feature, altering only one import, to another page, and the feature works with no problems.
- If you delete the feature you aren't left with zombie code. No unused code in the codebase.

So let's dive into each possible folder we might need.

## Directories

There are some pretty standard folders so I'm not gonna be original here. Here are some that are self-explanatory.

```json
-- assets
-- constants
```

With `assets` and `constants`, one can rarely do wrong. They are not dynamic and grouping constants in files based on meaning makes sense(`authConfig.js`, `someStaticContent.js`, etc.).

### pages

---

Next, we will have a `pages` folder where we will define all the pages of our app. This can follow a similar approach NextJS takes. Have a subfolder with the name of your page containing a `page.js` and a `layout.js` file where the core template will be defined.

### layouts

---

This is tricky. Depending on the intricacies of your product you can choose to have a dedicated folder for your layouts and import them straight to your page’s `layout.js` file. Alternatively, this folder can go into the outer `components` folder of your app since it fulfills the global criteria of our ruleset.

### utils

---

This folder will have all the generic and global helper functions grouped under subfolders(or files) based on utility.

```json
-- utils
---- stringFormatting
------ makeUppercase.js
---- dates
------ hoursFromNow.js

// or //
-- utils
---- stringFormatting.js // includes makeUppercase helper
---- dates.js // includes hoursFromNow helper
```

### hooks

---

All global hooks like `useNotification()` and `useToaster()` which will be used throughout our app can be placed here.

### services

---

All the core APIs of our app like `getUsers()` and `upsertPost(id, data)`.

### components

---

This folder is interesting. I’ve seen this come in many flavors. Some prefer having component subfolders based on the app’s pages(shown earlier) or having components grouped based on component types, like a `forms` folder with all the forms used throughout the app, and doing the same with `buttons`, `tables`, etc.

Another way is to keep here what is indeed global and not tied to a specific view. You can have a folder with all the base elements(you can think of these as `atoms`) that will act as building blocks for larger components(you can think of these as `molecules`). Molecules are still global and generic but slightly bigger. For example, a radio or a checkbox are both atoms. A form that uses radios and checkboxes is a molecule. This is still generic. A header, text, and button are all atoms. A modal that uses a header, text, and button in a molecule. This is still generic. If you want to have more complex components that do a specific thing, then you move on to the next hot topic.

### features

---

This is the crux of the whole thing. Above we talked about atoms and molecules. The logical extension of those is to have organisms that are specialized in nature. They should be located within the only place they will ever be used. And that is within a feature. Having these in the outer `components` folder is not scalable at all.

As you can see below we embedded a components folder to place all of our organisms. The same goes for hooks and utils. We have all of our custom hooks and helpers that exist for the sole purpose of serving this particular feature. I also like the `api` folder here where we can create wrappers around core services. This is the epitome of pragmatic encapsulation if you ask me.

In theory, you could go crazy and add “everything” here but I don’t think it’s necessary. Non-logic code can live outside.

```json
-- features
---- userProfile
------ components
-------- EditProfileForm.js
-------- UserSettings.js
------ hooks
-------- useGetUserSettings.js
-------- useUserProfileActions.js
------ utils
-------- sortSettingFields.js
------ api
-------- fetchUserSettings.js
-------- updateUserProfile.js
```

## Miscellaneous

Not all apps need these. But they might.

### lib

---

All third-party integrations can be abstracted away and create wrappers around them to cater to your app’s idiosyncrasies. You can place here a specific Axios(or React-query, or Supabase, or day.js, or zxcvbn-ts, etc.) implementation that you are going to use all over the place. You can expose only what is needed and you can make changes to your implementation(use the fetch API instead of Axios) under the hood with little overhead(see [Facade pattern](https://www.dofactory.com/javascript/design-patterns/facade)).

### config

---

You can use this folder to set some configuration for a provider, env variables, or even a custom theme for your component library of choice.

### store

---

If you are using a state management tool to handle state. You can have a file `config.js` inside it with configuration and a `store.js` (or many sub-store files that you combine in an `index.js` if that’s your thing).

### lang

---

If you want to support more than one language you can have your content split into constants and read everything from there.

### context

---

All the Context APIs you'll be using.

<br />
Final result may look something like this:

```json
-- assets
-- constants
-- pages
---- home
------ page.js
------ layout.js
---- userProfle
------ page.js
------ layout.js
-- components // my include a 'layouts' folder
---- atoms
---- molecules
-- hooks
---- useNotification.js
---- useToaster.js
-- layouts // optional
---- ...
-- utils
---- ...
-- services
---- user
------ getUsers.js
------ upsertUser.js
---- post
------ getPosts.js
------ upsertPost.js
-- features
---- userProfile
------ components
-------- EditProfileForm.js
-------- UserSettings.js
------ hooks
-------- useGetUserSettings.js
-------- useUserProfileActions.js
------ utils
-------- sortSettingFields.js
------ api
-------- fetchUserSettings.js
-------- updateUserProfile.js
-------------------
-- context
-- config
-- lib
-- store
-- lang

```

Of course, all the above become exponentially harder if your current codebase has lots of legacy code and you write new features at the same time. It’s like trying to change wheels while driving a car, literally.

So what can you do?

Do it gradually, and then suddenly. And with a great deal of commitment. First, you would need to have clearly defined rules and a straightforward plan so that each time you implement a new feature it can be realized as intended.

Secondly, when making changes or improvements and the scope of the task allows it.

In both cases, you might have duplication, but you shouldn't worry much. You will find yourself with user helpers both in a global file somewhere and within a specific feature folder. If the team follows the plan as a guiding principle, then gradually, each time someone comes across an opportunity, will know exactly what to do. If the majority of the codebase complies with the newly set rules, then a refactor of legacy features may happen, suddenly, if you choose to since now the majority of the app follows established practices.

The project structure presented here can work as a starting point and then build on top of this to cater to your specific needs. Add, pick, and throw. Nothing is set in stone so stop acting like it is.
