/**
 * WordPress dependencies
 */
/**
 * External dependencies
 */
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
/**
 * External dependencies
 */

const enableSidebarSelectOnBlocks = [ 'core/heading', 'core/paragraph', 'core/buttons', 'core/button', 'core/list-item', 'zach/zach-icon' ];

/**
 * Declare our custom attribute
 *
 * @param  settings
 * @param  name
 */
const setSidebarSelectAttribute = ( settings, name ) => {
	if ( ! enableSidebarSelectOnBlocks.includes( name ) ) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			animation: {
				type: 'string',
				default: '',
			},
			delay: {
				type: 'string',
				default: '',
			},
		},
	};
};

wp.hooks.addFilter(
	'blocks.registerBlockType',
	'custom-attributes/set-sidebar-select-attribute',
	setSidebarSelectAttribute
);

/**
 * Animation Selector Component
 *
 * @param  root0
 * @param  root0.attributes
 * @param  root0.setAttributes
 */
const AnimationComponent = ( { attributes, setAttributes } ) => {
	return (
		<>
			<SelectControl
				label="Animation"
				value={ attributes.animation }
				options={ [
					{ label: 'None', value: '' },
					{ label: 'Fade', value: 'zach-fade-in' },
					{ label: 'Zoom In', value: 'zoom-in' },
					{ label: 'Slide Up', value: 'slide-up' },
				] }
				onChange={ ( value ) => setAttributes( { animation: value } ) }
			/>
			{ attributes.animation && (
				<TextControl
					label="Delay (ms)"
					value={ attributes.delay }
					onChange={ ( value ) => setAttributes( { delay: value } ) }
					type="number"
				/>
			) }
		</>
	);
};

/**
 * Add Custom Select to Media/Text Sidebar
 */
const withSidebarSelect = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( ! enableSidebarSelectOnBlocks.includes( props.name ) ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody title={ __( 'Animation' ) } className="panel-body-with-zr-logo">
						<AnimationComponent attributes={ props.attributes } setAttributes={ props.setAttributes } />
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withSidebarSelect' );

wp.hooks.addFilter( 'editor.BlockEdit', 'custom-attributes/with-sidebar-select', withSidebarSelect );

/**
 * Add custom classes to block in Edit
 */
const withSidebarSelectProp = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		if ( ! enableSidebarSelectOnBlocks.includes( props.name ) ) {
			return <BlockListBlock { ...props } />;
		}

		const { attributes } = props;
		const { animation, delay } = attributes;

		// Construct class names
		const animationClass = animation ? `has-animation-${ animation }` : '';
		const delayClass = delay ? `has-delay-${ delay }` : '';

		return <BlockListBlock { ...props } className={ classnames( props.className, animationClass, delayClass ) } />;
	};
}, 'withSidebarSelectProp' );

wp.hooks.addFilter(
	'editor.BlockListBlock',
	'custom-attributes/with-sidebar-select-prop',
	withSidebarSelectProp
);

/**
 * Save our custom classes
 *
 * @param  extraProps
 * @param  blockType
 * @param  attributes
 */
const saveSidebarSelectAttribute = ( extraProps, blockType, attributes ) => {
	if ( enableSidebarSelectOnBlocks.includes( blockType.name ) ) {
		const { animation, delay } = attributes;

		const animationClass = animation ? `has-animation-${ animation }` : '';
		const delayClass = delay ? `has-delay-${ delay }` : '';

		extraProps.className = classnames( extraProps.className, animationClass, delayClass );
	}
	return extraProps;
};

wp.hooks.addFilter(
	'blocks.getSaveContent.extraProps',
	'custom-attributes/save-sidebar-select-attribute',
	saveSidebarSelectAttribute
);
