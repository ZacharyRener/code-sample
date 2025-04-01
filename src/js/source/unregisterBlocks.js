// Unregister entirely.
wp.domReady(() => {
	// Login/Logout navigation.
	wp.blocks.unregisterBlockType('core/loginout');

	// Navigation submenu.
	wp.blocks.unregisterBlockType('core/navigation-submenu');
});
