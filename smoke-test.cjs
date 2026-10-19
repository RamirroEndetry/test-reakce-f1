const {app,BrowserWindow,ipcMain}=require('electron');
const path=require('path');
let board=[],settings=null;
ipcMain.on('board:load',e=>e.returnValue=board);
ipcMain.on('board:save',(e,b)=>{board=b;e.returnValue=true;});
ipcMain.on('settings:load',e=>e.returnValue=settings);
ipcMain.on('settings:save',(e,v)=>{settings=v;e.returnValue=true;});
app.whenReady().then(async()=>{
 const win=new BrowserWindow({show:false,webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false}});
 try{
 await win.loadFile(path.join(__dirname,'index.html'));
 await win.webContents.executeJavaScript(`new Promise(r=>setTimeout(r,900))`);
 const result=await win.webContents.executeJavaScript(`(()=>{
 const $=s=>document.querySelector(s);const check=(ok,msg)=>{if(!ok)throw new Error(msg)};
 $('#admBtn').click();$('#admPass').value=window.APP_CONFIG.adminPassword;$('#admUnlock').click();
 check(!$('#admPanel').hidden,'admin unlock');
 for(const key of ['Phone','Email','Note']) $('#setting'+key).click();
 $('#admClose').click();$('#toSignBtn').click();
 for(const id of ['phoneInput','emailInput','noteInput'])check($('#'+id).disabled&&$('#'+id).closest('label').hidden,id+' hidden');
 check($('#nameInput').dataset.enter==='Uložit','name-only enter');
 $('#nameInput').value='Smoke Test';$('#signBtn').click();
 check($('#signed').textContent.includes('Smoke Test'),'name-only save');
 const img=$('.game-logo');check(img.complete&&img.naturalWidth>0,'logo loaded');
 return 'Admin switches, name-only signup, save confirmation and logo OK';
 })()`);
 if(board.length!==1||board[0].phone||board[0].email||board[0].note)throw new Error('Unexpected saved fields');
 if(settings.phone||settings.email||settings.note)throw new Error('Settings not saved');
 console.log(result);app.exit(0);
 }catch(e){console.error(e);app.exit(1);}
});
