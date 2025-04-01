/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { createPortal, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import PostSelectModal from './components/post-select-modal';

const PostSelectButton = ({
	children,
	onSelect,
	value = [],
	postSelectArguments,
	postTypeObject,
	btnProps = {},
}) => {
	const [modalVisible, setModalVisible] = useState(false);

	return (
		<div className="post-select">
			<Button isSecondary {...btnProps} onClick={() => setModalVisible(true)}>
				{children}
			</Button>
			{modalVisible &&
				createPortal(
					<PostSelectModal
						value={value}
						modalTitle={'Select A Post'}
						postTypeObject={postTypeObject}
						postSelectArguments={postSelectArguments}
						onSelect={(posts) => {
							onSelect(posts);
							setModalVisible(false);
						}}
						onClose={() => setModalVisible(false)}
					/>,
					document.getElementById('wpbody'),
				)}
		</div>
	);
};

export default PostSelectButton;
