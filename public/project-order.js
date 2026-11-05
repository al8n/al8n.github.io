// Both the initial HTML and the enhanced views use the same ranking rules.
export function groupProjects(records, layout, sort, categories) {
  const ordered = [...records].sort((a, b) => {
    if (sort === 'recommended') {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.featured) return 0; // Keep the maintainer's editorial order.
    }
    if (sort !== 'name') {
      const key = sort === 'stars' ? 'stars' : 'downloads';
      const difference = (b[key] ?? -1) - (a[key] ?? -1);
      if (difference) return difference;
    }
    return a.name.localeCompare(b.name, 'en');
  });
  if (layout === 'categories') {
    return categories.map(({id, name}) => ({
      key: id, title: name, items: ordered.filter(item => item.category === id),
    }));
  }
  if (sort === 'recommended') return [
    { key: 'featured', title: 'Maintainer picks', items: ordered.filter(item => item.featured) },
    { key: 'downloads', title: 'More projects by downloads', items: ordered.filter(item => !item.featured) },
  ];
  const titles = { stars: 'Most starred', downloads: 'Most downloaded', name: 'Projects A–Z' };
  return [{ key: sort, title: titles[sort], items: ordered }];
}
