import{s as e}from"./index.c6252597.js";const i={__name:"ocr",setup(r){const t=e.createWorker({logger:a=>console.log(a)});return(async()=>{await t.load(),await t.loadLanguage("chi_sim"),await t.initialize("chi_sim");let{data:{text:a}}=await t.recognize("/src/assets/test1.jpg");await t.terminate(),console.log(a)})(),(a,o)=>null}};export{i as default};