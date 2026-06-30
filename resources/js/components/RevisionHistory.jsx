import { useState, useEffect, useCallback } from '@wordpress/element';
import { Spinner, Button, Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { getRevisions, restoreRevision } from '../api';

function formatDate( iso ) {
	return new Date( iso ).toLocaleString( undefined, {
		dateStyle: 'medium',
		timeStyle: 'short',
	} );
}

export default function RevisionHistory( { onRestored } ) {
	const [ revisions, setRevisions ] = useState( null );
	const [ error, setError ] = useState( null );
	const [ restoring, setRestoring ] = useState( null );

	const load = useCallback( async () => {
		try {
			const data = await getRevisions();
			setRevisions( data );
		} catch ( e ) {
			setError(
				e.message ??
					__(
						'Failed to load revisions.',
						'multisite-override-style'
					)
			);
		}
	}, [] );

	useEffect( () => {
		load();
	}, [ load ] );

	const handleRestore = async ( revision ) => {
		if (
			! window.confirm(
				__(
					'Restore this revision? The current settings will be saved as a new revision first.',
					'multisite-override-style'
				)
			)
		) {
			return;
		}

		setRestoring( revision.id );
		try {
			const updated = await restoreRevision( revision.id );
			onRestored( updated );
			await load();
		} catch ( e ) {
			setError(
				e.message ?? __( 'Restore failed.', 'multisite-override-style' )
			);
		} finally {
			setRestoring( null );
		}
	};

	return (
		<div className="mos-revision-history">
			<p className="description">
				{ __(
					'The last 10 saves are kept. Restoring a revision saves the current settings as a new revision first.',
					'multisite-override-style'
				) }
			</p>

			{ error && (
				<Notice status="error" onRemove={ () => setError( null ) }>
					{ error }
				</Notice>
			) }

			{ ! revisions ? (
				<Spinner />
			) : revisions.length === 0 ? (
				<p>
					{ __(
						'No revisions yet. Save your settings to create the first revision.',
						'multisite-override-style'
					) }
				</p>
			) : (
				<table className="widefat striped mos-revisions-table">
					<thead>
						<tr>
							<th>
								{ __( 'Saved', 'multisite-override-style' ) }
							</th>
							<th>
								{ __( 'Author', 'multisite-override-style' ) }
							</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{ revisions.map( ( rev, index ) => (
							<tr key={ rev.id }>
								<td>
									{ formatDate( rev.saved_at ) }
									{ index === 0 && (
										<span className="mos-badge">
											{ __(
												'current',
												'multisite-override-style'
											) }
										</span>
									) }
								</td>
								<td>{ rev.author_id }</td>
								<td>
									{ index !== 0 && (
										<Button
											variant="secondary"
											onClick={ () =>
												handleRestore( rev )
											}
											isBusy={ restoring === rev.id }
											disabled={ restoring !== null }
										>
											{ __(
												'Restore',
												'multisite-override-style'
											) }
										</Button>
									) }
								</td>
							</tr>
						) ) }
					</tbody>
				</table>
			) }
		</div>
	);
}
