// Disallow blocks in non-FSE template post types.
(function (wp) {
	const { addFilter } = wp.hooks;
	const { select, subscribe } = wp.data;
	const { unregisterBlockType } = wp.blocks;

	// Disallowed Blocks.
	const disallowedBlocks = ['core/search', 'zach/byline'];

	/**
	 * Checks if the current post type allows restricted blocks.
	 *
	 * @returns {boolean} - True if the post type allows restricted blocks.
	 */
	const isAllowedPostType = () => {
		const coreEditSite = select('core/edit-site');

		return typeof coreEditSite !== 'undefined';
	};

	/**
	 * Unregisters restricted blocks if the post type is not allowed.
	 */
	const unregisterRestrictedBlocks = () => {
		if (isAllowedPostType()) {
			return;
		}

		disallowedBlocks.forEach((blockName) => {
			if (wp.blocks.getBlockType(blockName)) {
				unregisterBlockType(blockName);
			}
		});
	};

	// Hook into blocks.registerBlockType to check and unregister blocks
	addFilter('blocks.registerBlockType', 'zach/restrict-block-insertion', (settings, name) => {
		if (disallowedBlocks.includes(name)) {
			// Ensure execution after registration.
			setTimeout(unregisterRestrictedBlocks, 0);
		}
		return settings;
	});

	// Subscribe to editor state changes to unregister blocks dynamically.
	const unsubscribe = subscribe(() => {
		unregisterRestrictedBlocks();
		// Run only once.
		unsubscribe();
	});
})(window.wp);
