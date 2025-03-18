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
		[
			'name'  => 'arrow',
			'label' => __( 'Arrow', 'zach-fse-theme' ),
		]
	);

	register_block_style(
		'core/button',
		[
			'name'  => 'link',
			'label' => __( 'Link', 'zach-fse-theme' ),
		]
	);

	register_block_style(
		'core/media-text',
		[
			'name'  => 'hero',
			'label' => __( 'Hero', 'zach-fse-theme' ),
		]
	);

	register_block_style(
		'core/group',
		[
			'name'  => 'alert',
			'label' => __( 'Alert Banner', 'zach-fse-theme' ),
		]
	);

	register_block_style(
		'core/embed',
		[
			'name'  => 'vertical-embed',
			'label' => __( 'Has Vertical Video', 'zach-fse-theme' ),
		]
	);

	register_block_style(
		'core/list',
		[
			'name'  => 'arrow-links',
			'label' => __( 'Arrow Links', 'zach-fse-theme' ),
		]
	);

	register_block_style(
		'core/list',
		[
			'name'  => 'inline',
			'label' => __( 'Inline', 'zach-fse-theme' ),
		]
	);
}
add_action( 'init', 'zach_blocks_register_styles' );


/**
 * For the custom logo, replaces the img tag with SVG code.
 *
 * @param string $html          HTML img element or empty string on failure.
 * @param int    $attachment_id Image attachment ID.
 */
function zach_wp_get_attachment_image_for_custom_logo_svg( $html, $attachment_id ) {

	$custom_logo_id = get_theme_mod( 'custom_logo' );

	if ( $custom_logo_id === $attachment_id ) {

		// Define a cache key using the image ID.
		$cache_key = 'zach_svg_' . $custom_logo_id;

		// Try to get the SVG code from cache.
		$cached_svg = wp_cache_get( $cache_key );

		// If there is no cached svg code, we need to get it.
		if ( false === $cached_svg ) {
			// Get the full file path of the attachment.
			$svg_file_path = get_attached_file( $custom_logo_id );

			$svg_content = '';

			// Check if the file is an SVG.
			if ( strpos( $svg_file_path, '.svg' ) !== false ) {
				// Get the file contents.
				if ( function_exists( 'wpcom_vip_file_get_contents' ) ) {
					$svg_content = wpcom_vip_file_get_contents( $svg_file_path );
				} elseif ( file_exists( $svg_file_path ) ) {
					$svg_content = file_get_contents( $svg_file_path );  // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown
				}

				if ( $svg_content ) {
					// Just in case, sanitize the SVG.
					// Array of script-related attributes to remove.
					$script_attributes = [ 'onload', 'onclick', 'onmouseover', 'onhover', 'onfocus', 'onerror', 'onunload' ];

					// Loop through the script attributes and remove them using regular expressions.
					foreach ( $script_attributes as $attribute ) {
						$svg_content = preg_replace( '/\s+' . $attribute . '\s*=\s*"[^"]*"/i', '', $svg_content );
						$svg_content = preg_replace( '/\s+' . $attribute . "\s*=\s*'[^']*'/i", '', $svg_content );
					}

					// Store the sanitized content in the cache for future use.
					wp_cache_set( $cache_key, $svg_content );

					// Return the SVG markup directly into the DOM.
					return $svg_content;
				}
			}
		} else {
			return $cached_svg;
		}
	}

	// Always return some $html.
	return $html;
}
add_filter( 'wp_get_attachment_image', 'zach_wp_get_attachment_image_for_custom_logo_svg', 10, 5 );

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
 * Filters the content before the featured thumbnail on single posts.
 *
 * @param string $block_content The block content.
 * @param array  $block         The full block, including name and attributes.
 */
function zach_single_post_path_ribbon( $block_content, $block ) {

	if ( is_single() && isset( $block['blockName'] ) && 'core/post-featured-image' === $block['blockName'] ) {
		$selected_colors = get_post_meta( get_the_ID(), 'path_ribbon_color', true );
		$block_content   = '<div class="path-ribbon-container-outer ' . esc_attr( $selected_colors ) . '">
		<div class="path-ribbon-container">
		<div class="path-ribbon"></div>
		</div>
		</div>' . $block_content;
	}

	return $block_content;
}

