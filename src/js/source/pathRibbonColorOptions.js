/**
 * Path Ribbon Color Options.
 */

import { __ } from '@wordpress/i18n';

const dropdownColors = [
	{
		label: __('Blue Green Yellow'),
		value: 'cool_1',
		colors: ['#007EB4', '#3F9F90', '#FFB71B'],
	},
	{
		label: __('Purple Green Yellow'),
		value: 'cool_2',
		colors: ['#8F659C', '#3F9F90', '#FFB71B'],
	},
	{
		label: __('Blue Purple Yellow'),
		value: 'cool_3',
		colors: ['#007EB4', '#8F659C', '#FFB71B'],
	},
	{
		label: __('Pink Orange Yellow'),
		value: 'warm_1',
		colors: ['#D5647A', '#FF9527', '#FFB71B'],
	},
	{
		label: __('Purple Pink Yellow'),
		value: 'warm_2',
		colors: ['#8F659C', '#D5647A', '#FFB71B'],
	},
	{
		label: __('Purple Orange Yellow'),
		value: 'warm_3',
		colors: ['#8F659C', '#FF9527', '#FFB71B'],
	},
];

export default dropdownColors;
