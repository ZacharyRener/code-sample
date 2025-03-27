import { CountUp } from 'countup.js'; // @link https://github.com/inorganik/CountUp.js
const reducedMotion =
	window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
	window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

const statisticsCard = () => {
	if (document.querySelectorAll('.is-style-statistics .card__title').length) {
		document.querySelectorAll('.is-style-statistics .card__title').forEach((item) => {
			// Before manipulating the number in any way, detect if the text is too long to fit in the card.
			const maxWidth = item.parentNode.clientWidth - 74; // 48px for the icon + 16px gap + 10px cushion.
			setTimeout(() => {
				if (item.clientHeight >= 72 || item.clientWidth >= maxWidth) {
					item.classList.add('is-long');
				}
			}, 500);

			// Manipulate the number to get it in the right format for countup.js.
			// Extract the number from the text and wrap it in a span.
			const str = item.innerText;
			const number = str.match(/[\d,]+(\.\d+)?/); // number including commas and decimals. This step is important to accurately extract any text after the number.
			const before =
				number && 0 !== str.indexOf(number[0]) ? str.substring(0, str.indexOf(number[0])) : ''; // text before number.
			let after =
				number && str.length !== number[0].length
					? str.slice(str.indexOf(number[0]) + number[0].length)
					: ''; // text after number.

			after = after.replace(/(\s+[^]+)/g, (number) => {
				return `<span class="spaced">${number}</span>`; // Wrap any part that starts with space.
			});
			const finalNumber = number ? number[0].replaceAll(',', '') : str; // number without commas or decimals. CountUp.js requires this format.
			item.innerHTML = `${before}<span class="number">${finalNumber}</span>${after}`; // final output with span around number.
			const span = item.querySelector('.number');
			const spaced = item.querySelector('.spaced');
			setTimeout(() => {
				if (spaced) {
					// If there is a spaced element, check if it's too long to fit in the card.
					if (spaced.clientHeight >= 72) {
						spaced.classList.add('shrink');
					}
				}
				if (number) {
					initiateCounter(number, span);
				}
			}, 1000);
		});
	}
};

const initiateCounter = (number, span) => {
	const options = {
		enableScrollSpy: true,
		decimalPlaces: number[0].indexOf('.') > -1 ? number[0].split('.')[1].length : 0,
	};
	const countUp = new CountUp(span, span.innerText, options);
	countUp.start();
};

// Run on DOMContentLoaded.
if (!reducedMotion) {
	document.addEventListener('DOMContentLoaded', statisticsCard);
}
