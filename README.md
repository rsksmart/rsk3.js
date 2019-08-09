# rsk3.js - RSK Javascript API
## Installation
`npm install rsk3`

## Usage
`import Rsk3 from 'rsk3';

const rsk3 = new Rsk3('ws://localhost:4444');
console.log(web3);
> {
    net: ... ,
    wallet: ... ,
    utils: ...,
    ...
}`

## Commands
```
npm install # install all dependencies for npm run bootstrap
npm run lint # Examine formatting of source code using eslint
npm run test # runs all tests 
npm run clean # removes all the node_modules folders in all modules
```

## Testing
Testing is done using `jest`. The configuration file `jest.config.js` and `jesy.preprocessor.js` apply to tests in all packages. To run all tests, `npm run test` under root, or `cd` into each package and run `npm run test`.

## Babel

## Formatting
Code Formatting is done using `eslint`. `.eslintrc.json` under root configures formatting rules for the whole project, and `.eslintignore` file exclude files watched by eslint.
