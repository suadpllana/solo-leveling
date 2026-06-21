// ── DEADLINE ──
export const DEADLINE_DATE = "2027-07-01T00:00:00";
export const DEADLINE_LABEL = "1 JULY 2027";

// Task types:
//   { type: 'check' }                      → simple done/not done toggle
//   { type: 'progress', target: <number> } → countable, +1 / -1, auto-completes at target

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
      { id: "rel_cut_sins", type: "progress", target: 3, name: "Cut 3 major sins completely" },
      { id: "rel_theology_book", type: "check", name: "Study 1 theology/faith book" },
      { id: "rel_gratitude", type: "check", name: "Journal gratitude to God daily" },
      { id: "rel_charity", type: "progress", target: 10, name: "Acts of charity" },
      { id: "rel_memorize", type: "progress", target: 10, name: "Memorize Bible verses" },
      { id: "rel_reflect", type: "check", name: "Reflect on faith weekly" },
      { id: "rel_help", type: "progress", target: 10, name: "Help someone in need" },
      { id: "rel_tv_show", type: "check", name: "Watch the chosen TV show" },
    ],
  },
  {
    id: "money",
    name: "Money",
    icon: "💰",
    accent: "#34d399",
    tagline: "Build the empire",
    tasks: [
      { id: "mon_forge_500", type: "check", name: "Reach first $500 with ForgeKS" },
      { id: "mon_forge_2000", type: "check", name: "Scale ForgeKS to $2000/month" },
      { id: "mon_ls_clients_3", type: "progress", target: 3, name: "Land 3 paying clients for LS Corporation" },
      { id: "mon_ls_clients_8", type: "progress", target: 8, name: "Scale LS Corporation to 8 clients total" },
      { id: "mon_freelance", type: "check", name: "Build consistent freelance income" },
      { id: "mon_launch_app", type: "check", name: "Launch 1 new app/product" },
      { id: "mon_raise", type: "check", name: "Get a salary raise or better job offer" },
      { id: "mon_save", type: "check", name: "Save fixed % of income every month" },
      { id: "mon_investing", type: "check", name: "Learn investing basics" },
      { id: "mon_debt", type: "check", name: "Pay off any debt" },
      { id: "mon_github", type: "progress", target: 10, name: "Build GitHub portfolio (projects)" },
      { id: "mon_cert", type: "check", name: "Get 1 certification" },
      { id: "mon_university", type: "check", name: "Finish university with strong grades" },
      { id: "mon_linkedin", type: "check", name: "Build professional LinkedIn presence" },
      { id: "mon_skill", type: "check", name: "Master 1 new technical skill deeply" },
      { id: "mon_course", type: "check", name: "Complete 1 full online course" },
      { id: "mon_opensource", type: "check", name: "Contribute to open source project" },
      { id: "mon_brand", type: "check", name: "Build personal brand online" },
    ],
  },
  {
    id: "mind",
    name: "Mind",
    icon: "🧠",
    accent: "#a78bfa",
    tagline: "Sharpen the blade",
    tasks: [
      { id: "min_books", type: "progress", target: 8, name: "Read books" },
      { id: "min_films", type: "progress", target: 20, name: "Watch quality films" },
      { id: "min_tv", type: "progress", target: 5, name: "Watch TV shows" },
      { id: "min_anime", type: "progress", target: 3, name: "Watch anime series" },
      { id: "min_games", type: "progress", target: 5, name: "Play story-driven games" },
      { id: "min_documentaries", type: "progress", target: 5, name: "Watch documentaries" },
      { id: "min_hobbies", type: "progress", target: 2, name: "Pick up new hobbies" },
      { id: "min_yt", type: "progress", target: 60, name: "Watch educational YouTube video essays" },
      { id: "min_meditation", type: "check", name: "Build meditation habit (10 min/day)" },
      { id: "min_journal", type: "check", name: "Start and maintain a journal" },
      { id: "min_social", type: "check", name: "Limit social media to max 1hr/day" },
      { id: "min_outside_tech", type: "check", name: "Learn a topic outside tech deeply" },
      { id: "min_sunday_review", type: "check", name: "Reflect weekly — Sunday review habit" },
      { id: "min_podcasts", type: "progress", target: 10, name: "Listen to long-form podcasts" },
      { id: "min_history", type: "check", name: "Study 1 historical event in depth" },
      { id: "min_sleep", type: "check", name: "Sleep 8 hours at consistent hours" },
      { id: "min_supplements", type: "check", name: "Take useful supplements (e.g. magnesium)" },
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
      { id: "bod_calories", type: "progress", target: 60, name: "Track calories for 60 days" },
      { id: "bod_skincare", type: "check", name: "Build skincare routine" },
      { id: "bod_sleep_sched", type: "check", name: "Fix sleep schedule before midnight" },
      { id: "bod_wake", type: "check", name: "Wake up before 8am daily" },
      { id: "bod_water", type: "check", name: "Drink 2L water daily" },
      { id: "bod_steps", type: "check", name: "Walk 8000 steps/day habit" },
      { id: "bod_wardrobe", type: "progress", target: 5, name: "Improve wardrobe — quality pieces" },
      { id: "bod_hair", type: "check", name: "Hair care routine" },
      { id: "bod_no_phone_wake", type: "check", name: "No phone first 30 min after waking" },
      { id: "bod_no_phone_sleep", type: "check", name: "No phone 1hr before sleep" },
      { id: "bod_cut_habit", type: "check", name: "Cut 1 bad habit completely" },
      { id: "bod_morning_routine", type: "check", name: "Build consistent morning routine" },
      { id: "bod_evening_routine", type: "check", name: "Build consistent evening routine" },
      { id: "bod_weekly_plan", type: "check", name: "Weekly planning every Sunday" },
      { id: "bod_self_review", type: "progress", target: 10, name: "Monthly self-review/reflection" },
      { id: "bod_stretch", type: "check", name: "Stretch / mobility routine 3x per week" },
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

// A task counts as complete when:
//   check    → state === true
//   progress → state (count) >= target
export function isTaskComplete(task, state) {
  if (task.type === "progress") return (state ?? 0) >= task.target;
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
