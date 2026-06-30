import { Button, TextControl, Panel, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Spacing( { spacingSizes, onChange } ) {
	const add = () =>
		onChange( [ ...spacingSizes, { name: '', slug: '', size: '' } ] );

	const update = ( index, field, val ) => {
		const next = [ ...spacingSizes ];
		next[ index ] = { ...next[ index ], [ field ]: val };
		onChange( next );
	};

	const remove = ( index ) =>
		onChange( spacingSizes.filter( ( _, i ) => i !== index ) );

	return (
		<Panel>
			<PanelBody title={ __( 'Spacing Scale', 'multisite-override-style' ) } initialOpen={ false }>
				<p className="description">
					{ __( 'Define named spacing sizes used for padding, margin, and gap presets.', 'multisite-override-style' ) }
				</p>

				{ spacingSizes.map( ( item, i ) => (
					<div key={ i } className="mos-spacing-row">
						<TextControl
							label={ __( 'Name', 'multisite-override-style' ) }
							value={ item.name }
							onChange={ ( v ) => update( i, 'name', v ) }
						/>
						<TextControl
							label={ __( 'Slug', 'multisite-override-style' ) }
							value={ item.slug }
							onChange={ ( v ) => update( i, 'slug', v ) }
						/>
						<TextControl
							label={ __( 'Size (CSS value)', 'multisite-override-style' ) }
							value={ item.size }
							onChange={ ( v ) => update( i, 'size', v ) }
							placeholder="e.g. 1rem, 16px"
						/>
						<Button isDestructive variant="tertiary" onClick={ () => remove( i ) }>
							{ __( 'Remove', 'multisite-override-style' ) }
						</Button>
					</div>
				) ) }

				<Button variant="secondary" onClick={ add }>
					{ __( '+ Add spacing size', 'multisite-override-style' ) }
				</Button>
			</PanelBody>
		</Panel>
	);
}
