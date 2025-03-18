/**
 * Functions for setting and getting cookies.
 */

const cookies = {
	/**
	 * Sets a new cookie with the given name, value, and expiration in days.
	 *
	 * @param {String} name  The cookie name.
	 * @param {String} value The cookie value.
	 * @param {Number} days  The duration of the cookie in days.
	 */
	setCookie: (name, value, days) => {
		let expires = '';
		if (days) {
			const date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = `; expires=${date.toUTCString()}`;
		}
		document.cookie = `${name}=${value || ''}${expires}; path=/`;
	},
	/**
	 * Gets the value of the cookie with the given name.
	 *
	 * @param {String} name
	 * @returns {String | null}
	 */
	getCookie: (name) => {
		const nameEQ = `${name}=`;
		const ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i += 1) {
			let c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	},

	/**
	 * Deletes the cookie with the given name.
	 *
	 * @param {String} name
	 */
	eraseCookie: (name) => {
		document.cookie = `${name}=; Max-Age=-99999999;`;
	},
};

export default cookies;
