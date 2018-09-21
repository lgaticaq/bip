'use strict'

const http = require('http')
const querystring = require('querystring')
const cheerio = require('cheerio')

/**
 * The built http.Agent object.
 * @external "http.Agent"
 * @see https://nodejs.org/api/http.html#http_class_http_agent
 */

/**
 * Get JSESSIONID from response headers
 * @param external:"http.Agent" agent
 * @returns {Promise<String>} JSESSIONID
 */
const getSessionId = agent => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'pocae.tstgo.cl',
      port: 80,
      path: '/PortalCAE-WAR-MODULE/',
      method: 'GET',
      agent
    }
    const req = http.request(options, res => {
      const { statusCode } = res
      let err
      if (statusCode !== 200) {
        err = new Error(`Request Failed. Status Code: ${statusCode}`)
      }
      if (err) {
        res.resume()
        return reject(err)
      }
      res.resume()
      try {
        resolve(res.headers['set-cookie'][0].split('; ')[0].split('=')[1])
      } catch (err) {
        reject(new Error('Error al obtener el balance'))
      }
    })
    req.on('error', err => reject(err))
    req.end()
  })
}

/**
 * The built http.Agent object.
 * @external "http.Agent"
 * @see https://nodejs.org/api/http.html#http_class_http_agent
 */

/**
 * Get balance of bip card
 * @param external:"http.Agent" agent
 * @param {String|Number} number Bip number card
 * @param {String} sessionId JSESSIONID
 * @returns {Promise<Object>} Object with number, message, balance and date
 */
const getBalance = (agent, number, sessionId) => {
  return new Promise((resolve, reject) => {
    const data = querystring.stringify({
      accion: 6,
      NumDistribuidor: 99,
      NomUsuario: 'usuInternet',
      NomHost: 'AFT',
      NomDominio: 'aft.cl',
      Trx: '',
      RutUsuario: 0,
      NumTarjeta: number,
      bloqueable: ''
    })
    const options = {
      hostname: 'pocae.tstgo.cl',
      port: 80,
      path: '/PortalCAE-WAR-MODULE/SesionPortalServlet',
      method: 'POST',
      headers: {
        Connection: 'keep-alive',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
        Origin: 'http://pocae.tstgo.cl',
        'Upgrade-Insecure-Requests': '1',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3381.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        Referer: 'http://pocae.tstgo.cl/PortalCAE-WAR-MODULE/',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'es-419,es;q=0.9',
        Cookie: `JSESSIONID=${sessionId}`
      },
      agent
    }
    const req = http.request(options, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`Request Failed. Status Code: ${res.statusCode}`))
      } else {
        const rawData = []
        res.on('data', chunk => rawData.push(chunk))
        res.on('end', () => {
          try {
            const data = Buffer.concat(rawData).toString()
            const $ = cheerio.load(data)
            let [number, message, balance, date] = $('table')
              .find('td[bgcolor="#B9D2EC"]')
              .map((index, element) => $(element).text())
              .get()
            if (balance === '---' || typeof balance === 'undefined') {
              reject(new Error('Esta tarjeta no se puede cargar'))
            }
            let valid = false
            if (message === 'Contrato Activo') {
              message = 'Tarjeta Valida'
              valid = true
            }
            resolve({
              number,
              message,
              valid,
              balance: parseInt(balance.replace(/[$.]/g, ''), 10),
              date: new Date(
                date.replace(
                  /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/,
                  '$3-$2-$1T$4:$5:00-03:00'
                )
              )
            })
          } catch (err) {
            reject(err)
          }
        })
      }
    })
    req.on('error', err => reject(err))
    req.write(data)
    req.end()
  })
}

/**
 * Get balance of bip card
 * @param {String|Number} number Bip number card
 * @returns {Promise<Object>} Object with number, message, balance and date
 */
module.exports = async number => {
  const agent = new http.Agent({ keepAlive: true })
  try {
    const sessionId = await getSessionId(agent)
    const balance = await getBalance(agent, number, sessionId)
    return balance
  } catch (err) {
    throw err
  }
}
