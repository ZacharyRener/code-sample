<?php
/**
 * Registers Blocks in PHP, in JavaScript, and provides a space for callback functions.
 *
 * @package zach-theme
 */

/**
 * Registers the block styles.
 *
 * @return void
 */
function zach_blocks_register_styles() {
	register_block_style(
		'core/button',
		array(
			'name'  => 'arrow',
			'label' => __( 'Arrow', 'zach-blocks' ),
		)
	);

	register_block_style(
		'core/button',
		array(
			'name'  => 'link',
			'label' => __( 'Link', 'zach-blocks' ),
		)
	);

	register_block_style(
		'core/media-text',
		array(
			'name'  => 'hero',
			'label' => __( 'Hero', 'zach-blocks' ),
		)
	);

	register_block_style(
		'core/group',
		array(
			'name'  => 'alert',
			'label' => __( 'Alert Banner', 'zach-blocks' ),
		)
	);

	register_block_style(
		'core/embed',
		array(
			'name'  => 'vertical-embed',
			'label' => __( 'Has Vertical Video', 'zach-blocks' ),
		)
	);

	register_block_style(
		'core/list',
		array(
			'name'  => 'arrow-links',
			'label' => __( 'Arrow Links', 'zach-blocks' ),
		)
	);

	register_block_style(
		'core/list',
		array(
			'name'  => 'inline',
			'label' => __( 'Inline', 'zach-blocks' ),
		)
	);
}
add_action( 'init', 'zach_blocks_register_styles' );


/**
 * Filter Media/Text Block.
 *
 * @param string $block_content The block content about to be appended.
 * @param array  $block         The full block, including name and attributes.
 *
 * @return string
 */
function zach_media_text_ribbon( $block_content, $block ) {
	if ( 'core/media-text' === $block['blockName'] ) {
		$selected_colors = get_post_meta( get_the_ID(), 'path_ribbon_color', true );
		$ribbon_html     = '<div class="path-ribbon-container ' . esc_attr( $selected_colors ) . '">
		<div class="path-ribbon"></div>
		</div>';

		if ( preg_match( '/<div[^>]*>/', $block_content, $matches ) ) {
			$block_content = preg_replace( '/(<div[^>]*>)/', '$1' . $ribbon_html, $block_content, 1 );
		}

		// Use regex to find <figure> elements with <img> and insert <div class="figure__inner"> as a sibling.
		$block_content = preg_replace_callback(
			'/(<figure[^>]*>\s*)(<img[^>]*>)(?!\s*<div class="figure__inner">)/s',
			function ( $matches ) {
				return $matches[1] . $matches[2] . '<div class="figure__inner"></div>';
			},
			$block_content
		);
	}

	return $block_content;
}

add_filter( 'render_block', 'zach_media_text_ribbon', 10, 2 );

/**
 * Filters the content of the core Site Logo.
 *
 * @param string $block_content The block content.
 * @param array  $block         The full block, including name and attributes.
 */
function zach_site_logo_color_fill( $block_content, $block ) {
	// Check if the colorFill attribute is set.
	if ( isset( $block['attrs']['colorFill'] ) && ! empty( $block['attrs']['colorFill'] ) ) {
		// The fill hex color.
		$fill_hex = $block['attrs']['colorFill'];

		if ( $fill_hex ) {
			// Empty styles array.
			$styles = array();

			// Empty original style from the block.
			$block_style_attribute = '';

			// Add the color fill to the styles array.
			$styles['--color-fill'] = $fill_hex;

			// New tag processor.
			$processor = new WP_HTML_Tag_Processor( $block_content );

			// Track if the bookmark is successfully set.
			$bookmark_set = false;

			// Bookmark the start of the block if a <div> is found.
			if ( $processor->next_tag( 'div' ) ) {
				$processor->set_bookmark( 'block-start' );
				$bookmark_set          = true;
				$block_style_attribute = $processor->get_attribute( 'style' );
			}

			// Go to a possible link element.
			if ( $processor->next_tag( 'a' ) ) {
				$processor->set_attribute( 'aria-label', get_bloginfo( 'name' ) );
			}

			// Go to a possible image element.
			if ( $processor->next_tag( 'img' ) ) {
				$src = $processor->get_attribute( 'src' );
				if ( $src ) {
					// Add the image src to the styles array.
					$styles['--image-src'] = sprintf( "url('%s')", esc_url( $src ) );
				}
			}

			// Go back to the beginning **only if** the bookmark was set.
			if ( $bookmark_set ) {
				$processor->seek( 'block-start' );
			}

			// Convert the array of variables into an inline string.
			$inline_styles = implode(
				'; ',
				array_map(
					function ( $value, $key ) {
						return "$key:$value";
					},
					$styles,
					array_keys( $styles )
				)
			) . ';';

			// Append new styles to the existing block style attribute.
			$processor->set_attribute( 'style', $block_style_attribute . $inline_styles );

			// Return the modified block content.
			return $processor->get_updated_html();
		}
	}

	// Always return the original content.
	return $block_content;
}
add_filter( 'render_block_core/site-logo', 'zach_site_logo_color_fill', 10, 2 );


