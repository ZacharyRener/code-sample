const { registerBlockVariation } = wp.blocks;
const { createHigherOrderComponent } = wp.compose;

const ZACH_SITE_SEARCH_NAME = 'zach/site-search';

// Register the block variation.
registerBlockVariation('core/search', {
	name: ZACH_SITE_SEARCH_NAME,
	title: 'ZACH Site Search',
	description: 'Searches the site and provides post type options.',
	isActive: ({ namespace }) => {
		return namespace === ZACH_SITE_SEARCH_NAME;
	},
	attributes: {
		label: 'Search',
		showLabel: false,
		buttonText: 'Search',
		buttonPosition: 'button-inside',
		namespace: ZACH_SITE_SEARCH_NAME,
	},
});

// Adds a `namespace` attribute to the core/search block so we can verifying using the variation.
wp.hooks.addFilter('blocks.registerBlockType', 'zach/site-search-block', (settings, name) => {
	if (name === 'core/search') {
		return { ...settings, attributes: { ...settings.attributes, namespace: { type: 'string' } } };
	}
	return settings;
});

const SearchSiteRadioOptions = () => {
	return (
		<div className="zach-site-search-post-types">
			<label>
				<input type="radio" name="search_option" value="news" />
				News and Stories only
			</label>
			<label>
				<input type="radio" name="search_option" value="events" />
				Events only
			</label>
			<label>
				<input type="radio" name="search_option" value="areas-of-support" />
				Areas to Support only
			</label>
			<label>
				<input type="radio" name="search_option" value="compass" />
				Compass Issues only
			</label>
			<label>
				<input type="radio" name="search_option" value="all" />
				Search all foundations
			</label>
		</div>
	);
};

// Filter the Edit function to add the radio buttons.
const blockEditFilter = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (props.attributes.namespace !== ZACH_SITE_SEARCH_NAME) {
			return <BlockEdit {...props} />;
		}
		return (
			<div className="zach-site-search">
				<BlockEdit key="edit" {...props} />
				<SearchSiteRadioOptions />
			</div>
		);
	};
}, 'withMyPluginControls');

wp.hooks.addFilter('editor.BlockEdit', 'zach/site-search-block', blockEditFilter);
