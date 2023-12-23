---
layout: "../../layouts/BlogPost.astro"
title: "Thoughts on Legacy Code and How to Live With it"
pubDate: "2021-12-02"
description: "You will never get rid of legacy code, you can only learn how to deal and live with it"
minutes: 9
---

Let's start with one statement before we even define what legacy code is.

> You will never get rid of legacy code, you can only learn how to deal and live with it.

So what is legacy code anyway? You might fall into the trap of thinking that is just old code. This kind of answer is over-simplistic and doesn't reflect reality. Legacy code, yes, can be old, but old code is not necessarily considered legacy just because it is old. With this approach, your own very code you wrote yesterday, is legacy by now. So what is happening?

There is a _why_ we write code that might end up as legacy. There is also the _how_ and _what_. That we shall discuss later.

Legacy code has all or at least one of the following characteristics. It is a black box, difficult or impossible to extend and there is no documentation on how it works. And the scary thing is that we are writing it as we speak if don't consider all the above.

The "_why"_ we write code that most likely ends up as legacy is outside of the actual coding and implementation aspect of things. It has to do more with the business side of things. If you are an indie maker or a small startup you are more likely to build fast and revisit later. In today's day and age if you haven't taken this route you most likely don't have a business. You don't even know if you are going to be live till next week and every resource you have you drop it toward what is going to have the maximum return and value for your company. Eventually, you will have a hint that your business is viable, where you should start considering the effects it will have for your business in the future. Everyone is talking about a rewrite of the entire codebase, which never happens and there are good reasons for this as well.
If a company, from a startup, becomes a scale-up or even bigger, it usually has some dark place in the codebase from the early days. I have heard stories of entire repositories being deemed never to be seen by the team except for some lone genius.

All the above are why this happens. It is more of a business decision, derived from business needs that is causing this. It is a reality and it's almost certain it will stay that way. So acknowledging the problem is vital in order to move to practical ways of combating the problem. You can hack your way through when it comes to adding new features but inevitably everything will blow in your face, sooner or later.

Many companies never took off because they were too focused on the code to be perfect and there are companies that shipped crapy code that did really well but then they were crushed by their own weight due to not being able to make changes anymore.

It's ok to hack something fast to push the business forward but you need a way to get out of the ditch you are slowly digging for yourself. It is called technical debt for a reason. It means you are going to pay for in the future with your time, or someone else's time.

So having a pragmatic and effective approach is vital.

### Contents

