<?php
/**
 * Provides color functions for the theme.
 *
 * @package Zach
 */

/**
 * Register additional CSS rules per color set in Theme.json.
 */
function zach_register_additional_color_css_from_theme_json() {
	$global_settings = wp_get_global_settings();
	$theme_colors    = $global_settings['color']['palette']['theme'] ?? [];

	if ( empty( $theme_colors ) ) {
		return;
	}

	$color_styles = [];

	foreach ( $theme_colors as $color ) {
		$slug       = $color['slug'];
		$color_code = $color['color'];

		// Background Color.
		$color_styles[] = [
			'selector'     => sprintf( '.has-%1$s-background-color', $slug ),
			'declarations' => [
				'--current-background-color' => sprintf( 'var(--wp--preset--color--%s)', $slug ),
				'--preferable-text-color'    => zach_get_contrast_color( $color_code ),
				'--preferable-path-color'    => zach_get_contrast_color( $color_code, '#4d4d4f' ),
			],
		];

		// Text Color.
		$color_styles[] = [
			'selector'     => sprintf( '.has-%s-color[class]', $slug ),
			'declarations' => [
				'--preferable-text-color' => sprintf( 'var(--wp--preset--color--%s)', $slug ),
			],
		];
	}

	// Dropcap color.
	if ( get_the_ID() > 0 ) {
		$zach_dropcap_color = get_post_meta( get_the_ID(), 'zach_dropcap_color', true );

		if ( $zach_dropcap_color ) {
			$color_styles[] = [
				'selector'     => ':root',
				'declarations' => [
					'--bswh--post-content--drop-cap--color' => $zach_dropcap_color,
				],
			];
		}
	}


	if ( get_the_ID() > 0 ) {
		$mission_event_scheme_color = get_post_meta( get_the_ID(), 'mission_event_scheme_color', true );

		if ( empty( $mission_event_scheme_color ) ) {
			global $post;
			if ( $post->post_parent > 0 ) {
				$mission_event_scheme_color = get_post_meta( $post->post_parent, 'mission_event_scheme_color', true );
			}
		}


		if ( $mission_event_scheme_color ) {
			$color_styles[] = [
				'selector'     => 'body',
				'declarations' => [
					'--bswh--mission-events--scheme--color' => $mission_event_scheme_color,
					'--bswh--mission-events--scheme--preferable-text-color' => zach_get_contrast_color( $mission_event_scheme_color ),
				],
			];
		}
	}

	// This adds to the `zach-element-style` context, which will then be output in zach_register_additional_css_from_theme_json().
	wp_style_engine_get_stylesheet_from_css_rules(
		$color_styles,
		[
			'context'  => 'zach-color-styles',
			'optimize' => true,
		]
	);

	// Fetch compiled rules from context store.
	$stylesheet = wp_style_engine_get_stylesheet_from_context( 'zach-color-styles' );

	if ( ! empty( $stylesheet ) ) {
		wp_register_style( 'zach-color-styles-styles', false, array(), true, true );
		wp_add_inline_style( 'zach-color-styles-styles', $stylesheet );
		wp_enqueue_style( 'zach-color-styles-styles' );
	}
}
add_action( 'wp_enqueue_scripts', 'zach_register_additional_color_css_from_theme_json', 11 );
add_action( 'enqueue_block_editor_assets', 'zach_register_additional_color_css_from_theme_json', 11 );

/**
 * Filters the data provided by the theme for global styles and settings.
 *
 * @since 6.1.0
 *
 * @param WP_Theme_JSON_Data $theme_json Class to access and update the underlying data.
 */
function zach_color_wp_theme_json_data_theme( $theme_json ) {
	// If we have ended up here by mistake, return the existing theme.json.
	if ( ! function_exists( 'get_current_screen' ) ) {
		return $theme_json;
	}

	$current_screen = get_current_screen();

	// If there is no current screen, return the existing theme.json.
	if ( ! $current_screen ) {
		return $theme_json;
	}

	if ( is_admin() && $current_screen->is_block_editor() ) {
		if ( $current_screen && property_exists( $current_screen, 'post_type' ) && 'zach_mission_event' === $current_screen->post_type ) {
			// New theme.json data.
			$new_data = [
				'version'  => 3,
				'settings' => [
					'color' => [
						'custom' => true,
					],
				],
			];

			// Return the modified theme JSON data.
			$theme_json->update_with( $new_data );
		}
	}


	// Return the original theme JSON data.
	return $theme_json;
}

/**
 * For the filter to work properly, it must be run after theme setup.
 */
function zach_color_apply_theme_json_theme_filters() {
	// Check to make sure the theme has a theme.json file.
	if ( wp_theme_has_theme_json() ) {
		add_filter( 'wp_theme_json_data_user', 'zach_color_wp_theme_json_data_theme' );
	}
}
add_action( 'after_setup_theme', 'zach_color_apply_theme_json_theme_filters' );


/**
 * Find the best contrast color ensuring WCAG 2.1 AA compliance.
 *
 * @param string $hex_color Hex Color.
 * @param string $black_color  Dark text color.
 * @param string $light_color Light text Color.
 *
 * @return string
 */
function zach_get_contrast_color( $hex_color, $black_color = '#000000', $light_color = '#ffffff' ) {
	// Hex Color RGB.
	$r1 = hexdec( substr( $hex_color, 1, 2 ) );
	$g1 = hexdec( substr( $hex_color, 3, 2 ) );
	$b1 = hexdec( substr( $hex_color, 5, 2 ) );

	// Black RGB.
	$r2_black_color = hexdec( substr( $black_color, 1, 2 ) );
	$g2_black_color = hexdec( substr( $black_color, 3, 2 ) );
	$b2_black_color = hexdec( substr( $black_color, 5, 2 ) );

	// Light RGB.
	$r2_light_color = hexdec( substr( $light_color, 1, 2 ) );
	$g2_light_color = hexdec( substr( $light_color, 3, 2 ) );
	$b2_light_color = hexdec( substr( $light_color, 5, 2 ) );

	// Calc contrast ratio.
	$l1 = 0.2126 * pow( $r1 / 255, 2.2 ) + 0.7152 * pow( $g1 / 255, 2.2 ) + 0.0722 * pow( $b1 / 255, 2.2 );

	$l2_black = 0.2126 * pow( $r2_black_color / 255, 2.2 ) + 0.7152 * pow( $g2_black_color / 255, 2.2 ) + 0.0722 * pow( $b2_black_color / 255, 2.2 );
	$l2_light = 0.2126 * pow( $r2_light_color / 255, 2.2 ) + 0.7152 * pow( $g2_light_color / 255, 2.2 ) + 0.0722 * pow( $b2_light_color / 255, 2.2 );

	$contrast_ratio_black = ( $l1 > $l2_black ) ? ( $l1 + 0.05 ) / ( $l2_black + 0.05 ) : ( $l2_black + 0.05 ) / ( $l1 + 0.05 );
	$contrast_ratio_light = ( $l1 > $l2_light ) ? ( $l1 + 0.05 ) / ( $l2_light + 0.05 ) : ( $l2_light + 0.05 ) / ( $l1 + 0.05 );

	// If contrast is more than 4.5, return black color.
	if ( $contrast_ratio_black >= 4.5 ) {
		return sprintf( 'var(--color--content--text-dark, %s)', $black_color );
	} else {
		// if not, return white color.
		return sprintf( 'var(--color--content--text-light, %s)', $light_color );
	}
}
