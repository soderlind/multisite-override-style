import { __ } from '@wordpress/i18n';
import ColorPalette from '../visual-fields/ColorPalette';
import Typography from '../visual-fields/Typography';
import Spacing from '../visual-fields/Spacing';
import BorderControls from '../visual-fields/BorderControls';

function getPath( obj, ...keys ) {
	return keys.reduce( ( acc, key ) => ( acc && acc[ key ] !== undefined ? acc[ key ] : undefined ), obj );
}

function setPath( obj, keys, value ) {
	if ( keys.length === 0 ) return value;
	const [ head, ...tail ] = keys;
	return {
		...obj,
		[ head ]: setPath( obj?.[ head ] ?? {}, tail, value ),
	};
}

export default function VisualTab( { value, onChange } ) {
	const update = ( keys, fieldValue ) => {
		onChange( setPath( value ?? {}, keys, fieldValue ) );
	};

	return (
		<div className="mos-visual-tab">
			<ColorPalette
				colors={ getPath( value, 'settings', 'color', 'palette' ) ?? [] }
				onChange={ ( colors ) => update( [ 'settings', 'color', 'palette' ], colors ) }
			/>

			<Typography
				fontFamilies={ getPath( value, 'settings', 'typography', 'fontFamilies' ) ?? [] }
				fontSizes={ getPath( value, 'settings', 'typography', 'fontSizes' ) ?? [] }
				onChange={ ( typography ) => update( [ 'settings', 'typography' ], {
					...( getPath( value, 'settings', 'typography' ) ?? {} ),
					...typography,
				} ) }
			/>

			<Spacing
				spacingSizes={ getPath( value, 'settings', 'spacing', 'spacingSizes' ) ?? [] }
				onChange={ ( sizes ) => update( [ 'settings', 'spacing', 'spacingSizes' ], sizes ) }
			/>

			<BorderControls
				border={ getPath( value, 'styles', 'border' ) ?? {} }
				onChange={ ( border ) => update( [ 'styles', 'border' ], border ) }
			/>
		</div>
	);
}
