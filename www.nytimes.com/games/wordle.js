function filter(...filters) {
	return {
		ws: filters.reduce((acc, filt) => acc.filter(filt), words),
		extras: filters.reduce((acc, filt) => acc.filter(filt), extras)
	}
}

function any(letters) {
	const ary = letters.split('')
	return function(word) {
		return ary.some(letter => word.includes(letter))
	}
}

function all(letters) {
	const ary = letters.split('')
	return function(word) {
		word = word.split('')
		for (letter of ary) {
			if (!word.includes(letter)) return false

			word.splice(word.indexOf(letter), 1)
		}

		return true
	}
}

function match(rgx) {
	return function(word) {
		return !!word.match(rgx)
	}
}

function not(fn) {
	return function(word) {
		return !fn(word)
	}
}

function none(letters) {
	return not(any(letters))
}


(async function () {
	const link = document.querySelector("script[src^='main']").src
	const resp = await fetch(link)
	const data = await resp.text()
	return [
		data.match(/cigar.*shave/)[0].replaceAll('"','').split(','),
		data.match(/aahed.*zymic/)[0].replaceAll('"','').split(','),
	]
})().then(([words, extras]) => {
	console.log(words, extras)
	const script = document.createElement('script')
	script.innerHTML = `window.words = ["${words.join('","')}"];` +
		`window.extras = ["${extras.join('","')}"];` +
		[filter, any, all, match, not, none].join(";")
	document.body.append(script)
})
