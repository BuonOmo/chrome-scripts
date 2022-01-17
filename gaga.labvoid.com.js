// @include _global.js
// @include _scripts/wait-for.js

// Hesitate
(function() {
    'use strict';

    window.timeoutHesitate = null
    window.hesitateMode = false

    window.closeHesitate = function closeHesitate() {
        clearTimeout(window.timeoutHesitate)
    }

	document.body.addEventListener('click', e => {
		if (!e.target.attributes['phx-value-vote']) return

		window.closeHesitate()
		if (!(e.shiftKey || (e.isTrusted && window.hesitateMode))) return

		const selected = document.querySelector('.button-outline')
		if (!selected) return


		const existingValue = selected.attributes['phx-value-vote'].value
		const targetValue = e.target.attributes['phx-value-vote'].value

		hesitate(targetValue, existingValue)
		e.preventDefault()
		e.stopPropagation()
	}, false)

	document.addEventListener('keydown', (e) => {
        if (e.key !== 'h') return

        window.hesitateMode = !window.hesitateMode

        if (window.hesitateMode)
            document.body.classList.add('hesitating')
        else {
            document.body.classList.remove('hesitating')
            window.closeHesitate()
        }
    })

    window.hesitate = function hesitate(a, b, duration = 500) {
        window.closeHesitate()
        window.timeoutHesitate = setTimeout(() => {
            document.querySelector(`[phx-value-vote="${a}"]`).click()
            hesitate(b, a, duration)
        }, duration)
        return window.closeHesitate
    }
})();

// Name-dropping
(function() {
    'use strict'

    setTimeout(() => {
        const el = document.querySelector('nav > ul > li')
        const href = window.location.href
        el.setAttribute('contenteditable', true)

        el.addEventListener('blur', async function rename() {
            const name = el.innerText
            const w = window.open(href)

            /* Would be better than timeouts, yet not working for now
            await waitFor('a[href="/session"]', w.document)
            w.document.querySelector('a[href="/session"]').click()

            await waitFor('#user_name', w.document)
            w.document.querySelector('#user_name').value = name
            w.document.querySelector('button').click()

            w.document.addEventListener('unload', () => {
                window.location.href = href
                w.close()
            })
            /*/

            setTimeout(() => {
                w.document.querySelector('a[href="/session"]').click()
                setTimeout(() => {
                    w.document.querySelector('#user_name').value = name
                    w.document.querySelector('button').click()
                    setTimeout(() => {
                        window.location.href = href
                        w.close()
                    }, 100)
                }, 100)
            }, 200)
            //*/
        })

    }, 1000);
})();
