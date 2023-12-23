---
layout: "../../layouts/BlogPost.astro"
title: "Basic Git commands you should know"
pubDate: "2020-01-02"
description: "They will definitely come in handy"
minutes: 6
---

Git and Github play an essential role in every developers workflow. They give us a very sophisticated way to keep track of our projects history. Knowing how to use them give us the ability to work more efficiently.

The purpose of this article is more of a reminder or general overview and to have things grouped in one place, rather than a comprehensive guide. I think the official documentation does a very good job in that respect.

## Prerequisites

- Have Git installed in your system.

- Have a Github account and know the basics of creating a repository.

But first a quick reference.

## So what is Git?(Quickly)

Git is a system that tracks changes in our code. You will often hear it being referred as 'version control'. Why?
Because it keeps a history of all previous versions of our source code. This gives the ability to have multiple developers working in parallel and sharing code. In order to do that we would have a local Git repository which lives locally in our computer, and a remote Git repository which lives in a server(Github, GitLab, etc..).

### git config
In order to work locally we will have to set our username and email.
This information will be used when we are doing commits to remote repositories, and should match you Github profile credentials.

We can do this globally.

```
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```

. . . or in a single repository.

```
git config user.name "John Doe"
git config user.email johndoe@example.com
```

To check your information you can either do

```
git config user.name
> Joe Doe
```

```
git config user.email
> johndoe@example.com
```

or

```
git config --list
```

which returns them as part of a list

```
. . .
. . .
. . .
user.name=John Doe
user.email=johndoe@example.com
```

### git init
Initialize or reinitialize and existing repository with a `.git` folder that tracks our project locally.

### git add . / git add
When we make a change we want to commit it to our local repository. But before we do that the code has to be added to the staging area. The staging area keeps track of the files that are about to be committed.

To have a better understanding of git you should have the following mental frame in mind.
Git has three states. The first is if a file is modified, which means any change you might have done. The second is if a file is staged, which means if you prepared the file to be committed. And lastly if a file is committed, which means that our changes have been stored to our local repository, ready to be pushed.

To add a single file to the staging area you type...

```
git add [name-of-file]
//ex  git add index.html
```

or with the `.` you add all the files that has been changed.

```
git add .
```

### git commit -m "message"

Now that we added our code to the staging area, we are ready to commit the file. We also give a descriptive name like "form added" or "updated version". etc. . .

### git status

With `git status` we can see in which phase our files currently are. Which files are modified, which ones are in our staging area or being committed and in which branch we currently are.

### git log

With log we see all the commits from the very beginning up until now. It also shows the name of who authored the commit and the date.

## Branches

We can create other branches as well to work on other versions or parts of our project. By default we commit all our code to the main branch which is called `master`. We can merge branches together if needed.( this will be covered later)

To create another branch.

```
git branch [name_of_branch]

git branch new_branch
```

To switch branches.

```
git checkout [name_of_branch]

git checkout new_branch
```

To create a new branch and switch into the new branch with one command.

```
git checkout -b [name_of_branch]

git checkout -b new_branch
```

To delete a branch.

```
git branch -D [name_of_branch]

git branch -D new_branch
```

...and to see a list of all your branches

```
 git show-branch
```

### git merge

Lets say you made some changes in your new branch and want to merge it to the master branch. Head to the master branch and run the merge command with the name of the branch you want to take the code from.

```
git merge [new_branch]

// in master branch
git merge new_branch
```

### git push

After you commit your code to your local Git repository you will want to push your code to a remote Git repository so other people can view and pull your code. With `git push` we will have to specify the `origin` and which branch we want to push.

`origin` is the url of our remote Git repository. It's something like this.

```
// remote url https://github.com/[username]/[repository-name].git

git push origin master
```

### git pull
Now lets say we are working alongside other developers. Everyone is working on different stuff and we want to get the latest version of our source code, so everyone can be in the same page. In this case we have to pull the code from the remote Git repository, everyone is pushing to(in our case Github), to our local Git repository.

### git clone

With git clone you copy a remote repository locally in your machine.

```
git clone https://github.com/[username]/[repository-name].git
```

### git remote set-url /git remote add  
Now in some cases you might want to change the URL of an existing repository, or add a new URL so we can push our code to a second repository as well.

To add a remote URL

```
git remote add origin https://github.com/[username]/[repository-name].git
```

**Note:** The name origin is a convention. It could be anything, like banana.

To replace an existing URL

```
git remote set-url origin https://github.com/[username]/[repository-name].git
```

To see a list of our repository remote URL's

```
git remote -v

origin  https://github.com/[username]/[repository-name].git (fetch)
origin  https://github.com/[username]/[repository-name].git (push)
```

If you want to add a second remote URL you still do git remote add but with a different name, other that origin.

```
git remote add banana https://github.com/[username]/[repository-name].git
```

Our list again

```
git remote -v

origin https://github.com/[username]/[repository-name].git (fetch)
origin https://github.com/[username]/[repository-name].git (push)
banana https://github.com/[username]/[repository-name].git (fetch)
banana https://github.com/[username]/[repository-name].git (push)
```

### git diff
Show's us the difference between our commits and our working tree. What is in the staging area, waiting to be committed. You can also see difference between branches and such if you dig deeper.

### git reset
Goes back in time to a specific version of our code. Since we are dealing with different states we will use different flags in each case.

Let's say you made some changes and committed them. Now you want to return to the previous version that was committed. Since each commit comes with a unique number you can do.

```
git reset --soft 9e5e6a4
```

By adding the `--soft` flag we will go back to those commits but our staging area and working directory will stay as is. If we do a `git commit` we will commit our current changes from the staging area.

```
git reset --mixed 9e5e6a4
```

If we do the same but we use the `--mixed` flag instead, we will go back again up until the staging area of that commit.

If we do `git commit` nothing will happen since the staging area matches the what is ready to be committed.

```
git reset --hard 9e5e6a4
```

And by adding the `--hard` flag the same will apply but the changes will go back to the working directory, like nothing was added or committed.

> To learn more about **reset** you can check [this](https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified).

## using ssh

If you don't want to be prompt to type your username and password each time you make a push you can provide an ssh key to your Github settings so Github can identify you.

To generate a new SSH key type

```
ssh-keygen
```

This will generate a public and a private file named `id_rsa.pub` and `id_rsa` respectively. It will ask you where to save the files. By default it saves them in the users folder with a folder name `.ssh`.
Head to your Github profile settings and look in the sidebar for **SSH and GPG keys** section.
Press **New SSH key**. In here you name and paste your public SSH key.

When creating a new repository you will have the option to set the URL of your repository as `HTTPS` or `SSH`.
Choose `SSH` so the whole process can work.

If you want to change the URL from an existing repository first created with `HTTPS`, you can do the following.

As we saw before

The `git remote -v` will list your repos path.

```
git remote -v

origin https://github.com/[username]/[repository-name].git (fetch)
origin https://github.com/[username]/[repository-name].git (push)
```

With `git remote set-url`.

```
git remote set-url origin git@github.com:USERNAME/REPOSITORY.gi
```

Check again.

```
git remote -v

origin git@github.com:[username]/[repository-name].git (fetch)
origin git@github.com:[username]/[repository-name].git (push)
```

Now each time you make a push Github knows who you are.
