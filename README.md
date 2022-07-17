# A refreshing way of testing in the frontend

This project is an example of tests after I gave an earnest chance to use the [Better Specs](https://dev.to/noriller/testing-better-specs-2nig).

There were things I was not sure about, but after actually using it, I decided that I like it.

---

After you clone this project:

```bash
cd refreshing-way-test
yarn install --frozen-lockfile
yarn test
```

## Why three versions?

The first version is in a way I believe to be "cleaner", basically using nested `describe` blocks with `beforeEach` to set up the environment.

While the second version is more verbose, less DRY, but more explicit on each test since you know for each test directly what's going on.

The third one is probably the "common" one, where you put all expectations in one block. This is the one we use the most out there and also the one I felt I couldn't express myself or what the test is doing. It certainly is the fastest one to run, but it has so many expectations that you either say it tests just a slice of that, maybe using some generic phrasing or you would have to put a lot of "and".

But, regardless of which version you choose between the first two, focus on the `describe` and `it`/`test` blocks.

Remember the 3A's of testing?

1. Arrange
2. Act
3. Assert

By using `describe` blocks, you can finely separate the `arrangement`, the `act`, and, using `it`/`test`, the `assert` in your file.

The result of that is what you'll see in your tree of tests.

## Check the tree of tests

### Verbose

```bash
yarn test:verbose
```

---
As it runs, you should see the following tests (twice because of versions):

- ✓ src/app.version2.spec.jsx (27)
  - ✓ &lt;App&gt; (27)
    - ✓ on default render (27)
      - ✓ renders text of not submitted
      - ✓ renders input for title
      - ✓ renders input for body
      - ✓ renders a button (2)
        - ✓ with submit text
        - ✓ that is enabled
      - ✓ dont render the title error label
      - ✓ dont render the body error label
      - ✓ when you submit a form (20)
        - ✓ inputting both values (9)
          - ✓ the title input has the input value
          - ✓ the body input has the input value
          - ✓ when submitting (7)
            - ✓ disables the button
            - ✓ after api call complete (6)
              - ✓ reenables the button
              - ✓ renders the id
              - ✓ has called the API once
              - ✓ has called the API with
              - ✓ changes the text with the id
              - ✓ clears the form
        - ✓ without inputting values (3)
          - ✓ shows a title error
          - ✓ shows a body error
          - ✓ doesnt call the API
        - ✓ inputting only the title (4)
          - ✓ dont show a title error
          - ✓ shows a body error
          - ✓ doesnt call the API
          - ✓ dont clear the form
        - ✓ inputting only the body (4)
          - ✓ shows a title error
          - ✓ dont show a body error
          - ✓ doesnt call the API
          - ✓ dont clear the form

### JSON

```bash
yarn test:json
```

---
As it runs, you should have a JSON with a lot of properties, focus on `testResults`.

(you can also check out the `test.example.json` file)

It has two elements, they will be the same in this example as we have two versions of the test suite.

Inside `testResults` focus on `assertionResults`.

If you map that array extracting `fullname`, you would a list like this:

- &lt;App&gt; on default render renders text of not submitted
- &lt;App&gt; on default render renders input for title
- &lt;App&gt; on default render renders input for body
- &lt;App&gt; on default render renders a button with submit text
- &lt;App&gt; on default render renders a button that is enabled
- &lt;App&gt; on default render dont render the title error label
- &lt;App&gt; on default render dont render the body error label
- &lt;App&gt; on default render when you submit a form inputting both values the title input has the input value
- &lt;App&gt; on default render when you submit a form inputting both values the body input has the input value
- &lt;App&gt; on default render when you submit a form inputting both values when submitting disables the button
- &lt;App&gt; on default render when you submit a form inputting both values when submitting after api call complete reenables the button
- &lt;App&gt; on default render when you submit a form inputting both values when submitting after api call complete renders the id
- &lt;App&gt; on default render when you submit a form inputting both values when submitting after api call complete has called the API once
- &lt;App&gt; on default render when you submit a form inputting both values when submitting after api call complete has called the API with
- &lt;App&gt; on default render when you submit a form inputting both values when submitting after api call complete changes the text with the id
- &lt;App&gt; on default render when you submit a form inputting both values when submitting after api call complete clears the form
- &lt;App&gt; on default render when you submit a form without inputting values shows a title error
- &lt;App&gt; on default render when you submit a form without inputting values shows a body error
- &lt;App&gt; on default render when you submit a form without inputting values doesnt call the API
- &lt;App&gt; on default render when you submit a form inputting only the title dont show a title error
- &lt;App&gt; on default render when you submit a form inputting only the title shows a body error
- &lt;App&gt; on default render when you submit a form inputting only the title doesnt call the API
- &lt;App&gt; on default render when you submit a form inputting only the title dont clear the form
- &lt;App&gt; on default render when you submit a form inputting only the body shows a title error
- &lt;App&gt; on default render when you submit a form inputting only the body dont show a body error
- &lt;App&gt; on default render when you submit a form inputting only the body doesnt call the API
- &lt;App&gt; on default render when you submit a form inputting only the body dont clear the form

Which is not unlike what you would get in case of an error.

`FAIL  src/app.version2.spec.jsx > <App> > on default render > when you submit a form > inputting both values > when submitting > after api call complete > clears the form`

## Pros and cons

### Pros

Since you split the `arrange` and `act` into blocks, I feel it makes it easier to catch cases, because at each new nested block you can focus on the current block and see all the "what if's" that you can do.

More than that, it lets you think on a smaller step each time, I feel like I don't need to think about the entire behavior of a block, just on the individual one I'm on. This atomicity also helps with TDD.

This also makes it possible to use something like BDD to write specifications on the "user journey" for each part of the application.

### Cons

Verbosity is a given with this approach. I'm not even talking about the two different versions, but more about that you explode the `assertion` blocks that would normally live in one `test` block to multiple ones.

Another one would probably be performance. Something that you would do one time in one test, now is done over and over again in multiple.

## Vitest

I used this chance to try out `Vitest`.

Inside the test files, it's no different than `Jest`, so no problem there.

The setup was easy enough but I also didn't need to do any special configuration.

The running of the tests is fast!

And they also have a [VSCODE extension](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer) that makes it easy to run and debug them.
I use `Wallaby`, which is paid and totally worth it, but I'm really impressed and already recommending you to use their extension if your project is using `Vitest`.
