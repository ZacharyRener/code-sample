<?php
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * @package zach-theme
 */

/**
 * Theme setup and custom theme supports.
 */
function zach_after_setup_theme() {
	$crop_image_sizes = [
		'1x1' => [ 300, 300 ],
	];

	foreach ( $crop_image_sizes as $name => $size ) {
		add_image_size( $name . '_cropped', $size[0], $size[1], true );
		add_image_size( $name . '_cropped_x2', $size[0] * 2, $size[1] * 2, true );
		add_image_size( $name . '_cropped_xhalf', $size[0] / 2, $size[1] / 2, true );
	}

	$no_crop_image_sizes = [
		'1x1' => [ 300, 300 ],
	];

	foreach ( $no_crop_image_sizes as $name => $size ) {
		add_image_size( $name, $size[0], $size[1], false );
		add_image_size( $name . 'x2', $size[0] * 2, $size[1] * 2, false );
		add_image_size( $name . 'xhalf', $size[0] / 2, $size[1] / 2, false );
	}

	add_filter( 'should_load_remote_block_patterns', '__return_false' );
}
add_action( 'after_setup_theme', 'zach_after_setup_theme' );

/**
 * Filters the maxwidth oEmbed parameter.
 */
function zach_oembed_default_width() {
	return 1280;
}
add_filter( 'oembed_default_width', 'zach_oembed_default_width' );


/**
 * Enqueue scripts and styles.
 */
function zach_scripts() {
	$stylesheet      = get_stylesheet_directory_uri() . '/build/indexStyle.css';
	$stylesheet_path = get_stylesheet_directory() . '/build/indexStyle.css';
	// Theme stylesheet.
	wp_enqueue_style( 'zach-theme-style', $stylesheet, [], filemtime( $stylesheet_path ) );

	$mainscript      = get_stylesheet_directory_uri() . '/build/mainScript.js';
	$mainscript_path = get_stylesheet_directory() . '/build/mainScript.js';
	// Theme script.
	wp_enqueue_script( 'zach-theme-script', $mainscript, [], filemtime( $mainscript_path ), true );

	// Print styles.
	$print_stylesheet      = get_stylesheet_directory_uri() . '/build/printStyle.css';
	$print_stylesheet_path = get_stylesheet_directory() . '/build/printStyle.css';
	// Theme stylesheet.
	wp_enqueue_style( 'zach-print-style', $print_stylesheet, [], filemtime( $print_stylesheet_path ), 'print' );
}
add_action( 'wp_enqueue_scripts', 'zach_scripts' );
add_action( 'enqueue_block_assets', 'zach_scripts' );

/**
 * Register Post Meta.
 */
function zach_register_post_meta() {
	// Path Ribbon Color.
	register_meta(
		'post',
		'path_ribbon_color',
		[
			'type'         => 'string',
			'default'      => 'cool_1',
			'show_in_rest' => true, // Must include for it work in the Block Editor.
			'single'       => true,
			'label'        => 'Path Ribbon Color Scheme',
		]
	);

	// Table of Contents on/off.
	register_meta(
		'post',
		'zach_enable_toc',
		[
			'type'         => 'boolean',
			'default'      => true,
			'show_in_rest' => true, // Must include for it work in the Block Editor.
			'single'       => true,
			'label'        => 'Enable Table of Contents',
		]
	);

	// Drop cap color.
	register_meta(
		'post',
		'zach_dropcap_color',
		[
			'type'         => 'string',
			'default'      => '#3F9F90',
			'show_in_rest' => true, // Must include for it work in the Block Editor.
			'single'       => true,
			'label'        => 'Dropcap Color',
		]
	);

	// Post Footer CTA Id.
	register_meta(
		'post',
		'zach_footer_cta_id',
		[
			'type'         => 'integer',
			'default'      => 0,
			'show_in_rest' => true, // Must include for it work in the Block Editor.
			'single'       => true,
			'label'        => 'Post Footer CTA ID',
		]
	);
}
add_action( 'init', 'zach_register_post_meta' );



/**
 * Add post type support.
 */
function zach_add_post_type_support() {
	add_post_type_support( 'post', 'path-ribbon' );
	add_post_type_support( 'post', 'table-of-contents' );
	add_post_type_support( 'post', 'dropcap-color' );
	add_post_type_support( 'wp_block', 'dropcap-color' );
	add_post_type_support( 'post', 'footer-cta' );
}
add_action( 'init', 'zach_add_post_type_support' );

/**
 * Post Password Form.
 */
function zach_the_password_form() {
	global $post;
	$loginurl = site_url() . '/wp-login.php?action=postpass';

	$label = 'pwbox-' . ( ! empty( $post->ID ) ? $post->ID : wp_rand() );
	ob_start();
	?>
		<form action="<?php echo esc_url( $loginurl ); ?>" method="post" class="post-password-form" role="search">
			<fieldset>
				<legend class="post-password-label" id="password-help-<?php echo esc_attr( $label ); ?>"><?php echo esc_html( 'This content is password protected. To view it please enter your password below:' ); ?></legend>
				<div class="inline-label">
					<label for="<?php echo esc_attr( $label ); ?>" class="post-password-label"><?php echo esc_html__( 'Password', 'zach' ); ?></label><input name="post_password" id="<?php echo esc_attr( $label ); ?>" class="input post-password-class" type="password" placeholder="<?php echo esc_attr__( 'Enter password', 'zach' ); ?>" aria-describedby="password-help-<?php echo esc_attr( $label ); ?>" />				</div><input type="submit" name="Submit" class="button" value="<?php echo esc_attr__( 'Read', 'zach' ); ?>" aria-label="<?php echo esc_attr__( 'Submit password to unlock content', 'zach' ); ?>" />
			</fieldset>
		</form>
	<?php
	return ob_get_clean();
}
add_filter( 'the_password_form', 'zach_the_password_form', 9999 );


// add a style tag that sets body to display: none
// then, add a script that adds a class to the body when the page is loaded: page-is-loaded
// in the original style tag, add a rule that sets body.page-is-loaded to display: block
// add a noscript tag that sets body to display: block
function zach_add_noscript() {
	?>
	<style>
		body {
			display: none;
		}
		body.page-is-loaded {
			display: block;
		}
	</style>
	<script>
		document.addEventListener('DOMContentLoaded', function() {
			// document.body.classList.add('page-is-loaded');
		});
		window.addEventListener('load', function() {
			document.body.classList.add('page-is-loaded');
		});
	</script>
	<noscript>
		<style>
			body {
				display: block;
			}
		</style>
	</noscript>
	<?php
}
add_action( 'wp_head', 'zach_add_noscript' );
