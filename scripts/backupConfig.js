let fb = new (require('../firebase'))
let fs = require('fs')

let ROOT = getRootFolder();

console.log(`Backup Firebase DBs ...`)

let dbs = ['landlord', 'museum'];

// NOTE: missing ['logs'], too big to dump like this
//   'logs' and 'operations' might get too big to dump and might have to be removed
let tables = ['devices','status', 'runs', 'operations'];

let refCount = 0;
let dumpCount = 0;
dbs.forEach(db => {
    tables.forEach(table => {
        refCount++;
        let tableRef = fb.db.ref(`/${db}/${table}`)
        tableRef.once("value", (s) => {
            console.log(`  dumping ${db}/${table}...`)
            let tableFolder = `${ROOT}/${db}`
            let fName = `${tableFolder}/${table}.json`
            let val = s.val()

            fs.mkdirSync(tableFolder, { recursive: true })
            data = val == null ? {} : val;

            fs.writeFileSync(fName, JSON.stringify(data, null, 2))

            if (++dumpCount == refCount) {
                console.log("DONE.")
                process.exit();
            }
        })
    });
});

function getRootFolder() {
    let rootDir = 'backup'
    let today = new Date
    let month = today.getUTCMonth() + 1
    let day = today.getUTCDate()

    // zero pad folders
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;

    return `${rootDir}/${today.getUTCFullYear()}/${month}-${day}`
}