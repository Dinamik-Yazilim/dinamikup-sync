exports.login = function (webServiceUrl, webServiceUsername, webServicePassword) {
  fetch(`${webServiceUrl}/auth/loginuser`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: webServiceUsername, password: webServicePassword }),

  })
    .then(resp => {
      if (resp.ok) {
        resp
          .json()
          .then(result => {
            if (result.status == 'success') {
              resolve(result)
            } else {
              reject(result)
            }
          })
          .catch(reject)
      } else reject(resp.description)
    })
    .catch(reject)
}