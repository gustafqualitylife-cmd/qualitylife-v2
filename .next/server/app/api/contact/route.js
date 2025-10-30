"use strict";(()=>{var e={};e.id=386,e.ids=[386],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2081:e=>{e.exports=require("child_process")},6113:e=>{e.exports=require("crypto")},9523:e=>{e.exports=require("dns")},2361:e=>{e.exports=require("events")},7147:e=>{e.exports=require("fs")},3685:e=>{e.exports=require("http")},5687:e=>{e.exports=require("https")},1808:e=>{e.exports=require("net")},2037:e=>{e.exports=require("os")},1017:e=>{e.exports=require("path")},2781:e=>{e.exports=require("stream")},4404:e=>{e.exports=require("tls")},7310:e=>{e.exports=require("url")},3837:e=>{e.exports=require("util")},9796:e=>{e.exports=require("zlib")},3449:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>c,patchFetch:()=>g,requestAsyncStorage:()=>d,routeModule:()=>x,serverHooks:()=>u,staticGenerationAsyncStorage:()=>f});var o={};t.r(o),t.d(o,{POST:()=>l,runtime:()=>p});var i=t(9303),n=t(8716),s=t(3131),a=t(5245);let p="nodejs";async function l(e){try{let{name:r,email:t,phone:o,message:i}=await e.json()??{};if(!r||!t||!i)return Response.json({ok:!1,error:"Saknar namn, e-post eller meddelande."},{status:400});if(!(process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASS&&process.env.CONTACT_TO))return console.warn("Ingen SMTP konfigurerad. Skicka via mailto ist\xe4llet."),Response.json({ok:!1,fallback:!0});let n=a.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:!1,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});return await n.sendMail({from:`"Qualitylife Web" <${process.env.SMTP_USER}>`,to:t,subject:"Tack f\xf6r din bokning hos Qualitylife!",text:`Hej ${r},

Tack f\xf6r din bokning hos Qualitylife!

Vi har tagit emot din f\xf6rfr\xe5gan och \xe5terkommer s\xe5 snart som m\xf6jligt med en bekr\xe4ftelse.

Har du fr\xe5gor eller vill komplettera din bokning? Svara g\xe4rna p\xe5 detta mejl eller ring oss direkt p\xe5 ${process.env.CONTACT_TO}.

V\xe4nliga h\xe4lsningar,
Qualitylife
www.qualitylife.se
`,html:`
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:600px;margin:0 auto;background:#f4f5f7;border-radius:16px;overflow:hidden;">
    <!-- Header -->
    <div style="background:linear-gradient(90deg,#16A34A,#22C55E);padding:24px;text-align:center;color:#fff;">
      <div style="font-weight:700;font-size:18px;letter-spacing:.2px;">Qualitylife</div>
      <div style="opacity:.95;font-size:13px;margin-top:6px;">Tack f\xf6r din f\xf6rfr\xe5gan – vi h\xf6r av oss snart</div>
    </div>

    <!-- Body -->
    <div style="background:#ffffff;padding:24px 28px;">
      <h2 style="margin:0 0 8px 0;color:#111827;font-size:20px;line-height:1.35;">Tack, ${r}!</h2>
      <p style="margin:0 0 14px 0;color:#374151;font-size:15px;line-height:1.6;">
        Vi har tagit emot din bokningsf\xf6rfr\xe5gan och \xe5terkommer s\xe5 snart som m\xf6jligt
        med en bekr\xe4ftelse (vanligtvis inom <strong>~2 timmar</strong> p\xe5 vardagar).
      </p>

      <p style="margin:16px 0 0 0;color:#374151;font-size:15px;line-height:1.6;">
        Har du fr\xe5gor eller vill komplettera din bokning?<br>
        Svara g\xe4rna p\xe5 detta mejl eller ring oss direkt.
      </p>

      <!-- CTA-knappar -->
      <div style="margin-top:16px;">
        <a href="mailto:${process.env.CONTACT_TO}?subject=Ang.%20min%20bokningsf%C3%B6rfr%C3%A5gan"
           style="display:inline-block;background:#16A34A;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700;">
          Svara i e-post
        </a>
        ${process.env.SITE_PHONE?`
        <a href="tel:${process.env.SITE_PHONE}"
           style="display:inline-block;margin-left:8px;background:#111827;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700;">
          Ring oss
        </a>`:""}
      </div>

      <p style="margin:16px 0 0 0;font-size:13px;color:#6b7280;line-height:1.6;">
        \xd6ppettider: <strong>M\xe5n–Fre 09–19</strong>. Beh\xf6ver du \xe4ndra n\xe5got? Svara p\xe5 detta mejl s\xe5 uppdaterar vi din f\xf6rfr\xe5gan.
      </p>

      <p style="margin:14px 0 0 0;font-size:13px;color:#6b7280;line-height:1.6;">
        V\xe4nliga h\xe4lsningar,<br>
        <strong>Qualitylife</strong><br>
        <a href="https://www.qualitylife.se" style="color:#16A34A;text-decoration:none;">www.qualitylife.se</a>
      </p>
    </div>
  </div>
`}),Response.json({ok:!0})}catch(e){return console.error(e),Response.json({ok:!1,error:"Tekniskt fel."},{status:500})}}let x=new i.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/contact/route",pathname:"/api/contact",filename:"route",bundlePath:"app/api/contact/route"},resolvedPagePath:"C:\\Users\\gusta\\Desktop\\Webbutveckling\\qualitylife\\src\\app\\api\\contact\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:d,staticGenerationAsyncStorage:f,serverHooks:u}=x,c="/api/contact/route";function g(){return(0,s.patchFetch)({serverHooks:u,staticGenerationAsyncStorage:f})}},9303:(e,r,t)=>{e.exports=t(517)}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[948,245],()=>t(3449));module.exports=o})();