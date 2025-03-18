<?php
/**
 * Style related functions
 *
 * @package zach-theme
 */

/**
 * Register additional CSS rules per color set in Theme.json.
 */
function zach_register_additional_css_from_theme_json() {
	// Get the theme.json style.elements values.
	$elements = wp_get_global_styles( [ 'elements' ] ) ?? [];
	$blocks   = wp_get_global_styles( [ 'blocks' ] ) ?? [];

	$elements = array_merge( $elements, $blocks );

	if ( empty( $elements ) ) {
		return;
	}

	// Empty holding array.
	$element_declarations = [];

	// For each of the elements.
	foreach ( $elements as $element => $rules ) {
			$element_declarations = $element_declarations + zach_flatten_element_rules( $element, $rules );
	}

	$wp_style_engine_get_stylesheet_from_css_rules = wp_style_engine_get_stylesheet_from_css_rules(
		[
			[
				'selector'     => 'body',
				'declarations' => $element_declarations,
			],
		],
		[
			'context' => 'zach-element-styles',
		]
	);
	// Fetch compiled rules from context store.
	$stylesheet = wp_style_engine_get_stylesheet_from_context( 'zach-element-styles' );

	if ( ! empty( $stylesheet ) ) {
		wp_register_style( 'zach-generated-theme-styles', false, array(), true, true );
		wp_add_inline_style( 'zach-generated-theme-styles', $stylesheet );
		wp_enqueue_style( 'zach-generated-theme-styles' );
	}
}
add_action( 'wp_enqueue_scripts', 'zach_register_additional_css_from_theme_json', 11 );
add_action( 'enqueue_block_editor_assets', 'zach_register_additional_css_from_theme_json' );


/**
 * Recursive function to get all the styles as properly named
 *
 * @param string $element The element name, like button or core/button.
 * @param array  $rules A nested set of rules.
 */
function zach_flatten_element_rules( string $element, array $rules ) {
	$result = array();

	// Replacements for theme.json keys.
	$tokens =
		[
			'textDecoration' => 'text-decoration',
			'fontSize'       => 'font-size',
			'fontStyle'      => 'font-style',
			'fontWeight'     => 'font-weight',
			'fontFamily'     => 'font-family',
			'lineHeight'     => 'line-height',
		];

	foreach ( $rules as $key => $value ) {
		$key = str_replace( array_keys( $tokens ), array_values( $tokens ), $key );

		$new_key = $element . '--' . $key;

		// Get rid of colons.
		$new_key = str_replace( ':', '', $new_key );

		// Fix the slashes for `core/`.
		$new_key = str_replace( 'core/', 'block-', $new_key );

		if ( is_array( $value ) ) {
			$result = array_merge( $result, zach_flatten_element_rules( $new_key, $value ) );
		} elseif ( ! is_null( $value ) ) {
				$result[ '--bswh--' . $new_key ] = (string) $value;
		}
	}

	return $result;
}

/**
 * Mega Menu themes.
 *
 * @param  array $themes Mega Menu themes array.
 */
function megamenu_add_theme_zach_1733952010( $themes ) {
	$themes['zach_1733952010'] = array(
		'title'                                    => 'Zach',
		'container_background_from'                => 'rgb(255, 255, 255)',
		'container_background_to'                  => 'rgb(255, 255, 255)',
		'menu_item_background_hover_from'          => 'rgba(0, 0, 0, 0)',
		'menu_item_background_hover_to'            => 'rgba(0, 0, 0, 0)',
		'menu_item_link_font_size'                 => '16px',
		'menu_item_link_height'                    => '26px',
		'menu_item_link_color'                     => 'rgb(54, 66, 72)',
		'menu_item_link_weight'                    => 'bold',
		'menu_item_link_color_hover'               => 'rgb(0, 126, 180)',
		'menu_item_link_weight_hover'              => 'bold',
		'menu_item_link_padding_left'              => '0',
		'menu_item_link_padding_right'             => '0',
		'menu_item_link_padding_bottom'            => '0',
		'panel_background_from'                    => 'rgb(255, 255, 255)',
		'panel_background_to'                      => 'rgb(255, 255, 255)',
		'panel_width'                              => 'header.wp-block-template-part',
		'panel_header_color'                       => 'rgb(34, 34, 34)',
		'panel_widget_padding_left'                => '0px',
		'panel_widget_padding_right'               => '0px',
		'panel_widget_padding_top'                 => '0px',
		'panel_widget_padding_bottom'              => '0px',
		'panel_font_size'                          => '14px',
		'panel_font_color'                         => '#666',
		'panel_font_family'                        => 'inherit',
		'panel_second_level_font_color'            => '#555',
		'panel_second_level_font_color_hover'      => '#555',
		'panel_second_level_text_transform'        => 'uppercase',
		'panel_second_level_font'                  => 'inherit',
		'panel_second_level_font_size'             => '16px',
		'panel_second_level_font_weight'           => 'bold',
		'panel_second_level_font_weight_hover'     => 'bold',
		'panel_second_level_text_decoration'       => 'none',
		'panel_second_level_text_decoration_hover' => 'none',
		'panel_third_level_font_color'             => '#666',
		'panel_third_level_font_color_hover'       => '#666',
		'panel_third_level_font'                   => 'inherit',
		'panel_third_level_font_size'              => '14px',
		'flyout_width'                             => '100%',
		'flyout_menu_background_from'              => 'rgb(255, 255, 255)',
		'flyout_menu_background_to'                => 'rgb(255, 255, 255)',
		'flyout_link_size'                         => '14px',
		'flyout_link_color'                        => '#666',
		'flyout_link_color_hover'                  => '#666',
		'flyout_link_family'                       => 'inherit',
		'responsive_breakpoint'                    => '1024px',
		'line_height'                              => '1.6',
		'toggle_background_from'                   => 'rgb(255, 255, 255)',
		'toggle_background_to'                     => 'rgb(255, 255, 255)',
		'toggle_bar_height'                        => '12px',
		'toggle_bar_border_radius_top_left'        => '0',
		'toggle_bar_border_radius_top_right'       => '0',
		'toggle_bar_border_radius_bottom_left'     => '0',
		'toggle_bar_border_radius_bottom_right'    => '0',
		'mobile_menu_overlay'                      => 'on',
		'mobile_menu_force_width'                  => 'on',
		'mobile_background_from'                   => 'rgb(255, 255, 255)',
		'mobile_background_to'                     => 'rgb(255, 255, 255)',
		'mobile_menu_item_link_font_size'          => '14px',
		'mobile_menu_item_link_color'              => 'rgb(54, 66, 72)',
		'mobile_menu_item_link_text_align'         => 'left',
		'mobile_menu_item_link_color_hover'        => 'rgb(54, 66, 72)',
		'mobile_menu_item_background_hover_from'   => 'rgba(51, 51, 51, 0)',
		'mobile_menu_item_background_hover_to'     => 'rgba(51, 51, 51, 0)',
		'custom_css'                               => '/** Push menu onto new line **/
  #{$wrap} {
	  clear: both;
  }',
	);
	return $themes;
}
add_filter( 'megamenu_themes', 'megamenu_add_theme_zach_1733952010' );
