const db = require('./db');

async function main(){
  await db.migrate();
  console.log('migrations applied');
}

main().catch(err => { console.error(err); process.exit(1); });
