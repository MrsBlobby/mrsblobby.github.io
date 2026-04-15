let db = [];
let currentPage = 1;
const itemsPerPage = 50;
let lastQuery = '';
let currentSort = 'camp-top';
let currentSearchBy = 'name';
let activeFilters = new Set()

// --- Category Icons ---
const CategoryIcons = {
  'Quest': '../assets/MainCategory-QuestsIcon.svg',
  'Objectives': '../assets/MainCategory-QuestsIcon.svg',
  'Wallpapers': '../assets/MainCategory-WallpapersIcon.svg',
  'C.A.M.P. Pieces': '../assets/MainCategory-CAMPPiecesIcon.svg',
  'Foundations': '../assets/SubCategory-FoundationsIcon.png',
  'Decorations': '../assets/MainCategory-DecorationsIcon.svg',
  'Defense': '../assets/MainCategory-DefensesIcon.svg',
  'Dwellers': '../assets/MainCategory-DwellersIcon.svg',
  'Furniture': '../assets/MainCategory-FurnitureIcon.svg',
  'Lights': '../assets/MainCategory-LightsIcon.svg',
  'Power': '../assets/MainCategory-PowerIcon.svg',
  'Resources': '../assets/MainCategory-ResourcesIcon.svg',
  'Storage': '../assets/MainCategory-StorageIcon.svg',
  'Utility': '../assets/MainCategory-UtilityIcon.svg',
  'Wall Decor': '../assets/MainCategory-WallDecorIcon.svg',
  'Structure': '../assets/MainCategory-StructureIcon.svg',
  'Porches': '../assets/SubCategory-PorchesIcon.png',
  'Floors':'../assets/SubCategory-FloorsIcon.png',
  'Walls': '../assets/SubCategory-WallsIcon.png',
  'Roofs': '../assets/SubCategory-RoofsIcon.png',
  'Stairs': '../assets/SubCategory-StairsIcon.png',
  'Shelters': '../assets/SubCategory-SheltersIcon.png',
  'Doors': '../assets/SubCategory-DoorsIcon.png',
  'Columns': '../assets/SubCategory-ColumnsIcon.png',
  'Fences': '../assets/SubCategory-FencesIcon.png',
  'Barricades': '../assets/SubCategory-BarricadeIcon.png',
  'Traps': '../assets/SubCategory-TrapsIcon.png',
  'Turrets': '../assets/SubCategory-TurretsIcon.png',
  'Generators': '../assets/SubCategory-GeneratorsIcon.png',
  'Power Connectors': '../assets/SubCategory-PowerConnectorsIcon.png',
  'Candles': '../assets/SubCategory-CandleIcon.png',
  'Ceiling Lights': '../assets/SubCategory-CeilingLightsIcon.png',
  'Fire': '../assets/SubCategory-FireIcon.png',
  'Lamps': '../assets/SubCategory-LampsIcon.svg',
  'Wall Lights': '../assets/SubCategory-WallLightsIcon.png',
  'Crafting': '../assets/SubCategory-CraftingIcon.png',
  'Collectors': '../assets/SubCategory-CollectorsIcon.png',
  'Food': '../assets/SubCategory-FoodIcon.png',
  'Producers': '../assets/SubCategory-ProducersIcon.png',
  'Water': '../assets/SubCategory-WaterIcon.png',
  'Instruments': '../assets/SubCategory-InstrumentsIcon.png',
  'Player Buffs': '../assets/SubCategory-PlayerBuffsIcon.png',
  'Services': '../assets/SubCategory-ServicesIcon.png',
  'Vending Machines': '../assets/SubCategory-VendingMachinesIcon.png',
  'Appliances': '../assets/SubCategory-AppliancesIcon.png',
  'Beds': '../assets/SubCategory-BedsIcon.png',
  'Electronics': '../assets/SubCategory-ElectronicsIcon.png',
  'Seating': '../assets/SubCategory-SeatingIcon.png',
  'Shelves': '../assets/SubCategory-ShelvesIcon.png',
  'Surfaces': '../assets/SubCategory-SurfacesIcon.png',
  'Balloons': '../assets/SubCategory-BalloonsIcon.png',
  'Clutter': '../assets/SubCategory-ClutterIcon.png',
  'Crockery': '../assets/SubCategory-CrockeryIcon.png',
  'Entertainment': '../assets/SubCategory-EntertainmentIcon.png',
  'Fauna': '../assets/SubCategory-FaunaIcon.png',
  'Lawn & Garden': '../assets/SubCategory-Lawn&GardenIcon.png',
  'Novelties': '../assets/SubCategory-NoveltiesIcon.png',
  'Outdoor': '../assets/SubCategory-OutdoorIcon.png',
  'Rugs': '../assets/SubCategory-RugsIcon.png',
  'Signs': '../assets/SubCategory-SignsIcon.png',
  'Statues': '../assets/SubCategory-StatuesIcon.png',
  'Taxidermy': '../assets/SubCategory-TaxidermyIcon.png',
  'Toys': '../assets/SubCategory-ToysIcon.png',
  'Vehicles': '../assets/SubCategory-VehiclesIcon.png',
  'Accents': '../assets/SubCategory-AccentsIcon.png',
  'Ceiling': '../assets/SubCategory-CeilingIcon.png',
  'Holiday': '../assets/SubCategory-HolidayIcon.png',
  'Mounted': '../assets/SubCategory-MountedIcon.png',
  'Tapestry': '../assets/SubCategory-TapestryIcon.png',
  'Wall Art': '../assets/SubCategory-WallArtIcon.svg',
  'Wall Letters': '../assets/SubCategory-WallLettersIcon.png',
  'Window': '../assets/SubCategory-WindowIcon.png',
  'Additional Storage': '../assets/SubCategory-AdditionalStorageIcon.svg',
  'Displays': '../assets/SubCategory-DisplaysIcon.png',
  'Stash Boxes': '../assets/SubCategory-StashBoxesIcon.png',
  'Farm': '../assets/SubCategory-FarmIcon.png',
  'Frontier': '../assets/SubCategory-FrontierIcon.png',
  'Industrial': '../assets/SubCategory-IndustrialIcon.png',
  'Military': '../assets/SubCategory-MilitaryIcon.png',
  'Modern': '../assets/SubCategory-ModernIcon.png',
  'Retail': '../assets/SubCategory-RetailIcon.png',
  'Rustic': '../assets/SubCategory-RusticIcon.png',
  'Scavenger': '../assets/SubCategory-ScavengerIcon.png',
  'Allies': '../assets/SubCategory-AlliesIcon.svg',
  'Pets': '../assets/SubCategory-PetsIcon.png',
  'Pet Furniture': '../assets/SubCategory-PetFurnitureIcon.png'
};

