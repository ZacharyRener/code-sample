/**
 * Animation Component.
 */

import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { ToggleControl, TextControl, PanelRow } from '@wordpress/components';

const withMetaField = createHigherOrderComponent((WrappedComponent) => {
	return (props) => {
		// Get the current post type using useSelect
		const postType = useSelect((select) => {
			const currentPost = select('core/editor').getCurrentPost();
			return currentPost?.type || null;
		});

		// Retrieve and update the meta field for the current post type
		const [meta, setMeta] = useEntityProp('postType', postType, 'meta');
		const animationEnabled = meta?.animation_enabled || false;
		const animationDelay = meta?.animation_delay || '';

		const updateMetaValue = (key, newValue) => {
			setMeta({ ...meta, [key]: newValue });
		};

		return (
			<WrappedComponent
				{...props}
				animationEnabled={animationEnabled}
				animationDelay={animationDelay}
				updateMetaValue={updateMetaValue}
			/>
		);
	};
}, 'withMetaField');

const AnimationComponent = ({ animationEnabled, animationDelay, updateMetaValue }) => {
	return (
		<div>
			<PanelRow>
				<ToggleControl
					label={__('Animate In', 'zach')}
					checked={animationEnabled}
					onChange={(value) => updateMetaValue('animation_enabled', value)}
				/>
			</PanelRow>
			{animationEnabled && (
				<PanelRow>
					<TextControl
						label={__('Delay (ms)', 'zach')}
						value={animationDelay}
						onChange={(value) => updateMetaValue('animation_delay', value)}
						type="number"
						placeholder="200"
					/>
				</PanelRow>
			)}
		</div>
	);
};

export default withMetaField(AnimationComponent);