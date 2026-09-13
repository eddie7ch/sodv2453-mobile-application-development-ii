# Notes on Project 3

Jeremy asked me to help the other squad finish documenting the volunteam app:
comments on the code, and a README that explains the project, how to set it up
and how to run it.

I started from the starter code for this task, so the only screens are Login
and EventsMap. The screens I built in earlier projects aren't here on purpose,
this PR is just about documentation.

## Code comments

Used the comments that were already in `api.ts` and `imageApi.ts` as a
reference and added JSDoc comments everywhere else:

- **Functions** (`utils`, `services`, the handlers inside the screens): what
  goes in, what comes back, and when it fails.
- **Components** (`BigButton`, `Spacer`): every prop, plus what the component
  can do.
- **Responsibilities** (`Login`, `EventsMap`, `AppStack`,
  `AuthenticationContext`, `App`): what each one is in charge of.
- **Types and constants** (`User`, `MapSettings`, the sample events): what each
  field or value means.

I tried to write them so someone who isn't a developer can still follow them,
for example "a JWT" also says "login token".

## README

The old README only covered starting the fake API and the image key. The new
one has what the app is and what's in scope, the folder layout, setup step by
step, how to run it, how to log in, and fixes for the problems I actually hit.

## SDK upgrade

Expo Go no longer runs SDK 47, so the project is on Expo SDK 57 like the
earlier ones. Code changes this needed: removed the `translucent` prop from
`StatusBar` (App.tsx and Login.tsx), `absoluteFillObject` became
`absoluteFill` in EventsMap, and `baseURL` points at my computer's IP.
`tsc --noEmit` is clean. Comments don't change behaviour, but I still followed
the README on my phone and logged in as Ulla to make sure the steps work.

## What I learned

Comments that describe inputs and outputs are most useful for the weird
cases. "Returns the saved value" is obvious; "rejects if nothing is saved"
is what saves someone an hour.

Following your own README is the best test. Things that felt obvious to me,
like the test password or that you have to log out before testing login
again, are exactly where a new person gets stuck.

Documentation also has to be honest about the current state. The starter
still has the email bug from Project 2, so the README says so instead of
letting someone think their setup is broken.
