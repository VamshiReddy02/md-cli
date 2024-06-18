const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const parseMarkdownFile = require('./parseMarkdown');

const db = new sqlite3.Database('./templates.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS templates (
    id INTEGER PRIMARY KEY,
    title TEXT,
    template TEXT,
    date TEXT,
    content_type TEXT,
    tags TEXT,
    author TEXT,
    type TEXT,
    category TEXT,
    language TEXT,
    created_at TEXT,
    last_updated TEXT,
    spin_version TEXT,
    summary TEXT,
    url TEXT,
    keywords TEXT
  )`);

  const insert = db.prepare(`INSERT INTO templates (
    title, template, date, content_type, tags, author, type, category, language, 
    created_at, last_updated, spin_version, summary, url, keywords
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const directoryPath = './markdown_files';
  const files = fs.readdirSync(directoryPath); // Directory with your markdown files
  files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    const metadata = parseMarkdownFile(filePath);

    insert.run(
      metadata.title, metadata.template, metadata.date, metadata['content-type'], 
      JSON.stringify(metadata.tags), metadata.author, metadata.type, metadata.category, 
      metadata.language, metadata.created_at, metadata.last_updated, metadata.spin_version, 
      metadata.summary, metadata.url, metadata.keywords
    );
  });

  insert.finalize();
});

db.close();
