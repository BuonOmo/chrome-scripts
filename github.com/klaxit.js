// @include _global.js

/**
 * Allow more advanced suggestions for assignations on GitHub.
 * The idea is to divide into teams the persons you may want
 * to assign a PR, and order those teams per importance.
 *
 * To pimp this script, you can either for and change the few
 * lines below (see _example_), or edit `matesOrder` from your
 * local storage.
 *
 * Change this script name to match your company.
 */

const matesOrder = (function(){
	let item = localStorage.getItem('matesOrder')
	if (item) return JSON.parse(item)

	// Default (also an example for you to add your version to local storage)
	const rv = {
		'⚔️ SAMURAÏ ⚔️': [ // name of the team
			'antoinegirard', // Order will be preserved.
			'hugobarthelemy',
			'joakimklaxit',
			'quiwin',
			'teckwan',
		],
		cto: [ // Can have multiple teams, order matters (cto will be shown after samurai)
			'ccyrille'
		],
		_keepAll: false // Keep people not in that list at the bottom or not.
	}

	localStorage.setItem('matesOrder', JSON.stringify(rv))
	return rv
})()

const orders = function* (matesOrder) {
	for (let key in matesOrder) {
		if (key === '_keepAll') continue

		yield [key, matesOrder[key].map(username => username.toLowerCase())]
	}
}

// https://stackoverflow.com/a/14570614/6320039
const observeDOM = (function(){
	const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

	return function( obj, callback ){
	  if( !obj || obj.nodeType !== 1 ) return;

	  if( MutationObserver ){
		// define a new observer
		const mutationObserver = new MutationObserver(callback)

		// have the observer observe foo for changes in children
		mutationObserver.observe( obj, { childList:true, subtree:true })
		return mutationObserver
	  }

	  // browser support fallback
	  else if( window.addEventListener ){
		obj.addEventListener('DOMNodeInserted', callback, false)
		obj.addEventListener('DOMNodeRemoved', callback, false)
	  }
	}
})();

// Ruby inspired
Array.prototype.to_h = function(map = (x) => x) {
	let rv = {}
	this.map(map).forEach(([key, value]) => rv[key] = value)
	return rv
}

// Overly complicated way to simplify things. See usage for examples.
const insert = function(el) {
	return {
		before(existing) { existing.insertAdjacentElement('beforebegin', el) },
		after(existing) { existing.insertAdjacentElement('afterend', el) }
	}
}

observeDOM(window.document.body, () => {
	const items = qs('#assignees-select-menu .js-divider-suggestions:not(.pimped) ~ .select-menu-item')
	if (items.length === 0) return

	const elByUser = items.to_h((el) => [el.querySelector('.js-username')?.innerText?.toLowerCase(), el])

	items.forEach(el => el.remove())

	const selectorEl = q('#assignees-select-menu .js-divider-suggestions')
	selectorEl.classList.add('pimped')

	let insertedKeys = []

	for (let [title, mates] of orders(matesOrder)) {
		const groupEl = selectorEl.cloneNode()
		groupEl.innerText = title
		insert(groupEl).before(selectorEl)
		mates.forEach((username) => {
			const userEl = elByUser[username]
			insertedKeys.push(username)

			if (userEl) insert(userEl).before(selectorEl)
		})
	}

	if (matesOrder._keepAll) {
		Object
			.keys(elByUser)
			.filter(e => !insertedKeys.includes(e))
			.map(e => elByUser[e])
			.forEach(userEl => { insert(userEl).after(selectorEl) })
	} else {
		selectorEl.remove()
	}
});
