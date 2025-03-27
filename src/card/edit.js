/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	InnerBlocks,
	__experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	RangeControl,
	ToggleControl,
	TextControl,
	Button,
	__experimentalVStack as VStack,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { useSelect } from '@wordpress/data';

/**
 * Local dependencies.
 */
import { HoverStyle } from '../components/card-controls';
import './editor.scss';
import { statisticsInnerBlocksTemplate, defaultTemplate } from './innerBlockTemplates';

const SingleCardedit = ({ attributes, setAttributes, context, clientId }) => {
	// Retrieve postId from the core/post-template block.
	const { postId } = context;

	// Check if any ancestor is a Query block.
	const hasQueryAncestor = useSelect(
		(select) => {
			const { getBlockParentsByBlockName } = select('core/block-editor');
			// Get parents of the current block that match the Query block's name
			const queryAncestors = getBlockParentsByBlockName(clientId, 'core/query');
			return queryAncestors.length > 0; // If there are any, it means we are nested
		},
		[clientId],
	);

	// Block attributes.
	const {
		showImage,
		showTitle,
		showCategory,
		showExcerpt,
		showAuthor,
		showDate,
		showContinueReading,
		fontSize,
		headingLineLimit,
		excerptLineLimit,
		readMoreMessage,
		className,
		link,
		cardIsLink,
		hoverStyle,
	} = attributes;

	// Determine the current block style.
	// 'vertical' is default.
	const blockStyle = () => {
		if (className && className.includes('is-style-statistics')) {
			return 'statistics';
		} else if (className && className.includes('is-style-horizontal')) {
			return 'horizontal';
		}
		// Return the default.
		return 'vertical';
	};

	// InnerBlocks Templates.
	let template = defaultTemplate;

	if ('statistics' === blockStyle()) {
		template = statisticsInnerBlocksTemplate;
	}

	const blockProps = useBlockProps({ className: 'zach-card card' });

	return (
		<div {...blockProps}>
			{'statistics' === blockStyle() && (
				<InspectorControls key="inspector-controls">
					<PanelBody title={__('Link Card')}>
						<PanelRow className="zach-card-link-control-row">
							<VStack alignment="topLeft">
								<LinkControl
									className="zach-card-link-control"
									hasTextControl
									hasRichPreviews
									value={link}
									onChange={(link) => setAttributes({ link })}
									suggestionsQuery={{
										type: 'post',
									}}
									style={{ minWidth: 'unset' }}
								/>
								{link?.url && (
									<Button
										isLink
										isDestructive
										variant="secondary"
										size="small"
										onClick={() => {
											setAttributes({ link: undefined });
										}}
									>
										Remove Link
									</Button>
								)}
							</VStack>
						</PanelRow>
						{link?.url && (
							<>
								<PanelRow>
									<ToggleControl
										label={__('Card is Link')}
										help="Should the entire card be a link?"
										checked={cardIsLink}
										onChange={(val) => {
											setAttributes({ cardIsLink: val ? true : false });
										}}
									/>
								</PanelRow>
								<PanelRow>
									<ToggleControl
										label={__('Show continue reading')}
										help="Show a continue reading button at the bottom of the card"
										checked={showContinueReading}
										onChange={(showContinueReading) => setAttributes({ showContinueReading })}
									/>
								</PanelRow>
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
							</>
						)}
					</PanelBody>
				</InspectorControls>
			)}
			{postId && hasQueryAncestor && (
				<InspectorControls key="inspector-controls">
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
								checked={showCategory}
								onChange={(val) => {
									setAttributes({ showCategory: val ? true : false });
								}}
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={__('Show title')}
								checked={showTitle}
								onChange={(val) => {
									setAttributes({ showTitle: val ? true : false });
								}}
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={__('Show continue reading')}
								checked={showContinueReading}
								onChange={(val) => {
									setAttributes({ showContinueReading: val ? true : false });
								}}
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={__('Show author')}
								checked={showAuthor}
								onChange={(val) => {
									setAttributes({ showAuthor: val ? true : false });
								}}
							/>
						</PanelRow>
					</PanelBody>
					<PanelBody title="Appearance Options">
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
									help={__(
										'The number of lines of text to limit the heading to. Zero lines means no limit.',
									)}
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
				</InspectorControls>
			)}
			{postId && hasQueryAncestor ? (
				<ServerSideRender
					block="zach/card"
					attributes={{
						...attributes,
						postId: postId,
						context: 'editor',
					}}
				/>
			) : (
				<div className="card__inner">
					<div className="card__content">
						<div className="card__content-top">
							<InnerBlocks template={template} templateLock="all" />
						</div>
						<div className="card__content-bottom">
							{link?.url && showContinueReading && (
								<div className="wp-block is-style-arrow  wp-block-button ">
									<span className="wp-block-button__link wp-element-button">{readMoreMessage}</span>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default SingleCardedit;
