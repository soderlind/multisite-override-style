<?php

declare( strict_types=1 );

namespace MultisiteOverrideStyle\Admin;

use MultisiteOverrideStyle\Preview\PreviewHandler;
use MultisiteOverrideStyle\Storage\RevisionRepository;
use MultisiteOverrideStyle\Storage\SettingsRepository;

/**
 * Registers the "Override Style" page under Network Admin → Settings.
 * Enqueues the React admin application.
 */
final class NetworkAdminPage {

	public const MENU_SLUG = 'multisite-override-style';
	public const CAPABILITY = 'manage_network';

	public function __construct(
		private readonly SettingsRepository $settings,
		private readonly RevisionRepository $revisions,
		private readonly PreviewHandler $preview,
	) {}

	public function register(): void {
		add_action( 'network_admin_menu', [ $this, 'add_menu' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	public function add_menu(): void {
		add_submenu_page(
			'settings.php',
			__( 'Override Style', 'multisite-override-style' ),
			__( 'Override Style', 'multisite-override-style' ),
			self::CAPABILITY,
			self::MENU_SLUG,
			[ $this, 'render_page' ],
		);
	}

	public function render_page(): void {
		if ( ! current_user_can( self::CAPABILITY ) ) {
			wp_die( esc_html__( 'You do not have permission to access this page.', 'multisite-override-style' ) );
		}

		echo '<div class="wrap"><div id="mos-admin-app"></div></div>';
	}

	public function enqueue_assets( string $hook ): void {
		if ( $hook !== 'settings_page_' . self::MENU_SLUG ) {
			return;
		}

		if ( ! current_user_can( self::CAPABILITY ) ) {
			return;
		}

		$asset_file = MOS_PLUGIN_DIR . 'build/index.asset.php';
		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = require $asset_file;

		wp_enqueue_script(
			'mos-admin',
			MOS_PLUGIN_URL . 'build/index.js',
			$asset['dependencies'],
			$asset['version'],
			true,
		);

		wp_enqueue_style(
			'mos-admin',
			MOS_PLUGIN_URL . 'build/index.css',
			[ 'wp-components' ],
			$asset['version'],
		);

		wp_localize_script(
			'mos-admin',
			'mosAdminData',
			[
				'restUrl'   => esc_url_raw( rest_url( 'mos/v1' ) ),
				'nonce'     => wp_create_nonce( 'wp_rest' ),
				'siteUrl'   => network_home_url( '/' ),
			],
		);
	}
}
