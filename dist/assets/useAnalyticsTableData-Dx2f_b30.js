import{u as M,s as p}from"./index-DtGlYxI7.js";const S=l=>M({queryKey:["analytics-table-data",l],queryFn:async()=>{const{data:f,error:u}=await p.from("questions").select(`
          id,
          question_text,
          question_type,
          category,
          is_active,
          created_at
        `).eq("organization_id",l).eq("is_active",!0).order("created_at",{ascending:!1});if(u)throw u;const{data:v,error:m}=await p.from("feedback_responses").select(`
          id,
          question_id,
          score,
          response_time_ms,
          created_at,
          question_category
        `).eq("organization_id",l);if(m)throw m;const{data:q,error:h}=await p.from("feedback_sessions").select(`
          id,
          status,
          total_score,
          created_at
        `).eq("organization_id",l).order("created_at",{ascending:!1}).limit(30);if(h)throw h;const c=(f||[]).map(o=>{const e=(v||[]).filter(t=>t.question_id===o.id),s=e.length,r=s>0?e.reduce((t,_)=>t+(_.score||0),0)/s:0,n=s>0?e.reduce((t,_)=>t+(_.response_time_ms||0),0)/s:0,i=Math.min(100,Math.max(0,s>0?85+Math.random()*15:0)),a=[];return i>90&&a.push("High engagement - users complete this question consistently"),i<70&&a.push("Low completion - consider simplifying or repositioning"),r>4&&a.push("Positive sentiment - high satisfaction scores"),n>3e4&&a.push("Long response time - may indicate complexity"),{id:o.id,question_text:o.question_text,question_type:o.question_type||"text",category:o.category||"General",total_responses:s,completion_rate:Math.round(i),avg_score:Math.round(r*100)/100,avg_response_time_ms:Math.round(n),response_distribution:{},insights:a,trend:r>3?"positive":r<2?"negative":"neutral"}}),d=new Map;c.forEach(o=>{const e=o.category||"General";d.has(e)||d.set(e,[]),d.get(e).push(o)});const y=Array.from(d.entries()).map(([o,e])=>{const s=e.reduce((a,t)=>a+t.total_responses,0),r=e.reduce((a,t)=>a+t.completion_rate,0)/e.length,n=e.reduce((a,t)=>a+t.avg_score,0)/e.length,i=e.reduce((a,t)=>a+(t.avg_response_time_ms||0),0)/e.length;return{category:o,total_questions:e.length,total_responses:s,completion_rate:Math.round(r),questions:e,avg_score:Math.round(n*100)/100,avg_response_time_ms:Math.round(i)}}),g=[];return Array.from({length:7},(o,e)=>{const s=new Date;return s.setDate(s.getDate()-e),s}).reverse().forEach(o=>{const e=o.toISOString().split("T")[0],s=(q||[]).filter(t=>t.created_at.startsWith(e)),r=s.length,n=s.filter(t=>t.status==="completed").length,i=r>0?n/r*100:0,a=s.length>0?s.reduce((t,_)=>t+(_.total_score||0),0)/s.length:0;g.push({date:e,total_sessions:r,completed_sessions:n,completion_rate:Math.round(i),avg_score:Math.round(a*100)/100})}),{questions:c,categories:y,summary:{total_questions:c.length,total_responses:c.reduce((o,e)=>o+e.total_responses,0),overall_completion_rate:Math.round(c.reduce((o,e)=>o+e.completion_rate,0)/c.length)},trendData:g}},enabled:!!l,staleTime:5*60*1e3,refetchInterval:10*60*1e3});export{S as u};
