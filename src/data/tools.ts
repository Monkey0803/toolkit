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
  nameZh?: string;
  descriptionZh?: string;
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

export function getTool(route: string): Tool | undefined {
  return tools.find((tool) => tool.route === route);
}

export const tools: Tool[] = [
  { id: 'json-formatter', name: 'JSON Formatter', nameZh: 'JSON 格式化', description: 'Clean, validate and prettify JSON in a readable shape.', descriptionZh: '整理、校验并美化 JSON 文本。', category: 'Developer', icon: '{}', tags: ['json', 'format', 'validate'], route: 'json-formatter' },
  { id: 'word-counter', name: 'Word Counter', nameZh: '字数统计', description: 'Count words, characters and estimated reading time.', descriptionZh: '统计字数、字符数和预计阅读时长。', category: 'Text', icon: 'Aa', tags: ['writing', 'characters', 'reading'], route: 'word-counter' },
  { id: 'case-converter', name: 'Case Converter', nameZh: '大小写转换', description: 'Switch text between title, sentence, camel and snake case.', descriptionZh: '在标题、句首、驼峰和下划线等大小写风格间切换。', category: 'Text', icon: 'Aa', tags: ['text', 'uppercase', 'camelcase'], route: 'case-converter' },
  { id: 'markdown-previewer', name: 'Markdown Previewer', nameZh: 'Markdown 预览', description: 'Preview lightweight Markdown with a clean live layout.', descriptionZh: '用清晰的实时布局预览轻量 Markdown。', category: 'Text', icon: 'M>', tags: ['markdown', 'preview', 'writing'], route: 'markdown-previewer' },
  { id: 'encoding-converter', name: 'Encoding Converter', nameZh: '编码转换', description: 'Base64/32/58/16, URL, Unicode and UTF-8 encode and decode.', descriptionZh: '支持 Base64/32/58/16、URL、Unicode 与 UTF-8 双向编解码。', category: 'Convert', icon: '⇄', tags: ['base64', 'url', 'unicode', 'utf8', 'hex'], route: 'encoding-converter' },
  { id: 'timestamp-converter', name: 'Timestamp Converter', nameZh: '时间戳转换', description: 'Translate Unix timestamps into readable dates and times.', descriptionZh: '将 Unix 时间戳转换为可读日期时间。', category: 'Convert', icon: '12', tags: ['unix', 'date', 'time'], route: 'timestamp-converter' },
  { id: 'unit-converter', name: 'Unit Converter', nameZh: '单位换算', description: 'Convert length, weight, temperature and volume at a glance.', descriptionZh: '一站式换算长度、重量和温度。', category: 'Everyday', icon: '<>', tags: ['units', 'metric', 'imperial'], route: 'unit-converter' },
  { id: 'uuid-generator', name: 'UUID Generator', nameZh: 'UUID 生成器', description: 'Generate unique IDs for records, mocks and prototypes.', descriptionZh: '为记录、示例和原型生成唯一 ID。', category: 'Developer', icon: 'ID', tags: ['uuid', 'id', 'random'], route: 'uuid-generator' },
  { id: 'regex-tester', name: 'Regex Tester', nameZh: '正则测试', description: 'Check patterns against sample text with readable matches.', descriptionZh: '检查测试文本中的正则匹配。', category: 'Developer', icon: '.*', tags: ['regex', 'pattern', 'developer'], route: 'regex-tester' },
  { id: 'color-converter', name: 'Color Converter', nameZh: '颜色转换', description: 'Move between HEX, RGB, HSL and named color values.', descriptionZh: '在 HEX、RGB、HSL 颜色值之间实时转换。', category: 'Image & Color', icon: '#', tags: ['hex', 'rgb', 'hsl', 'color'], route: 'color-converter' },
  { id: 'contrast-checker', name: 'Contrast Checker', nameZh: '对比度检查', description: 'Check foreground and background contrast for readable UI.', descriptionZh: '检查前景与背景对比度，确保界面文字可读。', category: 'Image & Color', icon: 'A/', tags: ['accessibility', 'wcag', 'color'], route: 'contrast-checker' },
  { id: 'gradient-generator', name: 'Gradient Generator', nameZh: '渐变生成器', description: 'Build simple CSS gradients with balanced color stops.', descriptionZh: '生成色彩均衡的 CSS 渐变。', category: 'Image & Color', icon: '///', tags: ['css', 'gradient', 'design'], route: 'gradient-generator' },
  { id: 'image-resizer', name: 'Image Resizer', nameZh: '图片缩放', description: 'Calculate proportional image sizes before exporting assets.', descriptionZh: '缩放图片并导出为 PNG 或 JPEG。', category: 'Image & Color', icon: 'img', tags: ['image', 'resize', 'design'], route: 'image-resizer' },
  { id: 'qr-code-maker', name: 'QR Code Maker', nameZh: '二维码生成', description: 'Turn a link or short message into a scannable code.', descriptionZh: '将链接或短消息转换为可扫描二维码。', category: 'Generators', icon: 'QR', tags: ['qr', 'link', 'share'], route: 'qr-code-maker' },
  { id: 'password-generator', name: 'Password Generator', nameZh: '密码生成器', description: 'Create strong random passwords with custom length.', descriptionZh: '按自定义长度生成强随机密码。', category: 'Generators', icon: 'key', tags: ['security', 'random', 'password'], route: 'password-generator' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum', nameZh: '占位文本', description: 'Generate placeholder copy for layouts and early prototypes.', descriptionZh: '为布局和早期原型生成占位文本。', category: 'Generators', icon: '...', tags: ['copy', 'placeholder', 'design'], route: 'lorem-ipsum' },
  { id: 'percentage-calculator', name: 'Percentage Calculator', nameZh: '百分比计算', description: 'Work out percentages, increases, decreases and differences.', descriptionZh: '计算百分比、增减和差值。', category: 'Everyday', icon: '%', tags: ['math', 'percentage', 'calculator'], route: 'percentage-calculator' },
  { id: 'tip-calculator', name: 'Tip Calculator', nameZh: '小费计算', description: 'Split a bill and calculate a fair tip in seconds.', descriptionZh: '快速分摊账单并计算小费。', category: 'Everyday', icon: '$', tags: ['money', 'bill', 'tip'], route: 'tip-calculator' },
  { id: 'date-difference', name: 'Date Difference', nameZh: '日期差值', description: 'See the exact distance between two dates or milestones.', descriptionZh: '查看两个日期之间的精确距离。', category: 'Everyday', icon: 'CAL', tags: ['date', 'calendar', 'days'], route: 'date-difference' },
  { id: 'text-diff', name: 'Text Diff', nameZh: '文本对比', description: 'Compare two texts line by line with added and removed highlights.', descriptionZh: '逐行对比两段文本，高亮新增与删除。', category: 'Text', icon: '<>', tags: ['diff', 'compare', 'text'], route: 'text-diff' },
  { id: 'line-tools', name: 'Line Tools', nameZh: '文本行工具', description: 'Sort, deduplicate, trim and filter lines of text.', descriptionZh: '对文本行排序、去重、清理和筛选。', category: 'Text', icon: '≡', tags: ['lines', 'sort', 'text'], route: 'line-tools' },
  { id: 'image-to-base64', name: 'Image to Base64', nameZh: '图片转 Base64', description: 'Turn an image file into a Base64 data URI.', descriptionZh: '将图片文件转换为 Base64 data URI。', category: 'Convert', icon: '%3', tags: ['image', 'base64', 'datauri'], route: 'image-to-base64' },
  { id: 'jwt-decoder', name: 'JWT Decoder', nameZh: 'JWT 解码器', description: 'Inspect JWT header and payload without verifying the signature.', descriptionZh: '查看 JWT 的 Header 与 Payload，不校验签名。', category: 'Developer', icon: 'JWT', tags: ['jwt', 'token', 'decode'], route: 'jwt-decoder' },
  { id: 'hash-generator', name: 'Hash Generator', nameZh: '哈希生成器', description: 'Compute SHA-1/256/384/512 hashes in your browser.', descriptionZh: '在浏览器中计算 SHA-1/256/384/512 哈希。', category: 'Developer', icon: '#h', tags: ['hash', 'sha', 'security'], route: 'hash-generator' },
  { id: 'number-base', name: 'Base Converter', nameZh: '进制转换', description: 'Convert numbers between binary, octal, decimal and hex.', descriptionZh: '在二进制、八进制、十进制和十六进制间转换。', category: 'Developer', icon: '0x', tags: ['base', 'hex', 'binary'], route: 'number-base' },
  { id: 'loan-calculator', name: 'Loan Calculator', nameZh: '房贷计算器', description: 'Estimate monthly payment and total interest for a loan.', descriptionZh: '计算贷款月供与总利息。', category: 'Everyday', icon: '¥', tags: ['loan', 'mortgage', 'money'], route: 'loan-calculator' },
  { id: 'bmi-calculator', name: 'BMI Calculator', nameZh: 'BMI 计算器', description: 'Calculate body mass index from height and weight.', descriptionZh: '由身高体重计算身体质量指数。', category: 'Everyday', icon: 'BMI', tags: ['bmi', 'health', 'body'], route: 'bmi-calculator' },
];
