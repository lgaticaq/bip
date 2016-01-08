'use strict';

import Q from 'q';
import moment from 'moment';
import rp from 'request-promise';

const getBalance = (number, cb) => {
  const deferred = Q.defer();
  const options = {
    url: `http://www.metrosantiago.cl/contents/guia-viajero/includes/consultarTarjeta/${number}`,
    json: true
  };
  rp(options).then((results) => {
    if (results.length === 0) deferred.reject(new Error('Not found'));
    const balance = parseInt(results[1].saldo || 0, 10);
    const date = results[1].fecha ? moment(results[1].fecha, 'DD\/MM\/YYYY HH:mm').toDate() : null;
    deferred.resolve({
      number: parseInt(number, 10),
      balance: balance,
      date: date,
      message: results[0].mensaje,
      valid: results[1].salida
    });
  }).catch((err) => deferred.reject(err));
  deferred.promise.nodeify(cb);
  return deferred.promise;
};

module.exports = getBalance;
