const scrollContainers = document.querySelectorAll('.wp-block-zach-slider.display-scrollbar');

if (scrollContainers) {
	for (let i = 0; i < scrollContainers.length; i++) {
		const scrollContainer = scrollContainers[i];
		const scrollContentWrapper = scrollContainer.querySelector('.zach-slider');
		const scrollerContainer = document.createElement('div');
		const scroller = document.createElement('div');

		scrollContentWrapper.classList.add('has-scrollbar');

		let contentPosition = 0,
			scrollerBeingDragged = false,
			leftPosition,
			normalizedPosition;

		const calculateScrollerWidth = () => {
			// *Calculation of how tall scroller should be
			const visibleRatio = scrollContainer.offsetWidth / scrollContentWrapper.scrollWidth;
			return visibleRatio * scrollContainer.offsetWidth;
		};

		const scrollerWidth = calculateScrollerWidth();

		const moveScroller = (evt) => {
			// Move Scroll bar to top offset
			const scrollPercentage = evt.target.scrollLeft / scrollContentWrapper.scrollWidth;
			leftPosition = scrollPercentage * (scrollContainer.offsetWidth - 5); // 5px arbitrary offset so scroll bar doesn't move too far beyond content wrapper bounding box
			scroller.style.left = leftPosition + 'px';
		};

		const startDrag = (evt) => {
			normalizedPosition = evt.pageX;
			contentPosition = scrollContentWrapper.scrollLeft;
			scrollerBeingDragged = true;
			scrollContentWrapper.classList.add('scrolling');
		};

		const stopDrag = () => {
			scrollerBeingDragged = false;
			scrollContentWrapper.classList.remove('scrolling');
		};

		const scrollBarScroll = (evt) => {
			if (scrollerBeingDragged === true) {
				const mouseDifferential = evt.pageX - normalizedPosition;
				const scrollEquivalent =
					mouseDifferential * (scrollContentWrapper.scrollWidth / scrollContainer.offsetWidth);

				scrollContentWrapper.scrollLeft = contentPosition + scrollEquivalent;
			}
		};

		const barClick = (event) => {
			// Get the bounds of the scrollContainer
			const bounds = scroller.getBoundingClientRect();
			// Calculate the center of the scrollContainer
			const centerX = bounds.left + bounds.width / 2;
			const itemWidth = scrollContentWrapper.scrollWidth / scrollContentWrapper.children.length;

			// Check if the click was on the left or right of the center
			if (event.clientX < centerX) {
				// Click was on the left, scroll left
				scrollContentWrapper.scrollBy({ top: 0, left: -itemWidth, behavior: 'smooth' });
			} else {
				// Click was on the right, scroll right
				scrollContentWrapper.scrollBy({ top: 0, left: itemWidth, behavior: 'smooth' });
			}
		};

		// *Creates scroller element and appends to '.scrollable' div
		// create scroller element
		scrollerContainer.className = 'scroller-container';
		scroller.className = 'scroller';

		if (scrollerWidth / scrollContainer.offsetWidth < 1) {
			// *If there is a need to have scroll bar based on content size
			scroller.style.width = scrollerWidth + 'px';

			// append scroller to scrollContainer div
			scrollContainer.appendChild(scrollerContainer);
			scrollerContainer.appendChild(scroller);

			// show scroll path divot
			scrollContainer.className += ' showScroll';

			// attach related draggable listeners
			scroller.addEventListener('mousedown', startDrag);
			window.addEventListener('mouseup', stopDrag);
			window.addEventListener('mousemove', scrollBarScroll);
		}

		scrollerContainer.addEventListener('click', barClick);

		// *** Listeners ***
		scrollContentWrapper.addEventListener('scroll', moveScroller);
	}
}
