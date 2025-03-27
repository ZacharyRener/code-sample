/**
 * Single post curations.
 */

import { __ } from '@wordpress/i18n';

const curations = [
	{
		label: __('Recent Posts'),
		value: 'default',
	},
	{
		label: __('Category'),
		value: 'category',
	},
	{
		label: __('Tags'),
		value: 'post_tag',
	},
	{
		label: __('Areas to Support'),
		value: 'area_of_support',
	},
	{
		label: __('Archive Query'),
		value: 'query',
	},
];

export default curations;
