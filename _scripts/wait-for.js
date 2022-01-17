// @include _scripts/sleep.js

/**
 * Wait for a element to appear on DOM.
 * @param {String} selector A valid CSS selector.
 */
async function waitFor(selector, doc = window.document) {
	let result
	while (!(result = doc.querySelector(selector))) await sleep(50)
	return result
}
