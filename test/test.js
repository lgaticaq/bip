'use strict';

import path from 'path';

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
        .replyWithFile(200, path.join(__dirname, 'valid.json'));
    });

    it('should return a balance data (callback)', (done) => {
      lib(number, (err, data) => {
        expect(err).to.be.null;
        expect(data).to.be.a('object');
        expect(data.balance).to.be.a('number');
        expect(data.date).to.be.a('date');
        done();
      });
    });


    it('should return a balance data (promise)', (done) => {
      lib(number).then((data) => {
        expect(data).to.be.a('object');
        expect(data.balance).to.be.a('number');
        expect(data.date).to.be.a('date');
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
        .replyWithFile(200, path.join(__dirname, 'invalid.json'));
    });

    it('should return a empty data (callback)', (done) => {
      lib(number, (err, data) => {
        expect(err).to.eql(new Error('Not found'));
        expect(data).to.be.undefined;
        done();
      });
    });

    it('should return a empty data (promise)', (done) => {
      lib(number).then((data) => {
        expect(data).to.be.undefined;
        done();
      }).fail((err) => {
        expect(err).to.eql(new Error('Not found'));
        done();
      });
    });
  });
});
