let db = [];
let currentPage = 1;
const itemsPerPage = 50;
let lastQuery = '';
let currentSort = 'camp-top';
let currentSearchBy = 'name';
let activeFilters = new Set()

function initLazyImages(options = {}) {
  const selector = options.selector || 'img.lazy[data-src]';
  const preloadDelay = options.preloadDelay || 2000;
  const batchSize = options.batchSize || 5;
  const batchInterval = options.batchInterval || 100;

  const lazyImages = new Set(document.querySelectorAll(selector));

  // Lazy-load images when they enter the viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        lazyImages.delete(img);
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '200px 0px',
    threshold: 0.1
  });

  lazyImages.forEach(img => observer.observe(img));

  // Slowly preload remaining images in batches
  function preloadRemaining() {
    const imgs = Array.from(lazyImages);
    let i = 0;

    function batch() {
      for (let j = 0; j < batchSize && i < imgs.length; j++, i++) {
        if (!imgs[i].src) imgs[i].src = imgs[i].dataset.src;
        lazyImages.delete(imgs[i]);
      }
      if (i < imgs.length) setTimeout(batch, batchInterval);
    }

    batch();
  }

  setTimeout(preloadRemaining, preloadDelay);
}



// --- Category Icons ---
const CategoryIcons = {
  'Quest': '../assets/MainCategory-QuestsIcon.svg',
  'Objectives': '../assets/MainCategory-QuestsIcon.svg',
  'Modify': '../assets/MainCategory-ModifyIcon.svg',
  'Wallpapers': '../assets/MainCategory-WallpapersIcon.svg',
  'C.A.M.P. Pieces': '../assets/MainCategory-CAMPPiecesIcon.svg',
  'Foundations': '../assets/SubCategory-FoundationsIcon.webp',
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
  'Porches': '../assets/SubCategory-PorchesIcon.webp',
  'Floors':'../assets/SubCategory-FloorsIcon.webp',
  'Walls': '../assets/SubCategory-WallsIcon.webp',
  'Roofs': '../assets/SubCategory-RoofsIcon.webp',
  'Stairs': '../assets/SubCategory-StairsIcon.webp',
  'Shelters': '../assets/SubCategory-SheltersIcon.webp',
  'Doors': '../assets/SubCategory-DoorsIcon.webp',
  'Columns': '../assets/SubCategory-ColumnsIcon.webp',
  'Fences': '../assets/SubCategory-FencesIcon.webp',
  'Barricades': '../assets/SubCategory-BarricadeIcon.webp',
  'Traps': '../assets/SubCategory-TrapsIcon.webp',
  'Turrets': '../assets/SubCategory-TurretsIcon.webp',
  'Generators': '../assets/SubCategory-GeneratorsIcon.webp',
  'Power Connectors': '../assets/SubCategory-PowerConnectorsIcon.webp',
  'Candles': '../assets/SubCategory-CandleIcon.webp',
  'Ceiling Lights': '../assets/SubCategory-CeilingLightsIcon.webp',
  'Fire': '../assets/SubCategory-FireIcon.webp',
  'Lamps': '../assets/SubCategory-LampsIcon.svg',
  'Wall Lights': '../assets/SubCategory-WallLightsIcon.webp',
  'Crafting': '../assets/SubCategory-CraftingIcon.webp',
  'Collectors': '../assets/SubCategory-CollectorsIcon.webp',
  'Food': '../assets/SubCategory-FoodIcon.webp',
  'Producers': '../assets/SubCategory-ProducersIcon.webp',
  'Water': '../assets/SubCategory-WaterIcon.webp',
  'Instruments': '../assets/SubCategory-InstrumentsIcon.webp',
  'Player Buffs': '../assets/SubCategory-PlayerBuffsIcon.webp',
  'Services': '../assets/SubCategory-ServicesIcon.webp',
  'Vending Machines': '../assets/SubCategory-VendingMachinesIcon.webp',
  'Appliances': '../assets/SubCategory-AppliancesIcon.webp',
  'Beds': '../assets/SubCategory-BedsIcon.webp',
  'Electronics': '../assets/SubCategory-ElectronicsIcon.webp',
  'Seating': '../assets/SubCategory-SeatingIcon.webp',
  'Shelves': '../assets/SubCategory-ShelvesIcon.webp',
  'Surfaces': '../assets/SubCategory-SurfacesIcon.webp',
  'Balloons': '../assets/SubCategory-BalloonsIcon.webp',
  'Clutter': '../assets/SubCategory-ClutterIcon.webp',
  'Crockery': '../assets/SubCategory-CrockeryIcon.webp',
  'Entertainment': '../assets/SubCategory-EntertainmentIcon.webp',
  'Fauna': '../assets/SubCategory-FaunaIcon.webp',
  'Lawn & Garden': '../assets/SubCategory-Lawn&GardenIcon.webp',
  'Novelties': '../assets/SubCategory-NoveltiesIcon.webp',
  'Outdoor': '../assets/SubCategory-OutdoorIcon.webp',
  'Rugs': '../assets/SubCategory-RugsIcon.webp',
  'Signs': '../assets/SubCategory-SignsIcon.webp',
  'Statues': '../assets/SubCategory-StatuesIcon.webp',
  'Taxidermy': '../assets/SubCategory-TaxidermyIcon.webp',
  'Toys': '../assets/SubCategory-ToysIcon.webp',
  'Vehicles': '../assets/SubCategory-VehiclesIcon.webp',
  'Accents': '../assets/SubCategory-AccentsIcon.webp',
  'Ceiling': '../assets/SubCategory-CeilingIcon.webp',
  'Holiday': '../assets/SubCategory-HolidayIcon.webp',
  'Mounted': '../assets/SubCategory-MountedIcon.webp',
  'Tapestry': '../assets/SubCategory-TapestryIcon.webp',
  'Wall Art': '../assets/SubCategory-WallArtIcon.webp',
  'Wall Letters': '../assets/SubCategory-WallLettersIcon.webp',
  'Window': '../assets/SubCategory-WindowIcon.webp',
  'Additional Storage': '../assets/SubCategory-AdditionalStorageIcon.svg',
  'Displays': '../assets/SubCategory-DisplaysIcon.webp',
  'Stash Boxes': '../assets/SubCategory-StashBoxesIcon.webp',
  'Farm': '../assets/SubCategory-FarmIcon.webp',
  'Frontier': '../assets/SubCategory-FrontierIcon.webp',
  'Industrial': '../assets/SubCategory-IndustrialIcon.webp',
  'Military': '../assets/SubCategory-MilitaryIcon.webp',
  'Modern': '../assets/SubCategory-ModernIcon.webp',
  'Retail': '../assets/SubCategory-RetailIcon.webp',
  'Rustic': '../assets/SubCategory-RusticIcon.webp',
  'Scavenger': '../assets/SubCategory-ScavengerIcon.webp',
  'Allies': '../assets/SubCategory-AlliesIcon.webp',
  'Pets': '../assets/SubCategory-PetsIcon.webp',
  'Pet Furniture': '../assets/SubCategory-PetFurnitureIcon.webp'
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

function createTooltipElement(text) {
  const t = document.createElement('div');
  t.className = 'tooltip';
  t.textContent = text;
  document.body.appendChild(t);
  return t;
}

let mobileTooltipTimeout = null; // for resetting hide timer

function attachTooltipToIcon(icon, text) {
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouch) {
    // --- Desktop Tooltip ---
    const desktopTooltip = createTooltipElement(text);

    function showDesktop() {
      const rect = icon.getBoundingClientRect();
      const w = desktopTooltip.offsetWidth;
      const h = desktopTooltip.offsetHeight;
      desktopTooltip.style.left = `${rect.left + rect.width / 2 - w / 2}px`;
      desktopTooltip.style.top  = `${rect.top - h - 6}px`;
      desktopTooltip.classList.add('show');
    }

    function hideDesktop() {
      desktopTooltip.classList.remove('show');
    }

    icon.addEventListener('mouseenter', showDesktop);
    icon.addEventListener('mouseleave', hideDesktop);

  } else {
    // --- Mobile Tooltip ---
    icon.addEventListener('click', (e) => {
      e.stopPropagation();

      let box = document.getElementById('mobile-tooltip-box');
      if (!box) {
        box = document.createElement('div');
        box.id = 'mobile-tooltip-box';
        document.body.appendChild(box);
      }
    
      box.textContent = text;
    
      // reset animation
      box.classList.remove('show');
      void box.offsetWidth; // force reflow
      box.classList.add('show');
    
      clearTimeout(mobileTooltipTimeout);
      mobileTooltipTimeout = setTimeout(() => {
        box.classList.remove('show');
      }, 2000);
    });

  }
}

