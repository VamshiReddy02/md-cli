const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt();

function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const [metaSection] = content.split('---').map(section => section.trim());
  const metadata = {};

  metaSection.split('\n').forEach(line => {
    const [key, value] = line.split('=').map(part => part.trim());
    if (key && value) {
      try {
        metadata[key] = JSON.parse(value);
      } catch {
        metadata[key] = value.replace(/^"(.*)"$/, '$1'); // Remove surrounding quotes
      }
    }
  });

  return metadata;
}

module.exports = parseMarkdownFile;
