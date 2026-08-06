export type ToolCategory =
  | 'Text'
  | 'Convert'
  | 'Developer'
  | 'Image & Color'
  | 'Generators'
  | 'Everyday';

export type Tool = {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  tags: string[];
  route?: string;
};

export const categories: Array<'All' | ToolCategory> = [
  'All',
  'Text',
  'Convert',
  'Developer',
  'Image & Color',
  'Generators',
  'Everyday',
];

export const tools: Tool[] = [
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Clean, validate and prettify JSON in a readable shape.', category: 'Developer', icon: '{}', tags: ['json', 'format', 'validate'], route: 'json-formatter' },
  { id: 'word-counter', name: 'Word Counter', description: 'Count words, characters and estimated reading time.', category: 'Text', icon: 'Aa', tags: ['writing', 'characters', 'reading'], route: 'word-counter' },
  { id: 'case-converter', name: 'Case Converter', description: 'Switch text between title, sentence, camel and snake case.', category: 'Text', icon: 'Aa', tags: ['text', 'uppercase', 'camelcase'], route: 'case-converter' },
  { id: 'markdown-previewer', name: 'Markdown Previewer', description: 'Preview lightweight Markdown with a clean live layout.', category: 'Text', icon: 'M>', tags: ['markdown', 'preview', 'writing'], route: 'markdown-previewer' },
  { id: 'base64-encoder', name: 'Base64 Encoder', description: 'Encode or decode text and small payloads in Base64.', category: 'Convert', icon: '64', tags: ['base64', 'encode', 'decode'], route: 'base64-encoder' },
  { id: 'url-encoder', name: 'URL Encoder', description: 'Safely encode or decode URL components for the web.', category: 'Convert', icon: '%/', tags: ['url', 'uri', 'encode'], route: 'url-encoder' },
  { id: 'timestamp-converter', name: 'Timestamp Converter', description: 'Translate Unix timestamps into readable dates and times.', category: 'Convert', icon: '12', tags: ['unix', 'date', 'time'], route: 'timestamp-converter' },
  { id: 'unit-converter', name: 'Unit Converter', description: 'Convert length, weight, temperature and volume at a glance.', category: 'Everyday', icon: '<>', tags: ['units', 'metric', 'imperial'], route: 'unit-converter' },
  { id: 'uuid-generator', name: 'UUID Generator', description: 'Generate unique IDs for records, mocks and prototypes.', category: 'Developer', icon: 'ID', tags: ['uuid', 'id', 'random'], route: 'uuid-generator' },
  { id: 'regex-tester', name: 'Regex Tester', description: 'Check patterns against sample text with readable matches.', category: 'Developer', icon: '.*', tags: ['regex', 'pattern', 'developer'], route: 'regex-tester' },
  { id: 'color-converter', name: 'Color Converter', description: 'Move between HEX, RGB, HSL and named color values.', category: 'Image & Color', icon: '#', tags: ['hex', 'rgb', 'hsl', 'color'], route: 'color-converter' },
  { id: 'contrast-checker', name: 'Contrast Checker', description: 'Check foreground and background contrast for readable UI.', category: 'Image & Color', icon: 'A/', tags: ['accessibility', 'wcag', 'color'], route: 'contrast-checker' },
  { id: 'gradient-generator', name: 'Gradient Generator', description: 'Build simple CSS gradients with balanced color stops.', category: 'Image & Color', icon: '///', tags: ['css', 'gradient', 'design'], route: 'gradient-generator' },
  { id: 'image-resizer', name: 'Image Resizer', description: 'Calculate proportional image sizes before exporting assets.', category: 'Image & Color', icon: 'img', tags: ['image', 'resize', 'design'] },
  { id: 'qr-code-maker', name: 'QR Code Maker', description: 'Turn a link or short message into a scannable code.', category: 'Generators', icon: 'QR', tags: ['qr', 'link', 'share'] },
  { id: 'password-generator', name: 'Password Generator', description: 'Create strong random passwords with custom length.', category: 'Generators', icon: 'key', tags: ['security', 'random', 'password'], route: 'password-generator' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum', description: 'Generate placeholder copy for layouts and early prototypes.', category: 'Generators', icon: '...', tags: ['copy', 'placeholder', 'design'], route: 'lorem-ipsum' },
  { id: 'percentage-calculator', name: 'Percentage Calculator', description: 'Work out percentages, increases, decreases and differences.', category: 'Everyday', icon: '%', tags: ['math', 'percentage', 'calculator'], route: 'percentage-calculator' },
  { id: 'tip-calculator', name: 'Tip Calculator', description: 'Split a bill and calculate a fair tip in seconds.', category: 'Everyday', icon: '$', tags: ['money', 'bill', 'tip'], route: 'tip-calculator' },
  { id: 'date-difference', name: 'Date Difference', description: 'See the exact distance between two dates or milestones.', category: 'Everyday', icon: 'CAL', tags: ['date', 'calendar', 'days'], route: 'date-difference' },
];
