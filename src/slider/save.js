/**
 * WordPress dependencies.
 */
import { InnerBlocks, useBlockProps } from '@wordpress/blockEditor';

/**
 * External dependencies
 */
import clsx from 'clsx';

const save = ({ attributes }) => {
	const { slideWidth, hasScrollbar } = attributes;

	const style = {
		'--bswh--slider--slide--width': slideWidth,
	};

	const classes = clsx('wp-block-zach-slider', { 'display-scrollbar': hasScrollbar });

	const blockProps = useBlockProps.save({ className: classes });

	return (
		<div {...blockProps}>
			<div className="zach-slider" style={style}>
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

export default save;
