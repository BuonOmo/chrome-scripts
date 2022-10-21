// @include _scripts/wait-for.js

(async function() {
	const token = await (async function() {
		await waitFor('#compte-user-mon-espace-a-loop-1')
		const userId = document.querySelector('#compte-user-mon-espace-a-loop-1').href.split('/').slice(-1)[0]
		const query = await fetch(`https://www.jegeremacartenavigo.iledefrance-mobilites.fr/attestation/${userId}`)
		const html = await query.text()
		const dom = document.createElement('html')
		dom.innerHTML = html
		return dom.querySelector('#attestation__token').value
	})()

	const year = new Date().getFullYear()
	const month = new Date().getMonth() + 1 // 1 based on the website.

	const attestation = {
		moisDebut: month, anneeDebut: year,
		moisFin: month, anneeFin: year,
		_token: token,
	}

	const result = await fetch('/attestation/attestation.pdf', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ attestation }),
	})

	const blob = await result.blob()
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	document.body.appendChild(a)
	a.style = "display: none"
	a.href = url
	a.download = `${year}-${month.toString().padStart(2, '0')}-attestation-navigo.pdf`
	a.click()
	window.URL.revokeObjectURL(url)
})()