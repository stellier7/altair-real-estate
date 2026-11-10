/** PostgREST `or` filter that keeps commas and quotes inside the search text. */
export function propertySearchOrFilter(query: string): string {
  const term = query.trim();
  const literal = term.replace(/\\/g, "\\\\").replace(/"/g, '""');
  const likeBody = literal.replace(/[%_]/g, "");
  const like = `"%${likeBody}%"`;
  const exact = `"${literal}"`;
  return `name.ilike.${like},slug.ilike.${like},id.eq.${exact}`;
}
