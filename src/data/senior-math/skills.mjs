import {quadraticTrigSkills} from './skills-quadratics-trig.mjs';
import {vectorConicSkills} from './skills-vectors-conics.mjs';
import {calculusStatisticsSkills} from './skills-calculus-statistics.mjs';
export const skills=[...quadraticTrigSkills,...vectorConicSkills,...calculusStatisticsSkills];
export const skillById=new Map(skills.map(skill=>[skill.id,skill]));
export const skillFamilies=[...new Set(skills.map(s=>s.familyId))].map(id=>({id,title:skills.find(s=>s.familyId===id).familyTitle,skills:skills.filter(s=>s.familyId===id),diagnostics:skills.filter(s=>s.familyId===id).flatMap(s=>s.diagnostics)}));
