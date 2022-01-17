// @include _global.js
// @include _scripts/wait-for.js

/**
 * Avoid that annoying step of clicking on the verify button
 */
waitFor('button.slds-button.slds-button_brand.slds-p-vertical_x-small.brand').then(verifyEl => {
	verifyEl.click()
})
