import { useState } from '@wordpress/element';
import {
	Button,
	TextControl,
	ColorPicker,
	Popover,
	Panel,
	PanelBody,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

function ColorRow( { color, onChange, onRemove } ) {
	const [ pickerOpen, setPickerOpen ] = useState( false );

	return (
		<div className="mos-color-row">
			<button
				className="mos-color-swatch"
				style={ { backgroundColor: color.color } }
				onClick={ () => setPickerOpen( ( v ) => ! v ) }
				aria-label={ __( 'Pick color', 'multisite-override-style' ) }
			/>

			{ pickerOpen && (
				<Popover onClose={ () => setPickerOpen( false ) }>
					<ColorPicker
						color={ color.color }
						onChange={ ( hex ) =>
							onChange( { ...color, color: hex } )
						}
						enableAlpha={ false }
					/>
				</Popover>
			) }

			<TextControl
				label={ __( 'Name', 'multisite-override-style' ) }
				hideLabelFromVision
				placeholder={ __( 'Name', 'multisite-override-style' ) }
				value={ color.name }
				onChange={ ( name ) => onChange( { ...color, name } ) }
			/>

			<TextControl
				label={ __( 'Slug', 'multisite-override-style' ) }
				hideLabelFromVision
				placeholder={ __( 'slug', 'multisite-override-style' ) }
				value={ color.slug }
				onChange={ ( slug ) => onChange( { ...color, slug } ) }
			/>

			<Button isDestructive variant="tertiary" onClick={ onRemove }>
				{ __( 'Remove', 'multisite-override-style' ) }
			</Button>
		</div>
	);
}

export default function ColorPaletteField( { colors, onChange } ) {
	const addColor = () => {
		onChange( [ ...colors, { name: '', slug: '', color: '#000000' } ] );
	};

	const updateColor = ( index, updated ) => {
		const next = [ ...colors ];
		next[ index ] = updated;
		onChange( next );
	};

	const removeColor = ( index ) => {
		onChange( colors.filter( ( _, i ) => i !== index ) );
	};

	return (
		<Panel>
			<PanelBody
				title={ __( 'Color Palette', 'multisite-override-style' ) }
				initialOpen={ true }
			>
				<div className="mos-color-palette">
					{ colors.map( ( color, index ) => (
						<ColorRow
							key={ index }
							color={ color }
							onChange={ ( updated ) =>
								updateColor( index, updated )
							}
							onRemove={ () => removeColor( index ) }
						/>
					) ) }

					<Button variant="secondary" onClick={ addColor }>
						{ __( '+ Add color', 'multisite-override-style' ) }
					</Button>
				</div>
			</PanelBody>
		</Panel>
	);
}
