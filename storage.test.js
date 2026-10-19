const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const store=require('./storage');
function fixture(t){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'brembo-store-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return path.join(dir,'board.json');}
test('latest contacts survive restart and damage to primary',t=>{const f=fixture(t);store.save(f,[{name:'A'}]);store.save(f,[{name:'A'},{name:'B'}]);assert.equal(store.load(f).length,2);fs.writeFileSync(f,'{');assert.equal(store.load(f).length,2);store.save(f,[{name:'A'},{name:'B'},{name:'C'}]);assert.equal(store.load(f).length,3);});
test('interrupted first save recovers flushed temporary file',t=>{const f=fixture(t);fs.writeFileSync(f+'.tmp','[{"name":"A"}]');assert.equal(store.load(f)[0].name,'A');});
test('committed primary wins over pending write; reset stays empty',t=>{const f=fixture(t);store.save(f,[{name:'A'}]);fs.writeFileSync(f+'.tmp','[{"name":"B"}]');assert.equal(store.load(f)[0].name,'A');store.save(f,[]);assert.deepEqual(store.load(f),[]);fs.writeFileSync(f,'bad');assert.deepEqual(store.load(f),[]);});
test('damaged copies are preserved and writes fail visibly',t=>{const f=fixture(t);fs.writeFileSync(f,'damaged');fs.writeFileSync(f+'.bak','also damaged');assert.throws(()=>store.load(f));assert.throws(()=>store.save(f,[]));assert.equal(fs.readFileSync(f,'utf8'),'damaged');});
test('settings persist false values',t=>{const f=fixture(t);const valid=v=>v&&typeof v==='object'&&!Array.isArray(v);store.save(f,{phone:false,email:false,note:false},valid);assert.deepEqual(store.load(f,valid),{phone:false,email:false,note:false});});
