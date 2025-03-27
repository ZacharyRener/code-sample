/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	useSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';

/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * Internal dependencies.
 */
import './editor.scss';

const Edit = ({ attributes, setAttributes }) => {
	const { layout, slideWidth, hasScrollbar } = attributes;

	const style = {
		'--bswh--slider--slide--width': slideWidth,
	};

	const classes = clsx('wp-block-zach-slider', { 'display-scrollbar': hasScrollbar });

	const blockProps = useBlockProps({ className: classes });

	const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps, {
		orientation: layout ?? 'horizontal',
		className: 'zach-slider 1',
		class: 'zach-slider 2',
	});

	// UnitControl option.
	const [availableUnits] = useSettings('spacing.units');
	const units = useCustomUnits({
		availableUnits: availableUnits || ['px', 'em', 'rem', 'vw', 'vh'],
	});

	return (
		<div {...blockProps}>
			<InspectorControls key="inspector-controls">
				<PanelBody title={__('Layout')}>
					<PanelRow>
						<ToggleControl
							label={__('Scrollbar')}
							checked={hasScrollbar}
							help={hasScrollbar ? 'Scollbar will display' : 'Scrollbar will be hidden'}
							onChange={(value) => setAttributes({ hasScrollbar: value })}
						/>
					</PanelRow>
					<PanelRow>
						<UnitControl
							label={__('Slide Width')}
							value={slideWidth}
							units={units}
							onChange={(slideWidth) => setAttributes({ slideWidth })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...innerBlocksProps} className="zach-slider" style={style}>
				{children}
			</div>
		</div>
	);
};

export default Edit;
