/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies.
 */
import SingleCardedit from './edit';
import metadata from './block.json';
import { save } from './save';

registerBlockType(metadata, {
	edit: SingleCardedit,
	save,
});
