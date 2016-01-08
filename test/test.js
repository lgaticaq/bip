'use strict';

import {expect} from 'chai';
import nock from 'nock';

import lib from '../lib';

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

    it('should return a balance data (callback)', (done) => {
      lib(number, (err, data) => {
        expect(err).to.be.null;
        expect(data).to.be.a('object');
        expect(data.number).to.eql(number);
        expect(data.balance).to.be.a('number');
        expect(data.date).to.be.a('date');
        expect(data.message).to.be.a('string');
        expect(data.valid).to.be.a('boolean');
        done();
      });
    });


    it('should return a balance data (promise)', (done) => {
      lib(number).then((data) => {
        expect(data).to.be.a('object');
        expect(data.number).to.eql(number);
        expect(data.balance).to.be.a('number');
        expect(data.date).to.be.a('date');
        expect(data.message).to.be.a('string');
        expect(data.valid).to.be.a('boolean');
        done();
      }).fail((err) => {
        expect(err).to.be.null;
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

    it('should return a empty data (callback)', (done) => {
      lib(number, (err, data) => {
        expect(err).to.be.null;
        expect(data).to.be.a('object');
        expect(data.number).to.eql(number);
        expect(data.balance).to.eql(0);
        expect(data.date).to.eql(null);
        expect(data.message).to.be.a('string');
        expect(data.valid).to.eql(false);
        done();
      });
    });

    it('should return a empty data (promise)', (done) => {
      lib(number).then((data) => {
        expect(data.number).to.eql(number);
        expect(data.balance).to.eql(0);
        expect(data.date).to.eql(null);
        expect(data.message).to.be.a('string');
        expect(data.valid).to.eql(false);
        done();
      }).fail((err) => {
        expect(err).to.be.null;
        done();
      });
    });
  });
});
