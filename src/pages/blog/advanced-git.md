---
layout: "../../layouts/BlogPost.astro"
title: "Advanced Git. Rebase, Stash, Squash and more"
pubDate: "2020-11-23"
description: "Leverage the power of Git"
minutes: 6
---

When I first learned about Git I thought knowing a few basic commands was all I needed. I could see my Git status, I could add files to the staging phase, commit and push to GitHub. But as soon I started working with larger teams in bigger projects I realized the power and possibilities of Git. Here I'm going to show you some slightly more advance commands that will definitely come in handy.

If you want a refresher on the basics of Git you can read [this](https://www.johnraptis.dev/git-basic-commands/).

We are going to talk about:

- [Rebase](#rebase)
- [Stash](#stash)
- [Squash](#squash)
- [Amend](#amend)
- [Deleting multiple branches](#delete)
- [Git aliases](#aliases)

<h2 id="rebase">Rebase</h2>

When you are merging a branch to your `main` branch you are merging all the history of each branch as well. This has as a result not having a clean history so you can track when each change was made.

What rebase actually does is to put changes under another branch. Let's say we have a branch named `feature one`. In the meantime we have made changes in our `main` branch. If we rebase the `main` branch to our `feature one` we will essentially put the `main` branch with all it's changes underneath our `feature one` branch. A common case would look like this.

```
// main branch
git pull

// feature one branch
git rebase main
```

We might get some conflicts. We resolve them and proceed with `rebase —-continue` and add them to our staging phase.

For whatever reason we can `rebase --abort` and the whole rebase will be canceled.

When it's time to push to GitHub we might get some errors because our local history and GitHub's history is different.

In this case we force the push with the `-f` flag.

```
git push -f
```

Rebase has two modes. The standard mode which Git takes your current branches commits and apply them to the HEAD of the branch you are rebasing. The other one is the interactive mode.

The interactive mode gives us many more features and more control over our history.

<h2 id="squash">Squash</h2>

One feature the rebase interactive gives us is the ability to squash commits.

Many times we have many commits that don't have a very significant meaning and could be 1 instead of 4 or 5. This way we can have a cleaner history. That is what squash does for us.

With `rebase -i` we will be prompt to an editor with all of our commits. If we want a certain number of commits we add the HEAD with the number of commits we want after the tilde `~` character. Here we want 3.

```
git rebase -i HEAD~3
```

**Note:** Here the HEAD means our current branch. If we change branch the HEAD pointer will point to that branch. You can read your HEAD with `cat .git/HEAD ⇒ ref: refs/heads/<-current-branch-name->`.

```
pick 4ee53cf commit one
pick 2b43f12 commit two
pick 4266517 commit three
```

Pick is going to be your main commit. By replacing the pick word with squash you will now have commit two and three squashed into commit one.

```
pick 4ee53cf commit one
squash 2b43f12 commit two
squash 4266517 commit three
```

If you save and exit you will be prompt to yet another editor so you can change the name of the commit. Keep the one you want and delete the others.

```
# This is a combination of 3 commits.
# This is the 1st commit message:

commit one

# This is the commit message #2:

commit two

# This is the commit message #3:

commit three
```

Note that squash changes your history. If you have pushed changes to remote you shouldn't use it. Use squash before you push any changes to remote.

<h2 id="stash">Stash</h2>

Stash is handy when you are working on something and want to switch to something else in another file and want to temporary remove your unstaged changes. I personally don't want to abuse this command because it interferes with my organization. I use this only for small fixes that are a higher priority.

Let's say you have an HTML file with some content and you have nothing to commit. You are working in a clean tree.

```html
. . .

<p>I'm learning about git stash.</p>

. . .
```

You make some changes in your file.

```html
. . .

<p>I'm learning about git stash and many more awesome stuff.</p>

. . .
```

If you check the status you see that you have changes that are unstaged.

```html
git status Changes not staged for commit: modified: index.html
```

Now you want to make some changes in another file and push them to GitHub. But you don't want to push all the changes.

What you do? You can stash your changes and put them temporarily on the selve.

```html
git stash
```

Now we extracted our changes, temporarily removed them. If you check your status you'll see that you are now working in a clean tree

```html
git status On branch master nothing to commit, working tree clean
```

And your file looks like nothing happened in the first place.

```html
. . .

<p>I'm learning about git stash.</p>

. . .
```

You make your changes, commit them and push them to GitHub. Now to re-apply your stashed changes you do with `pop`.

```html
git stash pop
```

Now you are back where you left.

```html
. . .

<p>I'm learning about git stash and many more awesome stuff.</p>

. . .
```

One thing to keep in mind is that stash doesn't apply to untracked or ignored files. In order to do that you have to add `-u` to include untracked files or add `-a` to include both untracked and ignored files. Be careful with ignored files. If you are working in a project that uses `node_modules` you are going to stash them as well.

```html
git stash -u // untracked files git stash -a // untracked and ignored files
```

We can see a list of all our stashes with `git stash list`.

By default the stash takes the name `"WIP on <-branch-name->"`.

```
git stash list

"stash@{0}: WIP on <branch-name>"
"stash@{1}: WIP on <branch-name>"
"stash@{2}: WIP on <branch-name>"
```

You can pass a description to your stash so you won't get lost when working with multiple stashes.

To view the diffs from you current state you can check them with `git stash show` to see all the changes or `git stash show <-file-name->` to view the diffs of one file.

If you want the full diff add the `-p` option at the end.

<h2 id="amend">Amend</h2>

Git amend is a command that lets you rewrite history. One use case of amend might be changing the commit message of your last commit. With `git commit --amend` you are prompt to an interactive editor to change the name.

Another use case is if you made some changes in a file and you want them in the same commit. You make your changes and stage them. If the changes are trivial you can just do `git commit --amend` and leave the commit message as is. This will rewrite your commit with you staged changes. If the changes are many you might want to change the message as well.

<h2 id="delete">Delete Multiple Branches</h2>

I haven't found any straight forward way to delete multiple branches. We can do that by using _grep_. If you are working in large project with lots of pull requests you are likely to have a naming convention for your branches.

e. x. _fix/delete-bug or feature/sort-by-tags_

```
git branch | grep "<pattern>"
```

The pattern might be something like a conventions you have when creating the branch, like `fix/'.

```
git branch | grep "fix/"
```

This filters by pattern. So you can see before hand which branch will be deleted.

```
	fix/branch-1
  fix/branch-2
  fix/branch-3
  fix/branch-4
```

And to do the actual deleting

```
git branch | grep "fix/" | xargs git branch -D
```

<h2 id="aliases">Git Aliases</h2>

An alias in Git let's you refer to certain commands using a shorter syntax.

Instead of `git checkout` you could set an alias to refer to the same thing with `git ch`.

You can also create commands that you thing should exist on Git.

Creating and using aliases in pretty straight forward.

```
git config --global alias.pushup 'push --set-upstream origin'

git push --set-upstream origin branch-one
// becomes
git pushup branch-one
```

If you do `git config -l` to list all your config options you will see all your aliases in there.

To delete an alias you add `--unset` before the alias name.

```
git config --global --unset alias.pushup 'push --set-upstream origin'
```

That's all. I really like learning about Git and understand in a deeper level. It's a very sophisticated tool that is essential for your work. In the course of your career you might jump around different languages. But Git will most certainly be there.
