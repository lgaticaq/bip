'use strict';

const http = require('http');

module.exports = number => {
  return new Promise((resolve, reject) => {
    const url = `http://www.metrosantiago.cl/contents/guia-viajero/includes/consultarTarjeta/${number}`;
    http.get(url, res => {
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`Request Failed. Status Code: ${res.statusCode}`));
      } else {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', chunk => rawData += chunk);
        res.on('end', () => {
          try {
            const data = JSON.parse(rawData);
            if (data.length === 0) reject(Error('Not found'));
            if (data[0].estado !== 0) reject(Error(data[0].mensaje));
            const balance = parseInt(data[1].saldo || 0, 10);
            let date = null;
            if (data[1].fecha) {
              const iso = data[1].fecha.replace(
                /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/, '$3-$2-$1T$4:$5:00-03:00');
              date = new Date(iso);
            }
            resolve({
              number: number,
              balance: balance,
              date: date,
              message: data[0].mensaje,
              valid: data[1].salida
            });
          } catch (err) {
            reject(err);
          }
        });
      }
    }).on('error', err => reject(err));
  });
};