- [Refactor vs Rewrite](#refactor-vs-rewrite)
- [Documentation](#documentation)
- [Extendibility](#extendibility)
- [Practical Implementation](#practical-implementation)
- [Testing](#testing)
- [Faceless Changes](#faceless-changes)


## Refactor vs Rewrite

As mentioned above the first thing you might think of is to start from a clean slate. This is not a good idea unless you have the recourses and a dedicated team to do so which is rare, or the codebase is extremely large and want to do some kind of rebrand and get rid of entire sections and features, which a rewrite might be the best decision to be made. In a [Maintainable podcast episode, Swizec Teller](https://maintainable.fm/episodes/swizec-teller-sr-engineer-mindset) talked about this and made a great point regarding a rewrite, amongst other great points.

> If you refactor the majority of a codebase where nothing from the original code exists, were you rewriting or refactoring?

I remember in my first job looking at codebases of various websites we were maintaining that used some old framework. I couldn't hold myself to ask in my naivety, _why aren't we rewriting all of this mess?_ Turns out that this would be a terrible idea. Besides the business cost in terms of hours, code — although old — works and has stood the test of time. It survived bug fixes and live quality assurance based on user feedback. Rewriting it will likely introduce new bugs and off we go again.

In [this post](https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/), Joel Spolsky makes a strong case against rewrites and takes a more pragmatic, real-life approach.

As developers we find the idea of a rewrite appealing because it is easier — at least that is what we think. The old code might look ugly but it is code that works. It's easier to judge code written before us and think we have a better solution often ignoring what business logic the old code serves and what edge case it was trying to solve. It is hard to read code and understand it so we have the impulse to avoid it.

> It's harder to read code than to write it. — Joel Spolsky

Although I generally agree with the premise that a rewrite is not often justifiable, in some cases, it might make sense. If a section in a project can't be expanded anymore or if doing so needs hacks and workarounds, some things are not being used anymore and it's isolated, starting from scratch can be the right thing to do.

## Documentation

The most evident solution when dealing with this is writing documentation. Documentation is one of those things that all developers agree upon but few do, at least in a practical and efficient way. Some keep everything in their head, hoping they remember it while others take the _let's write a novel_ approach. They write an endless amount of it which makes it incredibly hard to update, resulting in a disorganized, outdated mess. This is not helpful since you are making an extra effort to cut through the noise and find not only what you need, but if you need it at all in the first place.

> "I didn't have time to write a short letter, so I wrote a long one instead" - Mark Twain

It's is far easier to write lots of mindless documentation just for the sake of writing it than to be brief, concise and, make sense. Bullet points are better than paragraphs and short explanatory sentences are better than long-winded explanations. It is pretty much an art in and of itself.

Having a link at a prominent place in the source code linking to a doc describing all the technical decisions that took place, can be helpful for your future self and co-workers. Explaining _how_ and _why_ you chose a particular solution or approach and pointing out quirks and possible edge cases will make a world of difference next time you visit the code and decide to make improvements.

Learn how to write [good technical documentation](https://medium.com/@VincentOliveira/how-to-write-good-software-technical-documentation-41880a0e7814) which is short, easy to skim, easy to update, and in the place where it's needed. Easier said than done, right?

## Extendibility

A piece of code might work but it is really dead if you can't extend it. Sure it can work as expected and still generate revenue for the company but one-day shit will hit the fan. You can minimize the problem by keeping things isolated so it doesn't affect the rest of the code though this can't be a permanent solution.

You really don't want to end up in a situation wherein order to add a new feature, you have to make changes and preserve code that is based on old practices or technologies you no longer support just to fill a business need.

Usually, when you write new stuff they will depend on some legacy system, depending on the size. The larger the size of the codebase, the more challenging it will be to fix if systems are not isolated from each other. That is why having code that is tightly coupled is considered a bad idea. The more the coupling, the more the complexity.

Swyx has a great read on how we should [optimize for change](https://dev.to/swyx/how-to-optimize-for-change-a2n) and gave great insights on how we should design our abstractions and anything we code with that in mind. And the reason for this is to solve the _requirements volatility problem_, where changes in the specs of our product happen all the time whether we like it or not. We don't prepare ourselves for this kind of scenario so when a requirement changes it finds us unprepared so we write a "temporary" implementation. This usually doesn't happen just once, so all the previous hacks pile up and cause our codebase to mummify. Once all this sloppiness established itself it becomes increasingly hard to get rid of.

> Hard-to-delete code drives out easy-to-delete code over time

So optimizing your code for change and making it easier to delete, ironically makes it easier to extend in time and you will not produce legacy code _today_.

## Practical Implementation

In general, the code you write today is old code by tomorrow. So much of it has to do with _how_ we write code and with _what_ intention. Is your intention to be seen as clever or is it to help all the future developers that will come probably long after you are gone. Since we don't know what is going to be built, it is sane to make it easy to change code in the future. This has some ethical aspect to it from the developer's side to leave the codebase in a bit better condition than it was found.

I love the phrase by Swizec Teller again from the Maintainable podcast episode.

> It's easier to fix code that is repeated than code that is abstracted in the wrong way

It is far better to detour from so-called best practices and make it easier for another person to come and change stuff than have complex logic that is difficult to decipher and which will certainly break things if you try to refactor it.

The goal here is to slowly make incremental changes on legacy systems. When that option stops, that is where code starts being legacy. Code that changes is the only constant.

## Testing

An obvious but often overlooked way is to write tests which too can be done incrementally. Each time you visit a certain section — depending on the case — you can add unit tests. Or you can start testing more generic things like if a user is logged in. Having code that is really tightly coupled together might lead you to start testing the outer layers of a section, and gradually achieving full coverage. Then you can start moving stuff around more easily. The only downside in this approach is that often legacy codebase's don't even have tests or test infrastructure implemented which you have to do extra work for that. But regardless of the initial hustle, it will prove itself to be a valuable tool down the line.

## Faceless Changes

Ok, this might seem odd. But the true test that you don't have and don't generate legacy code today - at least as much - is if anyone in your team can go and make changes throughout the codebase. And the newcomers have a way of discovering how to work with it without the need to ask around for clarification. This doesn't mean you don't have places in the codebase where things aren't messy, but at least there is a way to navigate through. When your codebase doesn't depend on one single person, that is a healthy sign.

You want to make yourself unnecessary and detach your ego from the code. Within teams that is also a sign of seniority. To be able to tackle the issue of dealing and working with legacy systems.

### Conclusion

Nothing of the aforementioned can happen overnight. Incrementally is the keyword here.

To summarize, we learned what legacy code is. It is code that we are not able to extend. We can co-exist with legacy code and start improving it with _just as much_ documentation that is easy to update and always be in a semi-rewrite(aka refactor) mode.

As engineers, we solve problems that happen to be soluble by code. Code is just a tool so it doesn't make sense to get too attached to it. Eventually, any code you have written will slowly fade away, so go on and find the next interesting problem to solve.
