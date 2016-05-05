'use strict';

const {expect} = require('chai');
const nock = require('nock');

const lib = require('../src');

describe('bip', () => {


  describe('valid', () => {

    const number = 11111111;

    beforeEach(() => {
      nock.disableNetConnect();
      nock('http://www.metrosantiago.cl')
        .get(`/contents/guia-viajero/includes/consultarTarjeta/${number}`)
        .reply(200, [
          {
            'estado': 0,
            'mensaje': 'Tarjeta Valida'
          },
          {
            'salida': true,
            'tarjeta': '11111111',
            'saldo': '1180',
            'fecha': '02\/01\/2016 20:59'
          }
        ]);
    });

    it('should return a balance data', done => {
      lib(number).then(data => {
        expect(data.number).to.eql(number);
        expect(data.balance).to.eql(1180);
        expect(data.date).to.eql(new Date('2016-01-02T23:59:00.000Z'));
        expect(data.message).to.eql('Tarjeta Valida');
        expect(data.valid).to.be.true;
        done();
      }).catch(err => {
        expect(err).to.be.undefined;
        done();
      });
    });
  });

  describe('invalid', () => {

    const number = 11111111;

    beforeEach(() => {
      nock.disableNetConnect();
      nock('http://www.metrosantiago.cl')
        .get(`/contents/guia-viajero/includes/consultarTarjeta/${number}`)
        .reply(200, [
          {
            'estado': 1,
            'mensaje': 'Esta tarjeta no se puede cargar'
          },
          {
            'salida': false,
            'tarjeta': '11111111'
          }
        ]);
    });

    it('should return a empty data', done => {
      lib(number).catch((err) => {
        expect(err.message).to.eql('Esta tarjeta no se puede cargar');
        done();
      });
    });
  });
});
