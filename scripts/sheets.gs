// Deploy as Apps Script web app. Set WEBHOOK_SECRET in Script Properties.
const SHEET_MAP = {contacts:'Contacts',volunteers:'Volunteers',partnerships:'Partnerships',corporate:'Corporate',donations:'Donations',careers:'Careers',sponsorships:'Sponsorships',newsletter_subscribers:'Newsletter'};
function doPost(e) {
  const out = x => ContentService.createTextOutput(JSON.stringify(x)).setMimeType(ContentService.MimeType.JSON);
  try {
    const p = JSON.parse(e.postData.contents), secret = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET');
    if (!secret || p.secret !== secret || !SHEET_MAP[p.type] || !p.record) return out({ok:false});
    const lock = LockService.getScriptLock(); lock.waitLock(10000);
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet(); let sh = ss.getSheetByName(SHEET_MAP[p.type]);
      if (!sh) sh = ss.insertSheet(SHEET_MAP[p.type]);
      if (sh.getLastRow() === 0) sh.appendRow(['key','created_at','name','email','mobile','location','message','details','status']);
      const key = p.type + ':' + p.record.id;
      const existing = sh.getLastRow()>1 ? sh.getRange(2,1,sh.getLastRow()-1,1).getValues().flat() : [];
      if (!existing.includes(key)) { const r=p.record; const safe=v=>typeof v==='string' && /^[=+\-@\t\r]/.test(v) ? "'"+v : (v || ''); sh.appendRow([key,r.created_at,r.name,r.email,r.mobile,r.location,r.message,r.details,r.status].map(safe)); }
      return out({ok:true});
    } finally { lock.releaseLock(); }
  } catch(err) { return out({ok:false}); }
}
