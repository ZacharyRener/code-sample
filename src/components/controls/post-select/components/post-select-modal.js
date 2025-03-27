/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Button, Modal, __experimentalHStack as HStack } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import PostSelectBrowse from '../components/browse';
import PostSelectSelection from './selection';
import { deleteAtIndex, moveItemAtIndexDown, moveItemAtIndexUp } from '../utils/array-utils';

import './modal.scss';

const PostSelectModal = ({
	value, // post ids
	modalTitle = 'Select A Post',
	postSelectArguments,
	postTypeObject,
	onSelect,
	onClose,
	modalRef,
}) => {
	const { postType, numberPosts = 1 } = postSelectArguments;
	// Set State.
	const [selection, setSelection] = useState([]);

	// Set the value to the selection.
	useEffect(() => {
		// We want the unique values, in case there are duplicates.
		const uniqueValues = [...new Set(value)];
		setSelection(uniqueValues);
	}, [value]);

	// Only a single post?
	//const [single, setSingle] = useState(false);
	const single = false;

	const moveUp = (post) => {
		const index = selection.findIndex((p) => p === post.id);
		setSelection(moveItemAtIndexUp(selection, index));
	};

	const moveDown = (post) => {
		const index = selection.findIndex((p) => p === post.id);
		setSelection(moveItemAtIndexDown(selection, index));
	};

	const toggleSelected = (post) => {
		const index = selection.findIndex((p) => p === post.id);

		if (single) {
			setSelection([post.id]);
		} else {
			if (index >= 0) {
				setSelection(deleteAtIndex(selection, index));
			} else {
				if (numberPosts && !!selection && selection.length >= numberPosts) {
					/* translators: %d is total number of posts. */
					alert(sprintf(__('Max number %d reached.', 'zach-blocks'), numberPosts));
					return;
				} else {
					setSelection([...selection, post.id]);
				}
			}
		}
	};

	if (postTypeObject) {
		// Use the correct post type label in the name of the modal.
		modalTitle = sprintf('Select %s', postTypeObject.labels.name);
	}

	const modalToolbar = (
		<HStack HStackAlignment={'right'} expanded={false}>
			<Button isPrimary={true} onClick={() => onSelect(selection)}>
				{__('Save Selection', 'zach-blocks')}
			</Button>
		</HStack>
	);

	return (
		<Modal
			modalRef={modalRef}
			headerActions={modalToolbar}
			title={modalTitle}
			isFullScreen={true}
			onRequestClose={onClose}
			className="post-select"
		>
			<div className="modal-content">
				<PostSelectBrowse
					selection={selection}
					postSelectArguments={postSelectArguments}
					postTypeObject={postTypeObject ?? {}}
					onToggleSelected={toggleSelected}
				/>
				<PostSelectSelection
					className="post-selection"
					selection={selection}
					setSelection={setSelection}
					postType={postType}
					onRemoveItem={toggleSelected}
					onMoveItemUp={moveUp}
					onMoveItemDown={moveDown}
				/>
			</div>
		</Modal>
	);
};

export default PostSelectModal;
