'use strict'

const { describe, it, beforeEach } = require('mocha')
const { expect } = require('chai')
const path = require('path')
const nock = require('nock')

const lib = require('../src')

describe('bip', () => {
  describe('valid', () => {
    beforeEach(() => {
      nock.disableNetConnect()
      nock('http://pocae.tstgo.cl')
        .get('/PortalCAE-WAR-MODULE/')
        .reply(200, 'ok', {
          'set-cookie': [
            'JSESSIONID=517B19EEA6C1122EC934BDB624CFA413; Path=/PortalCAE-WAR-MODULE'
          ]
        })
      nock('http://pocae.tstgo.cl')
        .post('/PortalCAE-WAR-MODULE/SesionPortalServlet')
        .replyWithFile(200, path.join(__dirname, 'valid.html'))
    })

    it('should return a balance data', async () => {
      const data = await lib('11111111')
      expect(data.number).to.eql('11111111')
      expect(data.balance).to.eql(1180)
      expect(data.date).to.be.a('date')
      expect(data.message).to.eql('Tarjeta Valida')
      expect(data.valid).to.eql(true)
    })
  })

  describe('wrong status', () => {
    beforeEach(() => {
      nock.disableNetConnect()
      nock('http://pocae.tstgo.cl')
        .get('/PortalCAE-WAR-MODULE/')
        .reply(200, 'ok', {
          'set-cookie': [
            'JSESSIONID=517B19EEA6C1122EC934BDB624CFA413; Path=/PortalCAE-WAR-MODULE'
          ]
        })
      nock('http://pocae.tstgo.cl')
        .post('/PortalCAE-WAR-MODULE/SesionPortalServlet')
        .reply(200, '<table></table>')
    })

    it('should return an error', async () => {
      try {
        await lib('11111111')
      } catch (err) {
        expect(err.message).to.eql('Esta tarjeta no se puede cargar')
      }
    })
  })

  describe('wrong status code', () => {
    beforeEach(() => {
      nock.disableNetConnect()
      nock('http://pocae.tstgo.cl')
        .get('/PortalCAE-WAR-MODULE/')
        .reply(200, 'ok', {
          'set-cookie': [
            'JSESSIONID=517B19EEA6C1122EC934BDB624CFA413; Path=/PortalCAE-WAR-MODULE'
          ]
        })
      nock('http://pocae.tstgo.cl')
        .post('/PortalCAE-WAR-MODULE/SesionPortalServlet')
        .reply(301)
    })

    it('should return an error', async () => {
      try {
        await lib('11111111')
      } catch (err) {
        expect(err.message).to.eql('Request Failed. Status Code: 301')
      }
    })
  })

  describe('server error', () => {
    beforeEach(() => {
      nock.disableNetConnect()
      nock('http://pocae.tstgo.cl')
        .get('/PortalCAE-WAR-MODULE/')
        .reply(200, 'ok', {
          'set-cookie': [
            'JSESSIONID=517B19EEA6C1122EC934BDB624CFA413; Path=/PortalCAE-WAR-MODULE'
          ]
        })
      nock('http://pocae.tstgo.cl')
        .post('/PortalCAE-WAR-MODULE/SesionPortalServlet')
        .replyWithError('Server error')
    })

    it('should return an error', async () => {
      try {
        await lib('11111111')
      } catch (err) {
        expect(err.message).to.eql('Server error')
      }
    })
  })

  describe('wrong jssesionid', () => {
    beforeEach(() => {
      nock.disableNetConnect()
      nock('http://pocae.tstgo.cl')
        .get('/PortalCAE-WAR-MODULE/')
        .reply(200, 'ok')
    })

    it('should return an error', async () => {
      try {
        await lib('11111111')
      } catch (err) {
        expect(err.message).to.eql('Error al obtener el balance')
      }
    })
  })

  describe('wrong status code in jssesionid', () => {
    beforeEach(() => {
      nock.disableNetConnect()
      nock('http://pocae.tstgo.cl')
        .get('/PortalCAE-WAR-MODULE/')
        .reply(301)
    })

    it('should return an error in jssesionid', async () => {
      try {
        await lib('11111111')
      } catch (err) {
        expect(err.message).to.eql('Request Failed. Status Code: 301')
      }
    })
  })

  describe('server error', () => {
    beforeEach(() => {
      nock.disableNetConnect()
      nock('http://pocae.tstgo.cl')
        .get('/PortalCAE-WAR-MODULE/')
        .replyWithError('Server error')
    })

    it('should return an error', async () => {
      try {
        await lib('11111111')
      } catch (err) {
        expect(err.message).to.eql('Server error')
      }
    })
  })
})
