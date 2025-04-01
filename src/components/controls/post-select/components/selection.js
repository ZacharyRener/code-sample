/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEntityRecords } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';
import { __experimentalUseDropZone as useDropZone } from '@wordpress/compose';

/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import SelectionListItem from '../components/selection-item';

const Selection = ({ selection, onRemoveItem, setSelection, postType }) => {
	const [isDraggingOverElement, setIsDraggingOverElement] = useState(false);
	const [isDraggingOverDocument, setIsDraggingOverDocument] = useState(false);
	const [draggingIndex, setDraggingIndex] = useState(null);
	const [dropZoneElement, setDropZoneElement] = useState(null);

	// selected Posts based on the selection array.
	const [selectedPosts, setSelectedPosts] = useState([]);

	// Fetch posts.
	const {
		hasResolved,
		records,
		//	totalItems: maxPosts,
	} = useEntityRecords('postType', postType, {
		include: selection || [],
		orderby: 'include',
		context: 'view',
	});

	// Set the returned posts to the records.
	useEffect(() => {
		if (hasResolved) {
			setSelectedPosts(records);
		}
	}, [hasResolved, records]);

	const updateSelectionIndecies = (event) => {
		// Find the index of the currently being dragged post in the selection array based on post IDs.
		const droppedIndex = selection.findIndex((item) => item === parseInt(draggingIndex));

		const newIndex = calculateNewIndex(event.clientY, droppedIndex);

		// Update the selection array with the new index.
		if (newIndex !== droppedIndex) {
			// Get the current selection.
			const updatedSelection = [...selection];
			// Get the item to be removed.
			const removedItem = updatedSelection.splice(droppedIndex, 1)[0];

			updatedSelection.splice(newIndex, 0, removedItem);

			setSelection(updatedSelection);
		}
	};

	// Drop zone functionality.
	const dropZoneRef = useDropZone({
		dropZoneElement,
		onDragOver(event) {
			// When dragging, updating the interface.
			const newIndex = calculateNewIndex(event.clientY);
			// The Ordered Post List.
			const postListElements = dropZoneElement.querySelectorAll('.post-list .post-list-item');

			postListElements.forEach((listItem) => {
				listItem.classList.remove('hovered');
			});

			// Add the 'hovered' class to the item at the newIndex.
			postListElements[newIndex].classList.add('hovered');
		},
		onDragStart(event) {
			setIsDraggingOverDocument(true);
			// Set the post ID of the row being dragged.
			// Check if the target is an <li> element
			const elementBeingDragged =
				'li' === event.target.tagName.toLowerCase() ? event.target : event.target.closest('li');

			setDraggingIndex(parseInt(elementBeingDragged.dataset.id));
		},
		onDragEnd(event) {
			updateSelectionIndecies(event);
			setIsDraggingOverDocument(false);
			setDraggingIndex(null);
			const postListElements = dropZoneElement.querySelectorAll('.post-list .post-list-item');

			postListElements.forEach((listItem) => {
				listItem.classList.remove('hovered');
			});
		},
		onDragEnter() {
			setIsDraggingOverElement(true);
		},
		onDragLeave() {
			setIsDraggingOverElement(false);
		},
	});

	const calculateNewIndex = (mouseY, droppedIndex = 0) => {
		// The Ordered Post List.
		const postList = dropZoneElement ? dropZoneElement.querySelector('.post-list') : null;

		if (!postList) {
			console.error('there is no post-list element.');
			return;
		}

		// The drop zone size.
		const dropZoneRect = postList.getBoundingClientRect();

		// The current selected items.
		const items = postList.children;
		const itemsRects = Array.from(items).map((item) => item.getBoundingClientRect());

		const mouseYRelativeToContainer = mouseY - dropZoneRect.top;

		let newIndex = droppedIndex;

		for (let i = 0; i < itemsRects.length; i++) {
			const itemRect = itemsRects[i];
			const itemTop = itemRect.top - dropZoneRect.top;
			// const itemBottom = itemTop + itemRect.height;

			if (mouseYRelativeToContainer < itemTop + itemRect.height) {
				newIndex = i;
				break;
			}
		}

		return newIndex;
	};

	// DropZone classes.
	const classes = classNames('post-list', 'post-list-selected', {
		'is-dragging-over-document': isDraggingOverDocument,
		'is-dragging-over-element': isDraggingOverElement,
	});

	return (
		<div className="post-selection" ref={setDropZoneElement}>
			{!!selectedPosts && selectedPosts.length > 0 ? (
				<>
					<p>{'Drag and drop to reorder posts.'}</p>
					<ol ref={dropZoneRef} className={classes}>
						{selectedPosts.map((post) => (
							<SelectionListItem
								key={post.id}
								postType={post.type}
								post={post}
								actions={[
									{
										id: 'remove-post',
										text: __('Remove post from selections', 'zach-blocks'),
										icon: 'dismiss',
										onClick: () => onRemoveItem(post),
									},
								]}
							/>
						))}
					</ol>
				</>
			) : (
				<p className="no-selection">{__('Nothing selected', 'zach-blocks')}</p>
			)}
		</div>
	);
};

export default Selection;
