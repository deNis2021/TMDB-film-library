const BASE = 'https://localhost:7008';

async function loadFilm() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const out = document.getElementById('film');

    if (!id) {
        out.innerHTML = '<div class="status">No film ID provided</div>';
        return;
    }

    out.innerHTML = '<div class="status">Loading...</div>';

    try {
        const res = await fetch(`${BASE}/Film/Id/${id}`);
        const m = await res.json();

        if (!m || !m.id) {
            out.innerHTML = '<div class="status">Nothing found</div>';
            return;
        }

        const year = m.release_date?.slice(0, 4) ?? '—';
        const runtime = m.runtime ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m` : '—';
        const budget = m.budget ? `$${m.budget.toLocaleString()}` : '—';
        const revenue = m.revenue ? `$${m.revenue.toLocaleString()}` : '—';
        const genres = m.genres?.map(g => `<span class="badge">${g.name}</span>`).join(' ') ?? '—';
        const countries = m.production_countries?.map(c => c.name).join(', ') ?? '—';

        const poster = m.poster_path
            ? `<img class="poster-large" src="https://image.tmdb.org/t/p/w300${m.poster_path}">`
            : `<div class="poster-large" style="display:flex;align-items:center;justify-content:center">🎬</div>`;

        const backdrop = m.backdrop_path
            ? `<div class="backdrop" style="background-image:url('https://image.tmdb.org/t/p/w1280${m.backdrop_path}')"></div>`
            : '';

        const cast = m.credits?.cast?.slice(0, 10).map(c => `
            <div class="cast-item">
                <img src="${c.profile_path ? `https://image.tmdb.org/t/p/w92${c.profile_path}` : 'https://via.placeholder.com/92x138?text=?'}" alt="${c.name}">
                <div class="cast-name">${c.name}</div>
                <div class="cast-character">${c.character}</div>
            </div>`).join('') ?? '—';

        const director = m.credits?.crew?.find(c => c.job === 'Director')?.name ?? '—';

        out.innerHTML = `
            ${backdrop}
            <div class="film-detail">
                ${poster}
                <div class="film-info">
                    <h1>${m.title}</h1>
                    ${m.tagline ? `<div class="tagline">${m.tagline}</div>` : ''}
                    <div class="meta-row">
                        <span>⭐ ${m.vote_average?.toFixed(1)} (${m.vote_count} votes)</span>
                        <span>📅 ${year}</span>
                        <span>⏱ ${runtime}</span>
                        <span>🌍 ${countries}</span>
                    </div>
                    <div class="genres">${genres}</div>
                    <p class="overview">${m.overview || '—'}</p>
                    <div class="details">
                        <div><strong>Original title:</strong> ${m.original_title}</div>
                        <div><strong>Director:</strong> ${director}</div>
                        <div><strong>Budget:</strong> ${budget}</div>
                        <div><strong>Revenue:</strong> ${revenue}</div>
                        <div><strong>Status:</strong> ${m.status}</div>
                    </div>
                    <h3>Cast</h3>
                    <div class="cast-list">${cast}</div>
                </div>
            </div>`;
    } catch (e) {
        out.innerHTML = `<div class="status" style="color:red">Error loading film</div>`;
    }
}

loadFilm();