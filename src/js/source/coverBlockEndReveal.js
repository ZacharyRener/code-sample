import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	ToggleControl,
} from '@wordpress/components';

const allowedBlocks = ['core/cover'];

// Add the revealTopImageOnMobile attribute.
const addRevealTopImageOnMobileAttribute = (settings, name) => {
	if (allowedBlocks.includes(name)) {
		settings.attributes = {
			...settings.attributes,
			revealTopImageOnMobile: {
				type: 'boolean',
				default: false,
			},
		};
	}
	return settings;
};
addFilter(
	'blocks.registerBlockType',
	'zach/add-reveal-top-image-on-mobile-attribute',
	addRevealTopImageOnMobileAttribute,
);

// Block Controls.
const withRevealTopImageOnMobileControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (!allowedBlocks.includes(props.name)) {
			return <BlockEdit {...props} />;
		}

		const { attributes, setAttributes, clientId } = props;
		const { revealTopImageOnMobile } = attributes;

		return (
			<>
				<BlockEdit {...props} />

				<InspectorControls group="dimensions">
					<ToolsPanelItem
						label={__('Reveal Top Image on Mobile', 'zach')}
						isShownByDefault
						hasValue={() => !!revealTopImageOnMobile}
						onDeselect={() =>
							setAttributes({
								revealTopImageOnMobile: false,
							})
						}
						resetAllFilter={() => ({
							revealTopImageOnMobile: false,
						})}
						panelId={clientId}
					>
						<ToggleControl
							label={__('Reveal more of image on mobile')}
							help={__('Add extra top padding on mobile to reveal more of the image.')}
							checked={revealTopImageOnMobile}
							onChange={(revealTopImageOnMobile) => setAttributes({ revealTopImageOnMobile })}
						/>
					</ToolsPanelItem>
				</InspectorControls>
			</>
		);
	};
}, 'withRevealTopImageOnMobileControl');
addFilter(
	'editor.BlockEdit',
	'zach/with-reveal-top-image-on-mobile-control',
	withRevealTopImageOnMobileControl,
);

// Add CSS class on save.
const addRevealTopImageOnMobileToSaveProps = (props, blockType, attributes) => {
	if (allowedBlocks.includes(blockType.name) && attributes.revealTopImageOnMobile) {
		return {
			...props,
			className: `${props.className} has-reveal-top-image-mobile`,
		};
	}

	// always return the props;
	return props;
};
addFilter(
	'blocks.getSaveContent.extraProps',
	'zach/add-reveal-top-image-on-mobile-to-save-props',
	addRevealTopImageOnMobileToSaveProps,
);

// Add the new custom class in the editor, too.
const withRevealTopImageOnMobile = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes } = props;
		const { revealTopImageOnMobile } = attributes;

		if (allowedBlocks.includes(props.name) && revealTopImageOnMobile) {
			return (
				<BlockListBlock {...props} className={`${props.className} has-reveal-top-image-mobile`} />
			);
		}
		// Always return the original element.
		return <BlockListBlock {...props} />;
	};
}, 'withRevealTopImageOnMobile');

wp.hooks.addFilter(
	'editor.BlockListBlock',
	'zach/add-reveal-top-image-on-mobile-to-edit-block',
	withRevealTopImageOnMobile,
);
