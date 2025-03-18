const a11yCard = () => {
	const CARDS = document.querySelectorAll(
		'.card.card__has-excerpt-hover, .card.card__has-date-hover',
	);

	// Check if there are any cards.
	if (CARDS.length > 0) {
		// Foreach card.
		CARDS.forEach((card) => {
			// Add an event listener for the 'keydown' event.
			card.addEventListener('keydown', (event) => {
				// If the card is focused, and the escape key is pressed.
				if (event.key === 'Escape') {
					card.classList.toggle('remove-focus-styling');
				}
			});

			// Add an event listener for the 'blur' event.
			card.addEventListener('blur', () => {
				// When the card is blurred, remove the .remove-focus-styling class.
				card.classList.remove('remove-focus-styling');
			});
		});
	}
};

// Call the function to initialize.
a11yCard();
