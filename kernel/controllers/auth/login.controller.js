const { saveSession } = require('./helper')
const { sendAuthEmail, sendAuthSms } = require('../../lib/sender')
module.exports = (req) =>
  new Promise(async (resolve, reject) => {
    try {
      if (req.method != 'POST') return restError.method(req, reject)

      let email = null
      let phoneNumber = null
      let identifier = null

      identifier = req.getValue('identifier')
      if (!identifier) {
        // username = req.getValue('username')
    		email = req.getValue('email')
        phoneNumber = util.fixPhoneNumber(req.getValue('phoneNumber'))
      } else {
        if (identifier.includes('@')) {
          email = identifier
        } else if (!isNaN(identifier)) {
          phoneNumber = util.fixPhoneNumber(identifier)
        } else {
          return reject('identifier error')
        }
      }
      let password = req.getValue('password')
      let deviceId = req.getValue('deviceId')

      let filter = {}
      if (email) {
        filter.email = email
      } else if (phoneNumber) {
        filter.phoneNumber = phoneNumber
      } else {
        return reject(`email or phoneNumber required.`)
      }
      if (password) {
        filter.password = password
        const memberDoc = await db.members.findOne(filter)
        if (!memberDoc) return reject(`login failed. member not found.`)
        if (memberDoc.passive) return reject(`account is passive. please contact with administrators`)
        saveSession(memberDoc, req, 'dinamikup', null).then(resolve).catch(reject)
      } else {
        // TODO: buraya gelecekte saatte istenebilecek veya gunluk istenebilecek sms/email limiti koyalim
        // TODO: resolve mesaj icindeki authCode bilgileri kaldirilacak.
        let authCodeDoc = await db.authCodes.findOne({
          email: email,
          phoneNumber: phoneNumber,
          deviceId: deviceId,
          verified: false,
          passive: false,
          authCodeExpire: { $gt: new Date() },
        })
        if (authCodeDoc) {
          return resolve(`authCode already has been sent. authCode:${authCodeDoc.authCode} email:${authCodeDoc.email} phoneNumber:${authCodeDoc.phoneNumber}`)
        } else {
          authCodeDoc = new db.authCodes({
						deviceId: deviceId,
            email: email,
            phoneNumber: phoneNumber,
            authCode: util.randomNumber(120000, 980700),
            authCodeExpire: new Date(new Date().setMinutes(new Date().getMinutes() + 55)), // TODO: 3 dk ya indirilecek. simdilik 55 dk
          })
          authCodeDoc = await authCodeDoc.save()
        }
        if (phoneNumber) {
          sendAuthSms(authCodeDoc.phoneNumber, authCodeDoc.authCode)
            .then((result) => {
              devLog('login sms result:', result)
              return resolve(`authCode has been sent to your phone. authCode:${authCodeDoc.authCode} phoneNumber:${authCodeDoc.phoneNumber}`)
            })
            .catch(reject)
        } else if (email) {
          sendAuthEmail(authCodeDoc.email, authCodeDoc.authCode)
            .then((result) => {
              devLog('login email result:', result)
              return resolve(`authCode has been sent to your email. authCode:${authCodeDoc.authCode} email:${authCodeDoc.email}`)
            })
            .catch(reject)
        } else {
          reject('username authCode error') // TODO: buraya daha anlamli bir hata mesaji lutfen
        }
      }
    } catch (err) {
      reject(err)
    }
  })
