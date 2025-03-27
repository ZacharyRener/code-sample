import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, ColorPalette } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

const allowedBlocks = ['core/site-logo'];

// Add the colorFill attribute.
const addColorFillAttribute = (settings, name) => {
	if (allowedBlocks.includes(name)) {
		settings.attributes = {
			...settings.attributes,
			colorFill: {
				type: 'string',
			},
		};
	}
	return settings;
};
addFilter('blocks.registerBlockType', 'zach/add-color-fill-attribute', addColorFillAttribute);

// Block Controls.
const withColorFillControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (!allowedBlocks.includes(props.name)) {
			return <BlockEdit {...props} />;
		}

		const { attributes, setAttributes } = props;
		const { colorFill } = attributes;

		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title={__('Fill Color', 'zach')} initialOpen={true}>
						<PanelRow>
							<ColorPalette
								clearable
								help="Select a color to fill the image."
								value={colorFill}
								onChange={(color) => setAttributes({ colorFill: color })}
								colors={[
									{
										color: '#4D4D4F',
										name: 'Dark Gray',
									},
									{
										color: '#fff',
										name: 'White',
									},
								]}
							/>
						</PanelRow>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withColorFillControl');
addFilter('editor.BlockEdit', 'zach/with-color-fill-control', withColorFillControl);
