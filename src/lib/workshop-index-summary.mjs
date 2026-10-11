/** Describe validated drafts without claiming assessed learning or completion. */
export function workshopIndexSummary(records, lessons, locale, available) {
  const zh = locale === 'zh-Hant';
  if (!available) return zh ? '未能讀取本機進度；你仍可由學習地圖開啟課文。' : 'Local progress is unavailable. You can still open any lesson from the learning map.';
  if (!records.length) return zh ? '尚未有可讀取的本機草稿；由學習地圖選擇單元開始。' : 'No readable local drafts yet. Choose a lesson from the learning map to begin.';
  const recent = [...records].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const title = lessons.find(lesson => lesson.id === recent.lessonId)?.title[locale] || '';
  const complete = records.reduce((sum, record) => sum + record.completed.length, 0);
  const total = lessons.reduce((sum, lesson) => sum + lesson.steps.length, 0);
  return zh ? `已讀取 ${records.length} / ${lessons.length} 個單元的草稿；${complete} / ${total} 個步驟已自行標記完成。最近編輯：${title}。` : `Drafts loaded for ${records.length} of ${lessons.length} lessons; ${complete} of ${total} steps self-marked complete. Last edited: ${title}.`;
}
