# Math Studio learning support release

The six pilot chapters are `rational`, `operations`, `expressions`, `polynomial-add`, `linear-equation`, and `inequality`. They now have 36 challenge families (six per chapter), 19 foundation sections, and 12 controlled contrast templates. There is no AI service, account requirement, external learner telemetry, or change to the university modeling workshop.

## Content and authoring

`public/math-studio/challenge-bank.js` registers explicit stable family IDs, level, concept, misconception, support ID, and a seeded generator. Each generator creates its question, parameters, solution, and three step-specific follow-ups together. Written reasoning has a reference argument and three self-assessment criteria; it is never keyword graded. The pilot chapters replace the two old challenge families, keeping their lower levels. Non-pilot content is unchanged.

| Chapter | Six challenge strategies |
| --- | --- |
| 有理數 | Minimum distance sum; ordering negative numbers; counting integers under absolute-value conditions; recovering a number from its opposite; changing reference origin; counterexamples and sufficient sign conditions |
| 有理數的運算 | Telescoping fractions; powers with negative signs; minimum starting balance; weighted signed deviations; ratios across orders of magnitude; diagnosing left-to-right errors |
| 代數式 | Whole-expression substitution; fixed versus per-item charges; shared-edge patterns; signed substitution; units and remaining quantity; translating bracket structure |
| 整式的加減 | Zero coefficient for an invariant expression; recovering an unknown expression from a sum; nested signs; matching powers in like terms; perimeter modeling; refuting a faulty simplification |
| 一元一次方程 | Clearing denominators; percentage base; relative motion; given roots and parameters; canceling a shared fixed fee; identities and inconsistent equations |
| 不等式 | Negative coefficient; intersection and integer endpoints; budget and rounding down; inverse integer counts; cost crossover; unknown coefficient signs including zero |

`learning-content.js` supplies three or four sections per chapter, each with concept paragraphs, an annotated quantity/number-line/equality schematic, a worked example, a completion problem, and an independent problem. `learning-ui.js` renders progressive disclosure, auxiliary numeric checks, and two-column contrasts (stacked on mobile). Comparison submissions require a prediction and both valid numeric answers; students then see the actual outcomes, structural differences, and explanation. A new contrast keeps the previous attempt in session history. The first power contrasts are −2²/(−2)², −3²/(−3)², then a cubic pair with equal values and different structure.

All new mathematics is original. The progression from worked examples through completion to independent practice, and comparison of correct/incorrect steps, draws on EEF's explanation of worked examples and fading: https://educationendowmentfoundation.org.uk/news/eef-blog-integrating-evidence-into-mathematics-teaching-making-sense-through-modelling . This is a design rationale, not an effectiveness claim about this website.

## Sampling and state

- Challenge mode prioritizes family coverage before exposure history, with caps 1/2/3 per family for sets of 5/10/15. Within each family, unseen variants precede the least recently seen variants. No same-set duplicate prompts or automatic downgrade of difficulty.
- Selection returns available family count, actual coverage, cap, repeat count, and a shortage reason. Non-pilot chapters can return fewer questions. Explicit supplementation appends same-family variants without replacing existing questions, drafts, or scores; broadening opens the whole-grade selector at the same difficulty.
- Basic/application/mixed sets keep their original unseen-first practice behavior. Counts distinguish families from numeric/condition variants, rather than implying every variant is a distinct method.
- Existing exposure history remains in `math-studio-practice-v2`. Practice answers, support drafts, expanded follow-ups, and comparison attempts remain session-only. Auxiliary work never changes main practice scores. Storage denial/corruption follows the existing memory fallback.
- The static asset query version is `learning-2`. Existing chapter identifiers, navigation, inquiry units, and teaching links are retained.

## Validation and classroom review

Run `pnpm test:math-studio`, `pnpm run check:security`, and `pnpm build`. The support suite is part of the build. It checks every generated pilot challenge against separate numerical/constraint oracles, all foundation generators across 160 seeds, contrast branches, and 7,200 seeded selections across counts and histories. Each challenge family must retain at least ten unique variants. The original suite still checks all 38 chapters and all 12 inquiry units, persistence failures, escaping, and UI event paths.

Manual browser checks: complete a foundation example/completion/independent sequence; make and revise a contrast prediction; inspect negative squares and cubes; answer a challenge and expand its follow-ups while another answer is still a draft; inspect limited-family disclosure and supplementation; test desktop, mobile, and keyboard controls. After publishing, verify the exact deployment commit, public route, static asset hashes, bilingual teaching links, and a real public-site exercise.

Colleague review prompts (review not yet recorded):

1. Ask a student to explain the first step without looking at the worked example. Which prerequisite or intermediate step is still missing?
2. In the paired problems, can the student point to the one condition that changed, explain the different method, and then solve another pair?
3. Ask the student to choose the follow-up matching their sticking point. Does the response resolve it, or merely repeat the original solution?
4. Inspect a five-question challenge set: are the mathematical decisions distinct, and is any label disguising the same method with different numbers?

Do not infer mastery from opening hints, completed self-check boxes, or a single correct numeric answer. This release has mathematical and software checks; classroom learning impact still needs observation and feedback.
