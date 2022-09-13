'use strict';

var ONE_HOUR = 60 * 60 * 1000; /* ms */
var ONE_DAY = ONE_HOUR * 24;
const CUT_OFF_TIME = ONE_DAY * 90;; // 90 Days to keep

const purgeLogs = async (ref, updates) => {
    await ref.update(updates);
 }

const getOldLogs = async (ref) => {  
  // create a map with all children that need to be removed
  const updates = {};

  await ref.once("value", function(snapshot) {
      let logs = snapshot.val()
      let keys = Object.keys(logs)
      let count = 0;
    
      for(var i=0; i<keys.length; i++) {
          let log = logs[keys[i]];
          const now = Date.now();
          let logTime = new Date(log.timestamp)

          if ((now - logTime) > CUT_OFF_TIME) {
            // console.log(`found[${keys[i]}]: '${log.data}' from '${log.timestamp}'...`)
            updates[keys[i]] = null;
          }
      }
  });

  return updates;
 }

 exports.purgeLogs = purgeLogs;
 exports.getOldLogs = getOldLogs;
