import { useState, useRef } from '@wordpress/element';
import { Button, Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { exportSettings, importSettings } from '../api';

export default function ImportExport( { settings, onImported } ) {
	const [ error, setError ]       = useState( null );
	const [ success, setSuccess ]   = useState( null );
	const [ importing, setImporting ] = useState( false );
	const fileInputRef = useRef( null );

	const handleExport = async () => {
		try {
			const bundle = await exportSettings();
			const blob = new Blob( [ JSON.stringify( bundle, null, 2 ) ], { type: 'application/json' } );
			const url  = URL.createObjectURL( blob );
			const a    = document.createElement( 'a' );
			a.href     = url;
			a.download = `mos-settings-${ new Date().toISOString().slice( 0, 10 ) }.json`;
			a.click();
			URL.revokeObjectURL( url );
		} catch ( e ) {
			setError( e.message ?? __( 'Export failed.', 'multisite-override-style' ) );
		}
	};

	const handleFileChange = async ( event ) => {
		const file = event.target.files?.[ 0 ];
		if ( ! file ) return;

		if ( ! window.confirm(
			__( 'This will overwrite all current settings (CSS, theme.json, exemptions). The current settings will be saved as a revision first. Continue?', 'multisite-override-style' ),
		) ) {
			event.target.value = '';
			return;
		}

		setImporting( true );
		setError( null );
		setSuccess( null );

		try {
			const text   = await file.text();
			const bundle = JSON.parse( text );

			if ( ! bundle.css && ! bundle.theme_json ) {
				throw new Error( __( 'Invalid bundle: missing css or theme_json fields.', 'multisite-override-style' ) );
			}

			const updated = await importSettings( {
				css:        bundle.css ?? '',
				theme_json: bundle.theme_json ?? {},
				exemptions: bundle.exemptions ?? [],
			} );

			onImported( updated );
			setSuccess( __( 'Settings imported successfully.', 'multisite-override-style' ) );
		} catch ( e ) {
			setError( e.message ?? __( 'Import failed. Make sure the file is a valid MOS export.', 'multisite-override-style' ) );
		} finally {
			setImporting( false );
			event.target.value = '';
		}
	};

	return (
		<div className="mos-import-export">
			{ error && (
				<Notice status="error" onRemove={ () => setError( null ) }>{ error }</Notice>
			) }
			{ success && (
				<Notice status="success" onRemove={ () => setSuccess( null ) }>{ success }</Notice>
			) }

			<div className="mos-import-export__section">
				<h3>{ __( 'Export', 'multisite-override-style' ) }</h3>
				<p>{ __( 'Download all current settings (CSS, theme.json, exemptions) as a JSON file.', 'multisite-override-style' ) }</p>
				<Button variant="secondary" onClick={ handleExport }>
					{ __( 'Export settings', 'multisite-override-style' ) }
				</Button>
			</div>

			<div className="mos-import-export__section">
				<h3>{ __( 'Import', 'multisite-override-style' ) }</h3>
				<p>{ __( 'Import settings from a previously exported JSON file. Current settings will be preserved as a revision.', 'multisite-override-style' ) }</p>

				<input
					ref={ fileInputRef }
					type="file"
					accept="application/json,.json"
					onChange={ handleFileChange }
					style={ { display: 'none' } }
					aria-label={ __( 'Select JSON file to import', 'multisite-override-style' ) }
				/>

				<Button
					variant="secondary"
					onClick={ () => fileInputRef.current?.click() }
					isBusy={ importing }
					disabled={ importing }
				>
					{ __( 'Import settings…', 'multisite-override-style' ) }
				</Button>
			</div>
		</div>
	);
}
