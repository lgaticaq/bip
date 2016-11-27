# bip

[![npm version](https://img.shields.io/npm/v/bip.svg?style=flat-square)](https://www.npmjs.com/package/bip)
[![npm downloads](https://img.shields.io/npm/dm/bip.svg?style=flat-square)](https://www.npmjs.com/package/bip)
[![Build Status](https://img.shields.io/travis/lgaticaq/bip.svg?style=flat-square)](https://travis-ci.org/lgaticaq/bip)
[![Coverage Status](https://img.shields.io/coveralls/lgaticaq/bip/master.svg?style=flat-square)](https://coveralls.io/github/lgaticaq/bip?branch=master)
[![Code Climate](https://img.shields.io/codeclimate/github/lgaticaq/bip.svg?style=flat-square)](https://codeclimate.com/github/lgaticaq/bip)
[![devDependency Status](https://img.shields.io/david/dev/lgaticaq/bip.svg?style=flat-square)](https://david-dm.org/lgaticaq/bip#info=devDependencies)

> Get balance of bip card (Chile)

## Installation

```bash
npm i -S bip
```

## Use

[Try on RunKit](https://runkit.com/npm/bip)
```js
const bip = require('bip');

const number = 11111111;

bip(number)
  .then(console.log)
  .catch(console.error);
```

Result:
```js
{
  number: XXXXX, // a number
  balance: XXXXX, // a number
  date: XXXXX, // a date
  message: XXXXX, // a string
  valid: XXXXX // a boolean
}
```

## Licencia

[MIT](https://tldrlegal.com/license/mit-license)
