
const isTurnSep = node => node.innerText === ''

const hasAlt = altText => node => Array.from(node.children).some(child => child.alt?.toLowerCase() == altText)
const isOre = hasAlt('ore')

const filterOn = (filterFunc) => {
	document.querySelectorAll('.message_post').forEach((node) => {
		if (filterFunc(node) || isTurnSep(node))
			node.style.display = 'block'
		else
			node.style.display = 'none'
	})
}

;(function(){
	const i = document.createElement('input')
	i.addEventListener('input', (e) => {
		const value = e.target.value
		switch (value) {
			case 'wheat':
				filterOn(hasAlt('grain'))
				break
			case 'ore':
			case 'brick':
				filterOn(hasAlt(value))
				break
			case 'wood':
				filterOn(hasAlt('lumber'))
				break
			case 'sheep':
				filterOn(hasAlt('wool'))
				break
			default:
				filterOn(() => true)
		}
	})
	document.querySelector('.main_block.game_chat_block').prepend(i)
})()
