/**
 * WordPress dependencies.
 */
import { Spinner } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import { decodeEntities } from '@wordpress/html-entities';

const CurrentSelection = ({ postIds, postSelectArguments, title = 'Current Selection' }) => {
	// Get the posts.

	const { postType } = postSelectArguments;

	const { isResolving, records: posts } = useEntityRecords('postType', postType, {
		include: postIds,
		orderby: 'include',
	});

	return (
		<div className="hm-post-control-current-selection">
			<h4>{title}</h4>
			{isResolving ? (
				<Spinner style={{ float: 'none' }} />
			) : (
				<ol className="hm-post-select-control-list">
					{posts &&
						posts.map((post) => <li key={post.id}> {decodeEntities(post.title.rendered)}</li>)}
				</ol>
			)}
		</div>
	);
};

export default CurrentSelection;
