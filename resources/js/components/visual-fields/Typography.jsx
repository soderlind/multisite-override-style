import { Button, TextControl, Panel, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Typography( { fontFamilies, fontSizes, onChange } ) {
	const updateFontFamilies = ( updated ) =>
		onChange( { fontFamilies: updated, fontSizes } );

	const updateFontSizes = ( updated ) =>
		onChange( { fontFamilies, fontSizes: updated } );

	const addFontFamily = () =>
		updateFontFamilies( [
			...fontFamilies,
			{ name: '', slug: '', fontFamily: '' },
		] );

	const updateFamily = ( index, field, val ) => {
		const next = [ ...fontFamilies ];
		next[ index ] = { ...next[ index ], [ field ]: val };
		updateFontFamilies( next );
	};

	const removeFamily = ( index ) =>
		updateFontFamilies( fontFamilies.filter( ( _, i ) => i !== index ) );

	const addFontSize = () =>
		updateFontSizes( [ ...fontSizes, { name: '', slug: '', size: '' } ] );

	const updateSize = ( index, field, val ) => {
		const next = [ ...fontSizes ];
		next[ index ] = { ...next[ index ], [ field ]: val };
		updateFontSizes( next );
	};

	const removeSize = ( index ) =>
		updateFontSizes( fontSizes.filter( ( _, i ) => i !== index ) );

	return (
		<>
			<Panel>
				<PanelBody
					title={ __( 'Font Families', 'multisite-override-style' ) }
					initialOpen={ true }
				>
					{ fontFamilies.map( ( family, i ) => (
						<div key={ i } className="mos-font-family-row">
							<TextControl
								label={ __(
									'Name',
									'multisite-override-style'
								) }
								value={ family.name }
								onChange={ ( v ) =>
									updateFamily( i, 'name', v )
								}
							/>
							<TextControl
								label={ __(
									'Slug',
									'multisite-override-style'
								) }
								value={ family.slug }
								onChange={ ( v ) =>
									updateFamily( i, 'slug', v )
								}
							/>
							<TextControl
								label={ __(
									'Font Family CSS',
									'multisite-override-style'
								) }
								value={ family.fontFamily }
								onChange={ ( v ) =>
									updateFamily( i, 'fontFamily', v )
								}
								placeholder="e.g. Georgia, serif"
							/>
							<Button
								isDestructive
								variant="tertiary"
								onClick={ () => removeFamily( i ) }
							>
								{ __( 'Remove', 'multisite-override-style' ) }
							</Button>
						</div>
					) ) }
					<Button variant="secondary" onClick={ addFontFamily }>
						{ __(
							'+ Add font family',
							'multisite-override-style'
						) }
					</Button>
				</PanelBody>
			</Panel>

			<Panel>
				<PanelBody
					title={ __( 'Font Sizes', 'multisite-override-style' ) }
					initialOpen={ false }
				>
					{ fontSizes.map( ( size, i ) => (
						<div key={ i } className="mos-font-size-row">
							<TextControl
								label={ __(
									'Name',
									'multisite-override-style'
								) }
								value={ size.name }
								onChange={ ( v ) => updateSize( i, 'name', v ) }
							/>
							<TextControl
								label={ __(
									'Slug',
									'multisite-override-style'
								) }
								value={ size.slug }
								onChange={ ( v ) => updateSize( i, 'slug', v ) }
							/>
							<TextControl
								label={ __(
									'Size (CSS value)',
									'multisite-override-style'
								) }
								value={ size.size }
								onChange={ ( v ) => updateSize( i, 'size', v ) }
								placeholder="e.g. 1rem, 16px, clamp(1rem,2vw,1.5rem)"
							/>
							<Button
								isDestructive
								variant="tertiary"
								onClick={ () => removeSize( i ) }
							>
								{ __( 'Remove', 'multisite-override-style' ) }
							</Button>
						</div>
					) ) }
					<Button variant="secondary" onClick={ addFontSize }>
						{ __( '+ Add font size', 'multisite-override-style' ) }
					</Button>
				</PanelBody>
			</Panel>
		</>
	);
}
