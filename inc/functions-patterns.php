<?php
/**
 * Registers solely admin side functionality.
 *
 * @package zach-theme
 */

/**
 * Look in /assets/synced-patterns/ and import those patterns to the database.
 */
function zach_register_theme_synced_patterns() {

	// Check if this is a new deploy.
	// Check if the file exists as part of the deploy process.
	// We could do an environment check, but this file does that for us. If the file exists, we are running on a deployed host.
	if ( file_exists( 'buddy_execution_start_timestamp.php' ) ) {
		// The option in the database.
		$db_version = absint( get_option( 'zach_sp_timestamp' ) );

		// The option from the file.
		$file_version = absint( include_once 'buddy_execution_start_timestamp.php' );

		// Compare.
		// If the version numbers are the same, we do not need to run the sync.
		if ( $db_version === $file_version ) {
			return;
		}

		// Let's update the stored file version.
		update_option( 'zach_sp_timestamp', $file_version );
	}

	// Get all of our synced pattern files.
	$synced_pattern_files = glob( get_stylesheet_directory() . '/assets/synced-patterns/*.php' );

	// Early return: Check that there are any patterns in the synced-patterns directory.
	if ( empty( $synced_pattern_files ) ) {
		return;
	}

	// This is based on the code in https://github.com/WordPress/wordpress-develop/blob/trunk/src/wp-includes/class-wp-theme.php#L1837 .
	$default_headers = [
		'title'         => 'Title',
		'slug'          => 'Slug',
		'description'   => 'Description',
		'viewportWidth' => 'Viewport Width',
		'inserter'      => 'Inserter',
		'categories'    => 'Categories',
		'keywords'      => 'Keywords',
		'blockTypes'    => 'Block Types',
		'postTypes'     => 'Post Types',
		'templateTypes' => 'Template Types',
	];

	$properties_to_parse = [
		'categories',
		'keywords',
		'blockTypes',
		'postTypes',
		'templateTypes',
	];

	foreach ( $synced_pattern_files as $file ) {
		$pattern = get_file_data( $file, $default_headers );

		// Slug is missing.
		if ( empty( $pattern['slug'] ) ) {
			continue;
		}

		// Check slug.
		if ( ! preg_match( '/^[A-z0-9\/_-]+$/', $pattern['slug'] ) ) {
			continue;
		}

		// Caching.
		// Each pattern file is cached individually because there is a chance that one of them has been updated.
		$transient_key = sprintf( 'zach_sp_%s', sanitize_title( $pattern['slug'] ) );

		// Get the modified time of the pattern file.
		$modified_time = filemtime( $file );

		// Get the transient as an integer.
		$transient = (int) get_transient( $transient_key );

		// If the transient's value matches the modified time of the file, then we do not need to worry about updating it.
		if ( isset( $transient ) && $transient === (int) $modified_time ) {
			continue;
		}

		// Title is a required property.
		if ( ! $pattern['title'] ) {
			continue;
		}

		// For properties of type array, parse data as comma-separated.
		foreach ( $properties_to_parse as $property ) {
			if ( ! empty( $pattern[ $property ] ) ) {
				$pattern[ $property ] = array_filter( wp_parse_list( (string) $pattern[ $property ] ) );
			} else {
				unset( $pattern[ $property ] );
			}
		}

		// Parse properties of type int.
		$property = 'viewportWidth';
		if ( ! empty( $pattern[ $property ] ) ) {
			$pattern[ $property ] = (int) $pattern[ $property ];
		} else {
			unset( $pattern[ $property ] );
		}

		// Parse properties of type bool.
		$property = 'inserter';
		if ( ! empty( $pattern[ $property ] ) ) {
			$pattern[ $property ] = in_array(
				strtolower( $pattern[ $property ] ),
				array( 'yes', 'true' ),
				true
			);
		} else {
			unset( $pattern[ $property ] );
		}

		// Attempt to get the content of the block.
		$pattern['filePath'] = $file;

		if ( ! isset( $pattern['content'] ) && isset( $pattern['filePath'] ) ) {
			ob_start();
			include $pattern['filePath'];
			$pattern['content'] = ob_get_clean();
			unset( $pattern['filePath'] );
		}

		// We need to have pattern content.
		if ( empty( $pattern['content'] ) ) {
			continue;
		}

		$pattern_args = [
			'post_type'    => 'wp_block',
			'post_title'   => $pattern['title'],
			'post_name'    => sanitize_title( $pattern['slug'] ),
			'post_content' => $pattern['content'],
			'post_status'  => 'publish',
			'meta_input'   => [
				'wp_pattern_sync_status'        => 'fully',
				'zach_synced_pattern_from_file' => true,
			],
			'tax_input'    => [
				'wp_pattern_category' => $pattern['categories'] ?? [],
			],
		];

		// See if there is already a pattern with this slug.
		$existing_pattern_query_args = [
			'post_type'      => 'wp_block',
			'name'           => sanitize_title( $pattern['slug'] ),
			'posts_per_page' => 1,
			'post_status'    => 'any',
		];

		$existing_pattern_query = new WP_Query( $existing_pattern_query_args );

		if ( $existing_pattern_query->have_posts() ) {
			// Pattern already exists.
			// Add the ID to the pattern arguments we are going to enter in.
			$pattern_args['ID'] = $existing_pattern_query->get_queried_object_id();
		}

		// Finally, insert/update the wp_block post.
		$result = wp_insert_post( $pattern_args, true );

		// If the resulting post ID is greater than 0...
		if ( $result > 0 ) {
			// Set the transient.
			set_transient( $transient_key, $modified_time );
		}
	} // end for each of the found patterns.

	// Now we need to remove the patterns from the database that no longer exist in the filesystem.

	// Get all existing patterns that were synced from files.
	$existing_synced_patterns_args = [
		'post_type'      => 'wp_block',
		'meta_key'       => 'zach_synced_pattern_from_file',
		'meta_value'     => true, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
		'posts_per_page' => -1,
		'fields'         => 'ids', // Only retrieve IDs for efficiency.
	];

	$existing_synced_patterns = new WP_Query( $existing_synced_patterns_args );

	// If there are existing synced patterns found.
	if ( $existing_synced_patterns->have_posts() ) {
		$current_slugs = [];

		// For each of the synced pattern files that we found earlier with glob().
		foreach ( $synced_pattern_files as $file ) {
			// Get the file data.
			$headers = get_file_data( $file, [ 'slug' => 'Slug' ] );

			// Find the slug and add it to our array.
			if ( ! empty( $headers['slug'] ) ) {
				$current_slugs[] = sanitize_title( $headers['slug'] );
			}
		}

		// Loop through the existing synced patterns from the database and remove those not in the directory.
		foreach ( $existing_synced_patterns->posts as $post_id ) {
			$post_slug = get_post_field( 'post_name', $post_id );

			if ( ! in_array( $post_slug, $current_slugs, true ) ) {
				wp_delete_post( $post_id, true ); // Permanently delete the post.
			}
		}
	}
}
add_action( 'init', 'zach_register_theme_synced_patterns' );


