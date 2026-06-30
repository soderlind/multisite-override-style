<?php

declare( strict_types=1 );

// Only run during uninstall.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

if ( ! is_multisite() ) {
	return;
}

require_once __DIR__ . '/vendor/autoload.php';

use NetworkStyleOverride\Storage\RevisionRepository;
use NetworkStyleOverride\Storage\SettingsRepository;

( new SettingsRepository() )->delete_all();
( new RevisionRepository( new SettingsRepository() ) )->delete_all();
