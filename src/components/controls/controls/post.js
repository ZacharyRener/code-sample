/**
 * WordPress dependencies
 */
import { BaseControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PostSelectButton from '../post-select';
import CurrentSelection from '../current-selection';

const PostControl = ({
	label,
	id,
	help,
	onChange,
	value,
	postSelectArguments = { postType: 'post' },
	buttonLabel = 'Select post',
}) => {
	const { postType } = postSelectArguments;

	// Get the post type object for Labeling reasons.
	const postTypeObject = useSelect((select) => {
		return select('core').getEntityRecord('root', 'postType', postType);
	});

	if (postTypeObject) {
		// Use the correct post type label in the name of the modal.
		label = sprintf('%s Selection', postTypeObject.labels.name);
	}

	return (
		<BaseControl label={label} id={id} help={help} className="hm-post-control zach-post-control">
			<PostSelectButton
				postSelectArguments={postSelectArguments}
				postTypeObject={postTypeObject}
				value={value}
				onSelect={(posts) => onChange(posts)}
			>
				{buttonLabel}
			</PostSelectButton>
			{!!value && value.length > 0 && (
				<CurrentSelection postIds={value} postSelectArguments={postSelectArguments} />
			)}
		</BaseControl>
	);
};

export default PostControl;
