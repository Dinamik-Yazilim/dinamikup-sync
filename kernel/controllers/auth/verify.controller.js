const { saveSession } = require('./helper')

module.exports = (req) =>
	new Promise(async (resolve, reject) => {
		try {
			if (!req.method == 'POST') return restError.method(req, reject)
			let email = null
			let phoneNumber = null
			let authCode = req.getValue('authCode')
			let identifier = req.getValue('identifier')

			if (!identifier) {
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

			if (!authCode) return reject(`autCode required`)
			let filter = { passive: false, authCode: authCode }

			if (email) {
				filter.email = email
			} else if (phoneNumber) {
				filter.phoneNumber = phoneNumber
			} else {
				return reject(`email or phone required.`)
			}
			const docs = await db.authCodes.find(filter).sort({ _id: -1 }).limit(1)
			if (docs.length == 0) return reject('verification failed. authCodeDoc not found')
			let authCodeDoc = docs[0]
			if (authCodeDoc.authCodeExpire.getTime() < new Date().getTime()) return reject('authCode expired')
			if (authCodeDoc.verified) return reject('authCode has already been verified')

			let memberFilter = {}
			if (email) {
				memberFilter.email = email
			} else if (phoneNumber) {
				memberFilter.phoneNumber = phoneNumber
			}
			let memberDoc = await db.members.findOne(memberFilter)

			if (memberDoc == null) {
				const memberId = new ObjectId()
				memberDoc = new db.members({
					_id: memberId,
					email: authCodeDoc.email,
					phoneNumber: authCodeDoc.phoneNumber,
					name: '',
					passive: false,
					role: 'user',
				})
			}

			memberDoc = await memberDoc.save()
			saveSession(memberDoc, req, 'dinamikup', null)
				.then(async result => {
					authCodeDoc.verified = true
					authCodeDoc.verifiedDate = new Date()
					authCodeDoc = await authCodeDoc.save()
					resolve(result)
				})
				.catch(reject)

		} catch (err) {
			console.log('err:', err)
			reject(err)
		}
	})
