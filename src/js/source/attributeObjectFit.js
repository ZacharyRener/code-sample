import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import {
	ToggleControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

const allowedBlocks = ['core/image'];

// Add the objectFit attribute.
const addObjectFitAttribute = (settings, name) => {
	if (allowedBlocks.includes(name)) {
		settings.attributes = {
			...settings.attributes,
			objectFit: {
				type: 'boolean',
				default: false,
			},
		};
	}
	return settings;
};
addFilter('blocks.registerBlockType', 'zach/add-object-fit-attribute', addObjectFitAttribute);

// Block Controls.
const withObjectFitControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (!allowedBlocks.includes(props.name)) {
			return <BlockEdit {...props} />;
		}

		const { attributes, setAttributes, clientId } = props;
		const { objectFit } = attributes;

		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls group="dimensions">
					<ToolsPanelItem
						label={__('Object Fit', 'zach')}
						isShownByDefault
						hasValue={() => !!objectFit}
						onDeselect={() => setAttributes({ objectFit: false })}
						resetAllFilter={() => ({ objectFit: false })}
						panelId={clientId}
					>
						<ToggleControl
							label={__('Enable Object Fit', 'zach')}
							help={__('Image will fill the available space, possibly cropping itself', 'zach')}
							checked={objectFit}
							onChange={(value) => setAttributes({ objectFit: value })}
						/>
					</ToolsPanelItem>
				</InspectorControls>
			</>
		);
	};
}, 'withObjectFitControl');
addFilter('editor.BlockEdit', 'zach/with-object-fit-control', withObjectFitControl);

// Add CSS class and variable on save.
const addObjectFitToSaveProps = (props, blockType, attributes) => {
	if (allowedBlocks.includes(blockType.name) && attributes.objectFit) {
		return {
			...props,
			style: { ...props.style, '--image-object-fit': 'cover' },
			className: `${props.className || ''} has-object-fit`.trim(),
		};
	}
	return props;
};
addFilter(
	'blocks.getSaveContent.extraProps',
	'zach/add-object-fit-to-save-props',
	addObjectFitToSaveProps,
);

// Add the new custom class in the editor.
const withObjectFitClass = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes } = props;
		const { objectFit } = attributes;

		if (allowedBlocks.includes(props.name) && objectFit) {
			return (
				<BlockListBlock
					{...props}
					wrapperProps={{ style: { '--image-object-fit': 'cover' } }}
					className={`${props.className || ''} has-object-fit`.trim()}
				/>
			);
		}
		return <BlockListBlock {...props} />;
	};
}, 'withObjectFitClass');

addFilter('editor.BlockListBlock', 'zach/add-object-fit-to-edit-block', withObjectFitClass);
