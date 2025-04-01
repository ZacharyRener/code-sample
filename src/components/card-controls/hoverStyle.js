/**
 * WordPress dependencies.
 */
import { ColorPalette, BaseControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Hover Style Component
const HoverStyle = ({ value, onChange }) => {
	const colors = [
		{
			name: 'White',
			color: 'var(--wp--preset--color--white)',
		},
		{ name: 'Light Yellow', color: 'var(--wp--preset--color--light-yellow)' },
	];

	return (
		<BaseControl
			label={__('Hover Style', 'zach-blocks')}
			help={__('On hover, the color for the content area background.', 'zach-blocks')}
		>
			<ColorPalette
				disableCustomColors={true}
				clearable={false}
				colors={colors}
				value={value}
				onChange={onChange}
			/>
		</BaseControl>
	);
};

export default HoverStyle;
