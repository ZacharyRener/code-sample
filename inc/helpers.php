<?php
/**
 * Common Block helper functions.
 *
 * @package zach-blocks
 */

namespace Zach\Blocks;

/**
 * Functionally identical to WordPress' locate_template() function, but checks plugin dir.
 *
 * @param string|array $template_names Template file(s) to search for, in order.
 * @param bool         $load           If true the template file will be loaded if it is found.
 * @param bool         $load_once      Whether to require_once or require. Has no effect if `$load` is false.
 *                                     Default true.
 * @param array        $args           Optional. Additional arguments passed to the template.
 *                                     Default empty array.
 * @return string The template filename if one is located.
 */
function locate_template( $template_names, $load = false, $load_once = true, $args = array() ) {
	$located = '';
	foreach ( (array) $template_names as $template_name ) {
		if ( ! $template_name ) {
			continue;
		}

		$path = ZACH_BLOCKS_DIR . '/' . $template_name;

		if ( file_exists( $path ) ) {
			$located = $path;
			break;
		}
	}

	if ( $load && '' !== $located ) {
		load_template( $located, $load_once, $args );
	}

	return $located;
}

/**
 * Functionally identical to WordPress' get_template_part() function, but checks plugin dir for fallback.
 *
 * @param string      $slug The slug name for the generic template.
 * @param string|null $name Optional. The name of the specialized template.
 * @param array       $args Optional. Additional arguments passed to the template.
 *                          Default empty array.
 * @return void|false Void on success, false if the template does not exist.
 */
function get_template_part( string $slug, string|null $name = null, array $args = [] ) {
	$in_theme = \get_template_part( $slug, $name, $args );

	if ( false !== $in_theme ) {
		return;
	}

	$templates = array();
	$name      = (string) $name;
	if ( '' !== $name ) {
		$templates[] = "{$slug}-{$name}.php";
	}

	$templates[] = "{$slug}.php";

	if ( ! locate_template( $templates, true, false, $args ) ) {
		return false;
	}
}

/**
 * Get the post thumbnail with size, classes, and alt tags - OR - get the default image.
 *
 * @param  string $size     The image size.
 * @param  string $classes  The image class(es).
 * @param  bool   $featured If the image is featured (rather than a card). If the customizer setting is enabled, the same default card image will be used as the default featured image.
 * @param  string $id       The post id. If left empty it will use get_the_ID().
 */
function card_image( $size, $classes = false, $featured = false, $id = false ) {
	$alt   = get_post_meta( get_post_thumbnail_id(), '_wp_attachment_image_alt', true ) ?: get_the_title();
	$image = null;

	if ( get_the_post_thumbnail() ) {
		$image = get_the_post_thumbnail(
			$id ?: get_the_ID(),
			$size,
			[
				'class' => $classes,
				'alt'   => esc_html( $alt ),
			]
		);
	} elseif ( ! get_the_post_thumbnail() && get_theme_mod( 'zach_default_image' ) && ( false === $featured || true === get_theme_mod( 'zach_use_card_image_as_featured_image' ) ) ) {
		$image = wp_get_attachment_image(
			get_theme_mod( 'zach_default_image' ),
			$size,
			false,
			[
				'class' => $classes,
				'alt'   => esc_html( $alt ),
			]
		);
	}

	return $image;
}
