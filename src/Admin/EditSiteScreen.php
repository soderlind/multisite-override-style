<?php

declare( strict_types=1 );

namespace NetworkStyleOverride\Admin;

use NetworkStyleOverride\Storage\SettingsRepository;

/**
 * Adds a "Override Style" checkbox to Network Admin → Sites → Edit Site.
 * Allows network admins to exempt a specific site from the Network Override.
 */
final class EditSiteScreen {

	public const CAPABILITY = 'manage_network';
	public const NONCE_ACTION = 'nso_edit_site_exemption';
	public const FIELD_NAME = 'nso_exempted';

	public function __construct(
		private readonly SettingsRepository $settings,
	) {}

	public function register(): void {
		add_action( 'wpmueditblogaction', [ $this, 'render_field' ] );
		add_action( 'wpmu_update_blog_options', [ $this, 'save_field' ] );
	}

	public function render_field(): void {
		if ( ! current_user_can( self::CAPABILITY ) ) {
			return;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$blog_id = isset( $_GET['id'] ) ? (int) $_GET['id'] : 0;
		if ( $blog_id <= 0 ) {
			return;
		}

		$is_exempted = $this->settings->is_exempted( $blog_id );
		wp_nonce_field( self::NONCE_ACTION . '_' . $blog_id, '_nso_nonce' );

		?>
		<tr>
			<th scope="row">
				<?php esc_html_e( 'Override Style', 'network-style-override' ); ?>
			</th>
			<td>
				<label>
					<input
						type="checkbox"
						name="<?php echo esc_attr( self::FIELD_NAME ); ?>"
						value="1"
						<?php checked( $is_exempted ); ?>
					/>
					<?php esc_html_e( 'Exempt this site from the network CSS and theme.json overrides.', 'network-style-override' ); ?>
				</label>
			</td>
		</tr>
		<?php
	}

	public function save_field( int $blog_id ): void {
		if ( ! current_user_can( self::CAPABILITY ) ) {
			return;
		}

		$nonce = isset( $_POST['_nso_nonce'] ) ? sanitize_key( $_POST['_nso_nonce'] ) : '';
		if ( ! wp_verify_nonce( $nonce, self::NONCE_ACTION . '_' . $blog_id ) ) {
			return;
		}

		$is_exempted = isset( $_POST[ self::FIELD_NAME ] ) && $_POST[ self::FIELD_NAME ] === '1';

		if ( $is_exempted ) {
			$this->settings->add_exemption( $blog_id );
		} else {
			$this->settings->remove_exemption( $blog_id );
		}
	}
}
