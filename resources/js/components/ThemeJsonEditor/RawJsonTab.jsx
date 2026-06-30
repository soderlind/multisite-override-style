import { useState, useEffect } from '@wordpress/element';
import { Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import CodeMirror from '@uiw/react-codemirror';
import { json as jsonLang } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';

export default function RawJsonTab( { value, onChange } ) {
	const [ raw, setRaw ]       = useState( () => JSON.stringify( value ?? {}, null, 2 ) );
	const [ jsonError, setJsonError ] = useState( null );

	useEffect( () => {
		setRaw( JSON.stringify( value ?? {}, null, 2 ) );
	}, [] ); // intentionally run once; user controls the raw value from here

	const handleChange = ( text ) => {
		setRaw( text );
		try {
			const parsed = JSON.parse( text );
			setJsonError( null );
			onChange( parsed );
		} catch {
			setJsonError( __( 'Invalid JSON — changes will not be saved until fixed.', 'multisite-override-style' ) );
		}
	};

	return (
		<div className="mos-raw-json-tab">
			{ jsonError && (
				<Notice status="warning" isDismissible={ false }>{ jsonError }</Notice>
			) }

			<CodeMirror
				value={ raw }
				height="500px"
				extensions={ [ jsonLang() ] }
				theme={ oneDark }
				onChange={ handleChange }
				basicSetup={ { lineNumbers: true, foldGutter: true } }
			/>
		</div>
	);
}
