<?php
/**
 * Extends the Mega Menu block.
 *
 * @package zach-blocks
 */

namespace Zach\Blocks\Blocks;

/**
 * Extends the Mega Menu.
 */
class Mega_Menu extends Base {

	/**
	 * Block name. This must match the "zach/*" name given in block.json.
	 *
	 * @var string
	 */
	protected $name = 'mega-menu';


	/**
	 * Constructor. Call's Base construct.
	 */
	public function __construct() {
		parent::__construct();

		add_filter( 'default_wp_template_part_areas', [ $this, 'default_wp_template_part_areas' ] );
		add_action( 'zach_template_action_header_end', [ $this, 'zach_template_action_header_end' ] );
		add_action( 'zach_template_action_header_action_buttons_end', [ $this, 'zach_template_action_header_action_buttons_end' ] );
	}

	/**
	 * Adds a custom template part area for mega menus to the list of template part areas.
	 *
	 * @param array $areas Existing array of template part areas.
	 * @return array Modified array of template part areas including the new "Menu" area.
	 */
	public function default_wp_template_part_areas( array $areas ) {
		$areas[] = array(
			'area'        => 'menu-panel',
			'area_tag'    => 'div',
			'description' => __( 'Menu panels are used to create the content for the mega menu items.', 'zach-blocks' ),
			'icon'        => '',
			'label'       => __( 'Menu Panels', 'zach-blocks' ),
		);

		return $areas;
	}

	/**
	 * Inject the mega menu panels into the end of the of the header.
	 */
	public function zach_template_action_header_end() {
		?>
		<div class="zach-mega-menu-panels zach-mega-menu-panels-desktop" data-wp-interactive="zach/mega-menu" data-wp-class--mobile-menu-is-open="state.isMobileMenuOpen"
>
			<?php
			$panels = apply_filters( 'zach_mega_menu_desktop_panels', [] );
			foreach ( $panels as $panel_slug ) {
				$panel_id = sprintf( 'panel-%s', $panel_slug );
				// Define the Interactivity Context for this panel.
				$wp_context = [
					'panelId' => esc_attr( $panel_id ),
				];
				?>
				<div class="zach-mega-menu-panel zach-mega-menu-panel-desktop" id="<?php echo esc_attr( $panel_id ); ?>" data-wp-key="<?php echo esc_attr( $panel_id ); ?>"
				data-wp-watch="callbacks.togglePanel"
				data-wp-bind--aria-hidden="!state.isPanelOpen"
				<?php echo wp_interactivity_data_wp_context( $wp_context ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				>
				<button
					aria-label="<?php echo esc_attr__( 'Close menu', 'zach-blocks' ); ?>"
					class="zach-mega-menu-panel-close-button menu-container__close-button"
					type="button"
					data-wp-on--click="actions.togglePanel"
				>
				</button>
				<?php
				echo esc_html( block_template_part( $panel_slug ) );
				?>
				</div>
				<?php
			}
			?>
		</div>
		<?php
	}

	/**
	 * Inject the Mega menu close button to the action buttons area.
	 */
	public function zach_template_action_header_action_buttons_end() {
		?>
		<a class="zach-mega-menu-close-button" data-wp-interactive="zach/mega-menu"
		data-wp-class--is-mobile="state.isMobile"
		data-wp-class--active="state.activePanel"
		data-wp-watch="callbacks.togglePanel"
		data-wp-on--click="actions.closeAllPanels"
		data-wp-bind--aria-controls="state.activePanel"
		data-wp-on-document--keydown="callbacks.closeButtonKeyDown"
		aria-label="Close mega menu panel"
		title="Close mega menu panel">
			<?php esc_html_e( 'Close', 'zach-blocks' ); ?>
		</a>
		<?php
	}
}
