import { useState } from '@wordpress/element';
import {
	SelectControl,
	Button,
	Spinner,
	Notice,
	TabPanel,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import CssEditor from './CssEditor';
import ThemeJsonEditor from './ThemeJsonEditor';

/**
 * Controlled component for theme-specific overrides.
 *
 * @param {Object}   props
 * @param {Array}    props.themes           - List of network themes.
 * @param {Object}   props.overrides        - All theme overrides keyed by slug.
 * @param {Function} props.onOverrideChange - Called with (slug, override) when override changes.
 * @param {Function} props.onDelete         - Called with (slug) to delete an override.
 * @param {boolean}  props.loading          - Whether data is still loading.
 * @param {boolean}  props.deleting         - Whether a delete is in progress.
 */
export default function ThemeOverrides( {
	themes,
	overrides,
	onOverrideChange,
	onDelete,
	loading,
	deleting,
} ) {
	const [ selectedTheme, setSelectedTheme ] = useState( '' );

	// Auto-select first theme when themes load.
	if ( themes.length > 0 && ! selectedTheme ) {
		setSelectedTheme( themes[ 0 ].slug );
	}

	const currentOverride = overrides[ selectedTheme ] ?? {
		css: '',
		theme_json: {},
	};

	const handleThemeChange = ( slug ) => {
		setSelectedTheme( slug );
	};

	const handleCssChange = ( css ) => {
		onOverrideChange( selectedTheme, { ...currentOverride, css } );
	};

	const handleThemeJsonChange = ( themeJson ) => {
		onOverrideChange( selectedTheme, {
			...currentOverride,
			theme_json: themeJson,
		} );
	};

	const handleDelete = () => {
		if ( ! selectedTheme ) {
			return;
		}

		const confirmMsg = __(
			'Delete all overrides for this theme?',
			'multisite-override-style'
		);
		if ( ! window.confirm( confirmMsg ) ) {
			return;
		}

		onDelete( selectedTheme );
	};

	if ( loading ) {
		return (
			<div style={ { padding: '2rem', textAlign: 'center' } }>
				<Spinner />
			</div>
		);
	}

	if ( themes.length === 0 ) {
		return (
			<Notice status="info" isDismissible={ false }>
				{ __(
					'No themes found in the network.',
					'multisite-override-style'
				) }
			</Notice>
		);
	}

	const themeOptions = themes.map( ( t ) => ( {
		label: `${ t.name } (${ t.slug })${ t.is_block_theme ? '' : ' — Classic' }`,
		value: t.slug,
	} ) );

	const selectedThemeData = themes.find( ( t ) => t.slug === selectedTheme );
	const isBlockTheme = selectedThemeData?.is_block_theme ?? false;

	const hasOverride =
		currentOverride.css !== '' ||
		Object.keys( currentOverride.theme_json ).length > 0;

	const tabs = [
		{ name: 'css', title: __( 'CSS', 'multisite-override-style' ) },
		{
			name: 'theme-json',
			title: __( 'theme.json', 'multisite-override-style' ),
			disabled: ! isBlockTheme,
		},
	];

	return (
		<div className="mos-theme-overrides">
			<p className="description">
				{ __(
					'Add CSS or theme.json overrides that apply only to specific themes. These are applied after the global overrides.',
					'multisite-override-style'
				) }
			</p>

			<SelectControl
				label={ __( 'Select Theme', 'multisite-override-style' ) }
				value={ selectedTheme }
				options={ themeOptions }
				onChange={ handleThemeChange }
				__nextHasNoMarginBottom
				__next40pxDefaultSize
			/>

			{ selectedTheme && (
				<>
					<TabPanel
						tabs={ tabs.filter( ( t ) => ! t.disabled ) }
						className="mos-theme-override-tabs"
					>
						{ ( tab ) => (
							<div className="mos-tab-content">
								{ tab.name === 'css' && (
									<CssEditor
										value={ currentOverride.css }
										onChange={ handleCssChange }
									/>
								) }
								{ tab.name === 'theme-json' && (
									<ThemeJsonEditor
										value={ currentOverride.theme_json }
										onChange={ handleThemeJsonChange }
									/>
								) }
							</div>
						) }
					</TabPanel>

					{ hasOverride && (
						<div
							className="mos-theme-overrides__actions"
							style={ { marginTop: '1rem' } }
						>
							<Button
								variant="secondary"
								isDestructive
								onClick={ handleDelete }
								isBusy={ deleting }
								disabled={ deleting }
							>
								{ __(
									'Delete Override',
									'multisite-override-style'
								) }
							</Button>
						</div>
					) }
				</>
			) }
		</div>
	);
}
