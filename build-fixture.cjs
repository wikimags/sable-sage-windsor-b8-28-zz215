const fs=require('fs'),path=require('path'),assert=require('assert');
const root=__dirname;fs.mkdirSync(path.join(root,'data'),{recursive:true});fs.mkdirSync(path.join(root,'evidence'),{recursive:true});
const start=Date.parse('2026-08-24T12:00:00+03:00');
const iso=t=>new Date(t).toISOString();const localDay=t=>new Date(t+3*3600000).toISOString().slice(0,10);
const channels={'Meta Ads':{id:'SS-META-01',campaign:'Autumn collection discovery',daily:100},'Google Ads':{id:'SS-GOOGLE-01',campaign:'Brand and product search',daily:150},'TikTok Ads':{id:'SS-TIKTOK-01',campaign:'Small-space styling',daily:50}};
const orders=[],touches=[];let oi=0,ti=0;
const cohorts=[{n:30,p:['Meta Ads','Google Ads']},{n:20,p:['TikTok Ads','Meta Ads','Google Ads']},{n:10,p:['Meta Ads','TikTok Ads','Google Ads']},{n:20,p:['Meta Ads']},{n:15,p:['Google Ads']},{n:15,p:['TikTok Ads']},{n:10,p:['Direct']}];
function touch(journey,order,channel,time,type='click'){touches.push({touch_id:'SS-T'+String(++ti).padStart(4,'0'),journey_id:journey,order_id:order,touch_at:iso(time),touch_date:localDay(time),channel,campaign_id:channels[channel]?.id||'DIRECT',interaction:type,currency:'USD',synthetic:true});}
for(const c of cohorts)for(let i=0;i<c.n;i++){
 const n=++oi,order='SS-O'+String(n).padStart(4,'0'),journey='SS-J'+String(n).padStart(4,'0'),t=start+((n-1)%28)*86400000+Math.floor((n-1)/28)*3600000;
 orders.push({order_id:order,journey_id:journey,conversion_at:iso(t),conversion_date:localDay(t),revenue:200,currency:'USD',order_status:'completed',reporting_timezone:'Africa/Nairobi',synthetic:true});
 c.p.forEach((ch,k)=>touch(journey,order,ch,t-(c.p.length-k)*86400000));
}
// A repeat click must not create an extra channel share under the specified channel-linear model.
touch('SS-J0001','SS-O0001','Meta Ads',Date.parse(orders[0].conversion_at)-3600000);
// Outside the seven-day window and after conversion: retained as deliberate audit cases.
touch('SS-J0001','SS-O0001','TikTok Ads',Date.parse(orders[0].conversion_at)-8*86400000);
touch('SS-J0002','SS-O0002','Meta Ads',Date.parse(orders[1].conversion_at)+3600000);
// Non-converting journeys are available, but they are observational, not a randomized holdout.
for(let i=1;i<=60;i++){const t=start+((i-1)%28)*86400000;const j='SS-N'+String(i).padStart(4,'0');touch(j,'',Object.keys(channels)[(i-1)%3],t);if(i<=30)touch(j,'','Google Ads',t+3600000);}
const cleanOrders=[...orders],cleanTouches=[...touches];
// Duplicate delivery of identical records; preserve original IDs for exact deduplication.
orders.push({...orders[0]},{...orders[31]});touches.push({...touches[0]},{...touches[14]});
const spend=[];for(let d=0;d<28;d++)for(const [channel,c] of Object.entries(channels)){
 const date=localDay(start+d*86400000);const dayOrders=cleanOrders.filter(o=>o.conversion_date===date);let claims=0;
 for(const o of dayOrders){const ct=Date.parse(o.conversion_at);if(cleanTouches.some(t=>t.order_id===o.order_id&&t.channel===channel&&t.interaction==='click'&&Date.parse(t.touch_at)<=ct&&Date.parse(t.touch_at)>=ct-7*86400000))claims++;}
 spend.push({date,brand:'Sable & Sage',channel,campaign_id:c.id,campaign_name:c.campaign,spend:c.daily,impressions:c.daily*100,clicks:c.daily,platform_reported_purchases:claims,platform_reported_revenue:claims*200,currency:'USD',reporting_timezone:'Africa/Nairobi',attribution_window:'7-day click',reporting_basis:'conversion date',data_status:'complete',synthetic:true});
}
function csv(rows){const keys=Object.keys(rows[0]);const esc=x=>{let s=String(x??'');return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};return keys.join(',')+'\n'+rows.map(r=>keys.map(k=>esc(r[k])).join(',')).join('\n')+'\n';}
for(const [name,rows]of Object.entries({'channel-daily':spend,orders,touchpoints:touches})){fs.writeFileSync(path.join(root,'data',name+'.csv'),csv(rows));fs.writeFileSync(path.join(root,'data',name+'.json'),JSON.stringify(rows,null,2)+'\n');}
const credits={},last={},first={},claims={};let overlaps=0,eligibleOrders=0;for(const ch of [...Object.keys(channels),'Unattributed']){credits[ch]=0;last[ch]=0;first[ch]=0;claims[ch]=0;}
for(const o of cleanOrders){const ct=Date.parse(o.conversion_at),ts=cleanTouches.filter(t=>t.order_id===o.order_id&&channels[t.channel]&&t.interaction==='click'&&Date.parse(t.touch_at)<=ct&&Date.parse(t.touch_at)>=ct-7*86400000).sort((a,b)=>a.touch_at.localeCompare(b.touch_at));const cs=[...new Set(ts.map(t=>t.channel))];if(cs.length){eligibleOrders++;if(cs.length>1)overlaps++;cs.forEach(ch=>{credits[ch]+=1/cs.length;claims[ch]++});first[ts[0].channel]++;last[ts.at(-1).channel]++;}else{credits.Unattributed++;first.Unattributed++;last.Unattributed++;}}
const summary=Object.keys(credits).map(channel=>{let spendTotal=spend.filter(r=>r.channel===channel).reduce((s,r)=>s+r.spend,0),credit=+credits[channel].toFixed(8);return {channel,spend:spendTotal,platform_claims:claims[channel],first_paid_click:first[channel],last_paid_click:last[channel],channel_linear_credit:credit,attributed_revenue:credit*200,attributed_cpa:credit&&spendTotal?spendTotal/credit:null,attributed_roas:spendTotal?credit*200/spendTotal:null};});
assert.equal(spend.length,84);assert.equal(cleanOrders.length,120);assert.equal(eligibleOrders,110);assert.equal(overlaps,60);assert.equal(Object.values(claims).reduce((a,b)=>a+b,0),200);assert(Math.abs(Object.values(credits).reduce((a,b)=>a+b,0)-120)<1e-8);
const truth={period:{from:'2026-08-24',to:'2026-09-20',timezone:'Africa/Nairobi',currency:'USD',lookback_days:7},row_counts:{channel_daily:spend.length,orders_raw:orders.length,orders_unique:cleanOrders.length,touchpoints_raw:touches.length,touchpoints_unique:cleanTouches.length,nonconverting_journeys:60},total_spend:8400,unique_orders:120,total_order_revenue:24000,paid_matched_orders:110,unattributed_orders:10,platform_claims:200,duplicate_channel_claims:90,multi_channel_orders:60,summary,limitations:['All source data is synthetic. No native paid-ad accounts are connected.','Channel-linear, first-paid-click and last-paid-click are transparent rule-based models, not a native Windsor attribution service.','Observed journeys do not establish causal incrementality; no randomized holdout is provided.']};
fs.writeFileSync(path.join(root,'evidence','expected-calculations.json'),JSON.stringify(truth,null,2)+'\n');
console.log(JSON.stringify(truth,null,2));
