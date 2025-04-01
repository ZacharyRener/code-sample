/**
 * WordPress dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/blockEditor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	RadioControl,
	Placeholder,
	RangeControl,
	ToggleControl,
	ComboboxControl,
	TextControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import ServerSideRender from '@wordpress/server-side-render';
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useRef } from '@wordpress/element';

/**
 * External dependencies.
 */
import isEmpty from 'lodash/isEmpty';

/**
 * Local dependencies.
 */
import { HoverStyle } from '../components/card-controls';
import { PostControl } from '../components/controls';
import layouts from './layouts.js';
import curations from './curations.js';
import paginationStyles from './paginationStyles.js';
import postTypes from './postTypes.js';

import './editor.scss';

const LayoutEdit = ({ className, attributes, setAttributes }) => {
	const {
		posts,
		layout,
		curation,
		curationType,
		loadMore,
		pagination,
		paginationStyle,
		numberPosts,
		showAsCarousel,
		skipDuplicatePosts,
		term_id,
		postType,
		excludeType,
		exclude_term_id,
		showImage,
		showTitle,
		showCategory,
		showDate,
		showExcerpt,
		showContinueReading,
		showAuthor,
		fontSize,
		headingLineLimit,
		excerptLineLimit,
		readMoreMessage,
		hoverStyle,
	} = attributes;

	const blockRef = useRef(null);

	const selectPost = (postIds) => {
		setAttributes({ posts: postIds });
	};

	const fetchAutomaticPosts = () => {
		const postTypeREST = 'post' === postType ? 'posts' : postType;
		let fetchPath = `/wp/v2/${postTypeREST}?per_page=${numberPosts}`;
		if ('default' !== curation) {
			fetchPath = `${fetchPath}&${curation}=${term_id}`;
		}
		apiFetch({ path: fetchPath }).then((posts) => {
			const postIds = posts.map((post) => post.id);
			selectPost(postIds);
		});
	};

	const fetchManualPosts = () => {
		const currentPostsNumber = posts ? posts.length : 1;
		if (currentPostsNumber > numberPosts) {
			const newPosts = posts.slice(0, numberPosts);
			setAttributes({
				posts: newPosts,
			});
		}

		if (currentPostsNumber < numberPosts) {
			const newPosts = numberPosts - currentPostsNumber;
			const postTypeREST = 'post' === postType ? 'posts' : postType;
			const fetchPath = `/wp/v2/${postTypeREST}?per_page=${newPosts}&offset=${currentPostsNumber}`;

			apiFetch({ path: fetchPath }).then((fetchedPosts) => {
				const postIds = fetchedPosts.map((p) => p.id);
				setAttributes({
					posts: [...posts, ...postIds],
				});
			});
		}
	};

	curations.forEach((presetCuration) => {
		useEntityRecords('taxonomy', presetCuration, { per_page: -1 });
	});

	const excludeCurations = [...curations];

	excludeCurations[0] = {
		label: __('None'),
		value: '',
	};

	useEffect(() => {
		if ('automatic' === curationType) {
			fetchAutomaticPosts();
		}

		if ('manual' === curationType) {
			fetchManualPosts();
		}
	}, [curationType, term_id, numberPosts]);

	// Tax Options.
	const taxonomyTerms = useEntityRecords('taxonomy', curation, { per_page: -1 });

	const termOptions =
		taxonomyTerms.hasResolved && taxonomyTerms.records
			? taxonomyTerms.records.map(({ id, name }) => ({
					label: name,
					value: parseInt(id),
				}))
			: [];

	// Exclusion Term Options.
	const taxonomyExclusionTerms = useEntityRecords('taxonomy', excludeType, {
		per_page: -1,
	});

	const exclusionTermOptions =
		taxonomyExclusionTerms.hasResolved && taxonomyExclusionTerms.records
			? taxonomyExclusionTerms
				? [
						{
							label: __('Select a Term'),
							value: '0',
							disabled: true,
						},
						...taxonomyExclusionTerms.records.map(({ id, name }) => ({
							label: name,
							value: parseInt(id),
						})),
					]
				: []
			: [];

	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<InspectorControls key="inspector-controls">
				<PanelBody title={__('Select Curation')}>
					<PanelRow>
						<RadioControl
							label="Curation"
							help="The type of curation to use."
							selected={curationType}
							options={[
								{ label: 'Automatic', value: 'automatic' },
								{ label: 'Manual', value: 'manual' },
								{ label: 'Use Query', value: 'query' },
							]}
							onChange={(curationType) => {
								setAttributes({ curationType: curationType });
							}}
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
							label={__('Post Type')}
							value={postType}
							onChange={(postType) => {
								setAttributes({ postType: postType });
							}}
							options={postTypes}
						/>
					</PanelRow>
					{'automatic' === curationType && (
						<Fragment>
							<PanelRow>
								<SelectControl
									label={__('Curation Types')}
									value={curation}
									onChange={(curation) => {
										setAttributes({
											curation,
											term_id: 0,
										});
									}}
									options={curations}
								/>
							</PanelRow>
							{termOptions && termOptions.length > 0 && (
								<PanelRow>
									<ComboboxControl
										label={__('Term Filter')}
										value={term_id || 0}
										options={termOptions}
										className={'zach-layout__select'}
										onChange={(option) => {
											setAttributes({
												term_id: parseInt(option) || 0,
											});
										}}
									/>
								</PanelRow>
							)}
							<PanelRow>
								<SelectControl
									label={__('Exclude By Curation')}
									value={excludeType}
									onChange={(option) => {
										setAttributes({
											excludeType: option,
											exclude_term_id: 0,
										});
									}}
									options={excludeCurations}
								/>
							</PanelRow>
							{exclusionTermOptions && exclusionTermOptions.length > 0 && (
								<PanelRow>
									<ComboboxControl
										label={__('Exclude Terms')}
										value={exclude_term_id || 0}
										options={exclusionTermOptions}
										className={'zach-layout__select'}
										onChange={(option) => {
											setAttributes({
												exclude_term_id: parseInt(option) || 0,
											});
										}}
									/>
								</PanelRow>
							)}
							<PanelRow>
								<ToggleControl
									label={__('Do not allow duplicate posts')}
									checked={skipDuplicatePosts}
									onChange={(val) => {
										setAttributes({ skipDuplicatePosts: val });
									}}
								/>
							</PanelRow>
							<PanelRow>
								<ToggleControl
									label={__('Include load more button')}
									checked={loadMore}
									onChange={(val) => {
										setAttributes({ loadMore: val });
									}}
								/>
							</PanelRow>
						</Fragment>
					)}
					{'manual' === curationType && (
						<PostControl
							label={__('Posts')}
							value={posts}
							onChange={selectPost}
							buttonLabel={__('Select Post')}
							postSelectArguments={{ numberPosts, postType }}
						/>
					)}
					{'query' === curationType && (
						<Fragment>
							<PanelRow>
								<ToggleControl
									label={__('Include load more button')}
									checked={loadMore}
									onChange={(val) => {
										// Set load More to true, and pagination to false.
										setAttributes({ loadMore: val });
										val ? setAttributes({ pagination: false }) : '';
									}}
								/>
							</PanelRow>
							<PanelRow>
								<ToggleControl
									label={__('Include pagination')}
									checked={pagination}
									onChange={(val) => {
										// Pagination means load more is false.
										setAttributes({ pagination: val });
										val ? setAttributes({ loadMore: false }) : '';
									}}
								/>
							</PanelRow>
						</Fragment>
					)}
					{pagination && (
						<Fragment>
							<PanelRow>
								<SelectControl
									label={__('Pagination Style')}
									value={paginationStyle}
									onChange={(paginationStyle) => {
										setAttributes({
											paginationStyle,
										});
									}}
									options={paginationStyles}
								/>
							</PanelRow>
						</Fragment>
					)}
					{'query' !== curationType && (
						<PanelRow>
							<RangeControl
								label={__('Number of Posts')}
								value={numberPosts}
								onChange={(number) => {
									setAttributes({ numberPosts: number });
								}}
								min={1}
								max={20}
							/>
						</PanelRow>
					)}

					<PanelRow>
						<SelectControl
							label={__('Layout', 'zach')}
							value={layout}
							onChange={(newLayout) => {
								setAttributes({ layout: newLayout });
							}}
							options={layouts}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show as carousel', 'zach')}
							checked={true === showAsCarousel}
							help={
								showAsCarousel
									? __('Posts will disply in a horizontal carousel/slider', 'zach')
									: __('Posts will display in a vertical stack.', 'zach')
							}
							onChange={() => {
								setAttributes({ showAsCarousel: !showAsCarousel });
							}}
						/>
					</PanelRow>
				</PanelBody>
				{'vertical-tabs' != layout && (
					<>
						<PanelBody title={__('Select Output Options')}>
							<PanelRow>
								<ToggleControl
									label={__('Show image')}
									checked={showImage}
									onChange={(val) => {
										setAttributes({ showImage: val ? true : false });
									}}
								/>
							</PanelRow>
							<PanelRow>
								<ToggleControl
									label={__('Show category heading')}
									checked={true === showCategory}
									onChange={(val) => {
										setAttributes({ showCategory: val ? true : false });
									}}
								/>
							</PanelRow>
							<PanelRow>
								<ToggleControl
									label={__('Show title')}
									checked={true === showTitle}
									onChange={(val) => {
										setAttributes({ showTitle: val ? true : false });
									}}
								/>
							</PanelRow>
							<PanelRow>
								<ToggleGroupControl
									label={__('Date')}
									value={showDate}
									isBlock
									isAdaptiveWidth={true}
									isDeselectable={false}
									onChange={(val) => {
										setAttributes({ showDate: val });
									}}
								>
									<ToggleGroupControlOption value="show" label="Show" />
									<ToggleGroupControlOption value="hide" label="Hide" />
									<ToggleGroupControlOption
										value="hover"
										label="Appear"
										aria-label="The date will appear on hover."
									/>
								</ToggleGroupControl>
							</PanelRow>
							<PanelRow>
								<ToggleGroupControl
									label={__('Excerpt')}
									value={showExcerpt}
									isBlock
									isAdaptiveWidth={true}
									isDeselectable={false}
									onChange={(val) => {
										setAttributes({ showExcerpt: val });
									}}
								>
									<ToggleGroupControlOption value="show" label="Show" />
									<ToggleGroupControlOption value="hide" label="Hide" />
									<ToggleGroupControlOption
										value="hover"
										label="Appear"
										aria-label="The excerpt will appear on hover."
									/>
								</ToggleGroupControl>
							</PanelRow>
							<PanelRow>
								<ToggleControl
									label={__('Show continue reading')}
									checked={true === showContinueReading}
									onChange={(val) => {
										setAttributes({ showContinueReading: val ? true : false });
									}}
								/>
							</PanelRow>
							<PanelRow>
								<ToggleControl
									label={__('Show author')}
									checked={true === showAuthor}
									onChange={(val) => {
										setAttributes({ showAuthor: val ? true : false });
									}}
								/>
							</PanelRow>
						</PanelBody>
						<PanelBody title="Appearance Options">
							<PanelRow>
								<SelectControl
									label={__('Font Size')}
									value={fontSize}
									options={[
										{ label: 'Default', value: 'default' },
										{ label: 'Small', value: 'small' },
										{ label: 'Large', value: 'large' },
									]}
									onChange={(fontSize) => {
										setAttributes({ fontSize: fontSize });
									}}
								/>
							</PanelRow>
							{showTitle && (
								<PanelRow>
									<RangeControl
										label={__('Title - Line Limit')}
										value={headingLineLimit}
										onChange={(number) => {
											setAttributes({ headingLineLimit: number });
										}}
										min={0}
										max={10}
										help={
											headingLineLimit > 0
												? sprintf(
														_n(
															'The title will be limited to %d line.',
															'The title will be limited to %d lines.',
															headingLineLimit,
															'zach',
														),
														headingLineLimit,
													)
												: __('The title will display all lines.', 'zach')
										}
									/>
								</PanelRow>
							)}
							{showExcerpt && (
								<PanelRow>
									<RangeControl
										label={__('Excerpt - Line Limit')}
										value={excerptLineLimit}
										onChange={(number) => {
											setAttributes({ excerptLineLimit: number });
										}}
										min={0}
										max={10}
										help={__(
											'The number of lines of text to limit the excerpt to. Zero lines means no limit.',
										)}
									/>
								</PanelRow>
							)}
							{showContinueReading && (
								<PanelRow>
									<TextControl
										label={__('Continue reading message')}
										help="The continue reading message. If this is empty, only an arrow will show."
										value={readMoreMessage}
										onChange={(readMoreMessage) => {
											setAttributes({ readMoreMessage });
										}}
									/>
								</PanelRow>
							)}
							<PanelRow>
								<HoverStyle
									value={hoverStyle}
									onChange={(hoverStyle) => setAttributes({ hoverStyle })}
								/>
							</PanelRow>
						</PanelBody>
					</>
				)}
			</InspectorControls>
			<div className="zach-layouts-preview" key="preview" ref={blockRef}>
				{isEmpty(posts) ? (
					<Placeholder>{__('Please select a post.')}</Placeholder>
				) : (
					<ServerSideRender
						block="zach/layouts"
						attributes={{
							...attributes,
							context: 'editor',
							className: className,
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default LayoutEdit;
