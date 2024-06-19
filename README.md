# Markdown parser cli

 Markdown parser CLI is a command-line interface tool for managing templates stored in markdown files. It allows you to parse markdown files, store the metadata in a SQLite database, and query the database to list or filter templates based on specified criteria.

## Features

- Parse markdown files and extract metadata.
- Store metadata in a SQLite database.
- List all templates with their titles.
- Filter templates by language and list their titles.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [SQLite3](https://www.sqlite.org/)

## Installation

1. Clone the repository or download the source code.

    ```bash
    git clone https://github.com/yourusername/md-parser-cli.git
    cd md-parser-cli
    ```

2. Install the required dependencies.

    ```bash
    npm install
    ```

## Usage

### Parsing Markdown Files and Storing in Database

1. Place your markdown files in the `markdown_files` directory.

2. Run the script to parse the markdown files and store the metadata in the SQLite database.

    ```bash
    node storeInDatabase.js
    ```

### Command Line Interface

You can use the CLI to list all templates or filter templates by language.

#### List All Templates

To list all templates, showing only their titles:

```bash
node cli.js hub template list
