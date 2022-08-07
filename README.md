# Getting started with the repo

* Clone the repo
* Check you node and npm versions `node>=v14.15.1 & npm>=6.14.8`

```bash
$ npm i
$ npm run dev
```

Project should run for now. Will provide figma link.

# Basic good to know `git` commands

```bash
$ git add {fileName} # git add specific file
$ git add . # git add all
$ git rm {fileName} # git unstange filename
$ git reset # git remove all staged
$ git commit -m "msg" # git commit message
$ git checkout -b {branchName} # git checkout new branch
$ git checkout {branchName} # git checkout a tragetted branch
$ git pull # git pull current branch
$ git pull origin {branchName} # git pull targetted branch
$ git push # git push current branch
$ git push origin {branchName} # git push targetted branch
$ git merge {sourceBranch} # git merge source branch with current branch
$ git merge {sourceBranch} {targetBranch} # git merge source branch with targetted branch
$ git log # shows the commit history of the branch
$ git status # shows the status of current branch (usually tells what to do next as well)
$ git stash list # shows the list of git stash
$ git stash pop # pop the last node on the git stash
$ git stash # stashes all the current changes to git stash
```

These are basic commands any software engineers/programmers should know and be good with. Advanced commands such as `rebase`, `rebase -i`, `reset --soft`, `reset --hard`, and `cherry-pick` are good to know as one grows.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) TS template.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Redux
[link](https://react-redux.js.org/introduction/getting-started)

## Prettier and eslint
[link](https://dev.to/knowankit/setup-eslint-and-prettier-in-react-app-357b)
#### minor changes
```js
module.exports = {
  root: true,
  parser: '@babel/eslint-parser', // optional
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:react-hooks/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
```

## Relative pathing
[link](https://create-react-app.dev/docs/importing-a-component/#absolute-imports)
