const cssVariables = () => {
	const styles = {};

	const mainNav = document.querySelector('.main-nav');

	if (mainNav) {
		styles['main-header'] = {
			height: `${mainNav.offsetHeight}px`,
		};
	}

	styles['body'] = {
		width: `${document.body.offsetWidth}px`,
	};

	// Helper function to recursively output styles as CSS variables.
	const outputCSSVariables = (prefix, obj) => {
		Object.keys(obj).forEach((key) => {
			if (typeof obj[key] === 'object' && obj[key] !== null) {
				// Recursively handle nested objects.
				outputCSSVariables(`${prefix}--${key}`, obj[key]);
			} else {
				document.documentElement.style.setProperty(`--${prefix}--${key}`, `${obj[key]}`);
			}
		});
	};

	// Output each item in the array recursively, with a prefix of 'zach'.
	outputCSSVariables('zach', styles);
};

// Run on DOMContentLoaded.
document.addEventListener('DOMContentLoaded', cssVariables);

// Run on window resize.
window.addEventListener('resize', cssVariables);
