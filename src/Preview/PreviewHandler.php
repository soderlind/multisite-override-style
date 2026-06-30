<?php

declare( strict_types=1 );

namespace NetworkStyleOverride\Preview;

use NetworkStyleOverride\Storage\SettingsRepository;

/**
 * Manages the transient-backed Draft Override used for previewing unsaved changes.
 *
 * Flow:
 *  1. Admin POSTs draft CSS + theme.json to REST endpoint → stored in transient with a token.
 *  2. REST response includes a preview URL with ?nso_preview=TOKEN.
 *  3. On the front-end, if ?nso_preview=TOKEN is present and the visitor is a
 *     network admin, the draft values are used instead of live settings.
 *  4. The draft expires automatically after DRAFT_TTL seconds.
 */
final class PreviewHandler {

	private const TRANSIENT_PREFIX = 'nso_draft_';
	private const DRAFT_TTL        = 3600; // 1 hour

	private ?string $active_token = null;

	public function __construct(
		private readonly SettingsRepository $settings,
	) {
		// Detect the preview token from the query string early.
		add_action( 'parse_request', [ $this, 'detect_token' ] );
	}

	public function detect_token(): void {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$token = isset( $_GET['nso_preview'] ) ? sanitize_key( $_GET['nso_preview'] ) : '';

		if ( $token === '' ) {
			return;
		}

		// Only network admins may use the preview token.
		if ( ! current_user_can( 'manage_network' ) ) {
			return;
		}

		if ( get_transient( self::TRANSIENT_PREFIX . $token ) !== false ) {
			$this->active_token = $token;
		}
	}

	public function is_active(): bool {
		return $this->active_token !== null;
	}

	public function get_draft_css(): string {
		$draft = $this->get_draft();
		return (string) ( $draft['css'] ?? '' );
	}

	/**
	 * @return array<string, mixed>
	 */
	public function get_draft_theme_json(): array {
		$draft = $this->get_draft();
		return (array) ( $draft['theme_json'] ?? [] );
	}

	/**
	 * Save a draft and return the preview token.
	 *
	 * @param array<string, mixed> $theme_json
	 */
	public function create_draft( string $css, array $theme_json ): string {
		$token = wp_generate_password( 32, false );
		$draft = [
			'css'        => $css,
			'theme_json' => $theme_json,
		];

		set_transient( self::TRANSIENT_PREFIX . $token, $draft, self::DRAFT_TTL );

		return $token;
	}

	public function discard_draft( string $token ): void {
		delete_transient( self::TRANSIENT_PREFIX . sanitize_key( $token ) );
	}

	/**
	 * @return array<string, mixed>|null
	 */
	private function get_draft(): ?array {
		if ( $this->active_token === null ) {
			return null;
		}

		$draft = get_transient( self::TRANSIENT_PREFIX . $this->active_token );

		return is_array( $draft ) ? $draft : null;
	}
}
