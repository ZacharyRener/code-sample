import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import {
	ToggleControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

const allowedBlocks = ['core/column'];

// Add the layoutSeparator attribute.
const addLayoutSeparatorAttribute = (settings, name) => {
	if (allowedBlocks.includes(name)) {
		settings.attributes = {
			...settings.attributes,
			layoutSeparator: {
				type: 'boolean',
				default: false,
			},
		};
	}
	return settings;
};
addFilter(
	'blocks.registerBlockType',
	'zach/add-layout-separator-attribute',
	addLayoutSeparatorAttribute,
);

// Block Controls.
const withLayoutSeparatorControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (!allowedBlocks.includes(props.name)) {
			return <BlockEdit {...props} />;
		}

		const { attributes, setAttributes, clientId } = props;
		const { layoutSeparator } = attributes;

		return (
			<>
				<BlockEdit {...props} />

				<InspectorControls group="border">
					<ToolsPanelItem
						label={__('Layout Separator')}
						isShownByDefault
						hasValue={() => !!layoutSeparator}
						onDeselect={() =>
							setAttributes({
								layoutSeparator: false,
							})
						}
						resetAllFilter={() => ({
							layoutSeparator: false,
						})}
						panelId={clientId}
					>
						<ToggleControl
							label={__('Enable Layout Separator')}
							help={
								layoutSeparator
									? __('Display a thin separator between siblings.')
									: __('Separator is disabled.')
							}
							checked={layoutSeparator}
							onChange={(layoutSeparator) => setAttributes({ layoutSeparator })}
						/>
					</ToolsPanelItem>
				</InspectorControls>
			</>
		);
	};
}, 'withLayoutSeparatorControl');
addFilter('editor.BlockEdit', 'zach/with-layout-separator-control', withLayoutSeparatorControl);

// Add CSS class on save.
const addLayoutSeparatorToSaveProps = (props, blockType, attributes) => {
	if (allowedBlocks.includes(blockType.name) && attributes.layoutSeparator) {
		// Extract top and bottom margins from inline styles
		const { style = {} } = props;
		const { paddingTop, paddingBottom } = style;

		// Create CSS variables for top and bottom margins if they exist
		const cssVariables = {};
		if (paddingTop) {
			cssVariables['--padding-top'] = paddingTop;
		}
		if (paddingBottom) {
			cssVariables['--padding-bottom'] = paddingBottom;
		}

		return {
			...props,
			style: { ...props.style, ...cssVariables },
			className: props.className + ' has-layout-separator',
		};
	}

	// Always return the props.
	return props;
};
addFilter(
	'blocks.getSaveContent.extraProps',
	'zach/add-layout-separator-to-save-props',
	addLayoutSeparatorToSaveProps,
);

// Add the new custom class in the editor, too.
const withLayoutSeparator = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes, style = {} } = props;
		const { layoutSeparator } = attributes;

		// Extract top and bottom margins from inline styles
		const { paddingTop, paddingBottom } = style;

		// Create CSS variables for top and bottom margins if they exist
		const cssVariables = {};
		if (paddingTop) {
			cssVariables['--padding-top'] = paddingTop;
		}
		if (paddingBottom) {
			cssVariables['--padding-bottom'] = paddingBottom;
		}

		if (allowedBlocks.includes(props.name) && layoutSeparator) {
			return (
				<BlockListBlock
					{...props}
					wrapperProps={{
						style: { ...cssVariables },
					}}
					className={'has-layout-separator'}
				/>
			);
		}
		// Always return the original element.
		return <BlockListBlock {...props} />;
	};
}, 'withLayoutSeparator');
wp.hooks.addFilter(
	'editor.BlockListBlock',
	'zach/add-layout-separator-to-edit-block',
	withLayoutSeparator,
);
