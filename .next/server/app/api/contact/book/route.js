"use strict";(()=>{var e={};e.id=609,e.ids=[609],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2081:e=>{e.exports=require("child_process")},6113:e=>{e.exports=require("crypto")},9523:e=>{e.exports=require("dns")},2361:e=>{e.exports=require("events")},7147:e=>{e.exports=require("fs")},3685:e=>{e.exports=require("http")},5687:e=>{e.exports=require("https")},1808:e=>{e.exports=require("net")},2037:e=>{e.exports=require("os")},1017:e=>{e.exports=require("path")},2781:e=>{e.exports=require("stream")},4404:e=>{e.exports=require("tls")},7310:e=>{e.exports=require("url")},3837:e=>{e.exports=require("util")},9796:e=>{e.exports=require("zlib")},1709:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>h,patchFetch:()=>b,requestAsyncStorage:()=>x,routeModule:()=>g,serverHooks:()=>f,staticGenerationAsyncStorage:()=>m});var o={};r.r(o),r.d(o,{POST:()=>c});var s=r(9303),n=r(8716),i=r(3131),a=r(7070),p=r(728);let l=r(5245).createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:!1,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});async function d(e){return l.sendMail({from:process.env.MAIL_FROM,to:e.to,subject:e.subject,html:e.html,text:e.text})}let u=["gustaf@qualitylife.se","gustaf.muda@gmail.com"];async function c(e){let t=await e.json();if(!t?.resourceId||!t?.startIso||!t?.name||!t?.email||!t?.phone||!t?.address)return a.NextResponse.json({ok:!1,error:"Missing fields"},{status:400});let r=new Date(t.startIso),o=new Date(+r+36e5);try{let e=await p._.$transaction(async e=>{let s=await e.openSlot.findFirst({where:{resourceId:t.resourceId,start:r},select:{id:!0}});if(!s)throw Error("SlotClosed");let n=await e.booking.create({data:{resourceId:t.resourceId,start:r,end:o,name:t.name,email:t.email,phone:t.phone,address:t.address},select:{id:!0,start:!0,resourceId:!0,name:!0,email:!0,phone:!0,address:!0}});return await e.openSlot.delete({where:{id:s.id}}),n}),s=function(e){let{name:t,email:r,phone:o,address:s,startIso:n}=e;return`Ny bokning 🗓

• Namn: ${t}
• E-post: ${r}
• Telefon: ${o}
• Adress: ${s}
• Start: ${n}
`}({name:t.name,email:t.email,phone:t.phone,address:t.address,startIso:t.startIso}),n=new Date(r).toLocaleString("sv-SE",{timeZone:"Europe/Stockholm",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"});return process.env.NEXT_PUBLIC_BASE_URL||process.env.PUBLIC_URL,e.id,Promise.allSettled([d({to:u,subject:"Ny bokning",html:`<pre style="font-family:ui-monospace, Menlo, Consolas, monospace; white-space:pre-wrap;">${s}</pre>`,text:s}),d({to:t.email,subject:"Bekr\xe4ftelse: din bokning hos Qualitylife",html:function(e){let{name:t,datetimeLocal:r,phone:o,address:s}=e;return`
  <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: auto; background: #FFFFFF; border: 1px solid #E6E6E6; border-radius: 14px; padding: 32px; color: #000000;">
    <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #000000;">
      Tack f\xf6r din bokning, ${t}!
    </h2>

    <p style="margin: 0 0 20px; font-size: 16px; color: #000000;">
      Vi har tagit emot din bokning och ser fram emot att ses.
    </p>

    <div style="background: #F9FAF8; border: 1px solid #B3B3B3; border-radius: 12px; padding: 16px 20px; margin-bottom: 28px;">
      <p style="margin: 0 0 8px; font-size: 15px; color: #000000;">
        <strong>Tid:</strong> ${r}
      </p>
      <p style="margin: 0 0 8px; font-size: 15px; color: #000000;">
        <strong>Telefon:</strong> ${o}
      </p>
      <p style="margin: 0; font-size: 15px; color: #000000;">
        <strong>Adress:</strong> ${s}
      </p>
    </div>

    <hr style="border: none; border-top: 1px solid #E6E6E6; margin: 28px 0;">

    <h3 style="margin: 0 0 12px; font-size: 18px; font-weight: 700; color: #000000;">
      Kontakta oss
    </h3>


    <div style="background: #F9FAF8; border-radius: 10px; padding: 16px 20px; margin: 0 0 20px;">
      <p style="margin: 0 0 6px; font-size: 15px; color: #000000;">
        <strong>Adress:</strong> Bergtorpsv\xe4gen 43A, 183 64 T\xe4by
      </p>
      <p style="margin: 0 0 6px; font-size: 15px; color: #000000;">
        <strong>Telefon:</strong> <a href="tel:087330015" style="color: #A6CE39; text-decoration: none;">08 733 00 15</a>
      </p>
      <p style="margin: 0 0 6px; font-size: 15px; color: #000000;">
        <strong>E-post:</strong> <a href="mailto:info@qualitylife.se" style="color: #A6CE39; text-decoration: none;">info@qualitylife.se</a>
      </p>
      <p style="margin: 0; font-size: 15px; color: #000000;">
        <strong>\xd6ppettider:</strong> M\xe5n–Fre 8:00–18:00<br>
        <span style="color: #666666;">Telefon: Alltid tillg\xe4ngliga</span>
      </p>
    </div>

    <p style="margin: 0; font-size: 15px; color: #666666;">
      V\xe4nliga h\xe4lsningar<br>
      <strong style="color: #000000;">Qualitylife</strong>
    </p>
  </div>`}({name:t.name,datetimeLocal:n,phone:t.phone,address:t.address}),text:`Tack f\xf6r din bokning, ${t.name}! Tid: ${n}. Adress: ${t.address}.`})]).then(e=>{e.forEach((e,t)=>{"rejected"===e.status&&console.error(0===t?"INTERNAL MAIL FAILED":"CONFIRMATION MAIL FAILED",e.reason)})}),a.NextResponse.json({ok:!0,bookingId:e.id})}catch(e){if(e?.code==="P2002"||e?.message==="SlotClosed")return a.NextResponse.json({ok:!1,error:"Tiden \xe4r inte l\xe4ngre tillg\xe4nglig"},{status:409});return console.error("BOOKING ERROR",e),a.NextResponse.json({ok:!1,error:"Kunde inte boka"},{status:500})}}let g=new s.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/contact/book/route",pathname:"/api/contact/book",filename:"route",bundlePath:"app/api/contact/book/route"},resolvedPagePath:"C:\\Users\\gusta\\Desktop\\Webbutveckling\\qualitylife\\src\\app\\api\\contact\\book\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:x,staticGenerationAsyncStorage:m,serverHooks:f}=g,h="/api/contact/book/route";function b(){return(0,i.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:m})}},728:(e,t,r)=>{r.d(t,{_:()=>s});let o=require("@prisma/client"),s=global.prisma??new o.PrismaClient}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[948,972,245],()=>r(1709));module.exports=o})();