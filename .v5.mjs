import { chromium } from 'playwright'
const OUT='/private/tmp/claude-501/-Users-ritikafinsynth-Desktop-Fin-Claude-finsynth-landing-page/3b398e88-653c-4c94-b8a3-9f52fbd4e0d6/scratchpad'
const b=await chromium.launch()
const p=await b.newPage({viewport:{width:1698,height:996},deviceScaleFactor:2})
const errs=[]; p.on('pageerror',e=>errs.push(e.message))
await p.goto('http://localhost:5219/',{waitUntil:'networkidle'})
await p.locator('.hero-desktop-modal__btn').click({timeout:1200}).catch(()=>{})
await p.locator('#customers').scrollIntoViewIfNeeded(); await p.waitForTimeout(1000)
console.log(await p.evaluate(()=>{
  const nav=document.querySelector('.testi-nav').getBoundingClientRect()
  const cards=[...document.querySelectorAll('.testi-card')].sort((a,b)=>b.style.zIndex-a.style.zIndex)
  const front=cards[0].getBoundingClientRect()
  const auth=cards[0].querySelector('.testi-author').getBoundingClientRect()
  return JSON.stringify({
    navRightInsetFromCard: Math.round(front.right-nav.right),
    navBottomInsetFromCard: Math.round(front.bottom-nav.bottom),
    navInsideCard: nav.top>front.top && nav.bottom<=front.bottom+1 && nav.right<=front.right,
    authorRowBottomDelta: Math.round(auth.bottom-nav.bottom),
    navH: Math.round(nav.height), navW: Math.round(nav.width)
  })
}))
await p.locator('.testi-card').first().screenshot({path:`${OUT}/y-card.png`})
// arrows must stay clickable and still drive the deck
const z0=await p.$$eval('.testi-card',e=>e.map(x=>+x.style.zIndex))
await p.locator('.testi-navbtn').last().click(); await p.waitForTimeout(1300)
const z1=await p.$$eval('.testi-card',e=>e.map(x=>+x.style.zIndex))
await p.locator('.testi-navbtn').first().click(); await p.waitForTimeout(1300)
const z2=await p.$$eval('.testi-card',e=>e.map(x=>+x.style.zIndex))
console.log('z',z0,'next',z1,'prev',z2,'ERRORS',errs.length?errs:'none')
await p.locator('.testi-pin').screenshot({path:`${OUT}/y-sec.png`})
await b.close()