window.addEventListener('DOMContentLoaded', () => {
  // Clear search bar
  const searchBox = document.getElementById('searchBox');
  searchBox.value = '';
  lastQuery = '';

  // Hide all dropdowns on load
  const filtersOptions = document.getElementById('filtersOptions');
  filtersOptions.classList.remove('open');

  const filtersButton = document.getElementById('filtersButton');
  filtersButton.classList.remove('open');

  const dropdownOptions = document.getElementById('dropdownOptions');
  dropdownOptions.classList.remove('open');
  dropdownSelected.classList.remove('open');

  const sortOptions = document.getElementById('sortOptions');
  sortOptions.classList.remove('open');
  sortSelected.classList.remove('open');

  // Optional: render all results initially
  renderResults('');
});

// --- Manual icon overrides ---
const ManualIcons = {
  'XPD_': '../assets/StampIcon.png',
  '_GOLDVENDOR': '../assets/BullionIcon.png',
};
const ManualEntmIcons = {
  'Babylon_': '../assets/V51Icon.png',
  'Shelters_': '../assets/AtomIcon.png',
};
const miniSeasonAliases = {
  'SCORE_MiniSeason_2025_MMMFE': 'Marshal Mallow'
};

// --- Fetch DB ---
fetch('final_workshop_db.json')
  .then(response => response.json())
  .then(data => {
    db = data;
    renderResults('');
  })
  .catch(err => {
    console.error("Failed to load database:", err);
    document.getElementById('results').innerHTML = '<li>Error loading database.</li>';
  });

// --- Dropdown elements ---
const dropdownSelected = document.getElementById('dropdownSelected');
dropdownSelected.textContent = 'Search By: Item Name';
const dropdownOptions = document.getElementById('dropdownOptions');
const sortSelected = document.getElementById('sortSelected');
const sortOptions = document.getElementById('sortOptions');
const sortLabel = document.getElementById('sortLabel');
const filtersButton = document.getElementById('filtersButton');
const filtersOptions = document.getElementById('filtersOptions');
const clearFiltersBtn = document.querySelector('.clear-filters');

