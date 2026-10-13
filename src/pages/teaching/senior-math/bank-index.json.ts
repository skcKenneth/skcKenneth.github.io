import {bankIndex} from '../../../lib/senior-math-bank-index.mjs';
export function GET(){return new Response(JSON.stringify(bankIndex('en')),{headers:{'Content-Type':'application/json; charset=utf-8'}});}
