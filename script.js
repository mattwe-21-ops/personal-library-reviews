// Stato dell'applicazione
let reviews = JSON.parse(localStorage.getItem('bookReviews')) || [];
let activeAuthorFilter = null;

// Elementi del DOM
const reviewForm = document.getElementById('reviewForm');
const searchInput = document.getElementById('search');
const reviewsContainer = document.getElementById('reviewsContainer');
const reviewCount = document.getElementById('reviewCount');
const authorsContainer = document.getElementById('authorsContainer');
const authorsFilterCard = document.getElementById('authorsFilterCard');
const clearAuthorFilter = document.getElementById('clearAuthorFilter');

// Aggiungi Nuova Recensione
reviewForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value.trim();

    const newReview = {
        id: Date.now(),
        title: title,
        author: author,
        rating: parseInt(rating),
        review: review,
        date: new Date().toLocaleDateString('it-IT')
    };

    reviews.unshift(newReview);
    saveAndRender();
    reviewForm.reset();
});

// Ascolto input di ricerca
searchInput.addEventListener('input', render);

// Resetta filtro autori
clearAuthorFilter.addEventListener('click', () => {
    activeAuthorFilter = null;
    render();
});

function saveAndRender() {
    localStorage.setItem('bookReviews', JSON.stringify(reviews));
    render();
}

// Funzione Principale di Rendering
function render() {
    const searchTerm = searchInput.value.toLowerCase();
    reviewsContainer.innerHTML = '';

    // Filtra elementi per ricerca e per tag autore attivo
    const filteredReviews = reviews.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(searchTerm) || 
                              r.author.toLowerCase().includes(searchTerm) || 
                              r.review.toLowerCase().includes(searchTerm);
        
        const matchesAuthor = activeAuthorFilter ? r.author.toLowerCase() === activeAuthorFilter.toLowerCase() : true;
        
        return matchesSearch && matchesAuthor;
    });

    reviewCount.textContent = filteredReviews.length;

    if (filteredReviews.length === 0) {
        reviewsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted); background: white; border-radius: var(--radius); border: 1px solid var(--border);">
                <p style="font-size: 1.1rem; font-weight: 500;">Nessuna recensione trovata</p>
                <p style="font-size: 0.9rem; margin-top: 4px;">Aggiungi un nuovo libro o modifica i criteri di ricerca.</p>
            </div>
        `;
    } else {
        filteredReviews.forEach(r => {
            const card = document.createElement('div');
            card.className = 'review-card';
            const starsVisual = '⭐'.repeat(r.rating);

            card.innerHTML = `
                <div class="review-meta">
                    <div>
                        <h3 class="book-title">${escapeHTML(r.title)}</h3>
                        <p class="book-author">di <strong>${escapeHTML(r.author)}</strong> — <span style="font-size:0.85rem; color:var(--text-muted);">${r.date}</span></p>
                    </div>
                    <div class="stars">${starsVisual}</div>
                </div>
                <p class="review-text">${escapeHTML(r.review)}</p>
                <div class="review-actions">
                    <button class="delete-btn" onclick="deleteReview(${r.id})">Elimina Recensione</button>
                </div>
            `;
            reviewsContainer.appendChild(card);
        });
    }

    renderAuthorFilters();
}

// Genera i "pulsanti" degli autori nella sidebar
function renderAuthorFilters() {
    authorsContainer.innerHTML = '';
    
    if (reviews.length === 0) {
        authorsFilterCard.style.display = 'none';
        return;
    }

    authorsFilterCard.style.display = 'block';
    const authors = [...new Set(reviews.map(r => r.author))].sort();

    authors.forEach(author => {
        const tag = document.createElement('span');
        tag.className = 'author-tag';
        tag.textContent = author;
        
        if (activeAuthorFilter && author.toLowerCase() === activeAuthorFilter.toLowerCase()) {
            tag.classList.add('active');
        }

        tag.addEventListener('click', () => {
            if (activeAuthorFilter && activeAuthorFilter.toLowerCase() === author.toLowerCase()) {
                activeAuthorFilter = null;
            } else {
                activeAuthorFilter = author;
            }
            render();
        });

        authorsContainer.appendChild(tag);
    });

    clearAuthorFilter.style.display = activeAuthorFilter ? 'block' : 'none';
}

// Eliminazione
window.deleteReview = function(id) {
    if (confirm("Vuoi eliminare definitivamente questa recensione?")) {
        reviews = reviews.filter(r => r.id !== id);
        if (activeAuthorFilter && !reviews.some(r => r.author.toLowerCase() === activeAuthorFilter.toLowerCase())) {
            activeAuthorFilter = null;
        }
        saveAndRender();
    }
};

// Protezione base da iniezioni di codice (XSS)
function escapeHTML(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
}

render();