// --- Close logic ---
function closeAllDropdowns() {
  dropdownOptions.classList.remove('open');
  dropdownSelected.classList.remove('open');
  sortOptions.classList.remove('open');
  sortSelected.classList.remove('open');
  filtersOptions.classList.remove('open');
  filtersButton.classList.remove('open');
}


function closeOtherDropdowns(except) {
  if (except !== 'search') {
    dropdownOptions.classList.remove('open');
    dropdownSelected.classList.remove('open');
  }
  if (except !== 'sort') {
    sortOptions.classList.remove('open');
    sortSelected.classList.remove('open');
  }
  if (except !== 'filters') {
    filtersOptions.classList.remove('open');
    filtersButton.classList.remove('open');
  }
}

// --- Search By dropdown ---
dropdownSelected.addEventListener('click', e => {
  e.stopPropagation();
  const isOpen = dropdownOptions.classList.contains('open');
  closeAllDropdowns();
  if (!isOpen) {
    dropdownOptions.classList.add('open');
    dropdownSelected.classList.add('open');
  }
});

// --- Initial button text ---
sortSelected.textContent = 'Sort By: Workshop Menu ▼';

// --- Toggle dropdown on button click ---
sortSelected.addEventListener('click', e => {
  e.stopPropagation();
  const isOpen = sortOptions.classList.contains('open');
  closeAllDropdowns(); // Close other dropdowns first
  if (!isOpen) {
    sortOptions.classList.add('open');
    sortSelected.classList.add('open');
  }
});

// --- Option click handler ---
sortOptions.querySelectorAll('.option').forEach(option => {
  option.addEventListener('click', e => {
    e.stopPropagation();
    currentSort = option.dataset.value;

    // Update the whole button text, preserving prefix
    sortSelected.textContent = 'Sort By: ' + option.textContent.trim();

    // Close dropdown
    sortOptions.classList.remove('open');
    sortSelected.classList.remove('open');

    // Refresh results
    const searchBox = document.getElementById('searchBox');
    renderResults(searchBox ? searchBox.value : '');
  });
});


// --- Close dropdown if clicking elsewhere ---
document.addEventListener('click', () => {
  sortOptions.classList.remove('open');
  sortSelected.classList.remove('open');
});

function updateFiltersButton() {
  const count = activeFilters.size;

  // Find or create label span
  let label = filtersButton.querySelector('.filters-label');
  if (!label) {
    // Remove any existing text nodes (except the SVG)
    Array.from(filtersButton.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) node.remove();
    });

    label = document.createElement('span');
    label.className = 'filters-label';
    filtersButton.prepend(label); // add before the SVG
  }

  // Update text
  label.textContent = count ? `Filters: ${count}` : 'Filters';

  // Highlight if active
  if (count) {
    filtersButton.classList.add('active');
  } else {
    filtersButton.classList.remove('active');
  }
}


// --- Filters dropdown ---
filtersButton.addEventListener('click', e => {
  e.stopPropagation();
  const isOpen = filtersOptions.classList.contains('open');
  closeAllDropdowns(); // Close everything before toggling filters
  if (!isOpen) {
    filtersOptions.classList.add('open');
    filtersButton.classList.add('open');
  }
});

// Prevent clicks inside filters dropdown from closing it
filtersOptions.addEventListener('click', e => e.stopPropagation());

// Clear button handler
clearFiltersBtn.addEventListener('click', e => {
  e.stopPropagation();

  // Close the other two dropdowns (always)
  dropdownOptions.classList.remove('open');
  dropdownSelected.classList.remove('open');
  sortOptions.classList.remove('open');
  sortSelected.classList.remove('open');

  // Clear activeFilters data and UI
  activeFilters.clear();
  filtersOptions.querySelectorAll('button[data-filter].selected')
    .forEach(btn => btn.classList.remove('selected'));

  // Update Filters button text and highlight
  updateFiltersButton();

  // Refresh results using current searchbox value (safe lookup)
  const sb = document.getElementById('searchBox');
  renderResults(sb ? sb.value : '');
});


