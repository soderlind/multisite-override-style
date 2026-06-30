import { useState } from '@wordpress/element';
import {
	TextControl,
	Panel,
	PanelBody,
	Flex,
	FlexItem,
	FlexBlock,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	__experimentalUnitControl as UnitControl,
	Card,
	CardBody,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Convert a name to a valid slug (kebab-case).
 */
function toSlug( name ) {
	return name
		.toLowerCase()
		.replace( /[^a-z0-9]+/g, '-' )
		.replace( /^-|-$/g, '' );
}

const CSS_UNITS = [
	{ value: 'px', label: 'px' },
	{ value: 'em', label: 'em' },
	{ value: 'rem', label: 'rem' },
	{ value: '%', label: '%' },
	{ value: 'vw', label: 'vw' },
];

export default function Spacing( { spacingSizes, onChange, lockedSlugs = new Set() } ) {
	const [ slugsEdited, setSlugsEdited ] = useState( {} );

	const updateName = ( index, name ) => {
		const next = [ ...spacingSizes ];
		const isLocked = lockedSlugs.has( next[ index ].slug );
		if ( isLocked ) return;
		next[ index ] = { ...next[ index ], name };
		if ( ! slugsEdited[ index ] ) {
			next[ index ].slug = toSlug( name );
		}
		onChange( next );
	};

	const updateSlug = ( index, slug ) => {
		const isLocked = lockedSlugs.has( spacingSizes[ index ].slug );
		if ( isLocked ) return;
		setSlugsEdited( { ...slugsEdited, [ index ]: true } );
		const next = [ ...spacingSizes ];
		next[ index ] = { ...next[ index ], slug: toSlug( slug ) };
		onChange( next );
	};

	const update = ( index, field, val ) => {
		const next = [ ...spacingSizes ];
		next[ index ] = { ...next[ index ], [ field ]: val };
		onChange( next );
	};

	return (
		<Panel>
			<PanelBody
				title={ __( 'Spacing Scale', 'network-style-override' ) }
				initialOpen={ false }
			>
				<p className="description">
					{ __( 'Override spacing presets for padding, margin, and gap.', 'network-style-override' ) }
				</p>
				<div style={ { display: 'flex', padding: '0 56px 8px 56px', fontSize: 11, fontWeight: 500, color: '#757575', textTransform: 'uppercase' } }>
					<span style={ { flex: 1 } }>{ __( 'Name', 'network-style-override' ) }</span>
					<span style={ { flex: 1 } }>{ __( 'Identifier', 'network-style-override' ) }</span>
					<span style={ { flex: 1 } }>{ __( 'Size', 'network-style-override' ) }</span>
				</div>

				<VStack spacing={ 3 }>
					{ spacingSizes.map( ( item, i ) => {
						const isLocked = lockedSlugs.has( item.slug );
						return (
							<Card key={ i } size="small">
								<CardBody>
									<Flex align="center" gap={ 3 }>
										<FlexItem>
											<div
												style={ {
													width: 40,
													height: 40,
													background: '#1e1e1e',
													borderRadius: 4,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												} }
											>
												<div
													style={ {
														width: Math.min( parseInt( item.size ) || 16, 32 ),
														height: Math.min( parseInt( item.size ) || 16, 32 ),
														background: '#fff',
														borderRadius: 2,
													} }
												/>
											</div>
										</FlexItem>
										<FlexBlock>
											<HStack alignment="stretch" spacing={ 3 }>
												<TextControl
													placeholder={ __( 'Medium', 'network-style-override' ) }
													value={ item.name }
													onChange={ ( v ) => updateName( i, v ) }
													__nextHasNoMarginBottom
													readOnly={ isLocked }
													disabled={ isLocked }
												/>
												<TextControl
													placeholder={ __( 'medium', 'network-style-override' ) }
													value={ item.slug }
													onChange={ ( v ) => updateSlug( i, v ) }
													__nextHasNoMarginBottom
													readOnly={ isLocked }
													disabled={ isLocked }
												/>
												<UnitControl
													value={ item.size }
													onChange={ ( v ) => update( i, 'size', v ) }
													units={ CSS_UNITS }
													__nextHasNoMarginBottom
												/>
											</HStack>
										</FlexBlock>
									</Flex>
								</CardBody>
							</Card>
						);
					} ) }
				</VStack>
			</PanelBody>
		</Panel>
	);
}
