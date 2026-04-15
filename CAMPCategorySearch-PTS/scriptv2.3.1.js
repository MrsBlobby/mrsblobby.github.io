  fetch('final_workshop_db.json')
    .then(response => response.json())
    .then(db => {
      const searchBox = document.getElementById('searchBox');
      const results = document.getElementById('results');
      const toggleImages = document.getElementById('toggleImages');
      const sortMode = document.getElementById('sortMode');
      const pagination = document.getElementById('pagination');

      let currentPage = 1;
      const itemsPerPage = 50;
      let lastQuery = '';

      function sortItems(items) {
        const mode = sortMode.value;
        if (mode === 'camp-bottom') return [...items].reverse();
        if (mode === 'new-old') return [...items].sort((a, b) => (b.CNAM_FormID || '').localeCompare(a.CNAM_FormID || ''));
        if (mode === 'old-new') return [...items].sort((a, b) => (a.CNAM_FormID || '').localeCompare(b.CNAM_FormID || ''));
        if (mode === 'az') return [...items].sort((a, b) => (a.Name || '').localeCompare(b.Name || ''));
        if (mode === 'za') return [...items].sort((a, b) => (b.Name || '').localeCompare(a.Name || ''));
        return items;
      }

      function paginate(items) {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return items.slice(start, end);
      }

      function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        pagination.innerHTML = '';

        if (totalPages <= 1) return;

        const prevBtn = document.createElement('button');
        prevBtn.textContent = '← Prev';
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => { currentPage--; renderResults(lastQuery); };
        pagination.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
          if (i === currentPage || i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.style.margin = '0 4px';
            btn.style.background = i === currentPage ? 'var(--accent)' : 'var(--card-bg)';
            btn.style.color = i === currentPage ? 'black' : 'var(--text)';
            btn.style.border = '1px solid var(--accent)';
            btn.style.borderRadius = '4px';
            btn.style.cursor = 'pointer';
            btn.onclick = () => { currentPage = i; renderResults(lastQuery); };
            pagination.appendChild(btn);
          } else if (Math.abs(i - currentPage) === 3) {
            const span = document.createElement('span');
            span.textContent = '...';
            pagination.appendChild(span);
          }
        }

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next →';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => { currentPage++; renderResults(lastQuery); };
        pagination.appendChild(nextBtn);
      }

      function renderResults(query) {
        const normalizedQuery = query.toLowerCase();
        const queryChanged = normalizedQuery !== lastQuery;
        lastQuery = normalizedQuery;

        const filtered = db.filter(item => item.Name && item.Name.trim() !== '' && (!normalizedQuery || item.Name.toLowerCase().includes(normalizedQuery)));
        const sorted = sortItems(filtered);

        // reset to page 1 if query changed or current page is now out of range
        const totalPages = Math.ceil(sorted.length / itemsPerPage);
        if (queryChanged || currentPage > totalPages) currentPage = 1;

        const paged = paginate(sorted);
        results.innerHTML = '';

        if (!paged.length) {
          results.innerHTML = '<li>No matches found</li>';
          pagination.innerHTML = '';
          return;
        }

        paged.forEach(r => {
          const li = document.createElement('li');
          const left = document.createElement('div');
          left.className = 'result-left';

          const name = document.createElement('div');
          name.className = 'result-name';
          name.textContent = r.Name;
          left.appendChild(name);

          if (toggleImages.checked && r.CNAM_FormID) {
            const img = document.createElement('img');
            img.src = `Images/${r.CNAM_FormID.toLowerCase()}.png`;
            img.alt = r.Name;
            img.loading = "lazy";
            left.appendChild(img);
          }

          const right = document.createElement('div');
          right.className = 'result-right';
          const categories = [];
          if (r.Category) categories.push(r.Category);
          if (r.SubCategory && r.Category.toLowerCase() !== 'wallpapers') categories.push(r.SubCategory);

          categories.forEach((cat, index) => {
            const catSpan = document.createElement('span');
            catSpan.className = 'pill';
            catSpan.textContent = cat;
            right.appendChild(catSpan);
            if (index < categories.length - 1) {
              const arrow = document.createElement('span');
              arrow.className = 'arrow';
              right.appendChild(arrow);
            }
          });

          li.appendChild(left);
          li.appendChild(right);
          results.appendChild(li);
        });

        renderPagination(sorted.length);
      }

      searchBox.addEventListener('input', () => renderResults(searchBox.value));
      toggleImages.addEventListener('change', () => renderResults(searchBox.value));
      sortMode.addEventListener('change', () => {
        currentPage = 1;
        renderResults(searchBox.value.toLowerCase());
      });

      renderResults('');
    })
    .catch(err => {
      console.error("Failed to load database:", err);
      document.getElementById('results').innerHTML = '<li>Error loading database.</li>';
    });
