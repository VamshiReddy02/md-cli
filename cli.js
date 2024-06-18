const yargs = require('yargs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./templates.db');

yargs
  .command({
    command: 'list',
    describe: 'List all templates',
    handler: () => {
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
  })
  .command({
    command: 'filter',
    describe: 'Filter templates by criteria',
    builder: {
      language: {
        describe: 'Language to filter by',
        type: 'string'
      }
    },
    handler: (argv) => {
      const filters = [];
      if (argv.language) {
        filters.push(`language = '${argv.language}'`);
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
  })
  .help()
  .argv;