/**
 * Register Pattern ( wp_block ) meta.
 */
function zach_wp_block_register_meta() {
	// We want to know whether or not the pattern has come from a file, for syncing purposes, and to disallow updating it.
	register_post_meta(
		'wp_block',
		'zach_synced_pattern_from_file',
		array(
			'single'       => true,
			'type'         => 'boolean',
			'show_in_rest' => true,
			'default'      => false,
		)
	);
}
add_action( 'init', 'zach_wp_block_register_meta' );

/**
 * Determine if the pattern has been previously inserted into the database from a file.
 *
 * @param WP_Post|object|int $post           Optional. WP_Post instance or Post ID/object. Default null.
 */
function zach_is_zach_synced_pattern_from_file( $post = null ) {
	$_post = get_post( $post );

	if ( ! ( $_post instanceof WP_Post ) ) {
		return false;
	}

	return (bool) get_post_meta( $_post->ID, 'zach_synced_pattern_from_file', true );
}

/**
 * Determine if there should be a link to the edit the pattern.
 *
 * @param string $link    The edit link.
 * @param int    $post_id Post ID.
 */
function zach_wp_block_get_edit_post_link( $link, $post_id ) {

	if ( true === zach_is_zach_synced_pattern_from_file( $post_id ) ) {
		return null;
	}
	// Always return the link.
	return $link;
}
add_filter( 'get_edit_post_link', 'zach_wp_block_get_edit_post_link', 10, 2 );

/**
 * Attempts to restrict access to editing or deleting certain patterns.
 *
 * @param string[] $caps    Primitive capabilities required of the user.
 * @param string   $cap     Capability being checked.
 * @param int      $user_id The user ID.
 * @param array    $args    Adds context to the capability check, typically
 *                          starting with an object ID.
 */
function zach_wp_block_map_meta_cap( $caps, $cap, $user_id, $args ) {
	$post_id = isset( $args[0] ) && is_numeric( $args[0] ) > 0 ? (int) $args[0] : null;

	if ( $post_id > 0 && true === zach_is_zach_synced_pattern_from_file( $post_id ) ) {
		// We do not want anyone to be able to edit these patterns.
		if ( 'edit_post' === $cap || 'delete_post' === $cap ) {
			return [ 'do_not_allow' ];
		}
		return $caps;
	}

	return $caps;
}
add_filter( 'map_meta_cap', 'zach_wp_block_map_meta_cap', 10, 4 );

/**
 * Remove the 'Export as JSON' action for patterns that are from file.
 *
 * @param string[] $actions An array of row action links. Defaults are
 *                          'Edit', 'Quick Edit', 'Restore', 'Trash',
 *                          'Delete Permanently', 'Preview', and 'View'.
 * @param WP_Post  $post    The post object.
 */
