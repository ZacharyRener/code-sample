/**
 * Turn on and off the table-of-contents.
 */
import { store as coreStore, useEntityProp } from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { ColorPalette, BaseControl, PanelRow } from '@wordpress/components';

const DropcapColor = () => {
	const { supportsDropcapColor, postType } = useSelect((select) => {
		const { getEditedPostAttribute } = select(editorStore);
		const { getPostType } = select(coreStore);
		const postType = getPostType(getEditedPostAttribute('type'));

		return {
			postType: postType,
			supportsDropcapColor: !!postType?.supports?.['dropcap-color'],
		};
	}, []);

	// Only render fields if post type supports page attributes or available templates exist.
	if (!supportsDropcapColor || !postType) {
		return null;
	}

	// Table of Contents enable meta key registered in PHP.
	const meta_key = 'zach_dropcap_color';

	const [meta, setMeta] = useEntityProp('postType', postType.slug, 'meta');

	// The value of the zach_dropcap_color meta.
	const zach_dropcap_color = meta[meta_key];

	// Update the zach_dropcap_color value.
	const updateMetaValue = (newValue) => {
		setMeta({ ...meta, zach_dropcap_color: newValue });
	};

	return (
		<PanelRow>
			<BaseControl __nextHasNoMarginBottom label="Dropcap Color">
				<ColorPalette
					__experimentalIsRenderedInSidebar
					clearable={false}
					disableCustomColors={true}
					value={zach_dropcap_color}
					onChange={(color) => updateMetaValue(color)}
					colors={[
						{
							color: '#3F9F90',
							name: 'Green',
						},
					]}
				/>
			</BaseControl>
		</PanelRow>
	);
};

export default DropcapColor;
