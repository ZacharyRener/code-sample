/**
 * Turn on and off the table-of-contents.
 */
import { store as coreStore, useEntityProp } from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { ToggleControl, BaseControl, PanelRow } from '@wordpress/components';

const TableOfContents = () => {
	const { supportsPageAttributes, postType } = useSelect((select) => {
		const { getEditedPostAttribute } = select(editorStore);
		const { getPostType } = select(coreStore);
		const postType = getPostType(getEditedPostAttribute('type'));

		return {
			postType: postType,
			supportsPageAttributes: !!postType?.supports?.['table-of-contents'],
		};
	}, []);

	// Only render fields if post type supports page attributes or available templates exist.
	if (!supportsPageAttributes || !postType) {
		return null;
	}

	// Table of Contents enable meta key registered in PHP.
	const meta_key = 'zach_enable_toc';

	const [meta, setMeta] = useEntityProp('postType', postType.slug, 'meta');

	// The value of the zach_enable_toc meta.
	const zach_enable_toc = meta[meta_key];

	// Update the zach_enable_toc value.
	const updateMetaValue = (newValue) => {
		setMeta({ ...meta, zach_enable_toc: newValue });
	};

	return (
		<PanelRow>
			<BaseControl __nextHasNoMarginBottom label="Table of Contents">
				<ToggleControl
					label="Display on Post."
					help={
						zach_enable_toc
							? 'Show the Table of Contents for H2 elements.'
							: 'Hide the Table of Contents.'
					}
					checked={zach_enable_toc}
					onChange={(state) => {
						updateMetaValue(state);
					}}
				/>
			</BaseControl>
		</PanelRow>
	);
};

export default TableOfContents;
