import assert from 'node:assert/strict';
import {build} from 'esbuild';
await build({entryPoints:['app/countdown.ts'],outfile:'tests/.countdown.mjs',bundle:true,format:'esm',platform:'node',logLevel:'silent'});
const {TERM_START,remainingTime}=await import('./.countdown.mjs');
assert.equal(TERM_START,Date.parse('2027-02-11T03:00:00Z'));
assert.deepEqual(remainingTime(TERM_START-((2*86400+3*3600+4*60+5)*1000)),{days:2,hours:3,minutes:4,seconds:5,complete:false});
assert.deepEqual(remainingTime(TERM_START-1000),{days:0,hours:0,minutes:0,seconds:1,complete:false});
assert.equal(remainingTime(TERM_START-1).complete,false);
for(const now of [TERM_START,TERM_START+86400000])assert.deepEqual(remainingTime(now),{days:0,hours:0,minutes:0,seconds:0,complete:true});
// Returning after a suspended tab recomputes from wall time, with no timer drift.
assert.equal(remainingTime(TERM_START-86400000).days,1);
assert.equal(remainingTime(TERM_START-3600000).hours,1);
console.log('PASS: Brasilia deadline, day/hour/minute/second breakdown, suspended time, zero and post-deadline state.');
