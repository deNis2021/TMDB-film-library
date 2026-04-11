

const BASE = 'https://localhost:7008';

document.getElementById('filmQuery').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchFilm();
});
document.getElementById('countryQuery').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchCountry();
});
document.getElementById('idQuery').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchId();
});

async function searchFilm() {
    const q = document.getElementById('filmQuery').value.trim();
    if (!q) return;
    const out = document.getElementById('results');
    out.innerHTML = '<div class="status">Loading...</div>';
    try {
        const res = await fetch(`${BASE}/Film/search/${encodeURIComponent(q)}`);
        const data = await res.json();
        renderResults(data, out);
    } catch (e) {
        out.innerHTML = `<div class="status" style="color:red">Error: ${e.message}</div>`;
    }
}

async function searchCountry() {
    const q = document.getElementById('countryQuery').value.trim();
    if (!q) return;
    const out = document.getElementById('results');
    out.innerHTML = '<div class="status">Loading...</div>';
    try {
        const res = await fetch(`${BASE}/Film/country/${encodeURIComponent(q)}`);
        const data = await res.json();
        renderResults(data, out);
    } catch (e) {
        out.innerHTML = `<div class="status" style="color:red">Error: ${e.message}</div>`;
    }
}

async function searchId() {
    const q = document.getElementById('idQuery').value.trim();
    if (!q) return;
    const out = document.getElementById('results');
    out.innerHTML = '<div class="status">Loading...</div>';
    try {
        const res = await fetch(`${BASE}/Film/Id/${encodeURIComponent(q)}`);
        const m = await res.json();
        if (!m || !m.id) { out.innerHTML = '<div class="status">Nothing found</div>'; return; }
        const year = m.release_date?.slice(0, 4) ?? '—';
        const rating = m.vote_average?.toFixed(1);
        const poster = m.poster_path
            ? `<img class="poster" src="https://image.tmdb.org/t/p/w92${m.poster_path}">`
            : `<div class="poster" style="display:flex;align-items:center;justify-content:center">🎬</div>`;
        out.innerHTML = `<a href="film.html?id=${m.id}" class="card">${poster}<div><div class="title">${m.title}${rating ? `<span class="badge">★ ${rating}</span>` : ''}</div><div class="meta">${year}</div><div class="overview">${m.overview || '—'}</div></div></div>`;
    } catch (e) {
        out.innerHTML = `<div class="status" style="color:red">No film with such Id!</div>`;
    }
}

async function searchActor() {
    const q = document.getElementById('actorQuery').value.trim();
    if (!q) return;
    const out = document.getElementById('results');
    out.innerHTML = '<div class="status">Loading...</div>';
    try {
        const res = await fetch(`${BASE}/Film/Actor/${encodeURIComponent(q)}`);
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            out.innerHTML = '<div class="status">Nothing found</div>';
            return;
        }

        out.innerHTML = data.results.map(m => {
            const year = m.release_date?.slice(0, 4) ?? '—';
            const rating = m.vote_average?.toFixed(1);
            const poster = m.poster_path
                ? `<img class="poster" src="https://image.tmdb.org/t/p/w92${m.poster_path}">`
                : `<div class="poster" style="display:flex;align-items:center;justify-content:center">🎬</div>`;
            return `<a href="film.html?id=${m.id}" class="card">${poster}<div><div class="title">${m.title}${rating ? `<span class="badge">★ ${rating}</span>` : ''}</div><div class="meta">${year}</div><div class="overview">${m.overview || '—'}</div></div></div>`;
        }).join('');

    } catch (e) {
        out.innerHTML = `<div class="status" style="color:red">Error loading results</div>`;
    }
}

function renderResults(data, out) {
    if (!data.results?.length) {
        out.innerHTML = '<div class="status">Nothing found</div>';
        return;
    }
    out.innerHTML = data.results.slice(0, 10).map(m => {
        const year = m.release_date?.slice(0, 4) ?? '—';
        const rating = m.vote_average?.toFixed(1);
        const poster = m.poster_path
            ? `<img class="poster" src="https://image.tmdb.org/t/p/w92${m.poster_path}">`
            : `<div class="poster" style="display:flex;align-items:center;justify-content:center">🎬</div>`;
        return `<a href="film.html?id=${m.id}" class="card">${poster}<div><div class="title">${m.title}${rating ? `<span class="badge">★ ${rating}</span>` : ''}</div><div class="meta">${year}</div><div class="overview">${m.overview || '—'}</div></div></a>`;
    }).join('');
}


async function loadPopular() {
    const out = document.getElementById('popular');
    out.innerHTML = '<div class="status">Loading...</div>';
    try {
        const res = await fetch(`${BASE}/Film/Popular`);
        const data = await res.json();
        renderResults(data, out);
    } catch (e) {
        out.innerHTML = `<div class="status" style="color:red">Error loading popular movies</div>`;
    }
}

    loadPopular();