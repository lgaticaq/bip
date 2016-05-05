# bip

[![npm version](https://img.shields.io/npm/v/bip.svg?style=flat-square)](https://www.npmjs.com/package/bip)
[![npm downloads](https://img.shields.io/npm/dm/bip.svg?style=flat-square)](https://www.npmjs.com/package/bip)
[![Build Status](https://img.shields.io/travis/lgaticaq/bip.svg?style=flat-square)](https://travis-ci.org/lgaticaq/bip)
[![Coverage Status](https://img.shields.io/coveralls/lgaticaq/bip/master.svg?style=flat-square)](https://coveralls.io/github/lgaticaq/bip?branch=master)
[![dependency Status](https://img.shields.io/david/lgaticaq/bip.svg?style=flat-square)](https://david-dm.org/lgaticaq/bip#info=dependencies)
[![devDependency Status](https://img.shields.io/david/dev/lgaticaq/bip.svg?style=flat-square)](https://david-dm.org/lgaticaq/bip#info=devDependencies)
[![Join the chat at https://gitter.im/lgaticaq/bip](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg?style=flat-square)](https://gitter.im/lgaticaq/bip?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Get balance of bip card (Chile)

## Installation

```bash
npm i -S bip
```

## Use

[Try on Tonic](https://tonicdev.com/npm/bip)
```js
const bip = require('bip');

const number = 11111111;

bip(number)
  .then(console.log)
  .catch(console.error);

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
