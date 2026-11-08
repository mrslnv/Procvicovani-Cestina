export const normalize = value => String(value ?? '').normalize('NFC').trim().toLocaleLowerCase('cs').replace(/\s+/g, ' ');
export function grade(item, answer = {}) {
  const filled = normalize(answer.value) !== '' && (!item.typeAnswer || normalize(answer.type) !== '');
  const wordOK = item.answers.some(v => normalize(v) === normalize(answer.value));
  const typeOK = !item.typeAnswer || normalize(answer.type) === normalize(item.typeAnswer);
  return { filled, wordOK, typeOK, correct: filled && wordOK && typeOK };
}
export function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Each round visits every area once. The next round cannot start with the
// previous round's last area, so neighboring questions always switch topics.
export function mixedQuestions(lessons, perArea = 3) {
  const pools = lessons.map(lesson => shuffle(lesson.items));
  const result = [];
  let previous = -1;
  for (let round = 0; round < perArea; round++) {
    const available = pools.map((pool, i) => pool.length > round ? i : -1).filter(i => i >= 0);
    const order = shuffle(available);
    if (order.length > 1 && order[0] === previous) [order[0], order[1]] = [order[1], order[0]];
    for (const area of order) result.push(pools[area][round]);
    previous = order.at(-1) ?? previous;
  }
  return result;
}
