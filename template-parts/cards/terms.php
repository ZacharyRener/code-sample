<?php
/**
 * Default card terms template.
 * 
 * This template can be invoked with 
 * args that alter the output.
 * 
 * @package zach-blocks
 */

namespace Zach\Blocks;

$args = $args ?? [];

$default_args = [
	'taxonomy' => 'category',
	'max'      => 1,
];

$args = wp_parse_args( $args, $default_args );

$zach_blocks_terms = wp_get_post_terms( get_the_ID(), $args['taxonomy'] );

if ( empty( $zach_blocks_terms ) || is_wp_error( $zach_blocks_terms ) ) {
	return;
}

$zach_blocks_terms_list = [];

// Check for Primary category from Yoast.
if ( 'category' === $args['taxonomy'] && class_exists( 'WPSEO_Primary_Term' ) ) { 
	$wpseo_primary_term = new \WPSEO_Primary_Term( 'category', get_the_ID() );
	$wpseo_primary_term = $wpseo_primary_term->get_primary_term();
	$primary_term       = get_term( $wpseo_primary_term );
}

if ( empty( $primary_term ) || is_wp_error( $primary_term ) ) {
	$primary_term = $zach_blocks_terms[0];
}

$zach_blocks_terms_list = [ $primary_term ];

foreach ( $zach_blocks_terms as $zach_blocks_term ) {
	if ( $primary_term->term_id !== $zach_blocks_term->term_id ) {
		$zach_blocks_terms_list[] = $zach_blocks_term;
	}
}

$args['max'] = $args['max'] > 0 ? $args['max'] : 1;

$zach_blocks_terms_list = array_slice( $zach_blocks_terms_list, 0, $args['max'] );
?>
<ul class="card__term-list">
	<?php 
	$zach_blocks_term_middot = false;
	foreach ( $zach_blocks_terms_list as $zach_blocks_term ) : 
		$zach_blocks_term_link = get_term_link( $zach_blocks_term, $args['taxonomy'] );

		if ( is_wp_error( $zach_blocks_term_link ) ) {
			continue;
		}

		if ( $zach_blocks_term_middot ) {
			echo '<li class="card__term-list-seperator">•</li>';
		}

		$zach_blocks_term_middot = true;
		?>
		<li class="card__term-list-item">
			<a href="<?php echo esc_url( $zach_blocks_term_link ); ?>">
				<?php echo esc_html( $zach_blocks_term->name ); ?>
			</a>
		</li>
	<?php endforeach; ?>
</ul>