// --- Global click closes everything ---
document.addEventListener('click', () => closeAllDropdowns());


// --- Search & Sort Options ---
dropdownOptions.querySelectorAll('.option').forEach(option => {
  option.addEventListener('click', () => {
    currentSearchBy = option.dataset.value;
    dropdownSelected.textContent = 'Search By: ' + option.textContent;
    dropdownOptions.classList.remove('open');
    dropdownSelected.classList.remove('open');
    renderResults(document.getElementById('searchBox').value);
  });
});

document.getElementById('searchBox').addEventListener('input', e => renderResults(e.target.value));

// --- Sorting / Pagination ---
function sortItems(items) {
  switch(currentSort) {
    case 'camp-bottom': return [...items].reverse();
    case 'new-old': return [...items].sort((a,b) => (b.CNAM_FormID || '').localeCompare(a.CNAM_FormID || ''));
    case 'old-new': return [...items].sort((a,b) => (a.CNAM_FormID || '').localeCompare(b.CNAM_FormID || ''));
    case 'az': return [...items].sort((a,b) => (a.Name || '').localeCompare(b.Name || ''));
    case 'za': return [...items].sort((a,b) => (b.Name || '').localeCompare(a.Name || ''));
    default: return items;
  }
}

function paginate(items) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return items.slice(start, end);
}

function renderPagination(totalItems) {
  const pagination = document.getElementById('pagination');
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  pagination.innerHTML = '';
  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '← Prev';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => { currentPage--; renderResults(document.getElementById('searchBox').value); };
  pagination.appendChild(prevBtn);

  for (let i=1; i<=totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i-currentPage) <= 2) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.style.fontWeight = i===currentPage ? 'bold' : 'normal';
      btn.onclick = () => { currentPage = i; renderResults(document.getElementById('searchBox').value); };
      pagination.appendChild(btn);
    } else if (Math.abs(i-currentPage) === 3) {
      const span = document.createElement('span');
      span.textContent = '...';
      pagination.appendChild(span);
    }
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next →';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => { currentPage++; renderResults(document.getElementById('searchBox').value); };
  pagination.appendChild(nextBtn);
}

filtersOptions.querySelectorAll('button[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    if (activeFilters.has(filter)) {
      activeFilters.delete(filter);
      btn.classList.remove('selected');
    } else {
      activeFilters.add(filter);
      btn.classList.add('selected');
    }
    updateFiltersButton();
    renderResults(searchBox.value);
  });
});


