document.addEventListener('DOMContentLoaded', () => {
  function setFilter(filter, container, items) {
    container.querySelectorAll('.filter-btn').forEach(button => {
      button.classList.toggle('active', button.dataset.filter === filter);
    });

    items.forEach(item => {
      const tags = (item.dataset.tags || '').split(/\s+/).filter(Boolean);
      item.hidden = !(filter === 'all' || tags.includes(filter));
    });
  }

  function setupFilters(containerId, itemSelector, queryKey) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const items = Array.from(document.querySelectorAll(itemSelector));
    const labels = [
      ['all', 'All'],
      ['representation', 'Representation'],
      ['construction', 'Construction'],
      ['inference', 'Inference & expectation'],
      ['memory', 'Memory & knowledge'],
      ['discourse', 'Discourse']
    ];

    labels.forEach(([filter, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'filter-btn';
      button.dataset.filter = filter;
      button.textContent = label;
      button.addEventListener('click', () => {
        setFilter(filter, container, items);
        const url = new URL(window.location.href);
        if (filter === 'all') url.searchParams.delete(queryKey);
        else url.searchParams.set(queryKey, filter);
        window.history.replaceState({}, '', url);
      });
      container.appendChild(button);
    });

    const initial = new URLSearchParams(window.location.search).get(queryKey) || 'all';
    const valid = labels.some(([filter]) => filter === initial) ? initial : 'all';
    setFilter(valid, container, items);
  }

  setupFilters('research-filter-controls', '.research-theme', 'topic');
  setupFilters('pub-filter-controls', '#pub-list .pub', 'topic');
});
