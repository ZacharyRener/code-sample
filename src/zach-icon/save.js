/**
 * WordPress dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Local dependencies.
 */
import { ZachIcon } from '../components/zach-icon';

/**
 * External dependencies
 */
import clsx from 'clsx';

export const save = ({ attributes }) => {
	// Block attributes.
	const { icon, size, usePreferableColor } = attributes;

	const classes = clsx(
		'zach-icon',
		usePreferableColor && 'use-preferable-color',
		`bshw-icon-${icon}`,
	);

	const blockProps = useBlockProps.save({ className: classes, 'data-icon': icon });

	return <ZachIcon {...blockProps} icon={icon} size={size} />;
};
