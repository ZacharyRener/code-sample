/**
 * Adds the alert dismiss functionality.
 */

import cookies from './cookies';
const { setCookie, getCookie } = cookies;

const alertBar = () => {
	const alertBars = document.querySelectorAll('.wp-block-group.is-style-alert');

	if (alertBars) {
		alertBars.forEach((alertBar) => {
			if (alertBar.querySelector('.alert-bar__close') !== null) return;
			const alertBarCookie = JSON.parse(getCookie('alertBar') || '[]');
			const alertText = alertBar.innerText.trim();
			const alertHash = alertText.replace(/[^a-z0-9]/gi, '').toLowerCase();

			if (alertBarCookie.includes(alertHash)) {
				alertBar.style.display = 'none';
			} else {
				const closeButton = document.createElement('button');
				closeButton.classList.add('alert-bar__close');
				closeButton.innerHTML =
					'<span class="screen-reader-text">Dismiss</span><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 11L11 0.999999" stroke="black" stroke-width="2"/><path d="M1 1L11 11" stroke="black" stroke-width="2"/></svg>';
				alertBar.appendChild(closeButton);

				closeButton.addEventListener('click', () => {
					alertBar.style.display = 'none';
					alertBarCookie.push(alertHash);
					setCookie('alertBar', JSON.stringify(alertBarCookie), 7);
				});
			}
		});
	}
};
alertBar();

// makes sure the "x" is added when a new alert bar pattern is added to the editor
if (document.body.classList.contains('block-editor-iframe__body')) {
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				if (node.nodeType === Node.ELEMENT_NODE && node.matches('.wp-block-group.is-style-alert')) {
					alertBar();
				}
			});
		});
	});
	observer.observe(document.body, { childList: true, subtree: true });
}
