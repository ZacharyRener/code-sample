import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { ToggleControl, PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { parse } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';

const allowedBlocks = ['core/navigation'];

// Add the useParentMenu and parentRef attributes.
const addUseParentMenu = (settings, name) => {
	if (allowedBlocks.includes(name)) {
		settings.attributes = {
			...settings.attributes,
			useParentMenu: {
				type: 'boolean',
				default: false,
			},
		};
	}
	return settings;
};
addFilter('blocks.registerBlockType', 'zach/add-use-parent-menu-attribute', addUseParentMenu);

// Utility to recursively find a block by name.
const findBlockRecursively = (blocks, blockName) => {
	for (const block of blocks) {
		if (block.name === blockName) {
			return block;
		}
		if (block.innerBlocks?.length) {
			const found = findBlockRecursively(block.innerBlocks, blockName);
			if (found) {
				return found;
			}
		}
	}
	return null;
};

// Utility to check if the parent post has a core/navigation block.
export const getParentNavigationBlock = (select) => {
	const coreEditor = select('core/editor');
	const coreData = select('core');
	const postId = coreEditor.getCurrentPostId();
	const postType = coreEditor.getCurrentPostType();

	// Fetch the current post's details.
	const post = coreData.getEntityRecord('postType', postType, postId);
	if (!post || !post.parent) {
		return { parentHasNavigation: false, parentNavigationRef: null };
	}

	// Fetch the parent post's block list.
	const parentPost = coreData.getEntityRecord('postType', postType, post.parent);
	if (!parentPost) {
		return { parentHasNavigation: false, parentNavigationRef: null };
	}

	// Parse the parent's raw content into blocks.
	const parentBlocks = parse(parentPost.content.raw);
	const navigationBlock = findBlockRecursively(parentBlocks, 'core/navigation');

	if (navigationBlock && navigationBlock.attributes.ref) {
		return {
			parentHasNavigation: true,
			parentNavigationRef: navigationBlock.attributes.ref,
		};
	}

	return { parentHasNavigation: false, parentNavigationRef: null };
};

// Block Controls.
const withUseParentMenuControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (!allowedBlocks.includes(props.name)) {
			return <BlockEdit {...props} />;
		}

		const { attributes, setAttributes } = props;
		const { useParentMenu, ref } = attributes;

		// Fetch the parent post's navigation block information.
		const { parentHasNavigation, parentNavigationRef } = useSelect((select) =>
			getParentNavigationBlock(select),
		);

		// Ensure that the attribute is in sync with the ref attribute in the way we want it to be.
		useEffect(() => {
			// Only run this if there is a parent navigation ref.
			if (!!parentHasNavigation && parentNavigationRef) {
				// If the attribute is true...
				// And the ref's do not match.
				if (useParentMenu && ref !== parentNavigationRef) {
					// Match the refs.
					setAttributes({ ref: parentNavigationRef });
				}

				// If the attribute is false.
				// And the ref's do match...
				if (!useParentMenu && ref === parentNavigationRef) {
					// Match the refs.
					setAttributes({ ref: undefined });
				}
			}
		}, [useParentMenu]);

		// Now, if `ref` is the attribute to change...
		useEffect(() => {
			// Only run this if there is a parent navigation ref.
			if (!!parentHasNavigation && parentNavigationRef) {
				// If the attribute is false, but should be true...
				if (!useParentMenu && ref === parentNavigationRef) {
					// Match the refs.
					setAttributes({ useParentMenu: true });
				}

				// If the attribute is true, but should be false ...
				if (useParentMenu && ref !== parentNavigationRef) {
					// Match the refs.
					setAttributes({ useParentMenu: false });
				}
			}
		}, [ref]);

		return (
			<>
				<BlockEdit {...props} />

				{parentHasNavigation && (
					<InspectorControls group="list">
						<PanelBody>
							<ToggleControl
								label={__('Use Parent Menu', 'zach')}
								help={
									useParentMenu
										? __('Match the Navigation Menu used on the Parent.')
										: __('Do not match the Navigation Menu sed on the Parent.')
								}
								checked={useParentMenu}
								onChange={() => {
									setAttributes({ useParentMenu: !useParentMenu });
								}}
							/>
						</PanelBody>
					</InspectorControls>
				)}
			</>
		);
	};
}, 'withUseParentMenuControl');
addFilter('editor.BlockEdit', 'zach/with-use-parent-menu-control', withUseParentMenuControl);

// Add CSS variable on save.
const addUseParentMenuToSaveProps = (props, blockType, attributes) => {
	if (allowedBlocks.includes(blockType.name) && attributes.useParentMenu && attributes.ref) {
		return {
			...props,
			'data-parent-menu-ref': attributes.ref,
		};
	}

	return props;
};
addFilter(
	'blocks.getSaveContent.extraProps',
	'zach/add-use-parent-menu-to-save-props',
	addUseParentMenuToSaveProps,
);
