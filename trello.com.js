// @include _global.js
// ================================= Count By Assignee =================================

// @include _scripts/sleep.js
// @include _scripts/wait-for.js

(function() {
	'use strict';
	const storageKey = 'CountByAssignee'
	const currentIndex = +(localStorage[storageKey] || 2)

	waitFor('.js-list:nth-child(3)').then(() => {
		const listEl = document.querySelector(`.js-list:nth-child(${currentIndex + 1})`)
		let mainEl = document.createElement('table')
		let countByAssigneeMemo = { h: {}, r: {} }
		let updating = false
		mainEl.innerHTML = `
			<thead>
				<th>Name</th>
				<th><abbr style="cursor:help" title="hours (should really be points but whatever)">H</abbr></th>
				<th><abbr style="cursor:help" title="cards assigned for review">R</abbr></th>
			</thead>
			<tbody></tbody>
		`
		const tbodyEl = mainEl.querySelector('tbody')
		mainEl.id = 'count-by-assignee'
		mainEl.style.cssText = `
			position: absolute;
			display: block;
			z-index: 10000;
			cursor: move;
			top: 0;
			width: max-content;
		`

		setListSelector()
		update()
		document.body.append(mainEl)
		draggable(mainEl)

		// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
		;(new MutationObserver(onTreeChange)).observe(listEl, { attributes: true, childList: true, subtree: true })


		function setListSelector() {
			qs('.list.js-list-content').forEach((el, index) => {
				if (index === currentIndex) return
				const button = document.createElement('a')
				button.innerText = 'count by assignee here'
				button.href = '#'
				button.style.textAlign = 'center'
				button.addEventListener('click', () => {
					localStorage[storageKey] = index
					window.location.reload()
				})
				el.append(button)
			})
		}


		function eq(obj1, obj2) {
			let props1 = Object.getOwnPropertyNames(obj1);
			let props2 = Object.getOwnPropertyNames(obj2);

			if (props1.length != props2.length) {
				return false;
			}
			for (let i = 0; i < props1.length; i++) {
				let prop = props1[i];

				if (obj1[prop] !== obj2[prop]) {
				return false;
				}
			}

			return true;
		}

		// Taken from https://stackoverflow.com/a/56246384/6320039
		function draggable(el) {
			el.style.userSelect = 'none'
		el.addEventListener('mousedown', function(e) {
			var offsetX = e.clientX - parseInt(window.getComputedStyle(this).left);
			var offsetY = e.clientY - parseInt(window.getComputedStyle(this).top);

			function mouseMoveHandler(e) {
			el.style.top = (e.clientY - offsetY) + 'px';
			el.style.left = (e.clientX - offsetX) + 'px';
			}

			function reset() {
			window.removeEventListener('mousemove', mouseMoveHandler);
			window.removeEventListener('mouseup', reset);
			}

			window.addEventListener('mousemove', mouseMoveHandler);
			window.addEventListener('mouseup', reset);
		});
		}

		function simpleName(input) {
			const nameEntry = input.toLowerCase()
			switch(true) {
				case /^q+u+e+n+t+i+n+(wentzler)?\b/i.test(nameEntry):
				case nameEntry === 'Monsieur_Mèche':
					return 'Quentin'
				case /^jo(?:jo|akim)?\b/i.test(nameEntry):
					return 'Jo'
				case /^h?ug[io]i*\b/i.test(nameEntry):
					return 'UGI'
				case /^teck\b/i.test(nameEntry):
					return 'Teck'
				case /^antoine\b/i.test(nameEntry):
					return 'Antoine'
				case /^ulysse\b/i.test(nameEntry):
					return 'Ulysse'
				case /^cyrille\b/i.test(nameEntry):
					return 'Cyrilou'
				default:
					throw `cannot match '${nameEntry}'`
			}
		}

		function update () {
			let countByAssignee = { h: {}, r: {} }
			const visibleCards = Array.from(listEl.querySelectorAll(':not(.hide) > .js-card-details'))
			// Count hours
			visibleCards
				.flatMap(cardEl => Array.from(cardEl.querySelectorAll('.member-avatar')).map(e => ({ count: Number(cardEl.querySelector('.badge')?.innerText), assignee: simpleName(e.alt) })))
				.filter(e => e.assignee)
				.forEach(e => { countByAssignee.h[e.assignee] = (countByAssignee.h[e.assignee] || 0) + e.count })

			visibleCards
				.map(el => el.querySelector('.js-custom-field-badges'))
				.filter(e => e)
				.flatMap(badgeTextEl => badgeTextEl.innerText.split(' ').slice(1))
				.forEach(name => {
					const matchingName = simpleName(name)
					countByAssignee.r[matchingName] ||= 0
					countByAssignee.r[matchingName] += 1
				})

			if (!eq(countByAssignee, countByAssigneeMemo)) {
				countByAssigneeMemo = countByAssignee
				let names = [...(new Set([...Object.keys(countByAssignee.h),  ...Object.keys(countByAssignee.r)]))].sort()
				tbodyEl.innerHTML = Object.keys(countByAssignee.h).sort().map(key => `<tr><td>${key}</td><td>${(countByAssignee.h[key] || 0).toPrecision(3)}</td><td>${countByAssignee.r[key] || 0}</td></tr>`).join('')
			}
			updating = false
		}

		function onTreeChange(modificationList, observer) {
			if (updating) return

			requestAnimationFrame(update)
			updating = true
		}
	})
})();

// ================================= Generate markdown link =================================
// Click command+g on a card to copy the link to clipboard.

(function() {
    'use strict';

    addEventListener('keydown', async e => {
        if (!(e.metaKey || e.ctrlKey) || e.key !== 'g') return
        if (document.querySelector('.window-title textarea') === null) return

        e.stopPropagation()
        e.preventDefault()
        const name = document.querySelector('.window-title textarea').value.replace(/\(\d+\)/, '').replaceAll(/^\s+|\s+$/g, '')
        const url = location.href.replace(/(?<=\/c\/.*)\/.*?$/, '') // shortened url
        const trelloLink = `![](https://github.trello.services/images/mini-trello-icon.png) [**${name}**](${url})`
        navigator.clipboard.writeText(trelloLink)
        console.log('Markdown Trello link copied to clipboard')
		const oldBackground = document.querySelector('.window').style.background
		document.querySelector('.window').style.background = 'pink'
		await sleep(200)
		document.querySelector('.window').style.background = oldBackground
    })
})();
