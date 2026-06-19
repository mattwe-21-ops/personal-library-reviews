// Il database del tuo blog. Quando hai una nuova recensione inseriscila qui in alto!
const posts = [
    {
        id: 1,
        titolo: "Le Storie del Mistero",
        autore: "Lyon WGF",
        anno: "2020",
        genere: "Horror per Ragazzi",
        dataLettura: "2026-06-18",
        pagine: "144",
        valutazione: "9 / 10",
        trama: "Lyon, Anna e Cico si uniscono per sventare i piani di una misteriosa organizzazione che conduce esperimenti segreti nei suoi sotterranei.\nIl trio attraversa realtà piene di pericoli per scoprire la verità.",
        personaggi: "Lyon\nAnna\nCico",
        note: "---",
        compilatoDa: "Matteo"
    }
    // I prossimi libri che leggerai li aggiungerai qui sotto divisi da una virgola
];

let activeAuthor = null;

const blogPostsContainer = document.getElementById('blogPostsContainer');
const searchBar = document.getElementById('searchBar');
const authorsContainer = document.getElementById('authorsContainer');
const clearFilterBtn = document.getElementById('clearFilter');

searchBar.addEventListener('input', renderBlog);
clearFilterBtn.addEventListener('click', () => {
    activeAuthor = null;
    renderBlog();
});

function renderBlog() {
    const searchText = searchBar.value.toLowerCase();
    blogPostsContainer.innerHTML = '';

    // Filtra per testo e per autore selezionato
    const filtered = posts.filter(post => {
        const matchesSearch = post.titolo.toLowerCase().includes(searchText) ||
                              post.autore.toLowerCase().includes(searchText) ||
                              post.genere.toLowerCase().includes(searchText) ||
                              post.trama.toLowerCase().includes(searchText);
        
        const matchesAuthor = activeAuthor ? post.autore === activeAuthor : true;
        
        return matchesSearch && matchesAuthor;
    });

    if (filtered.length === 0) {
        blogPostsContainer.innerHTML = `<p style="text-align:center; color:#6e6560; padding: 40px;">Nessuna recensione corrisponde ai criteri di ricerca.</p>`;
    } else {
        filtered.forEach(post => {
            const article = document.createElement('article');
            article.className = 'post-card';
            article.innerHTML = `
                <div class="post-header">
                    <h2 class="post-title">📚 ${escapeHTML(post.titolo)}</h2>
                    <div class="post-meta">Scritto da <strong>${escapeHTML(post.compilatoDa)}</strong> il ${post.dataLettura}</div>
                </div>

                <table class="info-table">
                    <tr><td class="label">Autore:</td><td>${escapeHTML(post.autore)}</td></tr>
                    <tr><td class="label">Anno di pubblicazione:</td><td>${post.anno}</td></tr>
                    <tr><td class="label">Genere:</td><td>${escapeHTML(post.genere)}</td></tr>
                    <tr><td class="label">Numero pagine:</td><td>${post.pagine}</td></tr>
                    <tr><td class="label">Valutazione:</td><td><strong>${post.valutazione}</strong></td></tr>
                </table>

                <div class="section-title">Trama</div>
                <div class="text-block">${escapeHTML(post.trama)}</div>

                <div class="section-title">Personaggi Principali</div>
                <div class="text-block">${escapeHTML(post.personaggi)}</div>

                <div class="section-title">Note aggiuntive</div>
                <div class="text-block">${escapeHTML(post.note)}</div>

                <div class="post-footer">
                    Identikit firmato da: <strong>${escapeHTML(post.compilatoDa)}</strong>
                </div>
            `;
            blogPostsContainer.appendChild(article);
        });
    }

    renderAuthors();
}

function renderAuthors() {
    authorsContainer.innerHTML = '';
    const uniqueAuthors = [...new Set(posts.map(p => p.autore))].sort();

    uniqueAuthors.forEach(author => {
        const btn = document.createElement('span');
        btn.className = `author-tag ${activeAuthor === author ? 'active' : ''}`;
        btn.textContent = author;
        btn.addEventListener('click', () => {
            activeAuthor = activeAuthor === author ? null : author;
            renderBlog();
        });
        authorsContainer.appendChild(btn);
    });

    clearFilterBtn.style.display = activeAuthor ? 'inline' : 'none';
}

function escapeHTML(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
}

// Primo avvio
renderBlog();