add_filter( 'render_block_core/post-featured-image', 'zach_single_post_path_ribbon', 10, 2 );

/**
 * Filters the content before the compass header on newsetter posts.
 *
 * @param string $block_content The block content.
 * @param array  $block         The full block, including name and attributes.
 */
function zach_single_newsletter_path_ribbon( $block_content, $block ) {

	if ( is_single() && isset( $block['blockName'], $block['attrs']['className'] ) && get_post_type() === 'zach-newsletter' && 'core/group' === $block['blockName'] && 'compass-header' === $block['attrs']['className'] ) {
		$selected_colors = get_post_meta( get_the_ID(), 'path_ribbon_color', true );
		$ribbon_html     = '<div class="path-ribbon-container-outer ' . esc_attr( $selected_colors ) . '">
		<div class="path-ribbon-vertical"></div>
		<div class="path-ribbon-horizontal"></div>
        </div>';
		
		// Insert $ribbon_html inside <figure> as a sibling to <img>.
		$block_content = preg_replace_callback(
			'/(<figure[^>]*>\s*<img[^>]*>)(?!\s*<div class="path-ribbon-container-outer">)/s',
			function ( $matches ) use ( $ribbon_html ) {
				return $matches[1] . $ribbon_html;
			},
			$block_content
		);
	}

	return $block_content;
}

add_filter( 'render_block_core/group', 'zach_single_newsletter_path_ribbon', 10, 2 );

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
            $styles = [];

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
                $bookmark_set = true;
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
 * Define the path for the related article.
 *
 * @return string
 */
function zach_the_related_posts_get_template_slug() {
	return 'template-parts/cards/card';
}
add_filter( 'zach_the_related_posts_get_template_slug', 'zach_the_related_posts_get_template_slug', 10, 1 );


/**
 * Related Post Template Arguments for theme.
 *
 * @param object $template Template options.
 */
function zach_the_related_posts_get_template_args( object $template ) {
	// Override default settings.
	$template->{'max-lines-excerpt'} = 2;
	$template->date                  = 'hover';
	$template->excerpt               = 'hover';
	$template->author                = false;
	$template->continue_reading      = true;

	// If it is a newsletter post type..
	if ( is_singular() && 'zach-newsletter' === get_post_type() ) {
		$template->{'max-lines-excerpt'} = 3;
		$template->date                  = 'hide';
		$template->excerpt               = 'show';
	}

	return $template;
}
add_filter( 'zach_the_related_posts_get_template_args', 'zach_the_related_posts_get_template_args', 10, 1 );

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
 * Render the Table of Contents
 *
 * @param string $content Content of the current post.
 */
function zach_the_table_of_contents( $content ) {
	if ( is_singular() && in_the_loop() && is_main_query() && post_type_supports( get_post_type(), 'table-of-contents' ) ) {

		// Early return if the `zach_enable_toc` meta key is not true.
		$enable_toc = get_post_meta( get_the_ID(), 'zach_enable_toc', true );

		if ( ! $enable_toc ) {
			return $content;
		}
		remove_filter( 'the_content', 'zach_the_table_of_contents', 100 );

		// We want to capture the table-of-contents template part and prepend it to the content.
		// Mobile table of contents.
		ob_start();

		get_template_part( 'template-parts/table-of-contents', null, [ 'breakpoint' => 'mobile' ] );

		$table_of_contents_mobile = ob_get_clean();

		// Match the first HTML element (e.g., <p>, <div>, <h1>, etc.).
		$pattern = '/<([^>\s]+)[^>]*>.*?<\/\1>/s';

		// Check if the first match is found.
		if ( $table_of_contents_mobile && preg_match( $pattern, $content, $matches ) ) {
			// Get the full match of the first element.
			$first_element = $matches[0];

			// Insert the mobile table-of-contents after the first element.
			$content = str_replace( $first_element, $first_element . $table_of_contents_mobile, $content );
		}

		// Desktop table of contents.
		ob_start();

		get_template_part( 'template-parts/table-of-contents', null, [ 'breakpoint' => 'desktop' ] );

		$table_of_contents_desktop = ob_get_clean();

		// Prepend the desktop table-of-contents to the content.
		if ( $table_of_contents_desktop ) {
			$content = $table_of_contents_desktop . $content;
		}
	}
	// Always return some content.
	return $content;
}
add_filter( 'the_content', 'zach_the_table_of_contents', 100 );


