/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import LayoutEdit from './edit';
import metadata from './block.json';
import postTypes from './postTypes.js';

import './style.scss';

/**
 * Register the block type using the block.json file.
 */
registerBlockType(metadata, {
	edit: LayoutEdit,
	save: function () {
		return null;
	},
	__experimentalLabel: (attributes, { context }) => {
		const { postType, curationType, curation, layout } = attributes;

		const postTypeObject = postTypes.find((option) => option.value === postType);

		// In the list view, use the block's name attribute as the label.
		if (context === 'list-view') {
			// Construct the label, then convert each word's first letter to uppercase.
			return sprintf(
				'Layout: %s - %s %s - %s',
				postTypeObject.label ?? 'Post',
				curationType,
				curation,
				layout,
			)
				.split(' ')
				.map((word) => {
					return word[0].toUpperCase() + word.substring(1);
				})
				.join(' ');
		}
	},
});
