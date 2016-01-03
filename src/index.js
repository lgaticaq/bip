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
    const data = results[1];
    if (!data.salida) deferred.reject(new Error('Not found'));
    deferred.resolve({
      balance: parseInt(data.saldo, 10),
      date: moment(data.fecha, 'DD\/MM\/YYYY HH:mm').toDate()
    });
  }).catch((err) => deferred.reject(err));
  deferred.promise.nodeify(cb);
  return deferred.promise;
};

module.exports = getBalance;
