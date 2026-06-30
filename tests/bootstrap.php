<?php

declare( strict_types=1 );

require_once dirname( __DIR__ ) . '/vendor/autoload.php';

// Stub WP constants required by classes under test.
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', '/' );
}
if ( ! defined( 'MOS_VERSION' ) ) {
	define( 'MOS_VERSION', '1.0.0-test' );
}

\Brain\Monkey\setUp();