const IconAltText_BOOK = {
    BullionVendor: {
      vendors: ['Minerva', 'Mortimer', 'Samuel', 'Regs', 'Windy'],
      get alt() { return `Sold by Gold Bullion Vendor (${this.vendors.join(', ')})`; }
    },
    StampsVendor: { alt: "Sold by Giuseppe Della Ripa" },
    DailyOps: { alt: "Daily Ops Reward" },
    CommonWorkshop: { alt: "Common Workshop Claim/Defense Reward" },
    RaidsReward: { alt: "Gleaming Depths Raid Reward" },
    TreasureHunters: { alt: "Treasure Hunters Event Reward" },
    MeatWeekRewards: { alt: "Meat Week Seasonal Event Reward" },
    FasnachtRewards: { alt: "Fasnacht Seasonal Event Reward" },
    InvadersRewards: { alt: "Invaders from Beyond Seasonal Event Reward"},
    HolidayScorched: { alt: "Holiday Scorched Seasonal Event Reward"},
    BigBloomRewards: { alt: "Big Bloom Seasonal Event Reward"},
    MischiefNightRewards: { alt: "Mischief Night Seasonal Event Reward" },
    SpookyScorched: { alt: "Spooky Scorched Seasonal Event Reward" },
    PublicEventRewards: { alt: "Public Event Reward" },
    EquinoxRewards: { alt: "Mothman Equinox Seasonal Event Reward" },
    GrahmVendor: { alt: "Sold by Grahm" },
    UnusedContent: { alt: "Unused Content"},
    ScorchedEarthRewards: { alt: "Reward from Event: Scorched Earth"},
    ColossalProblemRewards: { alt: "Reward from Event: A Colossal Problem" },
    BeastsOfBurdenRewards: { alt: "Reward from Event: Beasts of Burden" },
    CampfireTalesRewards: { alt: "Reward from Event: Campfire Tales" },
    DangerousPastimesRewards: { alt: "Reward from Event: Dangerous Pastimes" },
    MoonshineJamboreeRewards: { alt: "Reward from Event: Moonshine Jamboree" },
    MostWantedRewards: { alt: "Reward from Event: Most Wanted" },
    NWOTGenericRewards: { alt: "Reward from Event: Most Wanted, Event: Spin the Wheel, Event: Tunnel of Love" },
    NeurologicalWarfareRewards: { alt: "Reward from Event: Neurological Warfare" },
    RadiationRumbleRewards: { alt: "Reward from Event: Radiation Rumble" },
    SafeAndSoundRewards: { alt: "Reward from Event: Safe and Sound" },
    SeismicActivityRewards: { alt: "Reward from Event: Seismic Activity" },
    SpinTheWheelRewards: { alt: "Reward from Event: Spin the Wheel" },
    TestYourMetalRewards: { alt: "Reward from Event: Test Your Metal" },
    TunnelOfLoveRewards: { alt: "Reward from Event: Tunnel of Love" },
    GearinUpRewards: { alt: "Reward from Event: Gearin' Up" },
    SinkholeSolutionsRewards: { alt: "Reward from Event: Sinkhole Solutions" } 
  };

function getTooltipText_BOOK(tag) {
  // Normalize all BullionVendor variants to the single key
  if (tag.startsWith('BullionVendor')) tag = 'BullionVendor';

  const entry = IconAltText_BOOK[tag];
  if (!entry) return tag;

  // Return alt property if exists, otherwise fallback to tag
  return entry.alt || tag;
}


