import { SQLite } from 'expo';

// QA
//module.exports = SQLite.openDatabase('evaluacionesSQLite.db');

// PROD
module.exports = SQLite.openDatabase('evaluacionesSQLiteAPK.db');