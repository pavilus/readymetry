export interface SelectableQuestion {
  id: string;
  category: string;
  difficulty: string;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function roundRobinByCategory<T extends SelectableQuestion>(questions: T[], count: number): T[] {
  const groups = new Map<string, T[]>();
  for (const question of shuffle(questions)) {
    const group = groups.get(question.category) ?? [];
    group.push(question);
    groups.set(question.category, group);
  }

  const selected: T[] = [];
  const categories = shuffle([...groups.keys()]);
  while (selected.length < count && categories.length > 0) {
    for (let index = categories.length - 1; index >= 0 && selected.length < count; index--) {
      const category = categories[index];
      const question = groups.get(category)?.pop();
      if (question) selected.push(question);
      if (!groups.get(category)?.length) categories.splice(index, 1);
    }
  }
  return selected;
}

export function selectBalancedQuestions<T extends SelectableQuestion>(
  questions: T[],
  count: number,
  recentlySeenIds: Set<string>,
): T[] {
  const unseen = questions.filter((question) => !recentlySeenIds.has(question.id));
  const selected = roundRobinByCategory(unseen, count);
  if (selected.length >= count) return shuffle(selected);

  const selectedIds = new Set(selected.map((question) => question.id));
  const fallback = questions.filter((question) => !selectedIds.has(question.id));
  return shuffle([...selected, ...roundRobinByCategory(fallback, count - selected.length)]);
}
