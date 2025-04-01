/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Button, Modal } from '@wordpress/components';
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import './style.scss';
import { left, right } from './icons';

const Lightbox = ({ mediaItems, initialIndex, onClose }) => {
	// By default, the lightbox will open when created.
	const [isOpen, setOpen] = useState(true);
	// Current index, if there are multiple items.
	const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);

	// Reference to the media items container.
	const mediaItemsRef = useRef(null);

	// Closing Modal.
	const closeModal = () => {
		setOpen(false);
		if (onClose) onClose();
	};

	// Go to next callback.
	const goToNext = () => {
		setCurrentIndex((previousIndex) => (previousIndex + 1) % mediaItems.length);
	};

	// Go to preivous callback.
	const gotToPrevious = () => {
		setCurrentIndex((previousIndex) => (previousIndex - 1 + mediaItems.length) % mediaItems.length);
	};

	// Go to a certain index.
	const goToIndex = (index) => {
		setCurrentIndex(index);
	};

	// Handle scrolling to the correct index when the currentIndex changes.
	// Also handles when the window resizes.
	useEffect(() => {
		const handleResize = () => {
			if (mediaItemsRef.current) {
				const currentItem = mediaItemsRef.current.children[currentIndex];
				if (currentItem) {
					currentItem.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});
				}
			}
		};

		// Add the resize event listener
		window.addEventListener('resize', handleResize);

		// Trigger scrolling on initial mount and on resize
		handleResize();

		// Clean up the resize event listener on unmount
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [currentIndex]);

	// Handle keyboard navigation.
	useEffect(() => {
		const handleKeydown = (event) => {
			if (event.key === 'ArrowLeft') {
				gotToPrevious(); // Go to previous media item
			} else if (event.key === 'ArrowRight') {
				goToNext(); // Go to next media item
			}
		};

		// Add the keydown event listener
		window.addEventListener('keydown', handleKeydown);

		// Clean up the event listener on unmount
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	}, []);

	// The lightbox modal.
	return (
		<>
			{isOpen && (
				<Modal
					className="zach-lightbox zach-lightbox"
					onRequestClose={closeModal}
					style={{ '--current-index': currentIndex }}
				>
					<div className="media">
						<div className="media-items" ref={mediaItemsRef}>
							{mediaItems.map((mediaItem, index) => (
								<div key={index} className="media-item">
									{mediaItem}
								</div>
							))}
						</div>
						{mediaItems.length > 1 && (
							<div className="dots-nav">
								{mediaItems.map((_, index) => (
									<button
										key={index}
										className={`dot ${index === currentIndex ? 'active' : ''}`}
										onClick={() => goToIndex(index)}
									></button>
								))}
							</div>
						)}
					</div>
					<div className="content">
						{mediaItems[currentIndex].props.alt && (
							<div className="caption">{mediaItems[currentIndex].props.alt}</div>
						)}
						{mediaItems.length > 1 && (
							<div className="navigation">
								<Button
									variant="secondary"
									onClick={gotToPrevious}
									icon={left}
									label={__('Previous', 'zach-blocks')}
								/>
								<Button
									variant="secondary"
									onClick={goToNext}
									icon={right}
									label={__('Next', 'zach-blocks')}
								/>
							</div>
						)}
					</div>
				</Modal>
			)}
		</>
	);
};

export default Lightbox;
