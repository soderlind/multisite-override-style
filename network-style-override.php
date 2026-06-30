<?php
/**
 * Plugin Name:       Network Style Override
 * Plugin URI:        https://github.com/soderlind/network-style-override
 * Description:       Network-wide CSS and theme.json overrides for WordPress Multisite. Enforces brand consistency across all subsites.
 * Version:           0.7.1
 * Author:            Per Søderlind
 * Author URI:        https://soderlind.no
 * Requires at least: 6.8
 * Tested up to:      7.0
 * Requires PHP:      8.3
 * Network:           true
 * Text Domain:       network-style-override
 * Domain Path:       /languages
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

declare( strict_types=1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'NSO_VERSION', '0.7.1' );
define( 'NSO_PLUGIN_FILE', __FILE__ );
define( 'NSO_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'NSO_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

require_once NSO_PLUGIN_DIR . 'vendor/autoload.php';

// Initialize GitHub Updater for automatic updates.
\Soderlind\WordPress\GitHubUpdater::init(
	github_url:   'https://github.com/soderlind/network-style-override',
	plugin_file:  __FILE__,
	plugin_slug:  'network-style-override',
	name_regex:   '/network-style-override\.zip/',
	branch:       'main',
	check_period: 6,
);

add_action( 'plugins_loaded', static function (): void {
	( new \NetworkStyleOverride\Plugin() )->init();
} );
