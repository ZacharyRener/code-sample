<?php
/**
 * Search functionality
 *
 * @package zach-theme
 */

/**
 * Filters the content of a core Search block.
 *
 * @param string $block_content The block content.
 * @param array  $block         The full block, including name and attributes.
 */
function zach_render_block_core_search( $block_content, $block ) {
	// Check to make sure we are in the ZACH Site Search Variation of the core Search field.
	if ( isset( $block['attrs']['namespace'] ) && 'zach/site-search' !== $block['attrs']['namespace'] ) {
		return $block_content;
	}

	$type_request = null;

	if ( isset( $_GET['type'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$type_request = sanitize_text_field( $_GET['type'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	} else {
		$type_request = 'post';
	}

	// The different post types we are going to output on the front end.
	$post_types = apply_filters(
		'zach_site_search_post_type_options',
		[
			'post'             => 'News & Stories only',
			'events'           => 'Events only',
			'areas-of-support' => 'Areas to Support only',
			'compass'          => 'Compass Issues only',
			'site'             => 'Search all foundations',
		]
	);

	// Capture the post types radio button.
	ob_start();
	?>
	<div class="zach-site-search-post-types">
	<?php
	foreach ( $post_types as $slug => $label ) {
		?>
		<label>
			<input type="radio" name="type" value="<?php echo esc_attr( $slug ); ?>" <?php checked( $type_request, esc_attr( $slug ) ); ?> />
			<?php echo esc_html( $label ); ?>
		</label>
		<?php
	}
	?>
	</div><!-- .zach-site-search-post-types -->
	<?php
	$html = ob_get_contents();

	ob_end_clean();

	// Append to the end of the block.
	$block_content = str_replace( '</form>', $html . '</form>', $block_content );

	// Add an ID.

	$block_content = str_replace( '<form ', '<form id="zach-site-search" ', $block_content );

	// Return block contents.
	return $block_content;
}
add_filter( 'render_block_core/search', 'zach_render_block_core_search', 10, 2 );

/**
 * Search pre get posts.
 *
 * @param WP_Query $query The WP_Query instance (passed by reference).
 */
function zach_core_search_pre_get_posts( $query ) {
	if ( ! is_admin() && $query->is_main_query() ) {
		if ( $query->is_search && isset( $_GET['type'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended

			$content_type = sanitize_text_field( $_GET['type'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

			$search_term = isset( $_GET['s'] ) ? sanitize_text_field( $_GET['s'] ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

			if ( 'areas-of-support' === $content_type ) {
				$tax_query = [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
					[
						'taxonomy' => 'area_of_support',
						'operator' => 'EXISTS',
					],
				];

				$query->set( 'tax_query', $tax_query );
				$query->set( 'post_type', 'page' );
			} else {
				$query->set( 'post_type', $content_type ); // phpcs:ignore WordPressVIPMinimum.Hooks.PreGetPosts.PreGetPosts
			}
		}
	}
}
add_action( 'pre_get_posts', 'zach_core_search_pre_get_posts' );

