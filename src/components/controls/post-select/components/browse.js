/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Spinner, __experimentalHStack as HStack } from '@wordpress/components';
import { useState, useEffect, useMemo, useCallback } from '@wordpress/element';
import { useEntityRecords } from '@wordpress/core-data';
import { previous, next } from '@wordpress/icons';
import apiFetch from '@wordpress/api-fetch';

/**
 * External dependencies
 */
import debounce from 'lodash/debounce';

/**
 * Internal dependencies
 */
import PostBrowseFilters from '../components/browse-filters';
import PostListItem from '../components/post-list-item';

const PostSelectBrowse = ({ selection = [], onToggleSelected, postSelectArguments }) => {
	const [hasMore, setHasMore] = useState(false);
	const [hasPrev, setHasPrev] = useState(false);
	const [connectedSite, setConnectedSite] = useState();

	const { postType, connection } = postSelectArguments;

	// Set component states.
	const [queryArgs, setQueryArgs] = useState({
		search: '',
		page: 1,
		per_page: 25,
		site_id: connection,
		context: 'view',
	});

	const { page, site_id } = queryArgs;

	// Pagination.
	const nextPage = () => {
		applyFilters({ page: page + 1 });
	};

	const prevPage = () => {
		applyFilters({ page: page - 1 });
	};

	const {
		isResolving,
		totalPages = 0,
		records: posts,
	} = useEntityRecords('postType', postType, queryArgs);

	// Construct the hasMore and hasPrev elements.
	useEffect(() => {
		setHasMore(totalPages > page);
		setHasPrev(page > 1);
	}, [page, totalPages]);

	// Handle when the filter changes..
	const changeFilters = useCallback(
		(newFilters) => {
			setQueryArgs({ ...queryArgs, ...newFilters });
		},
		[queryArgs],
	);

	// Debounce for filter changes.
	const applyFilters = useMemo(() => debounce(changeFilters, 300), [changeFilters]);

	// Site info.
	// Get info about the current site so we can display that in the Modal.
	useEffect(() => {
		if (site_id > 0) {
			apiFetch({
				path: `zach-network-management/v1/sites/${site_id}`,
				credentials: 'same-origin',
			}).then((data) => {
				setConnectedSite(data);
			});
		}
	}, [site_id]);

	const PostBrowseListNavigation = () => {
		return (
			<HStack>
				<Button
					className="prev-page"
					onClick={prevPage}
					iconPosition="left"
					icon={previous}
					variant="primary"
					disabled={!hasPrev}
				>
					{__('Previous page')}
				</Button>
				<Button
					className="next-page"
					onClick={nextPage}
					iconPosition="right"
					icon={next}
					variant="primary"
					disabled={!hasMore}
				>
					{__('Next page')}
				</Button>
			</HStack>
		);
	};

	return (
		<div className="menu-container">
			{connectedSite && (
				<h2 className="connected-site-info">
					{connectedSite.blogname}
					<span>{`${connectedSite.domain}${connectedSite.path}`}</span>
				</h2>
			)}
			<div className="filters">
				<PostBrowseFilters
					filters={queryArgs}
					onApplyFilters={applyFilters}
					postSelectArguments={postSelectArguments}
				/>
			</div>
			<PostBrowseListNavigation />

			{isResolving ? ( // If waiting to return posts.
				<Spinner />
			) : (
				<div>
					{!!posts && posts.length > 0 ? (
						<ol className="post-list">
							{posts.map((post) => (
								<PostListItem
									key={post.id}
									post={post}
									postType={post.type}
									onToggleSelected={() => onToggleSelected(post)}
									isSelected={selection ? selection.findIndex((p) => p === post.id) >= 0 : false}
								/>
							))}
						</ol>
					) : (
						<p className="no-results">{__('No results found.')}</p>
					)}
				</div>
			)}
		</div>
	);
};

export default PostSelectBrowse;
