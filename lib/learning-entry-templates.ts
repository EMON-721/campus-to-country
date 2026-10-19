// New content starts blank. Never clone another learner's or author's content.
export function newLearningEntry(name:string,id:string,skill='Reading',group='reading'){
 const base={id,hidden:false};
 if(name.startsWith('vocabulary'))return {...base,word:'',meaning:'',meaningEn:'',primaryTopic:'general-everyday',topics:[],skills:['Reading','Listening','Writing','Speaking'].includes(skill)?[skill]:['Reading','Listening','Writing','Speaking'],spellingFocus:false};
 if(name==='notes')return {...base,title:'New note',skill:skill.toLowerCase(),question:'',answer:'',grammar:'',publicFiles:[]};
 if(name==='grammar')return {...base,title:'New worksheet',text:'',publicFiles:[]};
 if(name==='questions')return {...base,text:'New question',answer:'',skill,type:'Short answer',explanation:'',options:null};
 if(name==='units')return {...base,title:'New lesson',skill,concept:'',context:'',question:'',answer:'',explanation:'',strategy:'',mistake:'',revision:'',publicFiles:[]};
 if(name==='premium')return {...base,title:'New learning entry',level:'A1',explanation:'',example:'',question:'',answer:''};
 if(name==='mocks')return {...base,title:'New practice set',...(group==='reading'?{reading:[]}:group==='listening'?{listening:[]}:{}),...(group!=='listening'?{writing:[],speaking:{id:id+'-speaking',part1:[],part2:'',part3:[]}}:{}),publicFiles:[]};
 throw Error('Choose an existing learning collection');
}
