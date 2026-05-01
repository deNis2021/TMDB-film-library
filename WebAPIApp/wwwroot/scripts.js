const BASE = 'https://localhost:7008';
let lastResults = [];
let popularResults = [];
let currentPage = 1;
const PAGE_SIZE = 5;
let currentOut = null;

document.getElementById('filmQuery').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchFilm();
});
document.getElementById('countryQuery').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchCountry();
});
document.getElementById('idQuery').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchId();
});
document.getElementById('actorQuery').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchActor();
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
        out.innerHTML = `<a href="film.html?id=${m.id}" class="card">${poster}<div><div class="title">${m.title}${rating ? `<span class="badge">★ ${rating}</span>` : ''}</div><div class="meta">${year}</div><div class="overview">${m.overview || '—'}</div></div></a>`;
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
        renderResults(data, out);
    } catch (e) {
        out.innerHTML = `<div class="status" style="color:red">Error loading results</div>`;
    }
}

function renderResults(data, out) {
    if (!data.results?.length) {
        out.innerHTML = '<div class="status">Nothing found</div>';
        return;
    }
    lastResults = data.results.slice(0, 100);
    currentPage = 1;
    currentOut = out;
    renderPage(out);
}

function renderPage(out) {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const page = lastResults.slice(start, end);
    renderCards(page, out);
    renderPagination(out);
}

function renderPagination(out) {
    const totalPages = Math.ceil(lastResults.length / PAGE_SIZE);
    if (totalPages <= 1) return;

    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    pagination.innerHTML = `
        <button onclick="changePage(-1)" ${currentPage === 1 ? 'disabled' : ''}>← Prev</button>
        <span>${currentPage} / ${totalPages}</span>
        <button onclick="changePage(1)" ${currentPage === totalPages ? 'disabled' : ''}>Next →</button>
    `;
    out.appendChild(pagination);
}

function changePage(dir) {
    const totalPages = Math.ceil(lastResults.length / PAGE_SIZE);
    currentPage = Math.max(1, Math.min(totalPages, currentPage + dir));
    renderPage(currentOut);
}

function renderCards(movies, out) {
    out.innerHTML = movies.map(m => {
        const year = m.release_date?.slice(0, 4) ?? '—';
        const rating = m.vote_average?.toFixed(1);
        const poster = m.poster_path
            ? `<img class="poster" src="https://image.tmdb.org/t/p/w92${m.poster_path}">`
            : `<div class="poster" style="display:flex;align-items:center;justify-content:center">🎬</div>`;
        return `<a href="film.html?id=${m.id}" class="card">${poster}<div><div class="title">${m.title}${rating ? `<span class="badge">★ ${rating}</span>` : ''}</div><div class="meta">${year}</div><div class="overview">${m.overview || '—'}</div></div></a>`;
    }).join('');
}

function sortResults(by) {
    if (!lastResults.length) return;
    const out = currentOut ?? document.getElementById('popular');
    lastResults = [...lastResults].sort((a, b) => {
        if (by === 'rating') return (b.vote_average ?? 0) - (a.vote_average ?? 0);
        if (by === 'date') return new Date(b.release_date ?? 0) - new Date(a.release_date ?? 0);
    });
    currentPage = 1;
    renderPage(out);
}

async function loadPopular() {
    const out = document.getElementById('popular');
    out.innerHTML = '<div class="status">Loading...</div>';
    try {
        const res = await fetch(`${BASE}/Film/Popular`);
        const data = await res.json();
        lastResults = data.results?.slice(0, 100) ?? [];
        popularResults = [...lastResults];
        currentPage = 1;
        currentOut = out;
        renderPage(out);
    } catch (e) {
        out.innerHTML = `<div class="status" style="color:red">Error loading popular movies</div>`;
    }
}

async function searchGenre() {
    const genreId = document.getElementById('genreSelect').value;
    const out = document.getElementById('results');

    if (!genreId) {
        out.innerHTML = '';
        lastResults = [...popularResults];
        renderCards(lastResults, document.getElementById('popular'));
        return;
    }

    out.innerHTML = '<div class="status">Loading...</div>';
    try {
        const res = await fetch(`${BASE}/Film/Genre/${genreId}`);
        const data = await res.json();
        renderResults(data, out);
    } catch (e) {
        out.innerHTML = `<div class="status" style="color:red">Error loading results</div>`;
    }
}

document.getElementById('studioQuery').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchStudio();
});

async function searchStudio() {
    const q = document.getElementById('studioQuery').value.trim();
    if (!q) return;
    const out = document.getElementById('results');
    out.innerHTML = '<div class="status">Loading...</div>';
    try {
        const res = await fetch(`${BASE}/Film/Studio/${encodeURIComponent(q)}`);
        const data = await res.json();
        renderResults(data, out);
    } catch (e) {
        out.innerHTML = `<div class="status" style="color:red">Error loading results</div>`;
    }
}

loadPopular();