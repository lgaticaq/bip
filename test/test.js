'use strict';

const expect = require('chai').expect;
const nock = require('nock');

const lib = require('../src');

describe('bip', () => {
  describe('valid', () => {
    beforeEach(() => {
      nock.disableNetConnect();
      nock('http://www.metrosantiago.cl')
        .get('/contents/guia-viajero/includes/consultarTarjeta/11111111')
        .reply(200, [
          {'estado': 0, 'mensaje': 'Tarjeta Valida'},
          {
            'salida': true,
            'tarjeta': '11111111',
            'saldo': '1180',
            'fecha': '02\/01\/2016 20:59'
          }
        ]);
    });

    it('should return a balance data', done => {
      lib('11111111').then(data => {
        expect(data.number).to.eql('11111111');
        expect(data.balance).to.eql(1180);
        expect(data.date).to.be.a('date');
        expect(data.message).to.eql('Tarjeta Valida');
        expect(data.valid).to.be.true;
        done();
      });
    });
  });

  describe('wrong status', () => {
    beforeEach(() => {
      nock.disableNetConnect();
      nock('http://www.metrosantiago.cl')
        .get('/contents/guia-viajero/includes/consultarTarjeta/11111111')
        .reply(200, [
          {'estado': 1, 'mensaje': 'Esta tarjeta no se puede cargar'},
          {'salida': false, 'tarjeta': '11111111'}
        ]);
    });

    it('should return an error', done => {
      lib('11111111').catch((err) => {
        expect(err.message).to.eql('Esta tarjeta no se puede cargar');
        done();
      });
    });
  });

  describe('wrong status code', () => {
    beforeEach(() => {
      nock.disableNetConnect();
      nock('http://www.metrosantiago.cl')
        .get('/contents/guia-viajero/includes/consultarTarjeta/11111111')
        .reply(301);
    });

    it('should return an error', done => {
      lib('11111111').catch(err => {
        expect(err.message).to.eql('Request Failed. Status Code: 301');
        done();
      });
    });
  });

  describe('wrong data', () => {
    beforeEach(() => {
      nock.disableNetConnect();
      nock('http://www.metrosantiago.cl')
        .get('/contents/guia-viajero/includes/consultarTarjeta/11111111')
        .reply(200, []);
    });

    it('should return an error', done => {
      lib('11111111').catch(err => {
        expect(err.message).to.eql('Not found');
        done();
      });
    });
  });

  describe('server error', () => {
    beforeEach(() => {
      nock.disableNetConnect();
      nock('http://www.metrosantiago.cl')
        .get('/contents/guia-viajero/includes/consultarTarjeta/11111111')
        .replyWithError('Server error');
    });

    it('should return an error', done => {
      lib('11111111').catch(err => {
        expect(err.message).to.eql('Server error');
        done();
      });
    });
  });
});
