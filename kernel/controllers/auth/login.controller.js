const { saveSession } = require('./helper')
module.exports = (req) => new Promise(async (resolve, reject) => {
	try {

		if (req.method != 'POST') return restError.method(req, reject)

		let username = null
		let email = null
		let phoneNumber = null
		let identifier = null

		identifier = req.getValue('identifier')
		if (!identifier) {
			username = req.getValue('username')
			email = req.getValue('email')
			phoneNumber = util.fixPhoneNumber(req.getValue('phoneNumber'))
		} else {
			if (identifier.includes('@')) {
				email = identifier
			} else if (!isNaN(identifier)) {
				phoneNumber = util.fixPhoneNumber(identifier)
			} else {
				username = identifier
			}
		}
		let password = req.getValue('password')
		let deviceId = req.getValue('deviceId')
		let role = req.getValue('role') || 'user'
		let lang = req.getValue('language') || req.getValue('lang')

		let filter = {}
		if (email) {
			filter.email = email
		} else if (phoneNumber) {
			filter.phoneNumber = phoneNumber
		} else if (username) {
			filter.username = username
		} else {
			return reject(`One of email, phoneNumber, username required.`)
		}
		if (password) {
			filter.password = password
			const memberDoc = await db.members.findOne(filter)
			if (!memberDoc) return reject(`login failed. member not found.`)
			if (memberDoc.passive) return reject(`account is passive. please contact with administrators`)
			saveSession(memberDoc, role, req, 'dinamikup', null).then(resolve).catch(reject)
		} else {
			const memberDoc = await db.members.findOne(filter)
			if (!memberDoc) return reject(`login failed. member not found.`)
			if (memberDoc.passive) return reject(`account is passive. please contact with administrators`)
			if (phoneNumber) {

			}
		}
	} catch (err) {
		reject(err)
	}

})
