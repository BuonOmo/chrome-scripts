// include _global.js
// @include _scripts/wait-for.js

/**
 * Allow one to download a file without subscription.
 */

let downloadFile = function(filename, content) {
	let blob = new Blob([content]);
	let event = new MouseEvent('click', {
	  'view': window,
	  'bubbles': true,
	  'cancelable': true
	});
	let a = document.createElement("a");
	a.download = filename;
	a.href = URL.createObjectURL(blob);
	a.dispatchEvent(event);
  };

waitFor('.generator-preview__wrapper').then((el) => {
	el.addEventListener('click', () => {
		downloadFile('qr.svg', document.getElementById('svgContainer').innerHTML)
	})
})
