/**
 * WordPress dependencies.
 */
import domReady from '@wordpress/dom-ready';
import { createRoot, createElement } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import Lightbox from './lightbox';

/**
 * Render Lightbox Vanilla function.
 */
const lightboxInit = (
	parentElement,
	MEDIA_ELEMENTS_QUERY = ['figure.wp-block-image', 'figure.wp-block-embed'],
	CAPTION_ELEMENT_QUERY = '.wp-element-caption',
	LIGHTBOX_CLASS = 'zach-lightbox-container',
) => {
	// Variable to store the root instance.
	let lightboxRoot = null;

	domReady(() => {
		// All the timelines.
		const parentElements = document.querySelectorAll(parentElement);

		// For each timeline.
		parentElements.forEach((parent) => {
			// Gather all media elements for all queries.
			const mediaElements = MEDIA_ELEMENTS_QUERY.flatMap((query) =>
				Array.from(parent.querySelectorAll(query)),
			);

			// Prepare all sibling media items outside the click event listener.
			const siblingMediaItems = Array.from(mediaElements).map((element) => {
				const mediaElement = element.querySelector('img') || element.querySelector('iframe');

				if (!mediaElement) {
					return null; // Skip if no valid media element is found
				}

				// Extract attributes from the DOM element
				const attributes = Array.from(mediaElement.attributes).reduce((acc, attr) => {
					// some DOM attributes to need tobe changed for React.
					const attributeMapping = {
						class: 'className',
						srcset: 'srcSet',
					};

					const name = attributeMapping[attr.name] || attr.name;

					acc[name] = attr.value;

					return acc;
				}, {});

				// Check if it's an iframe and has width and height attributes
				const width = parseFloat(mediaElement.getAttribute('width'));
				const height = parseFloat(mediaElement.getAttribute('height'));

				if (width && height) {
					// Calculate the aspect ratio and set it in the style object
					const aspectRatio = width / height;
					attributes.style = {
						...attributes.style, // Preserve existing styles if any
						'--aspect-ratio': `${aspectRatio}`,
					};
				}

				// Find a possible caption element.
				const mediaCaption = element.querySelector(CAPTION_ELEMENT_QUERY);

				// If there is a mediaCaption element, replace the alt attribute with the innerText of the media caption.
				if (mediaCaption) {
					attributes.alt = mediaCaption.innerText;
				}

				// Create a React element from the media element.
				return createElement(mediaElement.tagName.toLowerCase(), attributes);
			});

			// For each media element, add the click event listener
			mediaElements.forEach((mediaElement) => {
				mediaElement.classList.add('zach-lightbox-clickable');

				mediaElement.setAttribute('role', 'button');
				mediaElement.setAttribute('aria-haspopup', 'dialog');
				mediaElement.setAttribute('aria-label', 'View item in lightbox.');
				mediaElement.setAttribute('aria-expanded', 'false');
				mediaElement.setAttribute('tabindex', '0');

				const openLightbox = () => {
					// Determine the initial index of the clicked media element
					const initialIndex = Array.from(mediaElements).indexOf(mediaElement);

					// Render the Lightbox component with all sibling media items
					renderLightbox(siblingMediaItems, initialIndex);
				};

				mediaElement.addEventListener('click', openLightbox);
				mediaElement.addEventListener('keydown', (event) => {
					if (event.key === 'Enter') {
						openLightbox();
					}
				});
			});

			// Render the lightbox.
			const renderLightbox = (mediaItems, initialIndex) => {
				// Check if the lightbox container exists, if not, create and append it
				let lightboxContainer = document.getElementById(LIGHTBOX_CLASS);
				if (!lightboxContainer) {
					lightboxContainer = document.createElement('div');
					lightboxContainer.id = LIGHTBOX_CLASS;
					document.body.appendChild(lightboxContainer); // Append it to the body.
				}

				// Check if the root has already been created
				if (!lightboxRoot) {
					// If not, create a new root and render the Lightbox
					lightboxRoot = createRoot(lightboxContainer);
				}

				// Set the aria-expanded to true for each of the mediaItems.
				mediaElements.forEach((mediaElement) => {
					mediaElement.setAttribute('aria-expanded', 'true');
				});

				// Render the Lightbox React component.
				lightboxRoot.render(
					createElement(Lightbox, {
						mediaItems: mediaItems,
						initialIndex: initialIndex,
						onClose: () => {
							// Unmount the Lightbox when it's closed
							lightboxRoot.unmount();
							// Reset the root variable after unmounting
							lightboxRoot = null;
							// Set the aria-expanded to false for each of the mediaItems.
							mediaElements.forEach((mediaElement) => {
								mediaElement.setAttribute('aria-expanded', 'false');
							});
						},
					}),
				);
			};
		});
	});
};

/**
 * Exports.
 */
export { default as Lightbox } from './lightbox';
export { lightboxInit };
