const mobieFooterMenuInit = () => {
	let isMobile = window.innerWidth <= 768;

	const footer = document.querySelector( 'footer.wp-block-template-part' );
	if ( ! footer ) {
		return;
	}
	const columns = footer.querySelector( '.wp-block-columns' );
	const columnElements = columns.querySelectorAll( '.wp-block-column' );

	// Function to initialize mobile interactions
	const setupMobileInteractions = () => {
		// Add the class to body when mobile interactions are enabled
		document.body.classList.add( 'has-mobile-footer-menus' );

		columnElements.forEach( ( column ) => {
			const heading = column.querySelector( '.wp-block-heading' );
			const nav = column.querySelector( '.wp-block-navigation' );

			if ( heading && nav ) {
				// Replace h2 with button on mobile
				const button = document.createElement( 'button' );
				button.className = heading.className; // Keep the same class
				button.innerHTML = heading.innerHTML; // Copy the text content of h2
				heading.replaceWith( button ); // Replace the h2 with button

				// Set aria attributes for the button
				button.setAttribute( 'role', 'button' );
				button.setAttribute( 'aria-pressed', 'false' );
				button.addEventListener( 'click', toggleExpandedClass );
			}
		} );
	};

	// Function to reset interactions when resizing to desktop or mobile
	const resetInteractions = () => {
		// Remove the class from body when mobile interactions are disabled
		document.body.classList.remove( 'has-mobile-footer-menus' );

		columnElements.forEach( ( column ) => {
			const button = column.querySelector( 'button' );
			const nav = column.querySelector( '.wp-block-navigation' );

			if ( button && nav ) {
				// Replace button with h2 on non-mobile
				const heading = document.createElement( 'h2' );
				heading.className = button.className; // Keep the same class
				heading.innerHTML = button.innerHTML; // Copy the text content of button
				button.replaceWith( heading ); // Replace the button with h2

				// Remove aria attributes for h2
				heading.removeAttribute( 'aria-pressed' );
				heading.removeEventListener( 'click', toggleExpandedClass );
			}
		} );
	};

	// Function to toggle the expanded class and aria-expanded attribute
	const toggleExpandedClass = ( event ) => {
		const heading = event.target;
		const column = heading.closest( '.wp-block-column' );

		column.classList.toggle( 'expanded' );

		// Set aria-expanded attribute based on the expanded state
		const expanded = column.classList.contains( 'expanded' );
		heading.setAttribute( 'aria-expanded', expanded );
		heading.setAttribute( 'aria-pressed', expanded );

		const links = column.querySelectorAll( 'a' );

		// Adjust the tabIndex functionality of the links.
		links.forEach( ( link ) => {
			if ( expanded ) {
				link.setAttribute( 'tabindex', '0' );
			} else {
				link.setAttribute( 'tabindex', '-1' );
			}
		} );
	};

	// Check if we're on mobile and set up interactions accordingly
	if ( isMobile ) {
		setupMobileInteractions();
	}

	// Resize handler to adjust interactions on window resize
	const onWindowResize = () => {
		const wasMobile = isMobile;
		isMobile = window.innerWidth <= 768;

		// If the window width has changed from mobile to desktop or vice versa, reset the behavior
		if ( wasMobile !== isMobile ) {
			resetInteractions();
			if ( isMobile ) {
				setupMobileInteractions();
			}
		}
	};

	// Add event listener for window resizing
	window.addEventListener( 'resize', onWindowResize );
};

// Initialize the mobile footer menu when the document is loaded
document.addEventListener( 'DOMContentLoaded', mobieFooterMenuInit );
