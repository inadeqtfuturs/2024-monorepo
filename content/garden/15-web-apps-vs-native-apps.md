---
title: web apps vs. native apps
author: alex christie
date: '2025-01-02T11:06:07-06:00'
type: 'garden'
tags: ['apps', 'react', 'react native', 'developer experience', 'user experience']
excerpt: writing web apps and native apps in 2025, and going all in on the web
draft: false
---

for my day job, i work on both react and react native project. i like working on both broadly speaking, and i've actively developed with react native for something like the last 6 years or so. but when i started to scaffold a new project for myself, a major component of which was going to be a user facing app[^1], i started to wonder why, given greenfield, i'd spin up a new react native project or, more radically, write a native app.

## reports from the field (maintanence)

one business offering i've been a part of both during my time working at an agency and for various companies more generally is the "white label" app. some company gives us some money, and we spin them up what appears to be a bespoke version of an ios and android app. what we know is that it's probably 99.9% some default react native project with a few knobs turned here and there -- change this color; tweak this asset; they're using xyz instead of abc for auth, so factor that in. one thing that happens pretty quickly is that the deployment process scales linearly with each new white label app you become responsible for. if you have reasonable ci/cd processes in place, this is probably fine, but there's a huge amount of friction involved in both setting these up with and for your clients (who gets access?; who has keys?; do you have a staging environment?; what's getting shipped to that?) as well as maintaining those pipelines.

nothing demonstrates the problem of this overhead like hotfixes. once the release goes out, it's easy to hotfix an issue. what's not easy, and what actively lengthens the feedback loop between user experience and our (developers) ability to fix or imporve it, is managing the actual deployment of apps through google and apple's storefronts. a fix that takes us 5-10 minutes to debug and verify locally can take 12-24 hours to actually get out to users. add to this verifying that the fix gets out to all your apps, and you realize this idea that you've centralized your code and you're making it easy to deploy things starts to seem suspect.[^2]

## reports from the field (value prop)

so what is the value prop, for the business, user, and developer for continuing to use native apps? browsers have a push notification api now. many major apps are moving over to providing a web based platform (see, among others, slack, figma, discord) in addition to or instead of a native app. what are we trying to build that compels us down this native road?

perusing [mdn's list of web apis](https://developer.mozilla.org/en-US/docs/Web/API), i'm struck by how much we can do through a browser without recourse to native access to hardware. badging, media capture, geolocation, and push notifications are all things we kind of just have access to now as web developers. if nothing else, this that browser vendors understand the way the world is moving -- we access increasing amounts of information and interact online on phones and tablets. it makes sense that they'd want us to be able to use those devices to the fullest.

is there a time and a place for diversified offerings, though? is the mobile app meant to be actively different from web offering? in most cases, when i am working on an app that is user facing, and here i'm thinking about people using the app rather than the app being used at/by a business or people working with it at a business, i tend to think that what my user cares about is less *how* they access the app or interact with the content than that they *can*. what i mean is this: if i have a todo app, i do not care if it's native. i don't actively care about how i access it. what i do care about is that i can get to my todo list. this is absolutely an oversimplification, but i am prompting us to think about what we actually need to do that cannot be done with the browser.

someone is absolutely saying to themselves, "i work on x, and it *has* to be native". to them, i say, for sure. i get it and i hear you. what i wonder is if that need is the exception rather than the rule. i'm thinking just in terms of progressive enhancement or incremental adoption: what if we started with the most simple thing and the most simple implementation, which i'm implicitly arguing is browser/web based, and move from there rather than beginning with a native app? how would the development process and lifecycle look different, and what value would we be able to ship to the end user just using the web?

## web apps in 2025

if i'm starting from scratch in 2025, i'm investing heavily in the web -- web primitives, good html, good css. it's scalable, it's maintainable, and it's going to be around for a while. i started thinking about this just because i was scaffolding a monorepo and said to myself, "well, time to spin up the native stuff". i started to think about every gripe i've had working on a native app or a react native codebase or deploying stuff to either app store and just thought, "if i don't have to, why should i?"

i'll be really interested to see where i'm wrong about this, mostly for myself and my use case, but also more generally. but in the mean time, i've just cut about 25%-30% of the work i was condsidering doing with what appears to be very very little downside.

[^1]: it's here, already, that i question the distinction between a web app and a native app, or what we talk about when we talk about both or either.
[^2]: over the air updates are absolutely a thing, i'm not trying to minimize or obscure that. however, that's another piece to this already kind of complicated or at least multi-stepped puzzle that we're involved in.
