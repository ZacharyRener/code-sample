<?php
/**
 * Default card template when there is post ID passed.
 *
 * Assumes $args['content'] is set.
 *
 * This template can be invoked with
 * args that alter the output.
 *
 * @package zach-blocks
 */

namespace Zach\Blocks;

$args = $args ?? [];

$default_args = [
	'layout'            => 'default',
	'excerpt'           => 'show',
	'image_size'        => '16x9',
	'heading_tag'       => 'h2',
	'image'             => true,
	'category'          => true,
	'title'             => true,
	'date'              => 'show',
	'continue_reading'  => false,
	'author'            => true,
	'font_size'         => 'default',
	'classes'           => '',
	'max-lines-heading' => 2,
	'max-lines-excerpt' => 4,
	'read-more-message' => 'Learn More',
];

$args = wp_parse_args( $args, $default_args );

// Classes.
$classes = [
	'card',
	$args['classes'],
];

?>
<article class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>" >
	<?php if ( $args['link'] && $args['card-is-link'] ) : ?>
	<a href="<?php echo esc_url( $args['link']['url'] ); ?>" class="card__link" aria-label=" <?php echo esc_attr( $args['link']['title'] ?? '' ); ?>"></a>
	<?php endif; ?>
	<div class="card__inner">
		<div class="card__content">
			<div class="card__content-top">
			<?php
			// The following will be coming from the block editor and has already been sanitizied, and has svg and html content.
			echo $args['content']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			?>
			</div>
			<div class="card__content-bottom">
				<?php
				if ( $args['link'] && $args['continue_reading'] ) :
					// Determine the tag for the continue reading element.
					if ( $args['card-is-link'] ) {
						?>
						<span class="card__continue-reading"><?php echo esc_html( $args['read-more-message'] ); ?></span>
						<?php
					} else {
						?>
						<a href="<?php echo esc_url( $args['link']['url'] ); ?>" class="card__continue-reading"><?php echo esc_html( $args['read-more-message'] ); ?></a>
						<?php
					}
					endif;
				?>
			</div>

		</div>
	</div>
</article>
