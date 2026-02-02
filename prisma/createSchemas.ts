import * as fs from 'fs';
import * as path from 'path';

const sourceSchema = path.join(__dirname, './schema.prisma');
const sqliteTargetSchema = path.join(__dirname, './schema.sqlite.prisma');
const postgresTargetSchema = path.join(__dirname, './schema.postgresql.prisma');

let schema = fs.readFileSync(sourceSchema, 'utf-8');

schema = schema
  .split('\n')
  .filter(line => !line.trim().startsWith('//'))
  .join('\n');

const dataSourceSqlite =
  'datasource db {\n' +
  '  provider = "sqlite"\n' +
  '}\n\n';

const dataSourcePostgres =
  'datasource db {\n' +
  '  provider = "postgresql"\n' +
  '}\n\n';

fs.writeFileSync(sqliteTargetSchema, dataSourceSqlite + schema, 'utf-8');
console.log(`Sqlite schema generated into ${sqliteTargetSchema}.`);

fs.writeFileSync(postgresTargetSchema, dataSourcePostgres + schema, 'utf-8');
console.log(`PostgreSQL schema generated into ${postgresTargetSchema}.`);
