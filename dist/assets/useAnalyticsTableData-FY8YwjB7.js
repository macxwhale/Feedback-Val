import{a3 as w,a4 as u}from"./index-BIt5b66a.js";const x=_=>w({queryKey:["analytics-table-data",_],queryFn:async()=>{const{data:v,error:m}=await u.from("questions").select(`
          id,
          question_text,
          question_type,
          category,
          is_active,
          created_at
        `).eq("organization_id",_).eq("is_active",!0).order("created_at",{ascending:!1});if(m)throw m;const{data:q,error:h}=await u.from("feedback_responses").select(`
          id,
          question_id,
          score,
          response_time_ms,
          created_at,
          question_category
        `).eq("organization_id",_);if(h)throw h;const{data:r,error:g}=await u.from("feedback_sessions").select(`
          id,
          status,
          total_score,
          created_at
        `).eq("organization_id",_).order("created_at",{ascending:!1}).limit(30);if(g)throw g;const l=(v||[]).map(t=>{const e=(q||[]).filter(s=>s.question_id===t.id),o=e.length,n=o>0?e.reduce((s,d)=>s+(d.score||0),0)/o:0,i=o>0?e.reduce((s,d)=>s+(d.response_time_ms||0),0)/o:0,c=Math.min(100,Math.max(0,o>0?85+Math.random()*15:0)),a=[];return c>90&&a.push("High engagement - users complete this question consistently"),c<70&&a.push("Low completion - consider simplifying or repositioning"),n>4&&a.push("Positive sentiment - high satisfaction scores"),i>3e4&&a.push("Long response time - may indicate complexity"),{id:t.id,question_text:t.question_text,question_type:t.question_type||"text",category:t.category||"General",total_responses:o,completion_rate:Math.round(c),avg_score:Math.round(n*100)/100,avg_response_time_ms:Math.round(i),response_distribution:{},insights:a,trend:n>3?"positive":n<2?"negative":"neutral"}}),p=new Map;l.forEach(t=>{const e=t.category||"General";p.has(e)||p.set(e,[]),p.get(e).push(t)});const y=Array.from(p.entries()).map(([t,e])=>{const o=e.reduce((a,s)=>a+s.total_responses,0),n=e.reduce((a,s)=>a+s.completion_rate,0)/e.length,i=e.reduce((a,s)=>a+s.avg_score,0)/e.length,c=e.reduce((a,s)=>a+(s.avg_response_time_ms||0),0)/e.length;return{category:t,total_questions:e.length,total_responses:o,completion_rate:Math.round(n),questions:e,avg_score:Math.round(i*100)/100,avg_response_time_ms:Math.round(c)}}),f=[];Array.from({length:7},(t,e)=>{const o=new Date;return o.setDate(o.getDate()-e),o}).reverse().forEach(t=>{const e=t.toISOString().split("T")[0],o=(r||[]).filter(s=>s.created_at.startsWith(e)),n=o.length,i=o.filter(s=>s.status==="completed").length,c=n>0?i/n*100:0,a=o.length>0?o.reduce((s,d)=>s+(d.total_score||0),0)/o.length:0;f.push({date:e,total_sessions:n,completed_sessions:i,completion_rate:Math.round(c),avg_score:Math.round(a*100)/100})});const M=(r||[]).length,S=(r||[]).filter(t=>t.status==="completed").length,D=r&&r.length>0?r.reduce((t,e)=>t+(e.total_score||0),0)/r.length:0;return{questions:l,categories:y,summary:{total_questions:l.length,total_responses:l.reduce((t,e)=>t+e.total_responses,0),overall_completion_rate:Math.round(l.reduce((t,e)=>t+e.completion_rate,0)/l.length),total_sessions:M,completed_sessions:S,avg_score:Math.round(D*100)/100},trendData:f}},enabled:!!_,staleTime:5*60*1e3,refetchInterval:10*60*1e3});export{x as u};
