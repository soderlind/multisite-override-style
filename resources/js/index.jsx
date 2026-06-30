import { createRoot } from '@wordpress/element';
import App from './components/App';

const root = document.getElementById( 'mos-admin-app' );
if ( root ) {
	createRoot( root ).render( <App /> );
}
