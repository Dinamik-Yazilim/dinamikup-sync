module.exports = (req) =>
	new Promise(async (resolve, reject) => {
		try {
			if (!(req.method == 'GET' || req.method == 'POST'))
				return restError.method(req, reject)

			if (!req.params.param1)
				return restError.param1(req, reject)


			let doc = null

			switch (req.params.param1) {

				case 'email':
					const email = req.params.param2 || req.getValue('email')
					doc = await db.members.findOne({ email: email })
					break
				case 'phoneNumber':
					const phoneNumber = util.fixPhoneNumber(req.params.param2 || req.getValue('phoneNumber'))
					doc = await db.members.findOne({ phoneNumber: phoneNumber })
					break
				default:
					reject('wrong parameter. /auth/check/:[email | phoneNumber]/:value')
					break
			}

			if (doc == null) {
				resolve({ inUse: false })
			} else if (doc.passive) {
				reject(`Kullanici aktif degil. Sistem yöneticisine başvurun.`)
			} else {
				resolve({ inUse: true, role: doc.role })
			}
		} catch (err) {
			reject(err)
		}
	})
