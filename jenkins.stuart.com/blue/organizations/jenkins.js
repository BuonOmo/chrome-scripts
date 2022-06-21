const updateFavicon = () => {
	const status = document.querySelector('.svgResultStatus > title')?.textContent
	if (status == null) return

	let statusColor
	switch (status) {
		case 'success':
			statusColor = '#78b037'
			break
		case 'failure':
			statusColor = '#d54c53'
			break
		case 'running':
			statusColor = '#3a70b0'
			break
		case 'not_built':
			statusColor = '#949393'
			break
		case 'queued':
			statusColor = '#949393' // May not be the correct one
			break
		default:
			statusColor = '#ffffff'
			break
	}
	// console.log({ status, statusColor })
	const canvas = document.createElement('canvas')
	canvas.width = 48 + 12
	canvas.height = 48 + 12
	const ctx = canvas.getContext('2d')

	const img = new Image()
	img.src = '/favicon.ico'
	img.onload = function() {
		ctx.fillStyle = statusColor
		ctx.fillRect(0, 0, canvas.width, canvas.height)
		ctx.drawImage(img, 6, 6)
		const link = document.createElement('link')
		link.type = 'image/x-icon'
		link.rel = 'shortcut icon'
		link.href = canvas.toDataURL('image/x-icon')
		document.getElementsByTagName('head')[0].appendChild(link)
	}
}

setInterval(() => updateFavicon(), 2000)
