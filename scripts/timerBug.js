let Firebase = require('firebase')
let fb = Firebase.initializeApp({ databaseURL: "https://exitpuzzles-admin.firebaseio.com" })
let db = fb.database()

console.log(`Getting time ...`)

let ref = db.ref('landlord/devices/tnt/time');
// ref.on("value", (s) => {
//     let val = s.val();
//     console.log('got value:');
//     console.dir(val);
// });

// setTimeout(()=>{
//     fb.db.ref('museum/status/foo').update({bar: "blah2"});
// }, 2000)

ref.update({
    hours: 0,
    minutes: 3,
    seconds: 0,
    timestamp: (new Date()).getTime()
})            
