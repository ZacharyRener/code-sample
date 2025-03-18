<?php
/**
 * Registers solely admin side functionality.
 *
 * @package zach-theme
 */

/**
 * Register and enqueue the editor stylesheet in the WordPress admin.
 */
function zach_enqueue_admin_editor_style() {
	$stylesheet      = get_stylesheet_directory_uri() . '/build/editorStyle.css';
	$stylesheet_path = get_stylesheet_directory() . '/build/editorStyle.css';
	// Admin stylesheet.
	wp_enqueue_style( 'zach-editor-style', $stylesheet, [], filemtime( $stylesheet_path ) );
}
add_action( 'admin_enqueue_scripts', 'zach_enqueue_admin_editor_style' );

/**
 * Register and enqueue the editor stylesheet in the WordPress admin.
 */
function zach_enqueue_block_editor_assets() {
	$script      = get_stylesheet_directory_uri() . '/build/editorScript.js';
	$script_path = get_stylesheet_directory() . '/build/editorScript.js';
	// Admin script.
	wp_enqueue_script(
		'zach-editor-script',
		$script,
		[],
		filemtime( $script_path ),
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'zach_enqueue_block_editor_assets' );
