import {isVisibleCountry} from "./country-visibility";
export const destinations=[
 {name:"Italy",code:"IT",route:"italy",region:"Europe",url:"https://www.universitaly.it/",portal:"Universitaly",note:"National higher education portal"},
 {name:"France",code:"FR",route:"france",region:"Europe",url:"https://www.campusfrance.org/en",portal:"Campus France",note:"Study and application information"},
 {name:"Hungary",code:"HU",route:"hungary",region:"Europe",url:"https://studyinhungary.hu/",portal:"Study in Hungary",note:"National study information"},
 {name:"Poland",code:"PL",route:"poland",region:"Europe",url:"https://study.gov.pl/",portal:"Study in Poland",note:"National study information"},
 {name:"Czech Republic",code:"CZ",route:"czech-republic",region:"Europe",url:"https://www.studyin.cz/",portal:"Study in Czechia",note:"National study information"},
 {name:"Spain",code:"ES",route:"spain",region:"Europe",url:"https://www.educacionfpydeportes.gob.es/",portal:"Education ministry",note:"Official education information"},
 {name:"Germany",code:"DE",route:"germany",region:"Europe",url:"https://www.daad.de/en/",portal:"DAAD",note:"Programmes and scholarships"},
 {name:"Sweden",code:"SE",route:"sweden",region:"Europe",url:"https://www.universityadmissions.se/intl/start",portal:"University Admissions",note:"National application portal"},
 {name:"USA",code:"US",route:"usa",region:"North America",url:"https://educationusa.state.gov/",portal:"EducationUSA",note:"Official study guidance"},
 {name:"Canada",code:"CA",route:"canada",region:"North America",url:"https://www.educanada.ca/",portal:"EduCanada",note:"Official study guidance"}
];
const otherDestinations=[
["Austria","AT"],["Belgium","BE"],["Bosnia and Herzegovina","BA"],["Bulgaria","BG"],["Croatia","HR"],["Cyprus","CY"],["Denmark","DK"],["Estonia","EE"],["Finland","FI"],["Greece","GR"],["Ireland","IE"],["Latvia","LV"],["Lithuania","LT"],["Luxembourg","LU"],["Moldova","MD"],["Netherlands","NL"],["Norway","NO"],["Portugal","PT"],["Romania","RO"],["Slovakia","SK"],["Switzerland","CH"],["United Kingdom","GB"],["Japan","JP"],["South Korea","KR"],["Australia","AU"],["New Zealand","NZ"]
];
for(const [name,code] of otherDestinations.filter(([name])=>isVisibleCountry(name)))destinations.push({name,code,route:name.toLowerCase().replace(/ü/g,"u").replace(/[^a-z0-9]+/g,"-"),region:["CN","JP","KR"].includes(code)?"Asia":["AU","NZ"].includes(code)?"Oceania":"Europe",url:"",portal:"Official source not yet verified",note:"Country page ready for reviewed content"});
export const resources=[
 {name:"IELTS Academic format",url:"https://ielts.org/take-a-test/test-types/ielts-academic-test",text:"Official overview of the Academic test."},
 {name:"British Council IELTS preparation",url:"https://takeielts.britishcouncil.org/take-ielts/prepare",text:"Preparation resources from the British Council."},
 {name:"BBC Learning English",url:"https://www.bbc.co.uk/learningenglish",text:"English learning resources."}
];
export const reading={
 title:"A different kind of campus garden",
 passage:"In 2024, a small university converted an unused courtyard into a community garden. Students proposed the project after a survey showed that many wanted a quiet outdoor space. The university supplied tools, but students chose which plants to grow. The garden is open every day, although organised gardening sessions take place only on Saturdays.\n\nThe first season did not go entirely to plan. Heavy rainfall damaged some vegetables. A local gardener suggested raised beds to improve drainage. Students built the beds using reclaimed wood, and the next crop survived a rainy month. They recorded rainfall and plant growth in a shared notebook.\n\nThe project coordinator said that the garden's main purpose was education, rather than selling food. Some of the produce was used in a student cooking workshop. The team has not yet measured whether the garden reduces stress, but it plans to survey visitors next year.",
 questions:[
 {q:"Students suggested creating the garden.",answer:"True",explanation:"Students proposed the project after a survey."},
 {q:"Organised gardening sessions happen every day.",answer:"False",explanation:"The garden opens daily, but organised sessions are only on Saturdays."},
 {q:"Raised beds were built with newly purchased wood.",answer:"False",explanation:"The students used reclaimed wood."},
 {q:"The garden has been proven to reduce stress.",answer:"Not Given",explanation:"The effect on stress has not yet been measured."}
 ]
};
