import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	SelectControl,
} from '@wordpress/components';

const allowedBlocks = ['core/columns'];

// Add the customBreakpoint attribute.
const addCustomBreakpointAttribute = (settings, name) => {
	if (allowedBlocks.includes(name)) {
		settings.attributes = {
			...settings.attributes,
			customBreakpoint: {
				type: 'number',
				default: 0,
			},
		};
	}
	return settings;
};
addFilter(
	'blocks.registerBlockType',
	'zach/add-custom-breakpoint-attribute',
	addCustomBreakpointAttribute,
);

// Block Controls.
const withCustomBreakpointControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (!allowedBlocks.includes(props.name)) {
			return <BlockEdit {...props} />;
		}

		const { attributes, setAttributes, clientId } = props;
		const { customBreakpoint, isStackedOnMobile } = attributes;

		// If 'Stacked on Mobile' is false, early return.
		// There's no point in setting a custom breakpoint on an element that won't break.
		if (!isStackedOnMobile) {
			setAttributes({
				customBreakpoint: undefined,
			});
			return <BlockEdit {...props} />;
		}

		const label = __('Custom Stacking', 'zach');

		return (
			<>
				<BlockEdit {...props} />

				<InspectorControls group="dimensions">
					<ToolsPanelItem
						label={label}
						isShownByDefault
						hasValue={() => !!customBreakpoint}
						onDeselect={() =>
							setAttributes({
								customBreakpoint: undefined,
							})
						}
						resetAllFilter={() => ({
							customBreakpoint: undefined,
						})}
						panelId={clientId}
					>
						<SelectControl
							label={label}
							help={
								customBreakpoint > 0
									? __(`The columns will stack at ${customBreakpoint} pixels window width.`, 'zach')
									: __('The columns will stack normally.', 'zach')
							}
							value={customBreakpoint}
							options={[
								{ label: __('Use Regular Stacking'), value: 0 },
								{ label: __('Tablet (1024px)'), value: 1024 },
								{ label: __('Mobile (600px)'), value: 600 },
							]}
							onChange={(customBreakpoint) =>
								setAttributes({ customBreakpoint: parseInt(customBreakpoint, 10) })
							}
						/>
					</ToolsPanelItem>
				</InspectorControls>
			</>
		);
	};
}, 'withCustomBreakpointControl');
addFilter('editor.BlockEdit', 'zach/with-custom-breakpoint-control', withCustomBreakpointControl);

// Add CSS variable on save.
const addCustomBreakpointToSaveProps = (props, blockType, attributes) => {
	if (
		allowedBlocks.includes(blockType.name) &&
		attributes.customBreakpoint &&
		attributes.customBreakpoint > 0
	) {
		return {
			...props,
			style: { ...props.style, '--bswh-custom-breakpoint': attributes.customBreakpoint },
			className:
				props.className +
				` has-custom-breakpoint has-custom-breakpoint-${attributes.customBreakpoint}`,
		};
	}

	// always return the props;
	return props;
};
addFilter(
	'blocks.getSaveContent.extraProps',
	'zach/add-custom-breakpoint-to-save-props',
	addCustomBreakpointToSaveProps,
);

// Add the new custom class in the editor, too.
const withCustomBreakpoint = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes } = props;
		const { customBreakpoint } = attributes;

		if (allowedBlocks.includes(props.name) && customBreakpoint && customBreakpoint > 0) {
			return (
				<BlockListBlock
					{...props}
					wrapperProps={{ style: { '--bswh-custom-breakpoint': customBreakpoint } }}
					className={`has-custom-breakpoint has-custom-breakpoint-${customBreakpoint}`}
				/>
			);
		}
		// Always return the original element.
		return <BlockListBlock {...props} />;
	};
}, 'withCustomBreakpoint');

wp.hooks.addFilter(
	'editor.BlockListBlock',
	'zach/add-custom-breakpoint-to-edit-block',
	withCustomBreakpoint,
);
