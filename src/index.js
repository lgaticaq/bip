'use strict';

const moment = require('moment');
const rp = require('request-promise');

module.exports = number => {
  const options = {
    url: `http://www.metrosantiago.cl/contents/guia-viajero/includes/consultarTarjeta/${number}`,
    json: true
  };
  return rp(options).then(res => {
    if (res.length === 0) throw new Error('Not found');
    if (res[0].estado !== 0) throw new Error(res[0].mensaje);
    const balance = parseInt(res[1].saldo || 0, 10);
    const date = res[1].fecha ? moment(res[1].fecha, 'DD\/MM\/YYYY HH:mm').toDate() : null;
    return {
      number: number,
      balance: balance,
      date: date,
      message: res[0].mensaje,
      valid: res[1].salida
    };
  });
};
