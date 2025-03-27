/**
 * WordPress dependencies.
 */
import { sprintf } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { store as editorStore, PluginDocumentSettingPanel } from '@wordpress/editor';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { brush } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import PathRibbonComponent from './pathRibbonComponent.js';
import TableOfContents from './postTableOfContents.js';
import DropcapColor from './postDropcapColor.js';
import FooterCTA from './postFooterCTA.js';

// Register the post style sidebar plugin.
registerPlugin('zach-post-style', {
	render() {
		// Get the post type and the supports of the post type.
		const { postType } = useSelect((select) => {
			const { getEditedPostAttribute } = select(editorStore);
			const { getPostType } = select(coreStore);
			const postType = getPostType(getEditedPostAttribute('type'));

			return {
				postType: postType,
			};
		}, []);

		// List of supported components.
		const supportedComponents = ['path-ribbon', 'table-of-contents', 'footer-cta', 'dropcap-color'];

		// If all components are unsupported, don't display the panel.
		if (supportedComponents.every((component) => !postType?.supports?.[component])) {
			return null;
		}

		return (
			<PluginDocumentSettingPanel
				name="page-style"
				title={sprintf('%s Style', postType?.labels?.singular_name || 'Post')}
				className="page-style"
				icon={brush}
			>
				{!!postType?.supports?.['path-ribbon'] && <PathRibbonComponent />}
				{!!postType?.supports?.['table-of-contents'] && <TableOfContents />}
				{!!postType?.supports?.['footer-cta'] && <FooterCTA />}
				{!!postType?.supports?.['dropcap-color'] && <DropcapColor />}
			</PluginDocumentSettingPanel>
		);
	},
	icon: brush,
});
