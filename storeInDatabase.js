const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const chokidar = require('chokidar');
const { parseMarkdownFile } = require('./parseMarkdown'); // Ensure correct import

const db = new sqlite3.Database('./templates.db');

// Function to create the table if it doesn't exist
function createTable() {
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
      keywords TEXT,
      path TEXT UNIQUE
    )`, insertInitialData);
  });
}

// Function to insert or replace data in the database
function insertOrUpdateData(metadata) {
  const insert = db.prepare(`INSERT OR REPLACE INTO templates (
    title, template, date, content_type, tags, author, type, category, language, 
    created_at, last_updated, spin_version, summary, url, keywords, path
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  
  insert.run(
    metadata.title || '', metadata.template || '', metadata.date || '', metadata['content-type'] || '', 
    JSON.stringify(metadata.tags || []), metadata.author || '', metadata.type || '', metadata.category || '', 
    metadata.language || '', metadata.created_at || '', metadata.last_updated || '', metadata.spin_version || '', 
    metadata.summary || '', metadata.url || '', metadata.keywords || '', metadata.path || ''
  );
  
  insert.finalize();
}

// Function to insert initial data into the database
function insertInitialData() {
  const directoryPath = './markdown_files';
  const files = fs.readdirSync(directoryPath); // Directory with your markdown files
  files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    const metadata = parseMarkdownFile(filePath);
    metadata.path = filePath;
    insertOrUpdateData(metadata);
  });
}

// Watch the markdown files directory for changes
const watcher = chokidar.watch('./markdown_files/*.md', { persistent: true });

watcher
  .on('add', filePath => {
    console.log(`File ${filePath} has been added`);
    const metadata = parseMarkdownFile(filePath);
    metadata.path = filePath;
    insertOrUpdateData(metadata);
  })
  .on('change', filePath => {
    console.log(`File ${filePath} has been changed`);
    const metadata = parseMarkdownFile(filePath);
    metadata.path = filePath;
    insertOrUpdateData(metadata);
  })
  .on('unlink', filePath => {
    console.log(`File ${filePath} has been removed`);
    db.run('DELETE FROM templates WHERE path = ?', filePath);
  });

// Create the table and insert initial data
createTable();

// Close the database connection when the process exits
process.on('exit', () => {
  db.close();
});
