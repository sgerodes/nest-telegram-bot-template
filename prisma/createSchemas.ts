import * as fs from 'fs';
import * as path from 'path';

const sourceSchema = path.join(__dirname, './schema.prisma');
const sqliteTargetSchema = path.join(__dirname, './schema.sqlite.prisma');
const postgresTargetSchema = path.join(__dirname, './schema.postgresql.prisma');

let schema = fs.readFileSync(sourceSchema, 'utf-8');

const dataSourceSqlite = "datasource db {\n" +
  "  provider = \"sqlite\"\n" +
  "  url      = env(\"DATABASE_URL\")\n" +
  "}\n\n";

const dataSourcePostgres = "datasource db {\n" +
  "  provider = \"postgresql\"\n" +
  "  url      = env(\"DATABASE_URL\")\n" +
  "}\n\n";

fs.writeFileSync(sqliteTargetSchema, dataSourceSqlite + schema, 'utf-8');
console.log(`Sqlite schema generated into ${sqliteTargetSchema}.`);

fs.writeFileSync(postgresTargetSchema, dataSourcePostgres + schema, 'utf-8');
console.log(`PostgreSQL schema generated into ${postgresTargetSchema}.`);