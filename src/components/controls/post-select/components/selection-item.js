/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import SelectionListItemAction from './selection-item-action';

const SelectionListItem = ({ post, isSelected, actions }) => {
	const { author, postTypeObject } = useSelect(
		(select) => {
			return {
				author: select('core')
					.getAuthors()
					.find((a) => post.author.id === a.id),
				postTypeObject: select('core').getEntityRecord('root', 'postType', post.type),
			};
		},
		[post],
	);

	return (
		<li
			className={classNames('post-list-item', {
				'post-list-item--selected': isSelected,
			})}
			id={`selected-${post.id}`}
			data-id={post.id}
			draggable
		>
			<h2>{decodeEntities(post.title.rendered)}</h2>
			<div className="post-list-item--meta">
				{postTypeObject && (
					<span key="meta-type">
						<b>Type:</b> {postTypeObject.labels.name}
					</span>
				)}
				<span key="meta-published">
					<b>Published:</b> {post.date_gmt}
				</span>
				{author && (
					<span>
						<b>Author:</b> {author.name}
					</span>
				)}
			</div>
			<div className="post-list-item-actions">
				{actions.map((action) => (
					<SelectionListItemAction key={action.id} {...action} />
				))}
			</div>
		</li>
	);
};

export default SelectionListItem;