function getTooltipText_ENTM(edid, fullName) {
  const edidUpper = String(edid || "").toUpperCase();
  const fullUpper = String(fullName || "").toUpperCase();

  // direct exact match
  if (IconAltText_ENTM[edidUpper]) return IconAltText_ENTM[edidUpper];
  if (IconAltText_ENTM[fullUpper]) return IconAltText_ENTM[fullUpper];

  // prefix matches (Babylon_, Shelters_, ATX, SCORE)
  for (const key in IconAltText_ENTM) {
    if (edidUpper.includes(key)) return IconAltText_ENTM[key];
    if (fullUpper.includes(key)) return IconAltText_ENTM[key];
  }

  // fallback
  return fullName;
}


const IconAltText_ENTM = {
  "F1_ENTM_CAMP_SCRAPBOX_STANDARD": "Requires Fallout 1st Subscription",
  "F1_ENTM_CAMP_AMMOSTORAGEBOX_STANDARD": "Requires Fallout 1st Subscription",
  "F1_ENTM_CAMP_AIDBOX_STANDARD": "Requires Fallout 1st Subscription",

  // manual EDID prefix mappings
  BABYLON_: "Nuclear Winter Reward",
  SHELTERS_: "Atomic Shop Item",
  DE2024_Halloween: "Trick or Treat Challenges Event Reward (2024)",
  DE2024_ScienceOfLove: "Science of Love Challenges Event Reward (2024)",
  DE2024_ScoutsUncharted: "Scouts Uncharted Challenges Event Reward (2024)",


  // fallbacks
  ATX: "Atomic Shop Item",
  SCORE: "S.C.O.R.E. Reward",
};


