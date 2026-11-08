import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../data.js';
import {grade, normalize, shuffle} from '../logic.js';
const all=lessons.flatMap(x=>x.items);
test('128 unique, explained questions with a valid answer format',()=>{
 assert.equal(all.length,128);assert.equal(new Set(all.map(x=>x.id)).size,128);
 for(const lesson of lessons)for(const q of lesson.items){
 assert.ok(q.why.length>15);assert.ok(q.source);assert.ok(q.answers.length);
 if(lesson.kind!=='phrase')assert.equal(q.q.split('_').length,2,q.id);
 const options={letter:['i','í','y','ý'],consonant:['n','nn'],sz:['s','z','vz'],prefix:['roz','bez','vz']}[lesson.kind];
 if(options)assert.ok(q.answers.every(a=>options.includes(a)),q.id);
 assert.equal(grade(q,{value:q.answers[0],type:q.typeAnswer}).correct,true,q.id);
 assert.equal(grade(q,{value:'nesprávně',type:q.typeAnswer}).correct,false,q.id);
 }
});
test('blank answers are incomplete, not correct',()=>{assert.equal(grade(all[0]).filled,false);assert.equal(grade(all[0]).correct,false)});
test('case, NFC and outside whitespace are tolerated; internal word boundaries matter',()=>{
 const q={answers:['před školou']};assert.ok(grade(q,{value:'  PŘED   ŠKOLOU  '}).correct);assert.equal(grade(q,{value:'předškolou'}).correct,false);
 assert.equal(grade({answers:['podlomila']},{value:'pod lomila'}).correct,false);
 assert.equal(normalize('i\u0301'),'í');assert.equal(grade({answers:['í']},{value:'i'}).correct,false);
});
test('prefix word and classification must both be right',()=>{
 const q={answers:['bez'],typeAnswer:'předložka'};
 assert.equal(grade(q,{value:'bez'}).filled,false);
 assert.equal(grade(q,{value:'bez',type:'předpona'}).correct,false);
 assert.equal(grade(q,{value:'bez',type:'předložka'}).correct,true);
});
test('shuffle preserves input and all members',()=>{const a=[1,2,3,4];assert.deepEqual(shuffle(a).sort(),a);assert.deepEqual(a,[1,2,3,4])});

test('mixed exam covers all eight areas, has no repeats, and always switches area',async()=>{
 const {mixedQuestions}=await import('../logic.js');
 for(let run=0;run<100;run++){
  const items=mixedQuestions(lessons);
  assert.equal(items.length,24);
  assert.equal(new Set(items.map(x=>x.id)).size,24);
  const area=x=>x.id.split('-')[0];
  for(const lesson of lessons)assert.equal(items.filter(x=>area(x)===lesson.id).length,3);
  for(let i=1;i<items.length;i++)assert.notEqual(area(items[i]),area(items[i-1]));
 }
});
test('written classification tolerates case and outer spaces but requires the right term',()=>{
 const q={answers:['bez'],typeAnswer:'předložka'};
 assert.equal(grade(q,{value:' BEZ ',type:' PŘEDLOŽKA '}).correct,true);
 assert.equal(grade(q,{value:'bez',type:'předpona'}).correct,false);
 assert.equal(grade(q,{value:'bez',type:'   '}).filled,false);
});


test('classification accepts missing accents without relaxing spelling answers',()=>{
 for(const type of ['predlozka','PREDLOZKA',' predložka ','předlozka']){
  assert.equal(grade({answers:['bez'],typeAnswer:'předložka'},{value:'bez',type}).correct,true);
 }
 assert.equal(grade({answers:['roz'],typeAnswer:'předpona'},{value:'roz',type:'predpona'}).correct,true);
 assert.equal(grade({answers:['bez'],typeAnswer:'předložka'},{value:'bez',type:'predpona'}).correct,false);
 assert.equal(grade({answers:['í']},{value:'i'}).correct,false);
 assert.equal(grade({answers:['před školou']},{value:'pred skolou'}).correct,false);
});
