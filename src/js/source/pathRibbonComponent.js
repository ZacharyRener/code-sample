/**
 * Path Ribbon Component.
 */

import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { ComboboxControl } from '@wordpress/components';
import {
	__experimentalZStack as ZStack,
	__experimentalHStack as HStack,
	Button,
	BaseControl,
} from '@wordpress/components';
import { Icon, closeSmall } from '@wordpress/icons';

import dropdownColors from './pathRibbonColorOptions.js';

const Avatar = ({ backgroundColor }) => {
	return (
		<div
			style={{
				backgroundColor,
				width: '20px',
				height: '20px',
				borderRadius: '50%',
				border: '1px solid black',
			}}
		/>
	);
};

const withMetaField = createHigherOrderComponent((WrappedComponent) => {
	return (props) => {
		// Get the current post type using useSelect
		const postType = useSelect((select) => {
			const currentPost = select('core/editor').getCurrentPost();
			return currentPost?.type || null;
		});

		// Retrieve and update the meta field for the current post type
		const [meta, setMeta] = useEntityProp('postType', postType, 'meta');
		const customMetaValue = meta?.path_ribbon_color || '';

		const updateMetaValue = (newValue) => {
			setMeta({ ...meta, path_ribbon_color: newValue });
		};

		return (
			<WrappedComponent
				{...props}
				customMetaValue={customMetaValue}
				updateMetaValue={updateMetaValue}
			/>
		);
	};
}, 'withMetaField');

// export default withMetaField;

const PathRibbonComponent = ({ customMetaValue, updateMetaValue }) => {
	// Define static options for ComboboxControl

	const currentScheme = dropdownColors.find((item) => item.value === customMetaValue);

	const componentLabel = __('Ribbon Path Color Scheme', 'zach');

	// Return the component by itself if it is already set.
	// If we need to set the meta value, show the Combobox.
	return (
		<div>
			{customMetaValue && currentScheme ? (
				<BaseControl label={componentLabel}>
					<HStack>
						<div className="combobox-render-item">
							<ZStack offset={15} isLayered>
								<Avatar backgroundColor={currentScheme.colors[0]} />
								<Avatar backgroundColor={currentScheme.colors[1]} />
								<Avatar backgroundColor={currentScheme.colors[2]} />
							</ZStack>
							<div className="combobox-render-item-details">
								<small>{currentScheme.label}</small>
							</div>
						</div>
						<Button
							label={__('Reset')}
							size="small"
							isDestructive
							onClick={() => updateMetaValue(undefined)}
						>
							<Icon icon={closeSmall} />
						</Button>
					</HStack>
				</BaseControl>
			) : (
				<ComboboxControl
					label={componentLabel}
					value={customMetaValue} // Current value of the meta field
					options={dropdownColors} // Predefined options
					onChange={(newValue) => updateMetaValue(newValue)} // Update meta field
					allowReset={true} // Allow resetting to no value
					__experimentalRenderItem={({ item }) => {
						const { label, colors } = item;
						return (
							<div className="combobox-render-item">
								<ZStack offset={15} isLayered>
									<Avatar backgroundColor={colors[0]} />
									<Avatar backgroundColor={colors[1]} />
									<Avatar backgroundColor={colors[2]} />
								</ZStack>
								<div className="combobox-render-item-details">
									<small>{label}</small>
								</div>
							</div>
						);
					}}
				/>
			)}
		</div>
	);
};

export default withMetaField(PathRibbonComponent);
