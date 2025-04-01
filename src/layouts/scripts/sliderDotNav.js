const scrollContainers = document.querySelectorAll('.wp-block-zach-slider.wp-block-zach-layouts');

if (scrollContainers) {
	scrollContainers.forEach((scrollContainer) => {
		const scrollContentWrapper = scrollContainer.querySelector('.zach-slider');
		const dotsContainer = document.createElement('div');
		dotsContainer.className = 'zach-slider-dots-container';

		const slides = Array.from(scrollContentWrapper.children);
		const totalSlides = slides.length;

		// Create dots for each slide
		slides.forEach((slide, index) => {
			const dot = document.createElement('button');
			dot.className = 'dot';
			dot.setAttribute('data-index', index);
			dotsContainer.appendChild(dot);

			// Add click event to scroll to the respective slide
			dot.addEventListener('click', () => {
				const slideWidth = scrollContentWrapper.scrollWidth / totalSlides;
				const scrollToPosition = slideWidth * index;

				scrollContentWrapper.scrollTo({
					left: scrollToPosition,
					behavior: 'smooth',
				});

				// Highlight the active dot
				document.querySelectorAll('.dot').forEach((d) => d.classList.remove('active'));
				dot.classList.add('active');
			});
		});

		// Add dotsContainer to the scrollContainer
		scrollContainer.appendChild(dotsContainer);

		// Update active dot based on scroll position
		scrollContentWrapper.addEventListener('scroll', () => {
			const currentIndex = Math.round(
				scrollContentWrapper.scrollLeft / (scrollContentWrapper.scrollWidth / totalSlides),
			);
			document.querySelectorAll('.dot').forEach((d) => d.classList.remove('active'));
			dotsContainer.querySelector(`.dot[data-index="${currentIndex}"]`).classList.add('active');
		});

		// Set the first dot as active initially
		dotsContainer.querySelector('.dot').classList.add('active');
	});
}
