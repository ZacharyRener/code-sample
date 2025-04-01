/**
 * WordPress dependencies.
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export const save = () => {
	const blockProps = useBlockProps.save();

	return (
		<div {...blockProps}>
			<InnerBlocks.Content />
		</div>
	);
};
