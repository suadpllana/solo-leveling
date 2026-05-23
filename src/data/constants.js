export const RANKS = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
export const RANK_TITLES = ['Shadow Novice', 'Shadow Initiate', 'Shadow Blade', 'Shadow Elite', 'Shadow Commander', 'Shadow Monarch', 'Absolute Hunter', 'Ruler of All'];
export const RANK_COLORS = ['#6b7280', '#4ade80', '#60a5fa', '#c084fc', '#facc15', '#f87171', '#ff6b35', '#ffd700'];
export const XP_PER_RANK = [500, 1500, 3000, 6000, 10000, 18000, 28000, 50000];

export function getRankInfo(xp) {
  let rank = 0, total = 0;
  for (let i = 0; i < XP_PER_RANK.length - 1; i++) {
    if (xp >= total + XP_PER_RANK[i]) { total += XP_PER_RANK[i]; rank = i + 1; } else break;
  }
  rank = Math.min(rank, RANKS.length - 1);
  return { rank, current: xp - total, needed: XP_PER_RANK[rank], pct: Math.min(100, ((xp - total) / XP_PER_RANK[rank]) * 100) };
}

// ── DEADLINE ──
export const DEADLINE_DATE = '2026-07-01T00:00:00';
export const DEADLINE_LABEL = '1 JULY 2026';

export const DAILY_TASKS = [
  { id: 'wake_up', name: 'Wake Up', time: '07:10', icon: '🌅', xp: 20, tip: 'Get out of bed immediately. No snoozing. Win the first battle of the day.' },
  // { id: 'prayer', name: 'Morning Prayer', time: '07:15', icon: '🙏', xp: 50, tip: 'Say: "God, destroy my need for comfort. Give me the strength to endure today\'s suffering so I may become who I am meant to be. I am ready to do the hard work." (Psychology: Shifts your brain out of victimhood and frames difficulty as training).' },
  // { id: 'meditate', name: 'Meditate', time: '07:20', icon: '🧘', xp: 60, tip: '5 min. Box breathing: 4s in, 4s hold, 4s out, 4s hold. Eyes closed. No stimulation. Mental training.' },
  // { id: 'stretch', name: 'Morning Stretch', time: '07:25', icon: '🤸', xp: 50, tip: '5-min mobility' },
  {
    id: 'looksmax', name: 'Looksmax Routine', time: '07:30', icon: '✨', xp: 75, tip: 'Physical Optimization Protocol. Consistency is everything.', subTasks: [
      { id: 'lm_eyes1', n: 'Eyes: Mewing (Full day)' },
      { id: 'lm_eyes2', n: 'Eyes: Canthal Tilt Massage (60s)' },
      { id: 'lm_eyes3', n: 'Eyes: Eyelid Hooding Drill (3x15)' },
      { id: 'lm_jaw1', n: 'Jaw: Neck Curls (3x25)' },
      { id: 'lm_jaw2', n: 'Jaw: Cheeks Pinch (10x10s)' },
      { id: 'lm_jaw3', n: 'Jaw: Chin Tucks (15 reps)' },
      { id: 'lm_brows', n: 'Eyebrows: Brush Up & Clean Strays' },
      { id: 'lm_nose1', n: 'Nose: Nasal Tip Lift (2x30)' },
      { id: 'lm_nose2', n: 'Nose: Bridge Massage (5 mins)' },
      { id: 'lm_skin', n: 'Skin: Wash, Moisturize & Ice Roller' },
      { id: 'lm_hair', n: 'Hair: Proper Wash & Clay Styling' }
    ]
  },
  { id: 'work', name: 'At Work', time: '08:00', icon: '💼', xp: 150, tip: 'Focus on your career. Build skills, provide value, and secure your financial future.' },
  // { id: 'exercise', name: 'Exercise (80kg Goal)', time: '17:30', icon: '💪', xp: 100, tip: 'Drop 8kg (88kg → 80kg) + Build Muscle. Body Recomposition.', subTasks: [{ id: 'e_push', n: '20 Pushups (Chest/Triceps)' }, { id: 'e_sq', n: '20 Squats (Legs)' }, { id: 'e_pike', n: '15 Pike Pushups (Shoulders)' }, { id: 'e_back', n: '15 Superman Raises  (Back)' }, { id: 'e_plank', n: '30 Sec Plank (Core)' }, { id: 'e_pull', n: '10 Bag Curls (Biceps)' }] },
  { id: 'yt_vid', name: 'Watch 1 Knowledge Video', time: '18:00', icon: '▶️', xp: 40, tip: 'Check the Knowledge tab and watch one video. Take mental notes to level up your intellect.' },
  { id: 'mastery', name: 'Skill Mastery (30m)', time: '18:30', icon: '🎯', xp: 40, tip: '30 minutes of deep, focused practice on a specific skill to reach expert level.' },
  { id: 'game_time', name: 'Game for 1.5 Hours', time: '19:00', icon: '🎮', xp: 50, tip: 'Enjoy your downtime! Play your favorite game guilt-free for 1.5 hours.' },
  { id: 'relax', name: 'Relax for 2 Hours', time: '20:30', icon: '🛋️', xp: 50, tip: 'Unstructured decompression. Enjoy some casual screen time, play CS2, or watch a football match to fully disconnect and recharge.' },
  { id: 'stoic', name: 'Stoic Quote', time: '22:30', icon: '📜', xp: 30, tip: 'Read today\'s quote. Sit with it for 2 minutes. Write one sentence on how it applies to your life right now.' },
  { id: 'read_book', name: 'Read 2 Book Chapters', time: '22:40', icon: '📚', xp: 60, tip: 'No screens. Read a physical book or e-reader to prepare your brain for sleep.' },
  { id: 'sleep', name: '8 Hours Sleep', time: '23:10', icon: '🌙', xp: 80, tip: 'In bed by 23:00. Phone in another room or face-down. Melatonin 0.5mg if needed. Cool room (18-20°C).' },
  { id: 'water', name: '2L of Water', time: 'All day', icon: '💧', xp: 50, tip: 'Start with 500ml before coffee. Set phone reminders every 2 hours.' },
  { id: 'nofap', name: 'NoFap', time: 'All day', icon: '🔥', xp: 150, tip: 'Every day of abstinence compounds. Redirect the energy into your goals.' }
];

