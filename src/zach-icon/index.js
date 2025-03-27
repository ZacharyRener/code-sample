/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';
import { sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Edit from './edit';
import { save } from './save';
import metadata from './block.json';
import { labelForIcon } from '../components/zach-icon/library';

import './style.scss';

registerBlockType(metadata, {
	edit: Edit,
	save,
	__experimentalLabel: (attributes, { context }) => {
		const { icon } = attributes;
		if (context === 'list-view') {
			return sprintf('Icon - %s', labelForIcon(icon));
		}
	},
});
