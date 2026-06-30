<?php

declare( strict_types=1 );

namespace NetworkStyleOverride\Override;

use NetworkStyleOverride\Storage\SettingsRepository;

final class ExemptionChecker {

	public function __construct(
		private readonly SettingsRepository $settings,
	) {}

	public function is_current_site_exempted(): bool {
		return $this->settings->is_exempted( (int) get_current_blog_id() );
	}
}
