document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('#research-filters .filter-btn');
  const cards = document.querySelectorAll('.research-card');
  buttons.forEach(btn => btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    buttons.forEach(b => b.classList.toggle('active', b === btn));
    cards.forEach(card => {
      const tags = (card.dataset.tags || '').split(/\s+/);
      card.style.display = (filter === 'all' || tags.includes(filter)) ? '' : 'none';
    });
  }));
});
