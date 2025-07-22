import * as monaco from 'monaco-editor';

export const customLightTheme: monaco.editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [
    // JSON syntax highlighting
    { token: 'key', foreground: '0969da' }, // Property keys - blue, no bold
    { token: 'string', foreground: '0a3069' }, // String values - dark blue
    { token: 'string.key', foreground: '0969da' }, // Keys, no bold
    { token: 'string.value', foreground: '0a3069' }, // String values
    { token: 'number', foreground: 'cf222e' }, // Numbers - red
    { token: 'keyword.json', foreground: '8250df' }, // true, false, null - purple
    { token: 'delimiter', foreground: '656d76' }, // Brackets, braces, commas - gray
    { token: 'delimiter.bracket.json', foreground: '656d76' },
    { token: 'delimiter.array.json', foreground: '656d76' },
    { token: 'delimiter.colon.json', foreground: '656d76' },
    { token: 'delimiter.comma.json', foreground: '656d76' },
  ],
  colors: {
    'editor.background': '#ffffff',
    'editor.foreground': '#24292f',
    'editorLineNumber.foreground': '#8c959f',
    'editorLineNumber.activeForeground': '#24292f',
    'editor.lineHighlightBackground': '#f6f8fa',
    'editorCursor.foreground': '#24292f',
    'editor.selectionBackground': '#0969da26',
    'editor.selectionHighlightBackground': '#0969da1a',
    'editorBracketMatch.background': '#0969da26',
    'editorBracketMatch.border': '#0969da',
    'editorError.foreground': '#cf222e',
    'editorWarning.foreground': '#bf8700',
    'editorInfo.foreground': '#0969da',
  }
};

export const customDarkTheme: monaco.editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    // JSON syntax highlighting for dark theme
    { token: 'key', foreground: '79c0ff' }, // Property keys - light blue, no bold
    { token: 'string', foreground: 'a5d6ff' }, // String values - lighter blue
    { token: 'string.key', foreground: '79c0ff' }, // Keys, no bold
    { token: 'string.value', foreground: 'a5d6ff' }, // String values
    { token: 'number', foreground: 'ffa198' }, // Numbers - light red
    { token: 'keyword.json', foreground: 'd2a8ff' }, // true, false, null - light purple
    { token: 'delimiter', foreground: '8b949e' }, // Brackets, braces, commas - gray
    { token: 'delimiter.bracket.json', foreground: '8b949e' },
    { token: 'delimiter.array.json', foreground: '8b949e' },
    { token: 'delimiter.colon.json', foreground: '8b949e' },
    { token: 'delimiter.comma.json', foreground: '8b949e' },
  ],
  colors: {
    'editor.background': '#0d1117',
    'editor.foreground': '#e6edf3',
    'editorLineNumber.foreground': '#7d8590',
    'editorLineNumber.activeForeground': '#e6edf3',
    'editor.lineHighlightBackground': '#161b22',
    'editorCursor.foreground': '#e6edf3',
    'editor.selectionBackground': '#264f78',
    'editor.selectionHighlightBackground': '#264f7833',
    'editorBracketMatch.background': '#264f7866',
    'editorBracketMatch.border': '#79c0ff',
    'editorError.foreground': '#ffa198',
    'editorWarning.foreground': '#d29922',
    'editorInfo.foreground': '#79c0ff',
  }
};

export const defineCustomThemes = (monaco: any) => {
  monaco.editor.defineTheme('encodly-light', customLightTheme);
  monaco.editor.defineTheme('encodly-dark', customDarkTheme);
};