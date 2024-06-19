const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const sqlite3 = require('sqlite3').verbose();
const parseMarkdownFile = require('./parseMarkdown');

const db = new sqlite3.Database('./templates.db');

// Function to list all templates
function listTemplates() {
  const query = 'SELECT title FROM templates';
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }
    rows.forEach(row => {
      console.log(row.title);
    });
  });
}

// Function to filter templates by criteria
function filterTemplates(argv) {
  const filters = [];
  if (argv.language) {
    filters.push(`language = '${argv.language}'`);
  }
  if (argv.author) {
    filters.push(`author = '${argv.author}'`);
  }

  const query = `SELECT title FROM templates ${filters.length ? 'WHERE ' + filters.join(' AND ') : ''}`;
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }
    rows.forEach(row => {
      console.log(row.title);
    });
  });
}

yargs
  .command({
    command: 'hub template list',
    describe: 'List all templates',
    handler: listTemplates
  })
  .command({
    command: 'hub template filter',
    describe: 'Filter templates by criteria',
    builder: {
      language: {
        describe: 'Language to filter by',
        type: 'string'
      },
      author: {
        describe: 'Author to filter by',
        type: 'string'
      }
    },
    handler: filterTemplates
  })
  .help()
  .argv;
