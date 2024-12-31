---
title: type safe useReducer for react context
author: alex christie
date: '2024-12-31T11:06:07-06:00'
type: 'garden'
tags: ['documentation', 'react', 'typescript', 'useReducer', 'useContext']
excerpt: creating a better typed `useReducer` for react context
draft: false
---

## overview

A common pattern I use a lot in React (as I'm sure many people do) is to spin up a `useReducer` and `useContext` to handle state management for a complex component, by which I mean a component that has more than 2-3 state values I need to keep track of. A lot of basic tutorials for creating a `reducer`, including that [React docs](https://react.dev/reference/react/useReducer#writing-the-reducer-function), tend to think about reducers as a series of `if` statements or a `switch` statement. Given an `action`, dispatch/perform a specfic `type` of action on state with an optional `payload` to update the state. Action `types` are usually defined by exporting `const` string values for the action, the logic being that you pass around a value rather than relying on a string that you might mistype. Once you have this set up, you usually pass the `dispatch` from `useReducer` into your `Context`, and you're off.

This works just fine. I have been using this general pattern for a long time, but I had a few general problems with the approach:

1. Any component accessing this `Context` had to import the actions. And while intellisense tends to take care of this pretty well, it just felt unnecessary
2. I tend not to write `switch` statements, and prefer to abstract my reducer to a function akin to the [`redux` docs](https://redux.js.org/usage/reducing-boilerplate#generating-reducers)
3. I would love to have better type completion for my actions, which the above doesn't really provide

With all of this in mind, I spent some time working on a function that would help me write type safe reducers that I could pass around with `Context`. [Here is a gist](https://gist.github.com/inadeqtfuturs/e11bdb3b98584fc5a7363c11c617cca6) that shows an example of a reducer that handles (1) a search value, (2) results coming back from the search, and (3) basic pagination.

## api

Let's look at the api:

``` typescript
const initialValue = {
  search: {
    value: '',
  },
  results: {
    loading: false,
    error: false,
    data: null,
  },
}

const [reducer, context] = createContextReducer(
  {
    SET_SEARCH: (state, { search: { value } }) => ({
      ...state,
      search: { value },
    }),
    SET_RESULTS: (state, { results }) => ({
      ..state,
      results: {
        ...state.results,
        ...results
      }
    })
  },
  initialValue
)

function Test() {
  const [, dispatch] = useReducer(reducer, initialValue)

  // enforce partial of `results`
  // ts error since `error` should be a boolean
  dispatch({ type: 'SET_RESULTS', payload: { results: { error: 'string' } } });
  // valid
  dispatch({ type: 'SET_RESULTS', payload: { results: { error: true } } });

  // should enforce `value` being a string
  dispatch({ type: 'SET_SEARCH', payload: { search: { value: 'test' } } });
  // ts error on `value` as `boolean`
  dispatch({ type: 'SET_SEARCH', payload: { search: { value: true } } });
}
```

This is an overly simplified example for the purpose of explaining how to think about what we're doing: We have an object with key/values that designate an `action` and the function we want to call. In general, the payload is an object, but it could also be any primitive. By default, without specifying types, `createContextReducer` will enforce the `payload` type if it is a parital of `initialValue`. Here, when you dispatch `SET_RESULTS`, you get autocomplete and type enforcement for the `results` object, with the exception of `data`. Because `data` defaults to `null`, we allow `data` to be of type `any`.

Two escape hatches to the above. First, you can define an alternative type OR specify the `payload` type in the `handler`s object:

``` typescript
// payload is not partial of `initialValue`. enforce based on specified type
SET_RESULTS_ERROR: (state, { error }: { error: string }) => ({
  ...state,
  results: {
    loading: false,
    data: null,
    error,
  },
})

// later...

// even though `initialValue` sets the default `error` to a `boolean`,
// we can set it as a string instead.
dispatch({ type: "SET_RESULTS_ERROR", payload: { error: 'error' } })
```

We can also define the type of `initialValue`:

``` typescript
type InitialValue = {
  search: {
    value?: string;
  };
  results: {
    loading: boolean;
    error: boolean;
    data: { id: number }[] | null;
  };
};

const initialValue: InitialValue = {
  search: {
    value: '',
  },
  results: {
    loading: false,
    error: false,
    data: null,
  },
};

// later...

// ts error since data is not an array of objects
dispatch({
  type: 'SET_RESULTS_DATA',
  payload: { results: { data: 'thing' } },
});

// error on `fake` but correctly eneforces `data`
dispatch({
  type: 'SET_RESULTS_DATA',
  payload: {
    results: { data: [{ id: 2 }, { id: 3 }], fake: true },
    fake: true,
  },
});
```

## why would i use this?

I see this pattern as having two major upshots: first, it reduces the amount of boilerplate you need to write including the amount of boilerplate you write just importing `actions` into different functions. The second, without having to actively define your types, you get easy type inference and enforcement, which you probably want when working on even a small team. The other benefit, at least for me, is that it allows me to think and write in a dictionary -- the `action`, `payload`, and what actually happens when you dispatch the `action` are all in one spot; it's easy to scan; everything is in one place.

One thing this isn't for is handling asynchronous events. In general, I abstract those outside of my reducers in favor of dispatching `actions` and `payloads` only once I've run anything asynchronously. If that's something you need, you still might be better off reaching for sagas or something similar.

