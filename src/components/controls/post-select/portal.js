import PostSelectModal from './components/post-select-modal';

const { createPortal, Fragment } = wp.element;

const PostSelectPortal = (props) => {
	const { onSelect, value, isVisible, onClose } = props;

	return (
		<Fragment>
			{isVisible &&
				createPortal(
					<PostSelectModal
						value={value}
						{...props}
						onSelect={(posts) => {
							onSelect(posts);
							onClose();
						}}
						onClose={onClose}
					/>,
					document.getElementById('wpbody'),
				)}
		</Fragment>
	);
};

export default PostSelectPortal;
