/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * External dependencies
 */
import classNames from 'classnames';

const PostListItem = ({ post, isSelected, onToggleSelected }) => {
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
		>
			<label htmlFor={`select-post-${post.id}`}>
				<input
					className="screen-reader-text"
					type="checkbox"
					checked={isSelected}
					id={`select-post-${post.id}`}
					onChange={() => onToggleSelected()}
				/>
				<h2>{decodeEntities(post.title.rendered)}</h2>
				<div className="post-list-item--meta">
					{postTypeObject && (
						<span>
							<b>{__('Type:', 'hm-gb-tools')}</b> {postTypeObject.labels.singular_name}&nbsp;
						</span>
					)}
					<span>
						<b>{__('Published:', 'hm-gb-tools')}</b> {post.date_gmt}
					</span>
					{author && (
						<span>
							<b>Author:</b> {author.name}
						</span>
					)}
				</div>
			</label>
		</li>
	);
};

export default PostListItem;
