export const normalize = value => String(value ?? '').normalize('NFC').trim().toLocaleLowerCase('cs').replace(/\s+/g, ' ');
export function grade(item, answer = {}) {
  const filled = normalize(answer.value) !== '' && (!item.typeAnswer || !!answer.type);
  const wordOK = item.answers.some(v => normalize(v) === normalize(answer.value));
  const typeOK = !item.typeAnswer || answer.type === item.typeAnswer;
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
