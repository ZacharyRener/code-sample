/**
 * WordPress dependencies
 */
import { Button, Dashicon } from '@wordpress/components';

const PostListItemAction = ({ text, icon, onClick, disabled = false }) => (
	<Button className="post-list-item-remove" onClick={onClick} disabled={disabled} isSmall>
		<Dashicon icon={icon} />
		<span className="screen-reader-text">{text}</span>
	</Button>
);

export default PostListItemAction;
