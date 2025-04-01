/**
 * Single post layouts.
 */

const { __ } = wp.i18n; // Import __() from wp.i18n

const layouts = [
	{
		label: __('Horizontal'),
		value: 'horizontal',
	},
	{
		label: __('Vertical'),
		value: 'vertical',
	},
];

export default layouts;
