/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Local dependencies.
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

import './style.scss';

registerBlockType(metadata, {
	edit: Edit,
	save,
});
