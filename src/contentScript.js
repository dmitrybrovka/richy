'use strict';

const blackButton = {
	name: 'black-button',
	action: function customAction(editor) {
		editor.codemirror.replaceSelection('{red}()');
		// Move the cursor inside the brackets
		const
			cursorPos = editor.codemirror.getCursor();

		editor.codemirror.setCursor(cursorPos.line, cursorPos.ch - 1);
		editor.codemirror.focus();
	},
	className: 'fa fa-font',
	title: 'Insert red text'
};

/**
 * {@link https://github.com/sparksuite/simplemde-markdown-editor}
 */
const areaConfig = {
	spellChecker: false,
	status: false,
	autoDownloadFontAwesome: false,
	forceSync: true,
	shortcuts: {
		drawTable: 'Cmd-Alt-T'
	},
	insertTexts: {
		image: ['![](', ')'],
		link: ['[', ']()']
	},
	toolbar: [
		'bold',
		'italic',
		'strikethrough',
		'heading',
		'|',
		'unordered-list',
		'ordered-list',
		'quote',
		'code',
		'horizontal-rule',
		'table',
		blackButton
	]
}

function richyAreas(dom = document) {
	const areas = dom.getElementsByTagName != null ? Array.from(dom.getElementsByTagName('textarea')) : [];

	areas.forEach((area) => {
		if (!area.closest('.CodeMirror')) {
			const mde = new SimpleMDE({...areaConfig, element: area});
			mde.codemirror.on('change', () => area.dispatchEvent(new Event('input', {bubbles: true})));
		}
	});
}

function debounce(fn, ms = 500) {
	let t;

	return (...args) => {
		clearTimeout(t);
		t = setTimeout(() => fn(...args), ms);
	};
}

function startDaemon() {
	const observerConfig = {
		childList: true,
		subtree: true
	};

	const observer = new MutationObserver(debounce((mutations) => {
		mutations.forEach((mut) => {
			if ([...mut.addedNodes].length > 0) {
				mut.addedNodes.forEach((node) => {
					richyAreas(node);
				});
			}
		});
	}));

	observer.observe(document.body, observerConfig);
}

richyAreas();
startDaemon();