// --- Render results ---
function renderResults(query) {
  const normalizedQuery = query.toLowerCase();
  const queryChanged = normalizedQuery !== lastQuery;
  lastQuery = normalizedQuery;

  // --- filters setup ---
  let placementFilters = new Set(['plan', 'entitlement']);

  function matchesItem(item) {
    if (activeFilters.size === 0) return true; // no filters → always match

    // Separate active filters into types
    const placementActive = [...activeFilters].filter(f => placementFilters.has(f));
    const categoryActive  = [...activeFilters].filter(f => !placementFilters.has(f));

    // --- Placement filters (plan, entitlement) OR logic ---
    const placementMatch = placementActive.length === 0 || placementActive.some(f => 
      (f === 'plan' && item.BOOK_FULL?.trim()) ||
      (f === 'entitlement' && item.ENTM_FULL?.trim())
    );

    // --- Category/subcategory filters OR logic ---
    const categoryMatch = categoryActive.length === 0 || categoryActive.some(f => 
      (item.Category || '').toLowerCase() === f || (item.SubCategory || '').toLowerCase() === f
    );

    // AND across different filter types
    return placementMatch && categoryMatch;
  }


  // --- Filter the DB ---
  const filtered = db.filter(item => {
  if (!item.Name || item.Name === 'null' || item.Name.trim() === '') return false;
    // basic search
    let matchesSearch;
    if (!normalizedQuery) matchesSearch = true;
    else if (currentSearchBy === 'name') matchesSearch = item.Name && item.Name.toLowerCase().includes(normalizedQuery);
    else if (currentSearchBy === 'book') matchesSearch = item.BOOK_FULL && item.BOOK_FULL.toLowerCase().includes(normalizedQuery);
    else if (currentSearchBy === 'entm') matchesSearch = item.ENTM_FULL && item.ENTM_FULL.toLowerCase().includes(normalizedQuery);

    const matchesFilters = matchesItem(item); // call the new function

    return matchesSearch && matchesFilters;
  });

  const sorted = sortItems(filtered);

  // reset to page 1 if query changed or current page is out of range
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
    if ((r.SubCategory || '').trim().toLowerCase() === 'testsubcat'.toLowerCase()) return;

    const li = document.createElement('li');

    const left = document.createElement('div');
    left.className = 'result-left';

    const name = document.createElement('div');
    name.className = 'result-name';
    name.textContent = r.Name;
    left.appendChild(name);

    if (r.CNAM_FormID) {
      const img = document.createElement('img');
      img.src = `Images/${r.CNAM_FormID.toLowerCase()}.png`;
      img.alt = r.Name;
      img.loading = "lazy";
      left.appendChild(img);
    }

    const right = document.createElement('div');
    right.className = 'result-right';

    // --- Build Menu Category header + pills ---
    if ((r.Category && r.Category.trim() !== '') || (r.SubCategory && r.SubCategory.trim() !== '')) {
      const catHeader = document.createElement('div');
      catHeader.className = 'section-header';
      catHeader.textContent = 'Build Menu Category';
      right.appendChild(catHeader);

      const catWrap = document.createElement('div');
      catWrap.className = 'inline-wrap';

      const categories = [];
      if (r.Category && r.Category.trim() !== '') categories.push(r.Category);
      if (r.SubCategory && r.SubCategory.trim() !== '' && (r.Category || '').toLowerCase() !== 'wallpapers') categories.push(r.SubCategory);

      categories.forEach((cat, i) => {
        const catSpan = document.createElement('span');
        catSpan.className = 'pill';
        catSpan.textContent = '';

        const iconPath = CategoryIcons[cat];
        if (iconPath) {
          const icon = document.createElement('img');
          icon.src = iconPath;
          const isSVG = iconPath.toLowerCase().endsWith('.svg');
          icon.style.height = isSVG ? '24px' : '30px';
          icon.style.width = 'auto';
          icon.style.verticalAlign = 'middle';
          icon.style.marginRight = '6px';
          catSpan.appendChild(icon);
        }

        catSpan.appendChild(document.createTextNode(cat));
        catWrap.appendChild(catSpan);

        if (i < categories.length - 1) {
          const arrow = document.createElement('span');
          arrow.className = 'arrow';
          catWrap.appendChild(arrow);
        }
      });

      right.appendChild(catWrap);
    }

    // --- Placement Conditions header + pills ---
    const hasBook = !!(r.BOOK_FULL && String(r.BOOK_FULL).trim());
    const hasEntm = !!(r.ENTM_FULL && String(r.ENTM_FULL).trim());
    if (hasBook || hasEntm) {
      const condHeader = document.createElement('div');
      condHeader.className = 'section-header';
      condHeader.textContent = 'Placement Conditions';
      condHeader.style.marginTop = '8px';
      right.appendChild(condHeader);

      const condWrap = document.createElement('div');
      condWrap.className = 'inline-wrap';

      const isDirect = (String(r.BOOK_SOURCE || '').toLowerCase() === 'direct');
      const connectorWord = isDirect ? 'and' : 'or';

      // --- BOOK pills ---
if (hasBook) {
  const ManualIcons = {
    'XPD_': '../assets/StampIcon.png',
    '_GOLDVENDOR': '../assets/BullionIcon.png',
  };

  // Split BOOK_FULLs and EDIDs by semicolon
  const bookFulls = String(r.BOOK_FULL || '')
    .split(';')
    .map(s => s.trim())
    .filter(Boolean);
  const bookEdids = String(r.BOOK_EditorID || '')
    .split(';')
    .map(s => s.trim())
    .filter(Boolean);

  const bookPills = [];

  bookFulls.forEach((fullName, i) => {
    const bookPill = document.createElement('span');
    bookPill.className = 'pill';

    const matchedEdid = bookEdids[i] || '';
    const bookEdidUpper = matchedEdid.toUpperCase();

    // Decide icon
    let iconSrc = '';
    for (const key in ManualIcons) {
      if (bookEdidUpper.includes(key.toUpperCase())) {
        iconSrc = ManualIcons[key];
        break;
      }
    }

    if (iconSrc) {
      const icon = document.createElement('img');
      icon.src = iconSrc;
      icon.style.width = '30px';
      icon.style.height = '30px';
      icon.style.verticalAlign = 'middle';
      icon.style.marginRight = '6px';
      bookPill.appendChild(icon);
    }

    bookPill.appendChild(document.createTextNode(fullName));
    bookPills.push(bookPill);
  });

  // append multiple BOOK pills with "and" connectors
  bookPills.forEach((pill, i) => {
    condWrap.appendChild(pill);
    if (i < bookPills.length - 1) {
      const conn = document.createElement('span');
      conn.className = 'connector';
      conn.textContent = 'and';
      condWrap.appendChild(conn);
    }
  });
}


      // --- connector ---
      if (hasBook && hasEntm) {
        const conn = document.createElement('span');
        conn.className = 'connector';
        conn.textContent = connectorWord;
        condWrap.appendChild(conn);
      }


      // --- ENTM pill ---
 if (hasEntm) {
  // --- prepare lists ---
  const entmFulls = String(r.ENTM_FULL || '')
    .split(';')
    .map(s => s
      .replace(/[\s;]*UTILITY_ENTM_ItemDisableEntitlement\s*\[ENTM:[0-9A-Fa-f]+\][\s;]*/gi, '')
      .trim()
    )
    .filter(Boolean);

  let entmEdids = String(r.ENTM_EDID || '')
    .split(';')
    .map(s => s.trim())
    .filter(Boolean);

  // --- guaranteed exact pairs: fullName -> expected EDID (use these EDIDs first if present) ---
  const ExactPairs = {
    'SCRAPBOX': 'F1_ENTM_CAMP_ScrapBox_Standard',
    'AMMO STORAGE BOX': 'F1_ENTM_CAMP_AmmoStorageBox_Standard',
    'AID BOX': 'F1_ENTM_CAMP_AidBox_Standard'
  };

  // EDID-based manual icons
  const ManualEntmIcons = {
    'BABYLON_': '../assets/V51Icon.png',
    'SHELTERS_': '../assets/AtomIcon.png',
  };

  // normaliser
  const norm = txt => String(txt || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  // helper: find and remove an edid from entmEdids by predicate
  function findAndRemoveEdid(pred) {
    const idx = entmEdids.findIndex(pred);
    return idx >= 0 ? entmEdids.splice(idx, 1)[0] : '';
  }

  // first pass: if fullName matches an ExactPair key, try to locate its expected EDID anywhere
  // and reserve it (remove from list). If found, attach that EDID to this fullName via mapping.
  const reservedEdidMap = {}; // fullName -> matchedEdid
  entmFulls.forEach(full => {
    const key = full.trim().toUpperCase();
    if (ExactPairs[key]) {
      const expected = ExactPairs[key];
      // prefer exact match, then contains, then contains ignoring underscores/case
      let matched = findAndRemoveEdid(e => e.toUpperCase() === expected.toUpperCase())
        || findAndRemoveEdid(e => e.toUpperCase().includes(expected.toUpperCase()))
        || findAndRemoveEdid(e => expected.toUpperCase().includes(e.toUpperCase()));
      if (matched) reservedEdidMap[full] = matched;
    }
  });

  // helper: best-effort pick for remaining full names
  function pickBestEdidForFull(fullName) {
    if (!entmEdids.length) return '';
    const fullNorm = norm(fullName);

    // 1) exact normalized match
    let idx = entmEdids.findIndex(e => norm(e) === fullNorm);
    if (idx >= 0) return entmEdids.splice(idx, 1)[0];

    // 2) substring / contains
    idx = entmEdids.findIndex(e => fullName.includes(e) || e.includes(fullName));
    if (idx >= 0) return entmEdids.splice(idx, 1)[0];

    // 3) token overlap scoring
    const fullTokens = fullName.toUpperCase().split(/[^A-Z0-9]+/).filter(Boolean);
    let bestIdx = -1, bestScore = 0;
    entmEdids.forEach((e, i) => {
      const eTokens = e.toUpperCase().split(/[^A-Z0-9]+/).filter(Boolean);
      const score = fullTokens.reduce((s, t) => s + (eTokens.includes(t) ? 1 : 0), 0);
      if (score > bestScore) { bestScore = score; bestIdx = i; }
    });
    if (bestIdx >= 0 && bestScore > 0) return entmEdids.splice(bestIdx, 1)[0];

    // 4) fallback: take first remaining
    return entmEdids.length ? entmEdids.splice(0,1)[0] : '';
  }

 // build pills
  const entmPills = [];

  entmFulls.forEach(fullName => {
    // get matched edid: reserved first, else best-effort
    let matchedEdid = reservedEdidMap[fullName] || pickBestEdidForFull(fullName);
    const edidUpper = String(matchedEdid || '').toUpperCase();
    const fullUpper = fullName.trim().toUpperCase();

    // Decide icon: exact full-name override first (guaranteed), else EDID-based rules
    let iconSrc = '';

    // Exact forced names to ensure these map to the standard EDID when present
    if (ExactPairs[fullUpper]) {
      // Only give AdditionalStorage when the matchedEDID equals or contains the expected EDID,
      // or if the expected EDID wasn't found but edidUpper starts with F1_
      const expected = ExactPairs[fullUpper].toUpperCase();
      if (edidUpper === expected || edidUpper.includes(expected) || edidUpper.startsWith('F1_')) {
        iconSrc = '../assets/SubCategory-AdditionalStorageIcon.svg';
      } else {
        // If the exact pair expected EDID is not matched, still prefer AdditionalStorage only
        // if an F1_ EDID was matched; otherwise fall through to EDID logic.
        if (edidUpper.startsWith('F1_')) iconSrc = '../assets/SubCategory-AdditionalStorageIcon.svg';
      }
    }

    // EDID-based manual icons
    if (!iconSrc) {
      for (const key in ManualEntmIcons) {
        if (edidUpper.includes(key)) {
          iconSrc = ManualEntmIcons[key];
          break;
        }
      }
    }

    // F1_ generic rule (only if matchedEdid indicates F1_)
    if (!iconSrc && edidUpper.startsWith('F1_')) {
      iconSrc = '../assets/SubCategory-AdditionalStorageIcon.svg';
    }

    // ATX / SCORE fallbacks
    if (!iconSrc) {
      if (edidUpper.includes('ATX')) iconSrc = '../assets/AtomIcon.png';
      else if (edidUpper.includes('SCORE_MINISEASON') || /SCORE[_-]?MINISEASON/i.test(matchedEdid)) iconSrc = '../assets/SeasonIcon.png';
      else if (/SCORE[_-]?S?\d+/i.test(matchedEdid) || edidUpper.includes('SCORE')) iconSrc = '../assets/SeasonIcon.png';
    }

    // Build pill DOM
    const pill = document.createElement('span');
    pill.className = 'pill';

    if (iconSrc) {
      const icon = document.createElement('img');
      icon.src = iconSrc;
      icon.style.width = '30px';
      icon.style.height = '30px';
      icon.style.verticalAlign = 'middle';
      icon.style.marginRight = '6px';
      pill.appendChild(icon);
    }

// optional season suffix
let textSuffix = '';
if (matchedEdid) {
  // Check manual mini season aliases first
  if (miniSeasonAliases[matchedEdid]) {
    textSuffix = ` (Mini Season: ${miniSeasonAliases[matchedEdid]})`;
  } else {
    const miniMatch = matchedEdid.match(/MiniSeason_\d+_([A-Za-z0-9]+)/i);
    if (miniMatch) {
      const prettyName = miniMatch[1].replace(/([a-z])([A-Z])/g, '$1 $2');
      textSuffix = ` (Mini Season: ${prettyName})`;
    } else {
      // Fallback for regular SCORE seasons
      const seasonMatch = matchedEdid.match(/SCORE[_]?S?(\d+)/i);
      if (seasonMatch) textSuffix = ` (Season ${seasonMatch[1]})`;
    }
  }
}


    pill.appendChild(document.createTextNode(fullName + textSuffix));
    entmPills.push(pill);
  });


  // append pills with "and" connectors
  entmPills.forEach((pill, i) => {
    condWrap.appendChild(pill);
    if (i < entmPills.length - 1) {
      const conn = document.createElement('span');
      conn.className = 'connector';
      conn.textContent = 'and';
      condWrap.appendChild(conn);
    }
  });
}

      right.appendChild(condWrap);
    }

    // --- attach left + right divs to li ---
    li.appendChild(left);
    li.appendChild(right);
    results.appendChild(li);
  });

  renderPagination(sorted.length);
}
