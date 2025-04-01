<?php
/**
 * Menu functionality
 *
 * @package zach-theme
 */

/**
 * For the mega menu, add in back links on the mega menu panels.
 *
 * @param string   $nav_menu The HTML content for the navigation menu.
 * @param stdClass $args     An object containing wp_nav_menu() arguments.
 */
function zach_mega_menu_mobile_header( $nav_menu, $args ) {
	// Ensure we are on the main mega menu.
	if ( 'mega-menu-wrap-max_mega_menu_1' !== $args->container_id ) {
		return $nav_menu;
	}
	// Define the regex to match <li.mega-menu-item> and its <a.mega-menu-link> text.
	$pattern_link = '#<li[^>]*class=["\'][^"\']*mega-menu-item[^"\']*["\'][^>]*><a[^>]*class=["\'][^"\']*mega-menu-link[^"\']*["\'][^>]*>(.*?)</a>#i';

	// Define the regex to match the first level <ul class="mega-sub-menu"> inside a <li.mega-menu-item>.
	$pattern_submenu = '#(<li[^>]*class=["\'][^"\']*mega-menu-item[^"\']*["\'][^>]*>)(.*?<ul[^>]*class=["\'][^"\']*mega-sub-menu[^"\']*["\'][^>]*>)(.*?)(</ul>)(.*?</li>)#is';

	// Find all matches for the link text and sub-menu.
	preg_match_all( $pattern_link, $nav_menu, $matches_link, PREG_OFFSET_CAPTURE );

	// Iterate over each match for link text (in case there are multiple items).
	$index    = 0;
	$nav_menu = preg_replace_callback(
		$pattern_submenu,
		function ( $submenu_matches ) use ( $matches_link, &$index ) {
			// Check if there are more links to insert (this assumes one link for each submenu).
			if ( isset( $matches_link[1][ $index ] ) ) {
				$link_text = $matches_link[1][ $index ][0];  // Extract the link text.
				$new_li    = '<li class="mega-menu-row mobile-back"> <a class="back-mega-menu-link" href="#"></a><span class="row-title">' . esc_html( wp_strip_all_tags( $link_text ) ) . '</span></li>'; // Create the new list item.
				$index++; // Move to the next link for the next submenu.
				return $submenu_matches[1] . $submenu_matches[2] . $new_li . $submenu_matches[3] . $submenu_matches[4] . $submenu_matches[5]; // Insert into the submenu.
			}
			return $submenu_matches[0]; // If no more links, return the submenu as is.
		},
		$nav_menu
	);

	return $nav_menu;
}
add_filter( 'wp_nav_menu', 'zach_mega_menu_mobile_header', 10, 2 );

/**
 * Flush Yoast SEO indexables to display breadcrumbs.
 */
if ( class_exists( 'Yoast\WP\SEO\Helpers\Options_Helper' ) ) { 
	add_filter( 'Yoast\WP\SEO\should_index_indexables', '__return_true' );
}
