import { useState, useEffect, useCallback } from '@wordpress/element';
import {
	Spinner,
	ToggleControl,
	SearchControl,
	Notice,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { getSites, setExemption } from '../api';

export default function ExemptionList() {
	const [ sites, setSites ] = useState( null );
	const [ search, setSearch ] = useState( '' );
	const [ error, setError ] = useState( null );
	const [ toggling, setToggling ] = useState( new Set() );

	const load = useCallback( async () => {
		try {
			const data = await getSites();
			setSites( data );
		} catch ( e ) {
			setError(
				e.message ??
					__( 'Failed to load sites.', 'network-style-override' )
			);
		}
	}, [] );

	useEffect( () => {
		load();
	}, [ load ] );

	const handleToggle = async ( site ) => {
		const next = ! site.exempted;
		setToggling( ( prev ) => new Set( [ ...prev, site.id ] ) );
		try {
			await setExemption( site.id, next );
			setSites( ( prev ) =>
				prev.map( ( s ) =>
					s.id === site.id ? { ...s, exempted: next } : s
				)
			);
		} catch ( e ) {
			setError(
				e.message ??
					__(
						'Failed to update exemption.',
						'network-style-override'
					)
			);
		} finally {
			setToggling( ( prev ) => {
				const updated = new Set( prev );
				updated.delete( site.id );
				return updated;
			} );
		}
	};

	const filtered = sites
		? sites.filter(
				( s ) =>
					s.name.toLowerCase().includes( search.toLowerCase() ) ||
					s.url.toLowerCase().includes( search.toLowerCase() )
		  )
		: [];

	return (
		<div className="mos-exemption-list">
			<p className="description">
				{ __(
					'Exempted sites will not receive any network CSS or theme.json overrides.',
					'network-style-override'
				) }
			</p>

			{ error && (
				<Notice status="error" onRemove={ () => setError( null ) }>
					{ error }
				</Notice>
			) }

			{ ! sites ? (
				<Spinner />
			) : (
				<>
					<SearchControl
						value={ search }
						onChange={ setSearch }
						placeholder={ __(
							'Search sites…',
							'network-style-override'
						) }
					/>

					<table className="widefat striped mos-sites-table">
						<thead>
							<tr>
								<th>
									{ __( 'Site', 'network-style-override' ) }
								</th>
								<th>
									{ __( 'URL', 'network-style-override' ) }
								</th>
								<th>
									{ __(
										'Exempt from overrides',
										'network-style-override'
									) }
								</th>
							</tr>
						</thead>
						<tbody>
							{ filtered.map( ( site ) => (
								<tr key={ site.id }>
									<td>{ site.name }</td>
									<td>
										<a
											href={ site.url }
											target="_blank"
											rel="noreferrer"
										>
											{ site.url }
										</a>
									</td>
									<td>
										<ToggleControl
											label=""
											checked={ site.exempted }
											onChange={ () =>
												handleToggle( site )
											}
											disabled={ toggling.has( site.id ) }
										/>
									</td>
								</tr>
							) ) }

							{ filtered.length === 0 && (
								<tr>
									<td colSpan={ 3 }>
										{ __(
											'No sites found.',
											'network-style-override'
										) }
									</td>
								</tr>
							) }
						</tbody>
					</table>
				</>
			) }
		</div>
	);
}
