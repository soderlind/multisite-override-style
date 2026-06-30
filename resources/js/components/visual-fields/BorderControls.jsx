import { TextControl, Panel, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function BorderControls( { border, onChange } ) {
	const update = ( field, val ) =>
		onChange( { ...border, [ field ]: val } );

	return (
		<Panel>
			<PanelBody title={ __( 'Border Defaults', 'multisite-override-style' ) } initialOpen={ false }>
				<TextControl
					label={ __( 'Border Radius', 'multisite-override-style' ) }
					value={ border.radius ?? '' }
					onChange={ ( v ) => update( 'radius', v ) }
					placeholder="e.g. 4px, 0.25rem"
					help={ __( 'Applied globally via styles.border.radius in theme.json.', 'multisite-override-style' ) }
				/>
				<TextControl
					label={ __( 'Border Width', 'multisite-override-style' ) }
					value={ border.width ?? '' }
					onChange={ ( v ) => update( 'width', v ) }
					placeholder="e.g. 1px"
					help={ __( 'Applied globally via styles.border.width in theme.json.', 'multisite-override-style' ) }
				/>
				<TextControl
					label={ __( 'Border Style', 'multisite-override-style' ) }
					value={ border.style ?? '' }
					onChange={ ( v ) => update( 'style', v ) }
					placeholder="e.g. solid, dashed"
				/>
				<TextControl
					label={ __( 'Border Color', 'multisite-override-style' ) }
					value={ border.color ?? '' }
					onChange={ ( v ) => update( 'color', v ) }
					placeholder="e.g. #cccccc, var(--wp--preset--color--contrast)"
				/>
			</PanelBody>
		</Panel>
	);
}
