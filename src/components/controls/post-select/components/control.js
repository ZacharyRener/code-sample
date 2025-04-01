/**
 * WordPress dependencies
 */
import { BaseControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import PostSelectButton from '../index';
import CurrentSelection from '../components/current-selection';

const PostSelectControl = ({
	label,
	id,
	help,
	onChange,
	value,
	postType = ['post'],
	buttonLabel = 'Select post',
}) => {
	return (
		<BaseControl label={label} id={id} help={help} className="hm-post-control">
			<PostSelectButton postType={postType} value={value} onSelect={(posts) => onChange(posts)}>
				{buttonLabel}
			</PostSelectButton>

			{!!value && value.length > 0 && <CurrentSelection postIds={value} postTypes={postType} />}
		</BaseControl>
	);
};

export default PostSelectControl;