function zach_post_row_actions( $actions, $post ) {
	if ( true === zach_is_zach_synced_pattern_from_file( $post ) ) {
		// No quick actions here.
		return [];
	}
	return $actions;
}
add_filter( 'post_row_actions', 'zach_post_row_actions', 10, 2 );


/**
 * Delete all transients with the 'zach_sp_' prefix.
 */
function zach_delete_zach_sp_transients() {
	global $wpdb;

	// Query the database for all transients with the 'zach_sp_' prefix.
	$transients = $wpdb->get_col( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$wpdb->prepare(
			"SELECT option_name FROM $wpdb->options WHERE option_name LIKE %s",
			$wpdb->esc_like( '_transient_zach_sp_' ) . '%'
		)
	);

	// Loop through and delete each transient.
	foreach ( $transients as $transient ) {
		// Extract the transient key by removing the '_transient_' prefix.
		$transient_key = str_replace( '_transient_', '', $transient );
		delete_transient( $transient_key );
	}
}

/**
 * Check for the 'delete_zach_sp' query parameter in the admin URL and trigger transient deletion.
 */
function zach_handle_zach_sp_transient_deletion() {
	if ( is_admin() && isset( $_GET['delete_zach_sp'] ) && current_user_can( 'manage_options' ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		// Delete all 'zach_sp_' transients.
		zach_delete_zach_sp_transients();

		// Add an admin notice for feedback.
		add_action(
			'admin_notices',
			function () {
				?><div class="notice notice-success is-dismissible"><p>All transients with the "zach_sp_" prefix have been deleted.</p></div>
				<?php
			}
		);
	}
}
add_action( 'admin_init', 'zach_handle_zach_sp_transient_deletion' );


/**
 * Registers custom pattern categories.
 */
function zach_pattern_categories() {

	// Areas to Support.
	register_block_pattern_category(
		'zach_area-to-support',
		array(
			'label'       => __( 'Area to Support', 'zach' ),
			'description' => __( 'A collection of Area to Support patterns.', 'zach' ),
		)
	);

	// Data.
	register_block_pattern_category(
		'zach_data',
		array(
			'label'       => __( 'Data', 'zach' ),
			'description' => __( 'Patterns to show data in stories, pages, newsletters, etc.', 'zach' ),
		)
	);

	// Newsletter.
	register_block_pattern_category(
		'zach_newsletter',
		array(
			'label'       => __( 'Newsletter', 'zach' ),
			'description' => __( 'Use these newsletter-specific patterns to build your next issue.', 'zach' ),
		)
	);

	// Mission Events.
	register_block_pattern_category(
		'zach_mission_events',
		array(
			'label'       => __( 'Mission Events', 'zach' ),
			'description' => __( 'Two patterns to build your next Mission Event minisite.', 'zach' ),
		)
	);

	// Pages.
	register_block_pattern_category(
		'zach_pages',
		array(
			'label'       => __( 'Pages', 'zach' ),
			'description' => __( 'Use these patterns to present information to your visitors.', 'zach' ),
		)
	);

	// People.
	register_block_pattern_category(
		'zach_people',
		array(
			'label'       => __( 'People', 'zach' ),
			'description' => __( 'Use these patterns to feature people on your pages', 'zach' ),
		)
	);

	// Stories.
	register_block_pattern_category(
		'zach_stories',
		array(
			'label'       => __( 'Stories', 'zach' ),
			'description' => __( 'Use these patterns to feature stories wherever they are relevant.', 'zach' ),
		)
	);
}
add_action( 'init', 'zach_pattern_categories' );


/**
 * Get a pattern ID from a slug.
 *
 * @param string $slug The slug of the pattern to find. The function will sanitize it, so pass the namespace/pattern-slug.
 *
 * @return int
 */
function zach_get_pattern_id_from_slug( $slug ) {
	if ( empty( $slug ) ) {
		return 0;
	}

	// Get the pattern to match the slug.
	$get_patterns = get_posts(
		[
			'post_type'      => 'wp_block',
			'name'           => sanitize_title( $slug ),
			'posts_per_page' => 1,
			'fields'         => 'id',
		]
	);

	// If we have a pattern, return the ID.
	if ( ! empty( $get_patterns ) ) {
		return $get_patterns[0]->ID;
	}

	return 0;
}

/**
 * Restrict access to certain patterns.
 */
function zach_restrict_patterns() {
	$registry = WP_Block_Patterns_Registry::get_instance();

	if ( $registry->is_registered( 'alert-bar' ) ) {
		$pattern = $registry->get_registered( 'alert-bar' );
		$screen  = get_current_screen();

		// If in admin and not in the Site Editor (FSE), hide pattern in inserter.
		if ( is_admin() && isset( $screen->id ) && 'site-editor' !== $screen->id ) {
			$pattern['inserter'] = false;
		}

		$registry->unregister( 'alert-bar' );
		$registry->register( 'alert-bar', $pattern );
	}
}

add_action( 'current_screen', 'zach_restrict_patterns' );
