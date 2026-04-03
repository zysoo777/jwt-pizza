# Curiosity Report: Feature Flags

## Introduction

For my curiosity report, I chose to learn about **Feature Flags**.

I became interested in this topic because in this course we learned a lot about **testing, deployment, release strategies, monitoring, and reliability**. While learning those topics, I started wondering how software teams can safely release new features without immediately showing them to every user.

That question led me to Feature Flags. I wanted to understand how developers can put new code into production while still keeping a feature hidden until it is ready. This topic felt practical and useful because it connects clearly to both **QA and DevOps**.

## What Are Feature Flags?

A **Feature Flag** is a way to turn a feature **on or off** without changing the source code or doing a new deployment.

In simple words, it works like a switch inside the software.

A team can:

- build a new feature
- deploy the code
- keep the feature hidden
- turn it on later when ready

Feature Flags are also sometimes called:

- Feature Toggles
- Release Toggles
- Feature Switches

One of the most interesting things I learned is that Feature Flags help **separate deployment from release**. This means code can be deployed to production, but users do not have to see the new feature right away.

## Why Feature Flags Matter

Feature Flags are useful because they make software releases safer and easier to control.

Some of the biggest benefits are:

### Safer Releases
A team can deploy code without giving it to every user immediately.

### Faster Problem Solving
If a feature causes problems, it can often be turned off quickly without doing a full rollback or redeployment.

### Better Testing
A feature can first be tested by a smaller group, such as developers, testers, or beta users.

### More Control
A team can decide exactly who sees a feature:
- only developers
- only testers
- only certain users
- only one region

### Less Risk
If a new feature has bugs, fewer users will be affected.
This makes Feature Flags useful not only for developers, but also for **quality assurance and release safety**.

## How Feature Flags Work

Feature Flags usually work with a simple condition in the code.

A small example looks like this:

```java
if (newCheckoutEnabled) {
    showNewCheckout();
} else {
    showOldCheckout();
}
```
In this example:

- if the flag is **true**, users see the new checkout
- if the flag is **false**, users still see the old checkout

This means developers can keep both versions in the application and control which one is active.
From what I learned, Feature Flags are often checked **at runtime**, which means teams can control behavior without rebuilding or redeploying the whole app.

Feature Flags can be managed in different ways, such as:

- config files
- environment variables
- databases
- feature flag platforms

## Real Example

Imagine our pizza app like **JWT Pizza**. A team creates a new feature called **"Quick Order"**. Without Feature Flags, once the new code is deployed, every user would see it right away.

But with a Feature Flag, the team can:

- deploy the code first
- keep the feature hidden
- turn it on only for a small group of users
- watch for bugs or errors
- then release it to everyone later

This is useful because it gives the team time to make sure the feature works before exposing it to all users.

## Connection to QA and DevOps

This topic connects really well to both **QA** and **DevOps**. From a **QA** point of view, Feature Flags help teams test features more safely. Instead of showing a new feature to everyone at once, teams can test it with fewer users and reduce the chance of causing a big problem. From a **DevOps** point of view, Feature Flags help teams release software with less risk. They make it easier to deploy code first and release it later in a more controlled way.

This connects well to things we studied in class like:

- testing
- deployment
- observability
- reliability
- release strategies

## Challenges

Even though Feature Flags are very useful, they also have some downsides. One challenge is that too many flags can make code harder to understand. Another problem is **technical debt**. If teams forget to remove old flags, the code can become messy and harder to maintain. Feature Flags also create more testing situations because a feature may need to be tested in both the **on** and **off** states. So while Feature Flags are powerful, they still need to be used carefully.

## What I Learned

This topic changed the way I think about software releases. Before researching Feature Flags, I mostly thought deployment meant that once code was pushed, the feature was simply live. Now I understand that deployment and release do not always have to happen at the same time. One of the biggest things I learned is that software quality is not only about writing tests. It is also about **how safely a team releases features**.

Feature Flags showed me that teams can:

- release more carefully
- lower the risk of bugs
- test in smarter ways
- solve problems faster

This helped me see QA and DevOps in a more practical way.

## Conclusion

Feature Flags are a simple but powerful idea in modern software development. They help teams release features more safely, control who sees new changes, reduce release risk, and respond to problems faster.
I chose this topic because it felt practical and closely connected to many of the things we studied in this course. After researching it, I can see why many real software teams use Feature Flags in their workflow. In the future, I would like to try using Feature Flags in one of my own projects.

## References

- [Harness: Feature Flags](https://www.harness.io/harness-devops-academy/feature-flags?utm_campaign=fme&utm_source=split_io&utm_medium=redirect&utm_content=individual)
- [LaunchDarkly: What Are Feature Flags?](https://launchdarkly.com/blog/what-are-feature-flags/)