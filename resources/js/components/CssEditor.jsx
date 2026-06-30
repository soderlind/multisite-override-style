import CodeMirror from '@uiw/react-codemirror';
import { css as cssLang } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { __ } from '@wordpress/i18n';

export default function CssEditor( { value, onChange } ) {
	return (
		<div className="mos-css-editor">
			<p className="description">
				{ __(
					'CSS entered here is appended after all theme stylesheets on every subsite front-end (except exempted sites).',
					'multisite-override-style'
				) }
			</p>

			<CodeMirror
				value={ value }
				height="500px"
				extensions={ [ cssLang() ] }
				theme={ oneDark }
				onChange={ onChange }
				basicSetup={ {
					lineNumbers: true,
					foldGutter: true,
					autocompletion: true,
				} }
			/>
		</div>
	);
}
