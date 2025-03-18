/* Add custom attribute to media-text block, in Sidebar */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

// Enable custom attributes on Image block
const enableSidebarSelectOnBlocks = [ 'core/media-text' ];

import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/blockEditor';
import { PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import PathRibbonComponent from './pathRibbonComponent.js';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Declare our custom attribute
 *
 * @param  settings
 * @param  name
 */
const setSidebarSelectAttribute = ( settings, name ) => {
	// Do nothing if it's another block than our defined ones.
	if ( ! enableSidebarSelectOnBlocks.includes( name ) ) {
		return settings;
	}

	return Object.assign( {}, settings, {
		attributes: Object.assign( {}, settings.attributes, {
			colors: { type: 'string', default: '' },
		} ),
	} );
};

wp.hooks.addFilter(
	'blocks.registerBlockType',
	'custom-attributes/set-sidebar-select-attribute',
	setSidebarSelectAttribute,
);

/**
 * Add Custom Select to Media/Text Sidebar
 */
const withSidebarSelect = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		// If current block is not allowed
		const isFrontPage = useSelect( ( select ) => {
			const currentPostId = select( 'core/editor' ).getCurrentPostId();
			const siteData = select( 'core' ).getEntityRecord( 'root', 'site' );
			return siteData?.page_on_front === currentPostId;
		}, [] );
		if (
			! enableSidebarSelectOnBlocks.includes( props.name )
		) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody title={ __( 'Path Ribbon' ) } className="panel-body-with-zr-logo">
						<PathRibbonComponent />
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withSidebarSelect' );

wp.hooks.addFilter( 'editor.BlockEdit', 'custom-attributes/with-sidebar-select', withSidebarSelect );

/**
 * Add custom class to block in Edit
 */
const withSidebarSelectProp = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		// If current block is not allowed
		if ( ! enableSidebarSelectOnBlocks.includes( props.name ) ) {
			return <BlockListBlock { ...props } />;
		}

		const meta = useEntityProp( 'postType', 'page', 'meta' );
		const { attributes } = props;
		const { colors } = attributes;

		if ( colors ) {
			return <BlockListBlock { ...props } className={ meta[ 0 ].path_ribbon_color } />;
		}
		return <BlockListBlock { ...props } />;
	};
}, 'withSidebarSelectProp' );

wp.hooks.addFilter(
	'editor.BlockListBlock',
	'custom-attributes/with-sidebar-select-prop',
	withSidebarSelectProp,
);

/**
 * Save our custom attribute
 *
 * @param  extraProps
 * @param  blockType
 * @param  attributes
 */
const saveSidebarSelectAttribute = ( extraProps, blockType, attributes ) => {
	// Do nothing if it's another block than our defined ones.
	if ( enableSidebarSelectOnBlocks.includes( blockType.name ) ) {
		const { colors } = attributes;
		if ( colors ) {
			extraProps.className = classnames( extraProps.className, 'has-option-' + colors );
		}
	}

	return extraProps;
};
wp.hooks.addFilter(
	'blocks.getSaveContent.extraProps',
	'custom-attributes/save-sidebar-select-attribute',
	saveSidebarSelectAttribute,
);
