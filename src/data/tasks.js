// ── DEADLINE ──
export const DEADLINE_DATE = "2027-07-01T00:00:00";
export const DEADLINE_LABEL = "1 JULY 2027";

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
      { id: "bod_gym", type: "check", name: "Gym 4x per week consistently" },
      { id: "bod_physique", type: "check", name: "Reach target physique goal" },
      { id: "bod_diet", type: "check", name: "Fix diet — cut junk food" },
      { id: "bod_skincare", type: "check", name: "Build skincare routine" },
      { id: "bod_sleep_sched", type: "check", name: "Fix sleep schedule before midnight" },
      { id: "bod_wake", type: "check", name: "Wake up before 8am daily" },
      { id: "bod_water", type: "check", name: "Drink 2L water daily" },
      { id: "bod_steps", type: "check", name: "Walk 8000 steps/day habit" },
      { id: "bod_hair", type: "check", name: "Hair care routine" },
      { id: "bod_no_phone_wake", type: "check", name: "No phone first 30 min after waking" },
      { id: "bod_no_phone_sleep", type: "check", name: "No phone 1hr before sleep" },
      { id: "bod_cut_habit", type: "check", name: "Cut 1 bad habit completely" },
      { id: "bod_morning_routine", type: "check", name: "Build consistent morning routine" },
      { id: "bod_evening_routine", type: "check", name: "Build consistent evening routine" },
      { id: "bod_weekly_plan", type: "check", name: "Weekly planning every Sunday" },
      { id: "bod_stretch", type: "check", name: "Stretch / mobility routine 3x per week" },
      { id: "bod_calories", type: "checklist", target: 60, name: "Track calories for 60 days" },
      { id: "bod_wardrobe", type: "checklist", target: 5, name: "Improve wardrobe — quality pieces" },
      { id: "bod_self_review", type: "checklist", target: 10, name: "Monthly self-review/reflection" },
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
export function checklistGoal(task, state) {
  const itemCount = state?.items?.length ?? 0;
  return Math.max(task.target, itemCount);
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
