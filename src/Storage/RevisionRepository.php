<?php

declare( strict_types=1 );

namespace NetworkStyleOverride\Storage;

/**
 * Manages the last 10 revisions of the Network Override.
 *
 * Each revision is an associative array:
 * {
 *   id:         string (unique, timestamp-based)
 *   saved_at:   string (ISO 8601)
 *   author_id:  int
 *   css:        string
 *   theme_json: array
 *   exemptions: int[]
 * }
 *
 * Stored as a JSON array in wp_sitemeta under nso_revisions.
 */
final class RevisionRepository {

	public const KEY_REVISIONS = 'nso_revisions';
	public const MAX_REVISIONS = 10;

	public function __construct(
		private readonly SettingsRepository $settings,
	) {}

	/**
	 * @return array<int, array<string, mixed>>
	 */
	public function all(): array {
		$raw = get_site_option( self::KEY_REVISIONS, '[]' );
		$decoded = json_decode( (string) $raw, true );

		return is_array( $decoded ) ? $decoded : [];
	}

	/**
	 * Snapshot the current live settings as a new revision.
	 */
	public function snapshot( int $author_id ): void {
		$revision = [
			'id'         => uniqid( 'rev_', true ),
			'saved_at'   => gmdate( 'c' ),
			'author_id'  => $author_id,
			'css'        => $this->settings->get_css(),
			'theme_json' => $this->settings->get_theme_json(),
			'exemptions' => $this->settings->get_exemptions(),
		];

		$revisions = $this->all();
		array_unshift( $revisions, $revision );
		$revisions = array_slice( $revisions, 0, self::MAX_REVISIONS );

		update_site_option( self::KEY_REVISIONS, wp_json_encode( $revisions ) );
	}

	/**
	 * @return array<string, mixed>|null
	 */
	public function find( string $revision_id ): ?array {
		foreach ( $this->all() as $revision ) {
			if ( isset( $revision['id'] ) && $revision['id'] === $revision_id ) {
				return $revision;
			}
		}

		return null;
	}

	/**
	 * Restore a revision by writing its values back to live settings.
	 * Creates a new snapshot of the current state before restoring.
	 */
	public function restore( string $revision_id, int $author_id ): bool {
		$revision = $this->find( $revision_id );
		if ( $revision === null ) {
			return false;
		}

		// Snapshot current state before overwriting.
		$this->snapshot( $author_id );

		$this->settings->save_css( (string) ( $revision['css'] ?? '' ) );
		$this->settings->save_theme_json( (array) ( $revision['theme_json'] ?? [] ) );
		$this->settings->save_exemptions( (array) ( $revision['exemptions'] ?? [] ) );

		return true;
	}

	public function delete_all(): void {
		delete_site_option( self::KEY_REVISIONS );
	}
}
