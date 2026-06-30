<?php

declare( strict_types=1 );

namespace MultisiteOverrideStyle\Override;

use MultisiteOverrideStyle\Preview\PreviewHandler;
use MultisiteOverrideStyle\Storage\SettingsRepository;
use WP_Theme_JSON_Data;

/**
 * Merges the network theme.json override into the user (Global Styles) layer,
 * giving network values the highest priority in the theme.json resolution stack.
 *
 * Only applies to block themes. Classic themes (no theme.json) are skipped.
 */
final class ThemeJsonOverride {

	public function __construct(
		private readonly SettingsRepository $settings,
		private readonly ExemptionChecker $exemption,
		private readonly PreviewHandler $preview,
	) {}

	public function register(): void {
		add_filter( 'wp_theme_json_data_user', [ $this, 'merge' ] );
	}

	public function merge( WP_Theme_JSON_Data $theme_json ): WP_Theme_JSON_Data {
		if ( $this->exemption->is_current_site_exempted() ) {
			return $theme_json;
		}

		// Skip classic themes — they have no theme.json support.
		if ( ! $this->active_theme_has_theme_json() ) {
			return $theme_json;
		}

		$override = $this->preview->is_active()
			? $this->preview->get_draft_theme_json()
			: $this->settings->get_theme_json();

		if ( empty( $override ) ) {
			return $theme_json;
		}

		// Ensure the required version key is present.
		if ( ! isset( $override['version'] ) ) {
			$override['version'] = 3;
		}

		$theme_json->update_with( $override );

		return $theme_json;
	}

	private function active_theme_has_theme_json(): bool {
		$theme = wp_get_theme();
		$theme_json_file = $theme->get_stylesheet_directory() . '/theme.json';

		if ( file_exists( $theme_json_file ) ) {
			return true;
		}

		// Check parent theme.
		if ( $theme->parent() ) {
			$parent_json = $theme->parent()->get_stylesheet_directory() . '/theme.json';
			return file_exists( $parent_json );
		}

		return false;
	}
}