// --- Manual icon overrides ---
const ManualEntmIcons = {
  'Babylon_': '../assets/V51Icon.webp',
  'Shelters_': '../assets/AtomIcon.webp',
  'DE2024_Halloween': '../assets/ChallengeIcon.svg',
  'DE2024_ScoutsUncharted': '../assets/ChallengeIcon.svg',
  'DE2024_ScienceOfLove': '../assets/ChallengeIcon.svg',
};
const miniSeasonAliases = {
  'SCORE_MiniSeason_2025_MMMFE': 'Marshal Mallow',
  'SCORE_MiniSeason_Lovehurts': 'Love Hurts'
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

const infoBtn = document.getElementById('infoBtn');
const infoModal = document.getElementById('infoModal');
const closeModal = document.getElementById('closeModal');

window.addEventListener('popstate', () => {
  if (infoModal.style.display === 'block') {
    closeInfoModal(true);
  }
});

// Open modal
infoBtn.addEventListener('click', () => {
  infoModal.style.display = 'block';

  requestAnimationFrame(() => {
    infoModal.classList.add('is-open');
  });

  history.pushState({ modal: 'info' }, '');

  // Reset scroll to top
  const content = infoModal.querySelector('.modal-body');
  if (content) content.scrollTop = 0;
});

function closeInfoModal(fromPopState = false) {
  infoModal.classList.remove('is-open');

  if (!fromPopState && history.state?.modal === 'info') {
    history.back();
  }

  // wait for fade-out to finish
  setTimeout(() => {
    infoModal.style.display = 'none';
  }, 120); // must match CSS transition duration
}

// Close modal via X
closeModal.addEventListener('click', closeInfoModal);

// Close modal by clicking outside content
infoModal.addEventListener('click', (event) => {
  if (event.target === infoModal) {
    closeInfoModal();
  }
});


const infoBody = document.getElementById('infoBody');

const faqItems = [
  { 
    q: "What is this?", 
    a: "This is a database tool for Fallout 76 C.A.M.P. items. You can search for items, and sort/filter based on different variables. Currently, this tool lists the build menu category, the placement conditions, and the budget cost of a particular C.A.M.P. item." 
  },
  { 
    q: "What do the different search options mean?",
    a: [
      "Search by Item Name: Quite self-explanatory. Search results are based on the name of the item that is built.",
      "Search by Plan/Challenge Name: Search results are based on the plan/challenge name listed under Placement Conditions. This can come in handy if you want to see what a particular, more vague-sounding plan unlocks, i.e. Plan: Metal Signs.",
      "Search by Entitlement Name: Similarly to the Plan/Challenge Name option, this does essentially the same, but for Atomic Shop/S.C.O.R.E items. Entitlements act like account-wide plans used by these items."
    ]
  },
   { 
    q: "How do the filters work?", 
    a: [
      "The Placement Condition filters operate on a logic that is sort of a mix of XOR and AND logic. If you select just 1 placement condition filter, you will only get results with that particular type of placement condition, i.e. selecting Plan will only yield items that are plan-only. Selecting 2 or more placement condition filters at once will result in results that meet both of those requirements at once, i.e. selecting Plan and Entitlement will only yield items that have both in their placement conditions.",
      "The Workshop Category Filters operate purely on OR logic. You will get results that are under any of the selected categories." 
   ]
  },
  {
    q: "What do the different placement condition icons mean?",
    a: [
      "The icons tend to have a broader meaning, stated below. Note that you can hover your mouse or tap on icons to see a more detailed description, if available."
    ],
    icons: [
      { src: "../assets/AtomIcon.webp", text: "Atomic Shop item" },
      { src: "../assets/BigBloomIcon.webp", text: "Big Bloom Seasonal Event Reward" },
      { src: "../assets/BullionIcon.webp", text: "Sold by Gold Bullion Vendor" },
      { src: "../assets/ChallengeIcon.svg", text: "Complete a Challenge to Unlock" },
      { src: "../assets/DOpsIcon.webp", text: "Daily Ops Reward" },
      { src: "../assets/EquinoxIcon.svg", text: "Mothman Equinox Seasonal Event Reward" },
      { src: "../assets/GrahmIcon.webp", text: "Sold by Grahm" },
      { src: "../assets/HolidayScorchedIcon.webp", text: "Holiday Scorched Seasonal Event Reward" },
      { src: "../assets/InvadersIcon.webp", text: "Invaders from Beyond Seasonal Event Reward" },
      { src: "../assets/LearnOnPickupIcon.webp", text: "Loot to Unlock" },
      { src: "../assets/MeatWeekIcon.svg", text: "Meat Week Seasonal Event Reward" },
      { src: "../assets/MischiefNightIcon.svg", text: "Mischief Night Seasonal Event Reward" },
      { src: "../assets/NPCVendorIcon.webp", text: "Sold by non-robot NPC vendor for Caps" },
      { src: "../assets/PublicEventIcon.svg", text: "Non-seasonal Public Event Reward" },
      { src: "../assets/RobotVendorIcon.webp", text: "Sold by robot NPC vendor for Caps" },
      { src: "../assets/SeasonIcon.webp", text: "(Mini) Season S.C.O.R.E Reward" },
      { src: "../assets/SpookyScorchedIcon.svg", text: "Spooky Scorched Seasonal Event Reward" },
      { src: "../assets/StampIcon.webp", text: "Sold by Giuseppe for Stamps" },
      { src: "../assets/TreasureHuntersIcon.webp", text: "Treasure Hunters Seasonal Event Reward" },
      { src: "../assets/UnusedContentIcon.svg", text: "Unused Content" },
      { src: "../assets/V51Icon.webp", text: "Nuclear Winter Gamemode Reward" },
      { src: "../assets/WorkshopIcon.svg", text: "Commonly obtained when claiming/defending Workshops" }
    ]
  },
    { 
    q: "What does it mean when there is no placement condition icon?", 
    a: "This simply means it's not covered by any particular category I have defined so far. Plans are obtained in a very wide selection of ways, and documenting all plan sources is a whole task in and of itself, especially in an automated manner. I may expand this in the future, but for now, as of V3.0, I tried to have the categories be as broad as possible while also keeping the time investment on my part relatively reasonable." 
  },
    {
    q: "What are the different budget cost tiers, and what is a Flamingo Unit?",
    a: [
        "Like the name implies, a Flamingo Unit is the budget cost of a lawn flamingo decor item. The vast majority of C.A.M.P. items costs 1 Flamingo Unit. This unit of measurement is used because budget limits vary between C.A.M.P.s, Shelters, and Workshops, so percentages aren't always the same. A C.A.M.P. has a max budget of 500 FUs. Most Shelters have a max budget of 700 FUs, and some have a max budget of 1500 FUs. Workshops have a max budget of 1500 FUs.",
        "The different budget tiers are chosen in an arbitrary manner. Each tier threshold is double of the previous threshold."
    ],
    icons: [
      { src: "../assets/BudgetBar-Tier1.webp", text: "Budget Cost: Very Low (0-1 FUs)" },
      { src: "../assets/BudgetBar-Tier2.webp", text: "Budget Cost: Low (1-2 FUs)" },
      { src: "../assets/BudgetBar-Tier3.webp", text: "Budget Cost: Medium (2-4 FUs)" },
      { src: "../assets/BudgetBar-Tier4.webp", text: "Budget Cost: High (4-8 FUs)" },
      { src: "../assets/BudgetBar-Tier5.webp", text: "Budget Cost: Very High (8+ FUs)" },
    ]
    }
];


faqItems.forEach(item => {
  const qEl = document.createElement('p');
  qEl.className = 'question';
  qEl.textContent = item.q;
  infoBody.appendChild(qEl);

  // Multi-paragraph answer
  if (Array.isArray(item.a)) {
    item.a.forEach(paragraph => {
      const aEl = document.createElement('p');
      aEl.className = 'answer';
      aEl.textContent = paragraph;
      infoBody.appendChild(aEl);
    });
  } else {
    const aEl = document.createElement('p');
    aEl.className = 'answer';
    aEl.textContent = item.a;
    infoBody.appendChild(aEl);
  }

  // Icons, if any
  if (item.icons && item.icons.length) {
  const iconWrapper = document.createElement('div');
  iconWrapper.style.display = 'flex';
  iconWrapper.style.flexDirection = 'column'; // stack vertically
  iconWrapper.style.gap = '10px';
  iconWrapper.style.marginTop = '10px';
    
  item.icons.forEach(iconData => {
    const iconContainer = document.createElement('div');
    iconContainer.style.display = 'flex';
    iconContainer.style.alignItems = 'flex-start';
  
    // Fixed-size box for the icon
    const iconBox = document.createElement('div');
    iconBox.style.width = '45px';
    iconBox.style.height = '45px';
    iconBox.style.display = 'flex';
    iconBox.style.justifyContent = 'center';
    iconBox.style.alignItems = 'center';
    iconBox.style.flexShrink = '0'

    const img = document.createElement('img');
    img.src = iconData.src;
    img.style.maxWidth = '100%';      // scale up to container width
    img.style.maxHeight = '100%';     // scale up to container height
    img.style.objectFit = 'contain';  // preserve aspect ratio

    iconBox.appendChild(img);

    iconContainer.appendChild(iconBox);
  
    const label = document.createElement('span');
    label.textContent = iconData.text;
    label.style.marginLeft = '10px';
    label.style.lineHeight = '1.3';
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.minHeight = '45px'; // same as iconBox height
    iconContainer.appendChild(label);
  
    iconWrapper.appendChild(iconContainer);
  });
  
  infoBody.appendChild(iconWrapper);
  
  }
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
    case 'budget-high-low': return [...items].sort((a, b) => (b.BudgetCost || 0) - (a.BudgetCost || 0));
    case 'budget-low-high': return [...items].sort((a, b) => (a.BudgetCost || 0) - (b.BudgetCost || 0));
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
      span.textContent = ' ... ';
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
  let placementFilters = new Set(['plan', 'entitlement', 'challenge', 'learn']);

 function matchesItem(item) {
  if (activeFilters.size === 0) return true;

  // Separate placement vs category filters
  const placementActive = [...activeFilters].filter(f => placementFilters.has(f));
  const categoryActive  = [...activeFilters].filter(f => !placementFilters.has(f));

  // Determine flags
  const id = String(item.BOOK_EditorID || '').toLowerCase();
  const source = String(item.BOOK_SOURCE || '').toLowerCase();

  const hasChallenge = id.includes('challenge_');
  const hasLearn     = source === 'learnbypickup'; // exact flag
  const hasPlan      = !!item.BOOK_FULL?.trim() && !hasChallenge; // exclude challenges
  const hasEnt       = !!item.ENTM_FULL?.trim();

  let placementMatch = true;

  if (placementActive.includes('plan') && placementActive.includes('learn')) {
      placementMatch = false;
  } else if (placementActive.includes('plan') && placementActive.includes('entitlement')) {
      placementMatch = hasPlan && hasEnt; // must have both
  } else if (placementActive.includes('plan')) {
      placementMatch = hasPlan && !hasEnt;
  } else if (placementActive.includes('entitlement')) {
      placementMatch = hasEnt && !hasPlan;
  }

  // Challenge and Learn are independent
  if (placementActive.includes('challenge')) placementMatch = placementMatch && hasChallenge;
  if (placementActive.includes('learn'))      placementMatch = placementMatch && hasLearn;


  // --- Category/subcategory filters (OR) ---
  const categoryMatch = categoryActive.length === 0 || categoryActive.some(f =>
    (item.Category || '').toLowerCase() === f || (item.SubCategory || '').toLowerCase() === f
  );

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
    results.innerHTML = '<li class="no-results">No matches found</li>';
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

    // Entry images
    let imgSrc = `Images/${(r.ARTO_FormID || '').toLowerCase()}.webp`;

    // Fallback to CNAM if ARTO image fails to load
    if (!r.ARTO_FormID) {
      imgSrc = `Images/${(r.CNAM_FormID || '').toLowerCase()}.webp`;
    }

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = r.Name;
    

    // If ARTO was tried first, fallback on error to CNAM
    if (r.ARTO_FormID && r.CNAM_FormID) {
      img.onerror = function() {
        this.onerror = null; // prevent infinite loop if CNAM also fails
        this.src = `Images/${r.CNAM_FormID.toLowerCase()}.webp`;
      };
    }

    left.appendChild(img);


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

      if (r.Category && r.Category.trim() !== '') {
        if (r.Category.toLowerCase() === 'wallpapers') {
          categories.push('Modify');          
          categories.push(r.Category);        // keep "Wallpapers" as subcategory
        } else {
          categories.push(r.Category);
          if (
            r.SubCategory &&
            r.SubCategory.trim() !== '' &&
            r.Category.toLowerCase() !== 'wallpapers'
          ) {
            categories.push(r.SubCategory);
          }
        }
      }


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
    const cnamUnlockText = {
      '00424740': '(Unlock 2 or more)',
      '0042716B': '(Unlock 3 or more)',
      '0042716D': '(Unlock 3 or more)',
      '0042716C': '(Unlock 4 or more)'
    };

    const hasBook = !!(r.BOOK_FULL && String(r.BOOK_FULL).trim());
    const hasEntm = !!(r.ENTM_FULL && String(r.ENTM_FULL).trim());
    if (hasBook || hasEntm) {
      const condHeader = document.createElement('div');
      condHeader.className = 'section-header';
      condHeader.textContent = 'Placement Conditions';
      condHeader.style.marginTop = '8px';
      right.appendChild(condHeader);

      // Optional CNAM-based unlock note
      const unlockText = cnamUnlockText[String(r.CNAM_FormID || '').trim()];
      if (unlockText) {
        const unlockNote = document.createElement('div');
        unlockNote.className = 'placement-note';
        unlockNote.textContent = unlockText;
        right.appendChild(unlockNote);
      }


      const condWrap = document.createElement('div');
      condWrap.className = 'inline-wrap';

      const bookSource = String(r.BOOK_SOURCE || '').trim();

      let bookBookConnector = 'and';
      let bookEntmConnector = 'and';
      let entmEntmConnector = 'and';

      switch (bookSource) {
        case 'direct':
          // all AND → defaults already correct
          break;
      
        case 'CNDF':
          bookBookConnector = 'or';
          bookEntmConnector = 'or';
          break;
      
        case 'CNDFException':
          bookBookConnector = 'or';
          bookEntmConnector = 'and';
          entmEntmConnector = 'or';
          break;
      
        default:
          // unknown source → safest fallback
          bookBookConnector = 'and';
          bookEntmConnector = 'and';
      }


if (hasBook) {
  const BookTagIcons = {
    'UnusedContent': '../assets/UnusedContentIcon.svg',
    'BullionVendor': '../assets/BullionIcon.webp',
    'StampsVendor': '../assets/StampIcon.webp',
    'DailyOps': '../assets/DOpsIcon.webp',
    'CommonWorkshop': '../assets/WorkshopIcon.svg',
    'RaidsReward': '../assets/RaidIcon.svg',
    'TreasureHunters': '../assets/TreasureHuntersIcon.webp',
    'MeatWeekRewards': '../assets/MeatWeekIcon.svg',
    'FasnachtRewards': '../assets/FasnachtIcon.svg',
    'InvadersRewards': '../assets/InvadersIcon.webp',
    'HolidayScorched': '../assets/HolidayScorchedIcon.webp',
    'BigBloomRewards': '../assets/BigBloomIcon.webp',
    'MischiefNightRewards': '../assets/MischiefNightIcon.svg',
    'SpookyScorched': '../assets/SpookyScorchedIcon.svg',
    'PublicEventRewards': '../assets/PublicEventIcon.svg',
    'EquinoxRewards': '../assets/EquinoxIcon.svg',
    'GrahmVendor': '../assets/GrahmIcon.webp',
    'ColossalProblemRewards': '../assets/PublicEventIcon.svg',
    'ScorchedEarthRewards': '../assets/PublicEventIcon.svg',
    'BeastsOfBurdenRewards': '../assets/PublicEventIcon.svg',
    'CampfireTalesRewards': '../assets/PublicEventIcon.svg',
    'DangerousPastimesRewards': '../assets/PublicEventIcon.svg',
    'MoonshineJamboreeRewards': '../assets/PublicEventIcon.svg',
    'MostWantedRewards': '../assets/PublicEventIcon.svg',
    'NWOTGenericRewards': '../assets/PublicEventIcon.svg',
    'NeurologicalWarfareRewards': '../assets/PublicEventIcon.svg',
    'RadiationRumbleRewards': '../assets/PublicEventIcon.svg',
    'SafeAndSoundRewards': '../assets/PublicEventIcon.svg',
    'SeismicActivityRewards': '../assets/PublicEventIcon.svg',
    'SpinTheWheelRewards': '../assets/PublicEventIcon.svg',
    'TestYourMetalRewards': '../assets/PublicEventIcon.svg',
    'TunnelOfLoveRewards': '../assets/PublicEventIcon.svg',
    'GearinUpRewards': '../assets/PublicEventIcon.svg',
    'SinkholeSolutionsRewards': '../assets/PublicEventIcon.svg'
  };

const multiVendorCategories = {
  BullionVendor: {
    icon: '../assets/BullionIcon.webp',
    prefixes: [
      'BullionVendorSamuel', 'BullionVendorMinerva', 'BullionVendorMortimer', 'BullionVendorRegs', 'BullionVendorWindy'
    ],
    displayName: 'Gold Bullion'
  },
  RobotVendor: {
    icon: '../assets/RobotVendorIcon.webp',
    prefixes: ['FreeStatesVendor', 'BrotherhoodVendor', 'RespondersVendor', 'RaiderVendor', 'WhitespringStationVendor', 'PendletonVendor']
  },
  NPCVendor: {
    icon: '../assets/NPCVendorIcon.webp',
    prefixes: ['MacVendor', 'JuneSeaverVendor']
  }
};



function normalizeTag(tag) {
  // Check multi-vendor categories first
  for (const [key, data] of Object.entries(multiVendorCategories)) {
    if (key === tag || (data.prefixes && data.prefixes.some(p => tag.startsWith(p)))) {
      return key;
    }
  }
  // fallback: single tags
  return tag;
}

function getTooltipTextForTag(tag, originalTags) {
  const normalized = normalizeTag(tag);

  if (normalized in multiVendorCategories) {
    const category = multiVendorCategories[normalized];

    // Map original tags to readable vendor names
    const presentVendors = originalTags
      .filter(t => t === normalized || (category.prefixes && category.prefixes.some(p => t.startsWith(p))))
      .map(t => {
      if (t === normalized) {
          // Special case for BullionVendor
          if (normalized === 'BullionVendor') return 'Gold Bullion';
      
          return normalized.replace('Vendor', '');
      }
    
      const match = category.prefixes.find(p => t.startsWith(p));
      if (!match) return t;
    
      let name = match.replace(normalized, ''); // REMOVE the normalized prefix
      name = name.replace('Vendor', '');        // Remove trailing Vendor
      name = name.replace(/([a-z])([A-Z])/g, '$1 $2'); // Add spacing
      return name.trim();
  });
  

    // NPC vendors have different wording
    if (normalized === 'NPCVendor') {
      return `Sold by NPC Vendor (${presentVendors.join(', ')})`;
    }

    const vendorLabel =
      normalized === 'BullionVendor'
        ? 'Gold Bullion'
        : normalized.replace('Vendor', '');

    return `Sold by ${vendorLabel} Vendor (${presentVendors.join(', ')})`;


   }

  const entry = IconAltText_BOOK[normalized];
  return entry?.alt || normalized;
}


 const bookFulls = String(r.BOOK_FULL || '')
  .split(';')
  .map(s => s.trim())
  .filter(Boolean);

  let tagEntries;
  
  if (r.BOOK_SOURCE_TAG === null) {
    tagEntries = [null];
  } else if (Array.isArray(r.BOOK_SOURCE_TAG)) {
    tagEntries = r.BOOK_SOURCE_TAG;
  } else {
    // string
    tagEntries = String(r.BOOK_SOURCE_TAG)
      .split(/[,;]/)
      .map(s => s.trim())
      .filter(Boolean);
  }
  
  const getTagsForBook = (index) => {
    if (bookFulls.length === 1) {
      // For a single book, return all tags
      return tagEntries.map(t => t);
    }
  
    if (Array.isArray(tagEntries) && tagEntries.length === bookFulls.length) {
      // One-to-one mapping between BOOK and tag array
      const entry = tagEntries[index];
      if (entry === null) return [null];
      return String(entry)
        .split(/[,;]/)
        .map(t => t.trim())
        .filter(Boolean);
    }
  
    // Fallback: return all tags for every book
    return tagEntries.map(t => t);
  };
  

bookFulls.forEach((fullName, i) => {
  const pill = document.createElement('span');
  pill.className = 'pill';

  const tags = getTagsForBook(i);

  // Make tags null-safe and deduplicate
  const uniqueNormalizedTags = [
    ...new Set(
      tags.map(t => (t === null ? "None" : normalizeTag(t)))
    )
  ];

  const bookEditorId = (r.BOOK_EditorID || '').split(';')[i]?.trim() || '';
  const globValue = r.GLOB_Value;

  let appendedIcon = false;

  uniqueNormalizedTags.forEach(normalizedTag => {
    let iconSrc = BookTagIcons[normalizedTag];

    // Multi-vendor icon
    if (multiVendorCategories[normalizedTag]?.icon) {
      iconSrc = multiVendorCategories[normalizedTag].icon;
    }

    // Challenge / Learn-on-Pickup icons
    if (/Challenge_/.test(bookEditorId)) {
      iconSrc = '../assets/ChallengeIcon.svg';
    } else if (String(r.BOOK_SOURCE || '').toLowerCase() === 'learnbypickup') {
      iconSrc = '../assets/LearnOnPickupIcon.webp';
    }

    if (!iconSrc) return;

    const icon = document.createElement('img');
    icon.src = iconSrc;
    icon.style.width = 'auto';
    icon.style.height = '30px';
    icon.style.verticalAlign = 'middle';
    icon.style.marginRight = '6px';
    pill.appendChild(icon);

    let tooltipText = getTooltipTextForTag(normalizedTag, tags);
    if (/Challenge_/.test(bookEditorId)) {
      tooltipText = `Complete a Challenge to Unlock`;
    } else if (String(r.BOOK_SOURCE || '').toLowerCase() === 'learnbypickup') {
      tooltipText = `Loot to Unlock`;
    }
    attachTooltipToIcon(icon, tooltipText);


    appendedIcon = true;
  });

  // If no tags produced an icon, still add Challenge/Learn icon
  if (!appendedIcon) {
    let iconSrc = '';
    let tooltipText = '';
    if (/Challenge_/.test(bookEditorId)) {
      iconSrc = '../assets/ChallengeIcon.svg';
      tooltipText = `Complete a Challenge to Unlock`;
    } else if (String(r.BOOK_SOURCE || '').toLowerCase() === 'learnbypickup') {
      iconSrc = '../assets/LearnOnPickupIcon.webp';
      tooltipText = `Loot to Unlock`;
    }

    if (iconSrc) {
      const icon = document.createElement('img');
      icon.src = iconSrc;
      icon.style.width = 'auto';
      icon.style.height = '30px';
      icon.style.verticalAlign = 'middle';
      icon.style.marginRight = '6px';
      pill.appendChild(icon);
      attachTooltipToIcon(icon, tooltipText);
    }
  }


  // Pill text
  let pillText = fullName;
  if (/Challenge_/.test(bookEditorId)) {
    pillText = `Challenge: "${fullName}"`;
    if (globValue != null) pillText += ` (X/${globValue})`;
  } else if (String(r.BOOK_SOURCE || '').toLowerCase() === 'learnbypickup') {
    pillText = `Loot: ${fullName}`;
  }

  pill.appendChild(document.createTextNode(pillText));
  condWrap.appendChild(pill);

  // Connector
  if (i < bookFulls.length - 1) {
    const conn = document.createElement('span');
    conn.className = 'connector';
    conn.textContent = bookBookConnector;
    condWrap.appendChild(conn);
  }
});

}
   // --- connector ---
   if (hasBook && hasEntm) {
    const conn = document.createElement('span');
    conn.className = 'connector';
    conn.textContent = bookEntmConnector;
    condWrap.appendChild(conn);
  }



 // --- ENTM pills ---
if (hasEntm) {
  // Prepare lists
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

  const ExactPairs = {
    'SCRAPBOX': 'F1_ENTM_CAMP_ScrapBox_Standard',
    'AMMO STORAGE BOX': 'F1_ENTM_CAMP_AmmoStorageBox_Standard',
    'AID BOX': 'F1_ENTM_CAMP_AidBox_Standard'
  };

  const norm = txt => String(txt || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  function findAndRemoveEdid(pred) {
    const idx = entmEdids.findIndex(pred);
    return idx >= 0 ? entmEdids.splice(idx, 1)[0] : '';
  }

  const reservedEdidMap = {};
  entmFulls.forEach(full => {
    const key = full.trim().toUpperCase();
    if (ExactPairs[key]) {
      const expected = ExactPairs[key];
      let matched = findAndRemoveEdid(e => e.toUpperCase() === expected.toUpperCase())
        || findAndRemoveEdid(e => e.toUpperCase().includes(expected.toUpperCase()))
        || findAndRemoveEdid(e => expected.toUpperCase().includes(e.toUpperCase()));
      if (matched) reservedEdidMap[full] = matched;
    }
  });

  function pickBestEdidForFull(fullName) {
    if (!entmEdids.length) return '';
    const fullNorm = norm(fullName);

    let idx = entmEdids.findIndex(e => norm(e) === fullNorm);
    if (idx >= 0) return entmEdids.splice(idx, 1)[0];

    idx = entmEdids.findIndex(e => fullName.includes(e) || e.includes(fullName));
    if (idx >= 0) return entmEdids.splice(idx, 1)[0];

    const fullTokens = fullName.toUpperCase().split(/[^A-Z0-9]+/).filter(Boolean);
    let bestIdx = -1, bestScore = 0;
    entmEdids.forEach((e, i) => {
      const eTokens = e.toUpperCase().split(/[^A-Z0-9]+/).filter(Boolean);
      const score = fullTokens.reduce((s, t) => s + (eTokens.includes(t) ? 1 : 0), 0);
      if (score > bestScore) { bestScore = score; bestIdx = i; }
    });
    if (bestIdx >= 0 && bestScore > 0) return entmEdids.splice(bestIdx, 1)[0];

    return entmEdids.length ? entmEdids.splice(0,1)[0] : '';
  }

  const entmPills = [];

  entmFulls.forEach(fullName => {
    const matchedEdid = reservedEdidMap[fullName] || pickBestEdidForFull(fullName);
    const edidUpper = String(matchedEdid || '').toUpperCase();
    const fullUpper = fullName.trim().toUpperCase();

    // Decide icon
    let iconSrc = '';
    if (ExactPairs[fullUpper] && (edidUpper === ExactPairs[fullUpper] || edidUpper.includes(ExactPairs[fullUpper]) || edidUpper.startsWith('F1_ENTM'))) {
      iconSrc = '../assets/SubCategory-AdditionalStorageIcon.svg';
    }
    if (!iconSrc) {
      for (const key in ManualEntmIcons) {
        if (edidUpper.startsWith(key.toUpperCase())) {
          iconSrc = ManualEntmIcons[key];
          break;
        }
      }
    }
    if (!iconSrc && edidUpper.startsWith('F1_ENTM')) iconSrc = '../assets/SubCategory-AdditionalStorageIcon.svg';
    if (!iconSrc) {
      if (edidUpper.includes('ATX')) iconSrc = '../assets/AtomIcon.webp';
      else if (edidUpper.includes('SCORE_MINISEASON') || /SCORE[_-]?MINISEASON/i.test(matchedEdid)) iconSrc = '../assets/SeasonIcon.webp';
      else if (/SCORE[_-]?S?\d+/i.test(matchedEdid) || edidUpper.includes('SCORE')) iconSrc = '../assets/SeasonIcon.webp';
    }

    // Build pill
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
    
      let tooltipText = fullName; // fallback
        const edidUpper = String(matchedEdid || '').toUpperCase();

        // 1️startsWith priority
        for (const key in IconAltText_ENTM) {
          if (edidUpper.startsWith(key.toUpperCase())) {
            tooltipText = IconAltText_ENTM[key];
            break;
          }
        }

        // 2️fallback includes (only if not already matched)
        if (tooltipText === fullName) {
          for (const key in IconAltText_ENTM) {
            if (edidUpper.includes(key.toUpperCase())) {
              tooltipText = IconAltText_ENTM[key];
              break;
            }
          }
        }

      attachTooltipToIcon(icon, tooltipText); 
    }
    
    
    
    // optional season suffix
    let textSuffix = '';
    if (matchedEdid) {
      // Check alias keys as prefix
      const aliasKey = Object.keys(miniSeasonAliases).find(key => matchedEdid.startsWith(key));
      if (aliasKey) {
        textSuffix = ` (Mini Season: ${miniSeasonAliases[aliasKey]})`;
      } else {
        // Try to extract MiniSeason name after "MiniSeason_"
        const miniMatch = matchedEdid.match(/MiniSeason_(?:\d+_)?([A-Za-z0-9]+)/i);
        if (miniMatch) {
          // Split camel case for readability
          const cleanedName = miniMatch[1].replace(/([a-z])([A-Z])/g, '$1 $2');
          textSuffix = ` (Mini Season: ${cleanedName})`;
        } else {
          // Fallback to generic SCORE season number
          const seasonMatch = matchedEdid.match(/SCORE[_]?S?(\d+)/i);
          if (seasonMatch) textSuffix = ` (Season ${seasonMatch[1]})`;
        }
      }
    }

    pill.appendChild(document.createTextNode(fullName + textSuffix));
    entmPills.push(pill);
  });

  // Append pills with connectors
  entmPills.forEach((pill, i) => {
    condWrap.appendChild(pill);
    if (i < entmPills.length - 1) {
      const conn = document.createElement('span');
      conn.className = 'connector';
      conn.textContent = entmEntmConnector;
      condWrap.appendChild(conn);
    }
  });
}

      right.appendChild(condWrap);
    }

// --- Budget Cost header + pill ---
if (r.BudgetCost !== undefined && r.BudgetCost !== null && (r.Category || '').toLowerCase() !== 'wallpapers') {
  const budgetHeader = document.createElement('div');
  budgetHeader.className = 'section-header';
  budgetHeader.textContent = 'Budget Cost';
  budgetHeader.style.marginTop = '8px';
  right.appendChild(budgetHeader);

  const budgetWrap = document.createElement('div');
  budgetWrap.className = 'inline-wrap';

  const budgetPill = document.createElement('span');
  budgetPill.className = 'pill';

  // Round to 1 decimal
  const roundedBudget = Math.round(r.BudgetCost * 100) / 100;

  // Budget cost labels for purposes of icon tooltips
  const BudgetTierLabels = {
  1: 'Very Low',
  2: 'Low',
  3: 'Medium',
  4: 'High',
  5: 'Very High'
  };


  // ---- Budget Tiers ----
  let budgetIcon = '';
  let budgetTier = 5; // default

  if (roundedBudget <= 1) {
    budgetIcon = '../assets/BudgetBar-Tier1.webp';
    budgetTier = 1;
  } else if (roundedBudget <= 2) {
    budgetIcon = '../assets/BudgetBar-Tier2.webp';
    budgetTier = 2;
  } else if (roundedBudget <= 4) {
    budgetIcon = '../assets/BudgetBar-Tier3.webp';
    budgetTier = 3;
  } else if (roundedBudget <= 8) {
    budgetIcon = '../assets/BudgetBar-Tier4.webp';
    budgetTier = 4;
  } else {
    budgetIcon = '../assets/BudgetBar-Tier5.webp';
    budgetTier = 5;
  }


  // Add icon
  if (budgetIcon) {
    const icon = document.createElement('img');
    icon.src = budgetIcon;
    icon.style.width = '30px';
    icon.style.height = '30px';
    icon.style.verticalAlign = 'middle';
    icon.style.marginRight = '6px';

    // Attach tooltip using BudgetTierLabels
    if (budgetTier && BudgetTierLabels[budgetTier]) {
      attachTooltipToIcon(icon, `Budget Cost: ${BudgetTierLabels[budgetTier]}`);
    }

    budgetPill.appendChild(icon);
  }


  // Singular/plural
  const unitText = (roundedBudget === 1) ? 'Flamingo Unit' : 'Flamingo Units';

  budgetPill.appendChild(
    document.createTextNode(`${roundedBudget} ${unitText}`)
  );

  budgetWrap.appendChild(budgetPill);
  right.appendChild(budgetWrap);
}

// --- Technical header + pills ---
if (r.CNAM_FormID || r.CNAM_EditorID) {
  const techHeader = document.createElement('div');
  techHeader.className = 'section-header';
  techHeader.textContent = 'Technical';
  techHeader.style.marginTop = '8px';
  right.appendChild(techHeader);

  const techWrap = document.createElement('div');
  techWrap.className = 'inline-wrap';
  techWrap.style.flexDirection = 'column'; // stack pills
  techWrap.style.gap = '4px';

  // --- Form ID pill ---
  if (r.CNAM_FormID) {
    const formPill = document.createElement('span');
    formPill.className = 'pill';
    formPill.textContent = `Form ID: ${r.CNAM_FormID}`;
    techWrap.appendChild(formPill);
  }

  // --- Editor ID pill ---
  if (r.CNAM_EditorID) {
    const edidPill = document.createElement('span');
    edidPill.className = 'pill';

    const label = document.createElement('span');
    

    const value = document.createElement('span');
    value.textContent = r.CNAM_EditorID;
    value.style.wordBreak = 'break-all';  // prevent overflow
    edidPill.style.maxWidth = 'none';
    edidPill.style.width = 'fit-content';

    edidPill.appendChild(label);
    edidPill.appendChild(value);
    techWrap.appendChild(edidPill);
  }

  right.appendChild(techWrap);
}


    // --- attach left + right divs to li ---
    li.appendChild(left);
    li.appendChild(right);
    results.appendChild(li);
  });

  renderPagination(sorted.length);
}