/**
 * Ensure all top-level headings have IDs.
 *
 * @param array         $parsed_block  An associative array of the block being rendered. See WP_Block_Parser_Block.
 * @param array         $source_block     An un-modified copy of `$parsed_block`, as it appeared in the source content.
 * @param WP_Block|null $parent_block If this is a nested block, a reference to the parent block.
 */
function zach_add_ids_for_headings( $parsed_block, $source_block, $parent_block ) {
	// We want...
	// Headings in the main loop, with no parent block.
	if ( null === $parent_block && 'core/heading' === $parsed_block['blockName'] && is_singular() && in_the_loop() && is_main_query() && post_type_supports( get_post_type(), 'table-of-contents' ) ) {
		// We only want to do this for the h2s.
		// Also, if the level attribute is not-set, set it to be 2.
		if ( empty( $parsed_block['attrs'] ) || empty( $parsed_block['attrs']['level'] ) ) {
			$parsed_block['attrs']['level'] = 2;
		}

		$processor = new WP_HTML_Tag_Processor( $parsed_block['innerHTML'] );

		if ( $processor->next_tag( 'H2' ) && empty( $processor->get_attribute( 'id' ) ) ) {
			// Get a new id from the innerHTML.
			$new_id = sanitize_title( wp_strip_all_tags( $parsed_block['innerHTML'] ) );

			// Set the new attribute.
			$processor->set_attribute( 'id', esc_attr( $new_id ) );

			// Update the parsed_block html.
			$parsed_block['innerHTML']       = $processor->get_updated_html();
			$parsed_block['innerContent'][0] = $processor->get_updated_html();
		}
	}

	// Always return data.
	return $parsed_block;
}
add_filter( 'render_block_data', 'zach_add_ids_for_headings', 1, 3 );

/**
 * Adds the image caption to the <img> tag's alt attribute for core/image blocks.
 *
 * @param string $block_content The HTML content of the block.
 * @param array  $block The block data, including attributes and content.
 *
 * @return string The modified block content with the caption added to the <img> tag.
 */
function add_caption_to_image_tag( $block_content, $block ) {
	// Use WP_HTML_Tag_Processor to process the <img> tag.
	$processor = new WP_HTML_Tag_Processor( $block_content );

	// Check if there already is an alt set.
	// We don't want to override that.
	while ( $processor->next_tag( 'img' ) ) {
		$processor->set_bookmark( 'image' );
		$exisiting_alt = $processor->get_attribute( 'alt' ) ?? '';
		if ( ! empty( $exisiting_alt ) ) {
			// Return block content if there already is a non-empty alt tag.
			return $block_content;
		}
	}

	// Get the image ID from the block attributes.
	$image_id = isset( $block['attrs']['id'] ) ? (int) $block['attrs']['id'] : 0;

	// If there's an image ID, get the attachment and its caption.
	if ( $image_id ) {
		$attachment = get_post( $image_id );
		if ( $attachment && 'attachment' === $attachment->post_type ) {
			$caption = $attachment->post_excerpt; // Get the caption from the attachment.

			// If a caption exists, process the HTML and add the caption as an alt attribute.
			if ( $caption ) {
				$processor->seek( 'image' );
				// Find all <img> tags in the block content.
				while ( $processor->next_tag( 'img' ) ) {
					// Add the caption as an alt attribute to each <img> tag.
					$processor->set_attribute( 'alt', esc_attr( $caption ) );
				}

				// Get the modified block content.
				$block_content = $processor->get_updated_html();
			}
		}
	}

	// Always return block content.
	return $block_content;
}
add_filter( 'render_block_core/image', 'add_caption_to_image_tag', 10, 2 );