/**
 * Register custom block binding source
 */
function zach_register_block_bindings() {
	register_block_bindings_source(
		'zach/time-to-read',
		[
			'label'              => __( 'Time to Read', 'zach' ),
			'get_value_callback' => 'zach_time_to_read_bindings_callback',
			'uses_context'       => [ 'postId' ],
		]
	);
}
add_action( 'init', 'zach_register_block_bindings' );

/**
 * "Time To Read" Block Bindings Callback.
 *
 * @return string.
 */
function zach_time_to_read_bindings_callback() {
	// 200 is the approximate estimated words per minute across languages.
	$words_per_minute = 200;
	$words            = str_word_count( wp_strip_all_tags( get_the_content() ) );

	$minutes = (int) round( $words / $words_per_minute );

	return sprintf( 'Time to Read: %d mins', $minutes );
}

/**
 * Move a Related Posts block out of the post content and into a template action area.
 *
 * @param string $content  Serialized content.
 *
 * @return string
 */
function zach_move_related_posts_to_template_action_area( $content ) {
	if ( ! is_admin() && is_singular() && in_the_loop() && is_main_query() && has_block( 'zach/related-posts' ) ) {
		// Parse the post_content into blocks.
		$parsed_blocks = parse_blocks( $content );

		// Find the Related Posts block in the blocks.
		$parsed_blocks = array_filter(
			$parsed_blocks,
			function ( $block ) use ( &$related_posts_block ) {
				if ( isset( $block['blockName'] ) && 'zach/related-posts' === $block['blockName'] ) {
					$related_posts_block = $block; // Save the block for later use.
					return false; // Exclude this block from the array.
				}
				return true; // Keep this block in the array.
			}
		);

		// Reindex the array to maintain sequential keys.
		$parsed_blocks = array_values( $parsed_blocks );

		// If there is a Related Posts block...
		if ( $related_posts_block ) {
			// Add that Related Posts block to the Template Action 'before_footer' block.
			add_action(
				'zach_template_action_before_footer',
				function () use ( $related_posts_block ) {
					// Unescaped because it has been run through do_blocks. Assumed to be safe.
					echo do_blocks( serialize_block( $related_posts_block ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				},
				2,
				1
			);
		}

		// Re-serialize blocks.
		$content = serialize_blocks( $parsed_blocks );
	}
	return $content;
}
add_filter( 'the_content', 'zach_move_related_posts_to_template_action_area', 8 );

/**
 * Render a post's CTA into the footer.
 *
 * @param \WP_Post $post The post object.
 */
function zach_post_footer_cta( $post ) {
	// Ensure that this is a post object with an ID.
	if ( ! isset( $post->ID ) ) {
		return;
	}

	// Get the post meta.
	$footer_cta_id = (int) get_post_meta( $post->ID, 'zach_footer_cta_id', true ) ?? 0;

	// Ensure that the CTA is a positive integer.
	if ( $footer_cta_id > 0 ) {
		// Get the post.
		$footer_cta_post = get_post( $footer_cta_id );

		// Check that the post is valid.
		if ( $footer_cta_post && ! is_wp_error( $footer_cta_post ) ) {
			// Process the post content through do_blocks().
			$processed_content = do_blocks( $footer_cta_post->post_content );

			// Output the processed content.
			// Unescaped because we want the correct code from the do_blocks to display.
			echo $processed_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
	}
}
add_action( 'zach_template_action_before_footer', 'zach_post_footer_cta', 1, 1 );

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
