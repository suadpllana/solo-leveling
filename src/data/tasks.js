// ── DEADLINE ──
export const DEADLINE_DATE = "2027-07-01T00:00:00";
export const DEADLINE_LABEL = "1 JULY 2027";
// When the journey began — used to gauge whether you're on pace. Pacing
// assumes a steady, linear effort from START_DATE to DEADLINE_DATE.
export const START_DATE = "2026-06-22T00:00:00";

// Task types:
//   { type: 'check' }                       → simple done/not done toggle
//   { type: 'progress', target: <number> }  → countable, +1 / -1, auto-completes at target
//   { type: 'checklist', target: <number> } → expandable accordion of named sub-items
//                                             you add/check off yourself. `target`
//                                             is only a starting goal; the real goal
//                                             grows to match however many items you
//                                             add. Completes when every item is
//                                             checked (and you've added at least
//                                             `target` of them).
//        stored value shape: { items: [{ id, name }], checked: { [itemId]: true } }

export const CATEGORIES = [
  {
    id: "religion",
    name: "Religion",
    icon: "✝️",
    accent: "#fbbf24",
    tagline: "Forge the spirit",
    tasks: [
      { id: "rel_morning_prayer", type: "check", name: "Daily morning prayer streak" },
      { id: "rel_evening_prayer", type: "check", name: "Daily evening prayer streak" },
      { id: "rel_read_bible", type: "check", name: "Read the Bible fully" },
      { id: "rel_church", type: "check", name: "Attend church every Sunday" },
      { id: "rel_fast", type: "check", name: "Fast regularly" },
      { id: "rel_theology_book", type: "check", name: "Study 1 theology/faith book" },
      { id: "rel_tv_show", type: "check", name: "Watch the chosen TV show" },
      { id: "rel_cut_sins", type: "checklist", target: 3, name: "Cut 3 major sins completely" },
      { id: "rel_help", type: "checklist", target: 10, name: "Help someone in need" },
      { id: "rel_christianity_videos", type: "checklist", target: 10, name: "Watch 10 videos about Christianity arguments" },
    ],
  },
  {
    id: "money",
    name: "Money",
    icon: "💰",
    accent: "#34d399",
    tagline: "Build the empire",
    tasks: [
      { id: "mon_forge_500", type: "check", name: "ForgeKs" },
      { id: "mon_investing", type: "check", name: "Learn investing basics" },
      { id: "mon_polymarket", type: "check", name: "Polymarket Bot" },
      { id: "mon_arbitrage", type: "check", name: "Arbitrage betting" },
      { id: "mon_gmaps_leads", type: "check", name: "Sell Google Maps leads" },
      { id: "mon_frontend_job", type: "check", name: "Full-time frontend developer job" },
      { id: "mon_pi_network", type: "check", name: "Pi Network" },
      { id: "mon_cs2_cases", type: "check", name: "CS2 cases" },
      { id: "mon_ecfito", type: "check", name: "Ecfito" },
      { id: "mon_worldcup_site", type: "check", name: "World Cup website" },
      { id: "mon_barber_app", type: "check", name: "Barber appointment app" },
      { id: "mon_fortnite_accounts", type: "check", name: "Sell Fortnite accounts" },
      { id: "mon_usertesting", type: "check", name: "UserTesting" },
      { id: "mon_stake", type: "check", name: "Stake" },
      { id: "mon_upwork", type: "check", name: "Upwork / Freelancer / Fiverr" },
      { id: "mon_u7buy", type: "check", name: "U7buy" },
      { id: "mon_hunt_sidehustles", type: "check", name: "Hunt daily in Reddit/X/Discord/Telegram for side hustles" },
      { id: "mon_revamp_portfolio", type: "check", name: "Revamp portfolio and lscorporation.online" },
      { id: "mon_ls_clients_3", type: "checklist", target: 3, name: "Get projects from LS Corporation" },
    ],
  },
  {
    id: "mind",
    name: "Mind",
    icon: "🧠",
    accent: "#a78bfa",
    tagline: "Sharpen the blade",
    tasks: [
      { id: "min_meditation", type: "check", name: "Build meditation habit (10 min/day)" },
      { id: "min_outside_tech", type: "check", name: "Learn a topic outside tech deeply" },
      { id: "min_sunday_review", type: "check", name: "Reflect weekly — Sunday review habit" },
      { id: "min_sleep", type: "check", name: "Sleep 8 hours at consistent hours" },
      { id: "min_supplements", type: "check", name: "Take useful supplements (e.g. magnesium)" },
      { id: "min_university", type: "check", name: "Finish university with strong grades" },
      { id: "min_course", type: "check", name: "Complete 1 full online course" },
      { id: "min_books", type: "checklist", target: 8, name: "Read books" },
      { id: "min_films", type: "checklist", target: 20, name: "Watch quality films" },
      { id: "min_tv", type: "checklist", target: 5, name: "Watch TV shows" },
      { id: "min_anime", type: "checklist", target: 3, name: "Watch anime series" },
      { id: "min_games", type: "checklist", target: 5, name: "Play story-driven games" },
      { id: "min_documentaries", type: "checklist", target: 5, name: "Watch documentaries" },
      { id: "min_hobbies", type: "checklist", target: 2, name: "Pick up new hobbies" },
      { id: "min_yt", type: "checklist", target: 60, name: "Watch educational YouTube video essays" },
      { id: "min_podcasts", type: "checklist", target: 10, name: "Listen to long-form podcasts" },
    ],
  },
  {
    id: "body",
    name: "Body",
    icon: "⚔️",
    accent: "#f87171",
    tagline: "Temper the vessel",
    tasks: [
      { id: "bod_gym", type: "check", name: "Gym 6x per week consistently" },
      { id: "bod_physique", type: "check", name: "Reach target physique goal" },
      { id: "bod_skincare", type: "check", name: "Looksmaxx" },
      { id: "bod_sleep_sched", type: "check", name: "Sleep 8 hours in the same time each night" },
      { id: "bod_water", type: "check", name: "Drink 2L water daily" },
      { id: "bod_stretch", type: "check", name: "Stretch daily" },
    ],
  },
  {
    id: "wishlist",
    name: "Wishlist",
    icon: "🛒",
    accent: "#38bdf8",
    tagline: "Claim the rewards",
    tasks: [
      { id: "wish_car", type: "check", name: "Buy a car" },
      { id: "wish_phone", type: "check", name: "Buy a phone" },
      { id: "wish_laptop", type: "check", name: "Buy a laptop" },
      { id: "wish_ps5", type: "check", name: "Buy a PS5" },
      { id: "wish_cd_album", type: "check", name: "Buy a CD album" },
      { id: "wish_cups", type: "check", name: "2 cups" },
      { id: "wish_wallet", type: "check", name: "Wallet" },
      { id: "wish_logo_real_madrid", type: "check", name: "Logo with Real Madrid" },
      { id: "wish_logo_psg", type: "check", name: "Logo with PSG" },
      { id: "wish_rm_jersey", type: "check", name: "Real Madrid jersey" },
      { id: "wish_funko_naruto", type: "check", name: "2 Funko Pop Naruto toys" },
      { id: "wish_magnesium_forte", type: "check", name: "Magnesium Forte" },
      { id: "wish_carpet", type: "check", name: "Carpet" },
      { id: "wish_fridge", type: "check", name: "Small fridge" },
      { id: "wish_bean_bags", type: "check", name: "2 bean bags" },
      { id: "wish_mirror", type: "check", name: "Mirror" },
      { id: "wish_room_parfume", type: "check", name: "Room parfume" },
      { id: "wish_lamps", type: "check", name: "Lamps" },
      { id: "wish_corner_shelf", type: "check", name: "Corner shelf" },
      { id: "wish_christian_cross", type: "check", name: "Christian cross" },
      { id: "wish_laptop_shelf", type: "check", name: "Shelf for laptop" },
      { id: "wish_door_poster", type: "check", name: "Poster for door" },
      { id: "wish_zoro_sword", type: "check", name: "Zoro sword" },
      { id: "wish_skanderbeg_figure", type: "check", name: "Skanderbeg figure" },
      { id: "wish_funko_other", type: "check", name: "Other Funko Pop toys" },
    ],
  },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

// Build a category's effective task list: built-in tasks (minus any the user
// deleted, with name/type edits applied) plus the user's custom tasks. Used by
// both the category page and the dashboard so counts stay in sync.
//   customTasks: { [categoryId]: [task] }
//   hiddenTasks: { [taskId]: true }
//   taskEdits:   { [taskId]: { name?, type? } }
export function mergeCategoryTasks(baseCategory, { customTasks, hiddenTasks, taskEdits } = {}) {
  const edits = taskEdits ?? {};
  const hidden = hiddenTasks ?? {};
  const custom = (customTasks ?? {})[baseCategory.id] ?? [];

  const applyEdit = (t) => {
    const e = edits[t.id];
    if (!e) return t;
    const merged = { ...t, ...e };
    if (merged.type === "checklist" && merged.target == null) merged.target = 1;
    return merged;
  };

  const visibleBuiltIn = baseCategory.tasks
    .filter((t) => !hidden[t.id])
    .map(applyEdit);

  return { ...baseCategory, tasks: [...visibleBuiltIn, ...custom] };
}

// Number of checked items in a checklist task's stored value.
export function checklistCount(state) {
  if (!state || !state.checked) return 0;
  return Object.values(state.checked).filter(Boolean).length;
}

// The live goal for a checklist: starts at `target`, but grows so it always
// covers however many items you've added (add a 9th book → goal becomes 9).
// Floored at 1 so a checklist can never be "complete" with zero checked items
// (guards against a stray target: 0 with no items).
export function checklistGoal(task, state) {
  const itemCount = state?.items?.length ?? 0;
  return Math.max(1, task.target ?? 1, itemCount);
}

// A task counts as complete when:
//   check     → state === true
//   progress  → state (count) >= target
//   checklist → checked items >= goal (all items checked, ≥ target of them)
export function isTaskComplete(task, state) {
  if (task.type === "progress") return (state ?? 0) >= task.target;
  if (task.type === "checklist") return checklistCount(state) >= checklistGoal(task, state);
  return state === true;
}

// Category completion %  (each task weighted equally)
export function categoryProgress(category, progress) {
  const total = category.tasks.length;
  if (!total) return 0;
  const done = category.tasks.reduce(
    (n, t) => n + (isTaskComplete(t, progress[t.id]) ? 1 : 0),
    0
  );
  return Math.round((done / total) * 100);
}

// Number of completed tasks in a category
export function categoryDoneCount(category, progress) {
  return category.tasks.reduce(
    (n, t) => n + (isTaskComplete(t, progress[t.id]) ? 1 : 0),
    0
  );
}

// ── PACING ──
// Are you on track to finish everything by the deadline? Compares your actual
// completion against the steady pace expected between START_DATE and
// DEADLINE_DATE. Returns the numbers a UI needs to say "ahead / behind".
export function computePace({ totalTasks, totalDone, now = Date.now() }) {
  const start = new Date(START_DATE).getTime();
  const end = new Date(DEADLINE_DATE).getTime();

  const totalMs = Math.max(1, end - start);
  const elapsedMs = Math.min(Math.max(0, now - start), totalMs);
  const remainingMs = Math.max(0, end - now);

  const DAY = 86400000;
  const MONTH = DAY * 30.437; // avg month length

  const daysLeft = Math.ceil(remainingMs / DAY);
  const monthsLeft = remainingMs / MONTH;

  // Where a steady effort would put you by now, vs. where you actually are.
  const timeElapsedFrac = elapsedMs / totalMs; // 0..1
  const expectedDone = Math.round(timeElapsedFrac * totalTasks);
  const expectedPct = Math.round(timeElapsedFrac * 100);
  const actualPct = totalTasks ? Math.round((totalDone / totalTasks) * 100) : 0;

  const remainingTasks = Math.max(0, totalTasks - totalDone);
  // Pace needed from now on to still finish on time.
  const perMonthNeeded = monthsLeft > 0 ? remainingTasks / monthsLeft : remainingTasks;
  const perWeekNeeded = remainingTasks / Math.max(remainingMs / (DAY * 7), 1e-9);

  const deltaPct = actualPct - expectedPct; // + ahead, − behind
  let status = "on-track";
  if (deltaPct >= 5) status = "ahead";
  else if (deltaPct <= -5) status = "behind";

  const finished = remainingTasks === 0;
  const overdue = remainingMs === 0 && !finished;

  return {
    actualPct,
    expectedPct,
    expectedDone,
    deltaPct,
    status, // "ahead" | "on-track" | "behind"
    finished,
    overdue,
    daysLeft,
    monthsLeft,
    remainingTasks,
    perMonthNeeded,
    perWeekNeeded,
  };
}
