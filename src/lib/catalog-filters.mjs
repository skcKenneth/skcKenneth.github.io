/** Read only values represented by the current catalogue's controls. */
export function readCatalogFilters(search, options) {
  const params = new URLSearchParams(search);
  return Object.fromEntries(Object.entries(options).map(([key, values]) => {
    const value = params.get(key) || '';
    return [key, values.includes(value) ? value : ''];
  }));
}

/** Update owned filters while retaining unrelated parameters and anchors. */
export function catalogFilterUrl(href, filters) {
  const url = new URL(href);
  for (const [key, value] of Object.entries(filters)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  return url;
}

/** Translation is explicit: unsupported free-text filters are not guessed. */
export function translatedCatalogFilters(filters, targetOptions) {
  return Object.fromEntries(Object.entries(targetOptions).map(([key, values]) => [key, values.includes(filters[key]) ? filters[key] : '']));
}

export function projectFilterOptions(projects) {
  const data = projects.map(project => project.data || project);
  const unique = values => ['', ...new Set(values.filter(value => typeof value === 'string' && value))];
  return { topic: unique(data.flatMap(project => project.topics || [])), status: unique(data.map(project => project.status)), method: unique(data.flatMap(project => project.methods || [])), availability: ['', 'code', 'data', 'student'] };
}

export function matchesCatalogFilters(kind, data, filters) {
  if (kind === 'model') return (!filters.purpose || data.purpose === filters.purpose) && (!filters.stage || data.stage === filters.stage);
  return (!filters.topic || (data.topic || '').split('|').includes(filters.topic))
    && (!filters.status || data.status === filters.status)
    && (!filters.method || (data.method || '').split('|').includes(filters.method))
    && (!filters.availability || ['code', 'data', 'student'].includes(filters.availability) && data[filters.availability] === 'true');
}
