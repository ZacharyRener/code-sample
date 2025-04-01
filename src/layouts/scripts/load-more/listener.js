/**
 * The loadMore submit listener.
 *
 * @module zach/blocks/load-more
 */

/* global ZachrestLoadMoreURL */

let page = 2;

/**
 * Handles the load more request.
 *
 * @param {*}           data   The form data.
 * @param {HTMLElement} button The button element.
 */
const request = (data, button) => {
	const buttonWrap = button.parentNode.parentNode;
	const archiveWrap = buttonWrap.previousElementSibling;
	const lastPost = archiveWrap.lastChild;

	archiveWrap.classList.add('loading');

	const requestURL = ZachrestLoadMoreURL + '?paged=' + page++;

	const formData = new FormData();
	formData.append('json', data);

	fetch(requestURL, { method: 'post', body: formData })
		.then((response) => response.json())
		.then((data) => {
			const html = data.body.trim();

			if (html) {
				const template = document.createElement('template');
				template.innerHTML = html;

				const posts = template.content.childNodes;

				if (posts) {
					for (let i = 0; i < posts.length; i++) {
						const post = posts[i];
						archiveWrap.append(post);
					}
					lastPost.nextElementSibling.querySelector('a').focus();
				}
			} else {
				buttonWrap.classList.add('d-none');
			}

			archiveWrap.classList.remove('loading');
		})
		.catch(() => {
			archiveWrap.classList.remove('loading');
			buttonWrap.classList.add('d-none');
		});
};

/**
 * Click event listener for the load more button.
 *
 * @param {MouseEvent} e The click event.
 */
const loadMoreListener = (e) => {
	e.preventDefault();

	const button = e.target;
	const data = button.getAttribute('data-args');

	request(data, button);
};

export {
	/**
	 * Click event listener for the load more button.
	 * @function
	 * @param {MouseEvent} e The click event.
	 */
	loadMoreListener,
};
