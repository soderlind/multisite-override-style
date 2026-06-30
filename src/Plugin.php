<?php

declare( strict_types=1 );

namespace MultisiteOverrideStyle;

use MultisiteOverrideStyle\Admin\EditSiteScreen;
use MultisiteOverrideStyle\Admin\NetworkAdminPage;
use MultisiteOverrideStyle\Admin\RestController;
use MultisiteOverrideStyle\Override\CssOverride;
use MultisiteOverrideStyle\Override\ExemptionChecker;
use MultisiteOverrideStyle\Override\ThemeJsonOverride;
use MultisiteOverrideStyle\Preview\PreviewHandler;
use MultisiteOverrideStyle\Storage\RevisionRepository;
use MultisiteOverrideStyle\Storage\SettingsRepository;

final class Plugin {

	public function init(): void {
		if ( ! is_multisite() ) {
			return;
		}

		$settings  = new SettingsRepository();
		$revisions = new RevisionRepository( $settings );
		$exemption = new ExemptionChecker( $settings );
		$preview   = new PreviewHandler( $settings );

		( new CssOverride( $settings, $exemption, $preview ) )->register();
		( new ThemeJsonOverride( $settings, $exemption, $preview ) )->register();
		( new RestController( $settings, $revisions, $exemption, $preview ) )->register();

		if ( is_admin() ) {
			( new NetworkAdminPage( $settings, $revisions, $preview ) )->register();
			( new EditSiteScreen( $settings ) )->register();
		}
	}
}
