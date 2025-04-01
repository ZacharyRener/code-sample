/**
 * External dependencies
 */
import AOS from 'aos';
import 'aos/dist/aos.css';

console.log( 'AOS', AOS );

const startAnimations = () => {
	/*
	     Elements will look like:
	     <anyElement class="... has-animation-fade has-delay-200" />
	     We add data-aos and data-aos-delay based on the classes.
	*/
	const elements = document.querySelectorAll( '[class*="has-animation-"]' );
	elements.forEach( ( element ) => {
		// Get all animation and delay classes
		const classes = Array.from( element.classList );
		const animationClasses = classes.filter( ( c ) => c.startsWith( 'has-animation-' ) );
		const delayClasses = classes.filter( ( c ) => c.startsWith( 'has-delay-' ) );

		// Remove duplicates, keep the last added one if there are multiple
		if ( animationClasses.length > 1 ) {
			animationClasses.slice( 0, -1 ).forEach( ( dup ) => element.classList.remove( dup ) );
		}
		if ( delayClasses.length > 1 ) {
			delayClasses.slice( 0, -1 ).forEach( ( dup ) => element.classList.remove( dup ) );
		}

		// Set the data attributes based on the remaining classes
		const animationClass = Array.from( element.classList ).find( ( c ) => c.startsWith( 'has-animation-' ) );
		if ( animationClass ) {
			const animation = animationClass.replace( 'has-animation-', '' );
			element.setAttribute( 'data-aos', animation );
		}
		const delayClass = Array.from( element.classList ).find( ( c ) => c.startsWith( 'has-delay-' ) );
		if ( delayClass ) {
			const delay = delayClass.replace( 'has-delay-', '' );
			element.setAttribute( 'data-aos-delay', delay );
		}
	} );

	if ( typeof AOS === 'undefined' ) {
		return;
	}

	window.AOS = AOS;
	setTimeout( () => {
		window.AOS.init( {
			duration: 500,
		} );
	}, 200 );
};

window.addEventListener( 'load', startAnimations );
