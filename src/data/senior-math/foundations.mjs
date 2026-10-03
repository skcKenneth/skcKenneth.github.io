import {algebraLessons,algebraChapters,algebraReviews} from './foundation-c1-algebra.mjs';
import {functionLessons,functionChapters,functionReviews} from './foundation-c1-functions.mjs';
import {trigLessons,trigChapters,trigReviews} from './foundation-c1-trigonometry.mjs';
import {vectorComplexLessons,vectorComplexChapters,vectorComplexReviews} from './foundation-c2-vectors-complex.mjs';
import {geometryLessons,geometryChapters,geometryReviews} from './foundation-c2-geometry.mjs';
import {statsLessons,statsChapters,statsReviews} from './foundation-c2-statistics.mjs';
import {distinctFoundationLessons,distinctFoundationReviews} from './foundation-distinct-tasks.mjs';

export const foundationLessons=distinctFoundationLessons([...algebraLessons,...functionLessons,...trigLessons,...vectorComplexLessons,...geometryLessons,...statsLessons]);
export const foundationChapters=[...algebraChapters,...functionChapters,...trigChapters,...vectorComplexChapters,...geometryChapters,...statsChapters];
export const foundationReviews=distinctFoundationReviews([...algebraReviews,...functionReviews,...trigReviews,...vectorComplexReviews,...geometryReviews,...statsReviews],foundationLessons);
