<?php

declare( strict_types=1 );

namespace NetworkStyleOverride\Tests\Unit\Storage;

use Brain\Monkey;
use Brain\Monkey\Functions;
use NetworkStyleOverride\Storage\SettingsRepository;
use PHPUnit\Framework\TestCase;

final class SettingsRepositoryTest extends TestCase {

	protected function setUp(): void {
		parent::setUp();
		Monkey\setUp();
	}

	protected function tearDown(): void {
		Monkey\tearDown();
		parent::tearDown();
	}

	public function test_get_css_returns_empty_string_by_default(): void {
		Functions\when( 'get_site_option' )
			->justReturn( '' );

		$repo = new SettingsRepository();
		$this->assertSame( '', $repo->get_css() );
	}

	public function test_save_css_calls_update_site_option(): void {
		Functions\expect( 'update_site_option' )
			->once()
			->with( SettingsRepository::KEY_CSS, 'body { color: red; }' );

		$repo = new SettingsRepository();
		$repo->save_css( 'body { color: red; }' );

		$this->addToAssertionCount( \Mockery::getContainer()->mockery_getExpectationCount() );
	}

	public function test_get_theme_json_returns_empty_array_when_option_is_empty(): void {
		Functions\when( 'get_site_option' )
			->justReturn( '{}' );

		$repo = new SettingsRepository();
		$this->assertSame( [], $repo->get_theme_json() );
	}

	public function test_is_exempted_returns_true_when_blog_id_in_list(): void {
		Functions\when( 'get_site_option' )
			->justReturn( '[1,2,3]' );

		$repo = new SettingsRepository();
		$this->assertTrue( $repo->is_exempted( 2 ) );
	}

	public function test_is_exempted_returns_false_when_blog_id_not_in_list(): void {
		Functions\when( 'get_site_option' )
			->justReturn( '[1,2,3]' );

		$repo = new SettingsRepository();
		$this->assertFalse( $repo->is_exempted( 99 ) );
	}

	public function test_add_exemption_does_not_duplicate(): void {
		Functions\when( 'get_site_option' )
			->justReturn( '[1,2]' );

		// 2 is already in the list — update_site_option must NOT be called.
		Functions\expect( 'update_site_option' )
			->never();

		Functions\when( 'wp_json_encode' )
			->alias( 'json_encode' );

		$repo = new SettingsRepository();
		$repo->add_exemption( 2 );

		$this->addToAssertionCount( \Mockery::getContainer()->mockery_getExpectationCount() );
	}
}
