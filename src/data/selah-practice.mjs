export const practiceKey = 'selah:q5:practice:v2';

export function practiceState(record) {
  const value = record && typeof record === 'object' ? record : {};
  const progress = ['open', 'independent', 'assisted', 'viewed'];
  return {
    invariant: progress.includes(value.invariant) ? value.invariant : 'open',
    transfer: progress.includes(value.transfer) ? value.transfer : 'open',
    attempt: Number.isSafeInteger(value.attempt) && value.attempt >= 0 ? value.attempt : 0,
    hint: value.hint === true,
    difficulty: ['arc', 'line', 'balance', 'square'].includes(value.difficulty) ? value.difficulty : '',
    misconception: ['sum', 'difference'].includes(value.misconception) ? value.misconception : '',
  };
}

export function transferProblem(attempt) {
  const low = [2, 4, 1, 3][attempt % 4];
  const maximum = 4 + 2 * (attempt % 7);
  const high = low + maximum * maximum / 2;
  return { low, high, midpoint: (low + high) / 2, maximum };
}

export function gradeTransfer(problem, x, sum, reason) {
  if (!x.trim() || !sum.trim() || !reason) return 'incomplete';
  if (Number(x) !== problem.midpoint) return 'balance';
  if (Number(sum) !== problem.maximum) return 'square';
  return reason === 'equal' ? 'correct' : 'square';
}
