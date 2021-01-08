let fb = new (require('../firebase'))
let fs = require('fs')

console.log(`Getting Status ...`)

let ref = fb.db.ref('museum/status/foo');
ref.on("value", (s) => {
    let val = s.val();
    console.log('got value:');
    console.dir(val);
});

setTimeout(()=>{
    fb.db.ref('museum/status/foo').update({bar: "blah2"});
}, 2000)
