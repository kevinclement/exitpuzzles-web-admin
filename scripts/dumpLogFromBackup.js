// This script will takes a backup file, e.g. fullBackup.json, and will stream
// out the log parts into seperate json files that we could import if needed
//
// Note: fullBackup.json is passed as argument, and is a result of backup run
// by firebase in the cloud and downloaded.
//
// see: https://console.firebase.google.com/project/exitpuzzles-admin/database/backups
//
const fs = require('fs');
let JSONStream = require('JSONStream')
let es = require('event-stream')

let fName = process.argv[2];
let path = process.argv[3] ? process.argv[3] : "landlord";
let outFile = `${path}.logs.json`;

if (!fName) {
    console.error(`ERROR: no filename given.\n`);
    console.error(`Usage: node dumpLogFromBackup.js fullBackup.json`);
    process.exit(1);
}
if (!fs.existsSync(fName)) {
    console.error(`ERROR: file '${fName}' does not exist.`)
    process.exit(1);
}

let reader = fs.createReadStream(fName).setEncoding('UTF8')
let writer = fs.createWriteStream(outFile)

let found = 0;
reader.pipe(JSONStream.parse([path, 'logs', {emitKey: true}]))
    .pipe(es.mapSync((data)=>{
        found++;
        process.stdout.write(`\rcount: ${found} ...` );
        //console.dir(data);
        return [data.key, data.value];
    }))
    .pipe(JSONStream.stringifyObject(null, null, null, 2))
    .pipe(writer)

reader.on('close', () => {
    console.log()
})

// PURE FILE DUMP
// readerStream.on('data', function(chunk) {
//  	// data += chunk
//      //do something with data
//      console.log(chunk)
// })

