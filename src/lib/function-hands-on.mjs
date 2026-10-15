import * as foundations from './function-hands-on-foundations.mjs';
import * as properties from './function-hands-on-properties.mjs';
import * as powers from './function-hands-on-powers.mjs';

export const DIRECT_FUNCTION_VERSION='2026-10-15-direct-v1';
const family=id=>{const key=String(id).padStart(2,'0');const engine=[foundations,properties,powers].find(item=>item.ids.includes(key));if(!engine)throw new RangeError('Unknown function lesson.');return {engine,key};};
export function createDirectState(id){const {engine,key}=family(id);return engine.create(key);}
export function reduceDirectState(id,state,action){const {engine,key}=family(id);return engine.reduce(key,state,action);}
export function renderDirectScene(id,state,locale='en'){const {engine,key}=family(id);return {...engine.render(key,state,locale),version:DIRECT_FUNCTION_VERSION};}
export function checkDirectState(id,state,claim='',locale='en'){const {engine,key}=family(id);return engine.check(key,state,claim,locale);}
