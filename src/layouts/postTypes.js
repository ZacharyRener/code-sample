/**
 * Single post curations.
 */

import { __ } from '@wordpress/i18n';

const postTypes = [
	{
		label: __('Posts'),
		value: 'post',
	},
	{
		label: __('Pages'),
		value: 'page',
	},
	{
		label: __('Events'),
		value: 'zach_mission_event',
	},
	{
		label: __('Newsletters'),
		value: 'zach-newsletter',
	},
];

export default postTypes;
