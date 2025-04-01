/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { Dropdown, ToolbarButton, ToggleControl } from '@wordpress/components';

/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * Local dependencies.
 */
import { ZachIcon } from '../components/zach-icon';
import IconPicker from './iconPicker';
import './editor.scss';

const Edit = ({ attributes, setAttributes }) => {
	// Block attributes.
	const { icon, size, usePreferableColor } = attributes;

	const iconClasses = clsx('zach-icon', usePreferableColor && 'use-preferable-color');

	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<BlockControls>
				<Dropdown
					className="zach-icon-dropdown"
					contentClassName="zach-icon-dropdown-content"
					headerTitle={__('Select Icon')}
					popoverProps={{ placement: 'bottom-start' }}
					renderToggle={({ isOpen, onToggle }) => (
						<ToolbarButton onClick={onToggle} aria-expanded={isOpen}>
							Select Icon
						</ToolbarButton>
					)}
					renderContent={() => (
						<IconPicker value={icon} setIcon={(icon) => setAttributes({ icon })} />
					)}
				/>
			</BlockControls>
			<InspectorControls group="advanced">
				<ToggleControl
					__nextHasNoMarginBottom
					label="Use Preferred Color"
					help="Use an accesible preferred path color based on the parent element's background color."
					checked={usePreferableColor}
					onChange={(usePreferableColor) => setAttributes({ usePreferableColor })}
				/>
			</InspectorControls>
			<ZachIcon className={iconClasses} icon={icon} size={size} />
		</div>
	);
};

export default Edit;
