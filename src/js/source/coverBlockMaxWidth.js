import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls, useSettings } from '@wordpress/block-editor';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';

const allowedBlocks = ['core/cover'];

// Add the innerContainerMaxWidth attribute.
const addInnerContainerMaxWidthAttribute = (settings, name) => {
	if (allowedBlocks.includes(name)) {
		settings.attributes = {
			...settings.attributes,
			innerContainerMaxWidth: {
				type: 'string',
			},
		};
	}
	return settings;
};
addFilter(
	'blocks.registerBlockType',
	'zach/add-inner-container-max-width-attribute',
	addInnerContainerMaxWidthAttribute,
);

// Block Controls.
const withInnerContainerMaxWidthControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (!allowedBlocks.includes(props.name)) {
			return <BlockEdit {...props} />;
		}

		const { attributes, setAttributes, clientId } = props;
		const { innerContainerMaxWidth } = attributes;

		// UnitControl option.
		const [availableUnits] = useSettings('spacing.units');
		const units = useCustomUnits({
			availableUnits: availableUnits || ['px', 'em', 'rem', 'vw', 'vh'],
		});

		return (
			<>
				<BlockEdit {...props} />

				<InspectorControls group="dimensions">
					<ToolsPanelItem
						label={__('Inner Max Width')}
						isShownByDefault
						hasValue={() => !!innerContainerMaxWidth}
						onDeselect={() =>
							setAttributes({
								innerContainerMaxWidth: undefined,
							})
						}
						resetAllFilter={() => ({
							innerContainerMaxWidth: undefined,
						})}
						panelId={clientId}
					>
						<UnitControl
							__next40pxDefaultSize
							label={__('Inner Max Width')}
							help={__(
								'The inner content container max width on desktop. On mobile, it will fill the area',
							)}
							value={innerContainerMaxWidth}
							units={units}
							onChange={(innerContainerMaxWidth) => setAttributes({ innerContainerMaxWidth })}
						/>
					</ToolsPanelItem>
				</InspectorControls>
			</>
		);
	};
}, 'withInnerContainerMaxWidthControl');
addFilter(
	'editor.BlockEdit',
	'zach/with-inner-container-max-width-control',
	withInnerContainerMaxWidthControl,
);

// Add CSS variable on save.
const addInnerContainerMaxWidthToSaveProps = (props, blockType, attributes) => {
	if (allowedBlocks.includes(blockType.name) && attributes.innerContainerMaxWidth) {
		return {
			...props,
			style: { ...props.style, '--inner-container--max-width': attributes.innerContainerMaxWidth },
			className: props.className + '   has-custom-inner-container-max-width ',
		};
	}

	// always return the props;
	return props;
};
addFilter(
	'blocks.getSaveContent.extraProps',
	'zach/add-inner-container-max-width-to-save-props',
	addInnerContainerMaxWidthToSaveProps,
);

// Add the new custom class in the editor, too.
const withInnerContainerMaxWidth = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes } = props;
		const { innerContainerMaxWidth } = attributes;

		if (allowedBlocks.includes(props.name) && innerContainerMaxWidth) {
			return (
				<BlockListBlock
					{...props}
					wrapperProps={{ style: { '--inner-container--max-width': innerContainerMaxWidth } }}
					className={'has-custom-inner-container-max-width'}
				/>
			);
		}
		// Always return the original element.
		return <BlockListBlock {...props} />;
	};
}, 'withInnerContainerMaxWidth');

wp.hooks.addFilter(
	'editor.BlockListBlock',
	'zach/add-inner-container-max-width-to-edit-block',
	withInnerContainerMaxWidth,
);
