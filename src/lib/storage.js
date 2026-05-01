const DB_NAME = "killteam-roster-db";
const DB_VERSION = 1;
const STORE_NAME = "appState";

const LEGACY_DRAFT_KEYS = ["killteam-roster-draft-v2", "killteam-roster-v1"];
const LEGACY_SAVED_ARMIES_KEY = "killteam-saved-armies-v1";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB."));
  });
}

function readKey(database, key) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error ?? new Error(`Failed to read ${key}.`));
  });
}

function writeKey(database, key, value) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error(`Failed to write ${key}.`));

    store.put(value, key);
  });
}

function parseJson(raw, fallbackValue) {
  if (!raw) {
    return fallbackValue;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

function loadLegacyDraft() {
  for (const key of LEGACY_DRAFT_KEYS) {
    const raw = window.localStorage.getItem(key);
    const parsed = parseJson(raw, null);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  }

  return null;
}

function loadLegacySavedArmies() {
  const parsed = parseJson(window.localStorage.getItem(LEGACY_SAVED_ARMIES_KEY), []);
  return Array.isArray(parsed) ? parsed : [];
}

function clearLegacyStorage() {
  for (const key of [...LEGACY_DRAFT_KEYS, LEGACY_SAVED_ARMIES_KEY]) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      return;
    }
  }
}

export async function loadAppState() {
  const database = await openDatabase();
  const [draft, savedArmies, battleState, dashboardLayout, battleDashboardLayout] = await Promise.all([
    readKey(database, "draftRoster"),
    readKey(database, "savedArmies"),
    readKey(database, "battleState"),
    readKey(database, "dashboardLayout"),
    readKey(database, "battleDashboardLayout")
  ]);

  if (draft || savedArmies || battleState) {
    return {
      draftRoster: draft,
      savedArmies: Array.isArray(savedArmies) ? savedArmies : [],
      battleState: battleState && typeof battleState === "object" ? battleState : null,
      dashboardLayout: Array.isArray(dashboardLayout) ? dashboardLayout : null,
      battleDashboardLayout: Array.isArray(battleDashboardLayout) ? battleDashboardLayout : null
    };
  }

  const legacyDraft = loadLegacyDraft();
  const legacySavedArmies = loadLegacySavedArmies();

  if (legacyDraft || legacySavedArmies.length > 0) {
    await Promise.all([
      writeKey(database, "draftRoster", legacyDraft),
      writeKey(database, "savedArmies", legacySavedArmies)
    ]);
    clearLegacyStorage();
  }

  return {
    draftRoster: legacyDraft,
    savedArmies: legacySavedArmies,
    battleState: null,
    dashboardLayout: null,
    battleDashboardLayout: null
  };
}

export async function saveDraftRoster(draftRoster) {
  const database = await openDatabase();
  await writeKey(database, "draftRoster", draftRoster);
}

export async function saveSavedArmies(savedArmies) {
  const database = await openDatabase();
  await writeKey(database, "savedArmies", savedArmies);
}

export async function saveBattleState(battleState) {
  const database = await openDatabase();
  await writeKey(database, "battleState", battleState);
}

export async function saveDashboardLayout(dashboardLayout) {
  const database = await openDatabase();
  await writeKey(database, "dashboardLayout", dashboardLayout);
}

export async function saveBattleDashboardLayout(battleDashboardLayout) {
  const database = await openDatabase();
  await writeKey(database, "battleDashboardLayout", battleDashboardLayout);
}