export const WEEKEND_TASKS = [
  { id: 'wk_movie', name: 'Watch 1 Movie / Doc', time: 'Weekend', icon: '🎞️', xp: 100, tip: 'Immerse yourself in a great story or learn about reality. Completely reset your mind.' },
  { id: 'wk_money', name: 'Ways to make $400 this month', time: 'Weekend', icon: '💰', xp: 150, tip: 'Spend time exploring side hustles, freelance gigs, or high-income skills to hit your monthly goal.' }
];

export const STOIC_QUOTES = [
  { q: "The impediment to action advances action. What stands in the way becomes the way.", a: "Marcus Aurelius" },
  { q: "You have power over your mind — not outside events. Realize this, and you will find strength.", a: "Marcus Aurelius" },
  { q: "We suffer more in imagination than in reality.", a: "Seneca" },
  { q: "Waste no more time arguing what a good man should be. Be one.", a: "Marcus Aurelius" },
  { q: "Make the best use of what is in your power, and take the rest as it happens.", a: "Epictetus" },
  { q: "The whole future lies in uncertainty: live immediately.", a: "Seneca" },
  { q: "No man is free who is not master of himself.", a: "Epictetus" },
  { q: "It is not the man who has too little that is poor, but the one who hankers after more.", a: "Seneca" },
  { q: "Accept the things to which fate binds you, and love the people with whom fate brings you together.", a: "Marcus Aurelius" },
  { q: "He suffers more than necessary, who suffers before it is necessary.", a: "Seneca" },
  { q: "Confine yourself to the present.", a: "Marcus Aurelius" },
  { q: "First say to yourself what you would be; and then do what you have to do.", a: "Epictetus" },
  { q: "Never let the future disturb you. You will meet it with the same weapons of reason which today arm you against the present.", a: "Marcus Aurelius" },
  { q: "Luck is what happens when preparation meets opportunity.", a: "Seneca" },
  { q: "Wealth consists not in having great possessions, but in having few wants.", a: "Epictetus" },
  { q: "If it is not right do not do it; if it is not true do not say it.", a: "Marcus Aurelius" },
  { q: "Ignorance is the cause of fear.", a: "Seneca" },
  { q: "Sometimes even to live is an act of courage.", a: "Seneca" },
  { q: "To bear trials with a calm mind robs misfortune of its strength and burden.", a: "Seneca" },
  { q: "How long are you going to wait before you demand the best for yourself?", a: "Epictetus" },
  { q: "Man conquers the world by conquering himself.", a: "Zeno of Citium" },
  { q: "A ship should not ride on a single anchor, nor life on a single hope.", a: "Epictetus" },
  { q: "No person has the power to have everything they want, but it is in their power not to want what they don't have.", a: "Seneca" },
  { q: "Whatever can happen at any time can happen today.", a: "Seneca" },
  { q: "Nothing, to my way of thinking, is a better proof of a well ordered mind than a man's ability to stop just where he is and pass some time in his own company.", a: "Seneca" },
  { q: "Difficulties strengthen the mind, as labor does the body.", a: "Seneca" },
  { q: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", a: "Marcus Aurelius" },
  { q: "Let us prepare our minds as if we'd come to the very end of life. Let us postpone nothing.", a: "Seneca" },
  { q: "We are more often frightened than hurt; and we suffer more from imagination than from reality.", a: "Seneca" },
  { q: "Knowledge is not just about what you know, but what you bear.", a: "Seneca" },
  { q: "There is no genius without a touch of madness.", a: "Seneca" },
  { q: "If a man knows not to which port he sails, no wind is favorable.", a: "Seneca" },
  { q: "Choose not to be harmed, and you won't feel harmed. Don't feel harmed, and you haven't been.", a: "Marcus Aurelius" },
  { q: "What we do now echoes in eternity.", a: "Marcus Aurelius" },
  { q: "Begin at once to live, and count each separate day as a separate life.", a: "Seneca" },
  { q: "It is essentially the same exactly. You must not focus on the outcome but the process.", a: "Epictetus" },
  { q: "To be everywhere is to be nowhere.", a: "Seneca" },
  { q: "You act like mortals in all that you fear, and like immortals in all that you desire.", a: "Seneca" },
  { q: "It is a rough road that leads to the heights of greatness.", a: "Seneca" },
  { q: "Only time can heal what reason cannot.", a: "Seneca" },
  { q: "While we are postponing, life speeds by.", a: "Seneca" },
  { q: "He who fears death will never do anything worth of a man who is alive.", a: "Seneca" },
  { q: "Life is very short and anxious for those who forget the past, neglect the present, and fear the future.", a: "Seneca" },
  { q: "Fire tests gold, suffering tests brave men.", a: "Seneca" },
  { q: "If you really want to escape the things that harass you, what you are needing is not to be in a different place but to be a different person.", a: "Seneca" },
  { q: "Until we have begun to go without them, we fail to realize how unnecessary many things are.", a: "Seneca" },
  { q: "I shall never be ashamed of citing a bad author if the line is good.", a: "Seneca" },
  { q: "Drunkenness is nothing but voluntary madness.", a: "Seneca" },
  { q: "It is the power of the mind to be unconquerable.", a: "Seneca" },
  { q: "No evil is honorable: but death is honorable; therefore death is not evil.", a: "Zeno" },
  { q: "Well-being is realized by small steps, but is truly no small thing.", a: "Zeno" },
  { q: "Steel your sensibilities, so that life shall hurt you as little as possible.", a: "Epictetus" },
  { q: "First learn the meaning of what you say, and then speak.", a: "Epictetus" },
  { q: "No great thing is created suddenly.", a: "Epictetus" },
  { q: "Do not explain your philosophy. Embody it.", a: "Epictetus" },
  { q: "If you want to improve, be content to be thought foolish and stupid.", a: "Epictetus" },
  { q: "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.", a: "Epictetus" },
  { q: "It is impossible for a man to learn what he thinks he already knows.", a: "Epictetus" },
  { q: "Circumstances do not make the man, they only reveal him to himself.", a: "Epictetus" },
  { q: "Men are disturbed not by things, but by the views which they take of them.", a: "Epictetus" },
  { q: "Any person capable of angering you becomes your master.", a: "Epictetus" },
  { q: "Only the educated are free.", a: "Epictetus" },
  { q: "The key is to keep company only with people who uplift you, whose presence calls forth your best.", a: "Epictetus" },
  { q: "When you are offended at any man fault, turn to yourself and study your own failings.", a: "Marcus Aurelius" },
  { q: "The soul becomes dyed with the color of its thoughts.", a: "Marcus Aurelius" },
  { q: "Our life is what our thoughts make it.", a: "Marcus Aurelius" },
  { q: "If it is not right do not do it; if it is not true do not say it.", a: "Marcus Aurelius" },
  { q: "The best revenge is to be unlike him who performed the injury.", a: "Marcus Aurelius" },
  { q: "A man worth is no greater than his ambitions.", a: "Marcus Aurelius" },
  { q: "To live a good life: We have the potential for it. If we can learn to be indifferent to what makes no difference.", a: "Marcus Aurelius" },
  { q: "Accept whatever comes to you woven in the pattern of your destiny, for what could more aptly fit your needs?", a: "Marcus Aurelius" },
  { q: "Reject your sense of injury and the injury itself disappears.", a: "Marcus Aurelius" },
  { q: "Often injustice lies in what you are not doing, not only in what you are doing.", a: "Marcus Aurelius" },
  { q: "The only wealth which you will keep forever is the wealth you have given away.", a: "Marcus Aurelius" },
  { q: "Perfection of character is this: to live each day as if it were your last.", a: "Marcus Aurelius" },
  { q: "Whatever anyone does or says, I must be emerald and keep my color.", a: "Marcus Aurelius" },
  { q: "Let men see, let them know, a real man, who lives as he was meant to live.", a: "Marcus Aurelius" },
  { q: "Because a thing seems difficult for you, do not think it impossible for anyone to accomplish.", a: "Marcus Aurelius" },
  { q: "Conceal a flaw, and the world will imagine the worst.", a: "Marcus Aurelius" },
  { q: "When you arise in the morning, think of what a precious privilege it is to be alive.", a: "Marcus Aurelius" },
  { q: "Nothing happens to any man that he is not formed by nature to bear.", a: "Marcus Aurelius" },
  { q: "How much more grievous are the consequences of anger than the causes of it.", a: "Marcus Aurelius" },
  { q: "Think of yourself as dead. You have lived your life. Now take what is left and live it properly.", a: "Marcus Aurelius" },
  { q: "You have power over your mind, not outside events. Realize this, and you will find strength.", a: "Marcus Aurelius" },
  { q: "Do every act of your life as if it were your last.", a: "Marcus Aurelius" },
  { q: "Remember that very little is needed to make a happy life.", a: "Marcus Aurelius" },
  { q: "He who lives in harmony with himself lives in harmony with the universe.", a: "Marcus Aurelius" },
  { q: "The universe is change; our life is what our thoughts make it.", a: "Marcus Aurelius" },
  { q: "Life is neither good or evil, but only a place for good and evil.", a: "Marcus Aurelius" },
  { q: "Let not your mind run on what you lack as much as on what you have already.", a: "Marcus Aurelius" },
  { q: "Look back over the past, with its changing empires that rose and fell, and you can foresee the future, too.", a: "Marcus Aurelius" },
  { q: "Where a man can live, he can also live well.", a: "Marcus Aurelius" },
  { q: "Dwell on the beauty of life. Watch the stars, and see yourself running with them.", a: "Marcus Aurelius" },
  { q: "He who indulges in empty fears earns himself real fears.", a: "Seneca" },
  { q: "Enjoy present pleasures in such a way as not to injure future ones.", a: "Seneca" },
  { q: "It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult.", a: "Seneca" },
  { q: "As is a tale, so is life: not how long it is, but how good it is, is what matters.", a: "Seneca" },
  { q: "We learn not in the school, but in life.", a: "Seneca" },
  { q: "If you wish him to keep a secret, keep it yourself.", a: "Seneca" },
  { q: "The greatest obstacle to living is expectancy, which hangs upon tomorrow and loses today.", a: "Seneca" },
  { q: "You must build up your life action by action, and be content if each one achieves its goal as far as possible.", a: "Marcus Aurelius" },
  { q: "Be tolerant with others and strict with yourself.", a: "Marcus Aurelius" },
  { q: "There is nothing happens to any person but what was in his power to go through with.", a: "Marcus Aurelius" },
  { q: "We are like many blocks of stone, all destined to be carved into a single column.", a: "Marcus Aurelius" },
  { q: "That which is not good for the bee-hive cannot be good for the bees.", a: "Marcus Aurelius" },
  { q: "Do not act as if you were going to live ten thousand years. Death hangs over you.", a: "Marcus Aurelius" },
  { q: "The mind that is anxious about future events is miserable.", a: "Seneca" },
  { q: "Whatever happens, it was prepared for you from all eternity.", a: "Marcus Aurelius" },
  { q: "Every living organism is fulfilled when it follows the right path for its own nature.", a: "Marcus Aurelius" },
  { q: "No one can lose either the past or the future - how could anyone be deprived of what he does not possess?", a: "Marcus Aurelius" },
  { q: "To be evenminded is the greatest virtue.", a: "Heraclitus" },
  { q: "Everything flows and nothing abides.", a: "Heraclitus" },
  { q: "Good character is not formed in a week or a month. It is created little by little, day by day.", a: "Heraclitus" },
  { q: "Men keep secrets of their own, but they do not keep the secrets of others.", a: "Epictetus" },
  { q: "First, do no harm.", a: "Hippocrates" },
  { q: "There is only one way to happiness and that is to cease worrying about things which are beyond the power of our will.", a: "Epictetus" },
  { q: "Do not try to seem wise to others. If you want to live a wise life, live it on your own terms and in your own eyes.", a: "Epictetus" },
  { q: "Seek not for events to happen as you wish but rather wish for events to happen as they do.", a: "Epictetus" },
  { q: "Know, first, who you are, and then adorn yourself accordingly.", a: "Epictetus" },
  { q: "Nature hath given men one tongue but two ears, that we may hear from others twice as much as we speak.", a: "Epictetus" },
  { q: "Freedom is the only worthy goal in life. It is won by disregarding things that lie beyond our control.", a: "Epictetus" },
  { q: "Do what you will. Even if you tear yourself apart, most people will continue doing the same things.", a: "Marcus Aurelius" },
  { q: "The true worth of a man is to be measured by the objects he pursues.", a: "Marcus Aurelius" },
  { q: "What is true is not always what is popularly believed.", a: "Marcus Aurelius" },
  { q: "If you want to be a writer, write.", a: "Epictetus" },
  { q: "Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth.", a: "Marcus Aurelius" },
  { q: "It is not what happens to you, but how you react to it that matters.", a: "Epictetus" },
  { q: "I am not an Athenian or a Greek, but a citizen of the world.", a: "Socrates" },
  { q: "I count him braver who overcomes his desires than him who conquers his enemies; for the hardest victory is over self.", a: "Aristotle" },
  { q: "Poverty is the parent of revolution and crime.", a: "Aristotle" },
  { q: "No great mind has ever existed without a touch of madness.", a: "Aristotle" },
  { q: "The energy of the mind is the essence of life.", a: "Aristotle" },
  { q: "The high-minded man must care more for the truth than for what people think.", a: "Aristotle" },
  { q: "There are more things, Lucilius, likely to frighten us than there are to crush us.", a: "Seneca" },
  { q: "It is a sign of a weak mind to be unable to bear wealth.", a: "Seneca" },
  { q: "A gem cannot be polished without friction, nor a man perfected without trials.", a: "Seneca" },
  { q: "To demand immortality is to ask for the perpetuation of a mistake.", a: "Schopenhauer" },
  { q: "Nothing is more honorable than a grateful heart.", a: "Seneca" },
  { q: "True happiness is to enjoy the present, without anxious dependence upon the future.", a: "Seneca" },
  { q: "Sometimes in life we must take a step backward to take two forward.", a: "Marcus Aurelius" },
  { q: "No man was ever wise by chance.", a: "Seneca" },
  { q: "Luck is what happens when preparation meets opportunity.", a: "Seneca" },
  { q: "We should always be asking ourselves: Is this something that is, or is not, in my control?", a: "Epictetus" },
  { q: "Difficulties are things that show a person what they are.", a: "Epictetus" },
  { q: "To make the best of what is in our power, and take the rest as it naturally happens.", a: "Epictetus" },
  { q: "How long are you going to wait before you demand the best for yourself?", a: "Epictetus" }
];

// ── FOCUS CATEGORY CONSTRAINTS & LIMITS ──
export const CATEGORY_LIMITS = {
  '📚 Books': 1,
  '📺 TV Shows/Anime': 1,
  '🎮 Gaming': 1,
  '🎬 Films': 2,
  '🎞️ Documentaries': 1,
  '🎯 Hobbies': 2,
};

// ── ONE-TIME QUESTS (May 2026 Edition) ──
// Enriched with dynamic pacing metadata
export const ONE_TIME_TASKS = [
  // 📚 Books
  { id: 'jam', name: 'Read "Jam Mysliman"', cat: '📚 Books', xp: 300, icon: '📖', totalUnits: 12, unitName: 'chapters', estUnitDuration: 30, defaultDurationDays: 14 },
  { id: 'prince', name: 'Read "The Prince" — Machiavelli', cat: '📚 Books', xp: 300, icon: '📖', totalUnits: 26, unitName: 'chapters', estUnitDuration: 15, defaultDurationDays: 20 },
  { id: 'book_animalfarm', name: 'Read "Animal Farm" — George Orwell', cat: '📚 Books', xp: 300, icon: '📖', totalUnits: 10, unitName: 'chapters', estUnitDuration: 20, defaultDurationDays: 10 },

  // 🎬 Films
  { id: 'film_harakiri', name: 'Watch "Harakiri" (1962)', cat: '🎬 Films', xp: 150, icon: '🎬', totalUnits: 1, unitName: 'movie', estUnitDuration: 133, defaultDurationDays: 3 },
  { id: 'film_comeandsee', name: 'Watch "Come and See" (1985)', cat: '🎬 Films', xp: 150, icon: '🎬', totalUnits: 1, unitName: 'movie', estUnitDuration: 142, defaultDurationDays: 3 },
  { id: 'film_silence', name: 'Watch "The Silence of the Lambs" (1991)', cat: '🎬 Films', xp: 150, icon: '🎬', totalUnits: 1, unitName: 'movie', estUnitDuration: 118, defaultDurationDays: 3 },
  { id: 'film_oppenheimer', name: 'Watch "Oppenheimer" (2023)', cat: '🎬 Films', xp: 150, icon: '🎬', totalUnits: 1, unitName: 'movie', estUnitDuration: 180, defaultDurationDays: 3 },
  { id: 'film_projecthailmary', name: 'Watch "Project Hail Mary"', cat: '🎬 Films', xp: 150, icon: '🎬', totalUnits: 1, unitName: 'movie', estUnitDuration: 120, defaultDurationDays: 3 },

  // 🎞️ Documentaries
  { id: 'doc_europe', name: 'Watch "Europa: The Last Battle"', cat: '🎞️ Documentaries', xp: 200, icon: '🎞️', url: 'https://www.youtube.com/results?search_query=europa+the+last+battle', totalUnits: 10, unitName: 'parts', estUnitDuration: 60, defaultDurationDays: 10 },
  { id: 'doc_planetearth', name: 'Watch "Planet Earth 1" (11 eps)', cat: '🎞️ Documentaries', xp: 200, icon: '🎞️', url: 'https://www.youtube.com/results?search_query=planet+earth+1+documentary', totalUnits: 11, unitName: 'episodes', estUnitDuration: 50, defaultDurationDays: 11 },
  { id: 'doc_socialdilemma', name: 'Watch "The Social Dilemma"', cat: '🎞️ Documentaries', xp: 150, icon: '🎞️', url: 'https://www.youtube.com/results?search_query=the+social+dilemma', totalUnits: 1, unitName: 'documentary', estUnitDuration: 94, defaultDurationDays: 2 },

  // 🎮 Gaming
  { id: 'origins', name: "Play Assassin's Creed Origins", cat: '🎮 Gaming', xp: 200, icon: '🎮', totalUnits: 8, unitName: 'parts', estUnitDuration: 90, defaultDurationDays: 14 },
  { id: 'game_ghost', name: 'Play Ghost of Tsushima', cat: '🎮 Gaming', xp: 200, icon: '🎮', totalUnits: 7, unitName: 'parts', estUnitDuration: 90, defaultDurationDays: 14 },
  { id: 'game_arkhamcity', name: 'Play Batman: Arkham City', cat: '🎮 Gaming', xp: 200, icon: '🎮', totalUnits: 3, unitName: 'parts', estUnitDuration: 90, defaultDurationDays: 7 },
  { id: 'game_arkhamknight', name: 'Play Batman: Arkham Knight', cat: '🎮 Gaming', xp: 200, icon: '🎮', totalUnits: 3, unitName: 'parts', estUnitDuration: 90, defaultDurationDays: 7 },

  // 🎯 Hobbies
  { id: 'hobby_cs2', name: 'CS2 Master', cat: '🎯 Hobbies', xp: 300, icon: '🎯', totalUnits: 12, unitName: 'sessions', estUnitDuration: 30, defaultDurationDays: 12 },
  { id: 'hobby_chess', name: 'Chess Master', cat: '🎯 Hobbies', xp: 300, icon: '♟️', totalUnits: 12, unitName: 'sessions', estUnitDuration: 30, defaultDurationDays: 12 },
  { id: 'hobby_pingpong', name: 'Ping Pong Master', cat: '🎯 Hobbies', xp: 300, icon: '🏓', totalUnits: 12, unitName: 'sessions', estUnitDuration: 30, defaultDurationDays: 12 },
  { id: 'hobby_eafc', name: 'EAFC 26 Master', cat: '🎯 Hobbies', xp: 300, icon: '⚽', totalUnits: 12, unitName: 'sessions', estUnitDuration: 30, defaultDurationDays: 12 },

  // ⚖️ Body
  { id: 'weight', name: 'Reach 80kg', cat: '⚖️ Body', xp: 500, icon: '⚖️', totalUnits: 2, unitName: 'milestones', estUnitDuration: 0, defaultDurationDays: 30, subTasks: [
    { id: 'w_ex', n: 'Consistent Exercise Routine' },
    { id: 'w_lm', n: 'Consistent Looksmaxing Routine' }
  ] },

  // 💰 Finance
  { id: 'money', name: 'Make $400 this month', cat: '💰 Finance', xp: 500, icon: '💵', totalUnits: 1, unitName: 'milestone', estUnitDuration: 0, defaultDurationDays: 30 },

  // 🧠 Knowledge
  { id: 'knowledge', name: 'Complete all knowledge videos', cat: '🧠 Knowledge', xp: 200, icon: '🧠', totalUnits: 1, unitName: 'milestone', estUnitDuration: 0, defaultDurationDays: 30 },

  // 📺 TV Shows
  { id: 'anime_onepiece', name: 'Watch "One Piece"', cat: '📺 TV Shows/Anime', xp: 500, icon: '📺', totalUnits: 1000, unitName: 'episodes', estUnitDuration: 24, defaultDurationDays: 365 },
  { id: 'anime_cowboybebop', name: 'Watch "Cowboy Bebop"', cat: '📺 TV Shows/Anime', xp: 200, icon: '📺', totalUnits: 26, unitName: 'episodes', estUnitDuration: 24, defaultDurationDays: 14 },
  { id: 'tv_chernobyl', name: 'Watch "Chernobyl" (Mini Series)', cat: '📺 TV Shows/Anime', xp: 200, icon: '📺', totalUnits: 5, unitName: 'episodes', estUnitDuration: 65, defaultDurationDays: 7 },
  { id: 'tv_bcs', name: 'Watch "Better Call Saul"', cat: '📺 TV Shows/Anime', xp: 200, icon: '📺', totalUnits: 63, unitName: 'episodes', estUnitDuration: 47, defaultDurationDays: 30 },
  { id: 'anime_fmab', name: 'Watch "Fullmetal Alchemist: Brotherhood"', cat: '📺 TV Shows/Anime', xp: 200, icon: '📺', totalUnits: 64, unitName: 'episodes', estUnitDuration: 24, defaultDurationDays: 21 },
];

export const LOOKSMAX_AREAS = [
  {
    area: 'Hunter Eyes', icon: '👁️', color: '#00f0ff', tips: [
      { t: 'Master Mewing', d: 'Tongue fully flat on palate — ALL of it, back third included. Teeth lightly touching, lips sealed. This creates upward maxillary force that reshapes your midface and orbital support over 1-3 years. The single most important thing you can do. Make it a constant habit.' },
      { t: 'Positive Canthal Tilt Massage', d: 'Place your index fingers at the outer corners of your eyes. Gently pull them upward and outward (diagonally toward your temples) while slightly squinting against the pull. Hold for 30-60 seconds daily. Over time, this trains the orbicularis oculi muscle and surrounding fascia to subtly lift the outer corners.' },
      { t: 'Eyelid Hooding Drill', d: 'Look straight ahead. Keep forehead completely relaxed. Very slowly lower your upper eyelid without raising your brows. 15 reps × 3 sets daily. Trains the levator palpebrae to rest with more natural hooding. Takes weeks to notice — stay consistent.' },
    ]
  },
  {
    area: 'Jawline', icon: '🦷', color: '#7b2fff', tips: [
      { t: 'Neck Curls', d: 'Lie flat on floor or edge of bed. Slowly curl chin to chest, hold 1 second, lower slowly. 3 sets of 25 reps every single day. Builds sternocleidomastoid and anterior neck muscles — creates sharp jaw-to-neck transition that makes the jaw pop dramatically. Most underrated exercise.' },
      { t: 'Cheeks Pinch', d: "Squeeze your cheeks with your hand, make a kissing face and hold for 10 seconds, 10 reps daily. This strengthens the masseter and buccinator muscles, which can enhance cheekbone definition and create a more sculpted midface appearance over time." },
      { t: 'Chin Tucks', d: 'Pull chin straight back (not down), creating a "double chin" position. Hold 10 seconds. 15 reps. This aligns the cervical spine and improves forward head posture, which drastically improves how the jaw projects when standing.' },
    ]
  },
  {
    area: 'Eyebrows', icon: '〰️', color: '#ff6b00', tips: [
      { t: 'Brush Upward Every Morning', d: 'Use a spoolie brush on dry brows every morning. Sweep firmly upward and slightly outward. This creates the thick, lifted masculine brow that frames the eyes with dominance. Takes 10 seconds. Non-negotiable daily ritual.' },
      { t: 'Clean Strays Only', d: 'Remove ONLY: hairs below the brow on the brow bone, and the monobrow gap. Never thin the main body. Never arch them. Full, straight, slightly flat brows are dominant and masculine. Less is more.' },
    ]
  },
  {
    area: 'Nose', icon: '👃', color: '#ffd700', tips: [
      { t: 'Nasal Tip Lift', d: 'Place index finger under nose tip, apply slight downward pressure. Push tip upward against finger resistance. 30 reps × 2 sets daily. May very gradually lift a droopy nasal tip over months. Low evidence but zero cost — include in daily routine.' },
      { t: 'Nose Bridge Massage', d: 'Thumb and index finger pinching the bridge. Gentle downward massage, 5 minutes. Can marginally slim the nose appearance through reduced tissue puffiness. Do after warm shower when circulation is up.' },
      { t: 'Posture & Angles', d: 'Straight posture with chin slightly forward and level creates the most flattering nose-to-face ratio. Most unflattering nose appearances are posture problems. Fix your posture and your nose appears completely different.' },
    ]
  },
  {
    area: 'Skin', icon: '✨', color: '#4ade80', tips: [
      { t: 'Daily Skincare Routine', d: 'Keep it simple: Wash your face with water or a gentle cleanser, then apply a basic moisturizer (preferably with SPF for the day). That\'s all you need to keep your skin healthy and hydrated.' },
      { t: 'Ice Roller', d: '90-second ice roller or ice cube in cloth after gua sha. Closes pores, reduces inflammation, tightens skin, eliminates morning puffiness. Looks and feels dramatically different within 5 minutes. Game changer pre-photos or going out.' },
    ]
  },
  {
    area: 'Hair', icon: '💈', color: '#c084fc', tips: [
      { t: 'Stop Daily Washing', d: 'Wash hair maximum 3×/week. Daily washing strips the sebum that naturally conditions hair and scalp. Use dry shampoo on off days if needed. Hair becomes less oily over 2-3 weeks as sebum production normalizes.' },
      { t: ' Clay Styling', d: 'Apply matte clay pomade to slightly damp hair — never dry. Work between palms first. Provides hold, texture, and natural finish. Never gel (wet look = dated). Never hairspray. Clay is the modern man\'s product.' },
    ]
  },
];

export const YOUTUBE_DATA = {
  'CS2': [
    { t: 'CS2 Complete Movement Guide', ch: 'lau', d: 'The best way to understand advanced CS2 movement mechanics like bhop, surfing and airstrafing.', url: 'https://www.youtube.com/watch?v=XDpuOMmluec' },
  ],
  'War': [
    { t: 'TOP 10 Historical Battles YOU need to know', ch: 'Forgotten History', d: 'Pivotal battles that shaped civilization — from Gaugamela to D-Day.', url: 'https://www.youtube.com/watch?v=Dt7F5I3Xp00' },
  ],
  'Books': [
    { t: 'How Good People Make Bad Leaders | Machiavelli\'s The Prince', ch: 'Unsolicited advice', d: 'Lessons on power, cruelty, adaptability and why idealism often fails in reality.', url: 'https://www.youtube.com/watch?v=jU0ydXfieGA' },
  ],
  'TV Show': [
    { t: 'Breaking Bad Ending Explained, Part 1: Did Walt Win or Lose?', ch: 'The Take', d: 'Deep analysis of Walter White’s fate and the cost of his empire.', url: 'https://www.youtube.com/watch?v=o4VIdIKI7RY' },
  ],
  'Anime': [
    { t: 'A Life Worth Living - Vagabond', ch: 'The Masked Man', d: 'Beautiful breakdown of the farm arc and Musashi’s journey toward meaning.', url: 'https://www.youtube.com/watch?v=ThOgXitJXW0' },
  ],
  'Science': [
    { t: 'How Enceladus Shocked NASA Scientists', ch: 'Science Space', d: 'Saturn’s fascinating moon and its potential for life.', url: 'https://www.youtube.com/watch?v=Y35LTzFB-2E' },
  ],
  'AI': [
    { t: 'AI Slop Is Destroying The Internet', ch: 'Kurzgesagt – In a Nutshell', d: 'How AI-generated content is flooding and degrading the web.', url: 'https://www.youtube.com/watch?v=_zfN9wnPvU0' },
  ],
  'History': [
    { t: 'Chernobyl – How The World Became A Risk Society', ch: 'History Analysis', d: 'Analysis of the disaster and modern risk society.', url: 'https://www.youtube.com/watch?v=Y21TGmzHHjk' },
  ],
  'Video Games': [
    { t: 'Top 20 Video Game Stories of All Time', ch: 'Max Derrat', d: 'In-depth ranking of the greatest narratives in gaming.', url: 'https://www.youtube.com/watch?v=I1gVNpCEqYQ' },
  ],
  'Evolution': [
    { t: 'The Evolution of Absolutely Everything', ch: 'Curious Archive', d: 'Wild, philosophical journey through life, memes, and culture.', url: 'https://www.youtube.com/watch?v=xWfHyEyRXcU' },
  ],
  'Religion': [
    { t: 'Why Some People Turn to Religion (and Others Don\'t)', ch: 'A Dose of Reason', d: 'Psychology behind religious belief and deconversion.', url: 'https://www.youtube.com/watch?v=02x9Hquuqhg' },
  ],
  'Economy': [
    { t: 'How do we create a better economy?', ch: 'TED-Ed', d: 'Doughnut Economics — balancing human needs with planetary limits.', url: 'https://www.youtube.com/watch?v=6MK6tuZ7Rws' },
  ],
  'Morality': [
    { t: 'What is Morality?', ch: 'Aperture', d: 'Exploration of how morality evolved and functions in society.', url: 'https://www.youtube.com/watch?v=qIZmSO2TVuw&t=236s' },
  ],
  'Christianity': [
    { t: 'Is it God - AND - OR - VERSUS - Science?', ch: 'IMBeggar', d: 'Can faith and science coexist? Excellent exploration.', url: 'https://www.youtube.com/watch?v=dxA-gdq_LUs' },

  ],
  'Politics': [
    { t: 'The Liberalism to Fascism Pipeline (Neoliberalism Explained)', ch: 'overzealots', d: 'Deep dive into how economic and political shifts shape modern society.', url: 'https://www.youtube.com/watch?v=i8F5FgernVY' },
  ],
  'Hacking': [
    { t: 'How HACKING Really Works (And How You Can Learn It)', ch: 'Hack Only Evil', d: 'Realistic explanation of hacking from recon to exploitation.', url: 'https://www.youtube.com/watch?v=qkFYqY3vr84' },
  ],
  'Coding': [
    { t: 'coding is easy, actually', ch: 'easy, actually', d: 'Motivational and practical advice on how to actually start and succeed at coding.', url: 'https://www.youtube.com/watch?v=9RJpIqD8MGg' },
  ],
  'Money': [
    { t: 'Escaping the Rat Race: What School Failed to Teach You About Money', ch: 'James Jani', d: 'Excellent breakdown of production vs consumption and breaking the money trap.', url: 'https://www.youtube.com/watch?v=j_m7_rrTSxI' },
  ],
  'Football': [
    { t: 'The Disgraces of World Cup Qatar 2022', ch: 'Maqwell', d: 'Corruption, human rights, and the dark side behind the tournament.', url: 'https://www.youtube.com/watch?v=j_m7_rrTSxI' },  // Note: You didn't provide a specific link for Football this time — let me know if you have one!
  ],
  'Psychology': [
    { t: 'Sympathy for the Villain', ch: 'Psychology Analysis', d: 'Why audiences connect with adversarial characters.', url: 'https://www.youtube.com/watch?v=YzfUj-m2I6I' },
  ],
};

export const CATS = Object.keys(YOUTUBE_DATA);

// ── MOTIVATIONAL TIPS ──
export const MOTIVATION_TIPS = [
  "Discipline is choosing between what you want now and what you want most.",
  "The man who moves a mountain begins by carrying away small stones.",
  "Your future self is watching you right now through memories.",
  "Every expert was once a beginner. Every pro was once an amateur.",
  "Pain is temporary. Quitting lasts forever.",
  "Fall seven times, stand up eight.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Small daily improvements over time lead to stunning results.",
  "You don't have to be extreme, just consistent.",
  "The only person you are destined to become is the person you decide to be.",
];
