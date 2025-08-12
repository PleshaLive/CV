document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('tournamentTableBody');
  const searchInput = document.getElementById('tournamentSearch');
  const gameFilter = document.getElementById('tournamentGameFilter');
  if (!tbody || !searchInput || !gameFilter) return;

  let data = [];

  fetch('data/tournament-history.csv', { cache: 'no-store' })
    .then((res) => res.text())
    .then((text) => {
      data = parseCSV(text);
      render(data);
      wireUp();
    })
    .catch((err) => {
      console.error('Failed to load tournament-history.csv', err);
      tbody.innerHTML = `<tr><td colspan="4" style="padding:12px; color: var(--text-secondary);">Failed to load tournament history.</td></tr>`;
    });

  function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(Boolean);
    const rows = [];
    for (let i = 1; i < lines.length; i++) { // skip header
      const line = lines[i];
      const parts = line.split(',');
      if (parts.length < 4) continue;
      const [date, game, championship, link] = parts;
      rows.push({ date: date.trim(), game: game.trim(), championship: championship.trim(), link: link?.trim() });
    }
    return rows;
  }

  function render(rows) {
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="4" style="padding:12px; color: var(--text-secondary);">No tournaments found.</td></tr>`;
      return;
    }
    const html = rows
      .map((r) => {
        const linkHtml = r.link
          ? `<a href="${r.link}" target="_blank" rel="noopener" style="color: var(--accent-orange); text-decoration: none;">Open</a>`
          : '<span style="color: var(--text-muted)">—</span>';
        return `
          <tr>
            <td style="padding:10px; border-bottom:1px solid var(--border-color); color: var(--text-secondary);">${escapeHtml(
              r.date
            )}</td>
            <td style="padding:10px; border-bottom:1px solid var(--border-color); color: var(--text-primary); font-weight:500;">${escapeHtml(
              r.game
            )}</td>
            <td style="padding:10px; border-bottom:1px solid var(--border-color); color: var(--text-primary);">${escapeHtml(
              r.championship
            )}</td>
            <td style="padding:10px; border-bottom:1px solid var(--border-color);">${linkHtml}</td>
          </tr>`;
      })
      .join('');
    tbody.innerHTML = html;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function wireUp() {
    const applyFilter = () => {
      const q = searchInput.value.trim().toLowerCase();
      const game = gameFilter.value.trim();
      const filtered = data.filter((r) => {
        const matchesGame = !game || r.game === game;
        const hay = `${r.date} ${r.game} ${r.championship}`.toLowerCase();
        const matchesQuery = !q || hay.includes(q);
        return matchesGame && matchesQuery;
      });
      render(filtered);
    };

    searchInput.addEventListener('input', applyFilter);
    gameFilter.addEventListener('change', applyFilter);
  }
});
