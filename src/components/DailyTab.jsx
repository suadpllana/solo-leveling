import { useMemo, useRef, useState } from "react";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const startDate = new Date("2026-05-09T00:00:00");
const endDate = new Date("2026-06-01T00:00:00");

// Episode durations in minutes per show (for relax/TV block end-time calculation)
const SHOW_EP_DURATIONS = {
  "Chernobyl":        65,
  "Cowboy Bebop":     24,
  "FMAB":             24,
  "Better Call Saul": 47,
};

const ALL_DAY_TASK_IDS = ['water', 'nofap'];

const dates = [];
for (let current = new Date(startDate); current <= endDate; current.setDate(current.getDate() + 1)) {
  dates.push(new Date(current));
}

const weekendDates = dates.filter((date) => date.getDay() === 0 || date.getDay() === 6);

const BOOK_PLAN = [
  { startDay: 0, endDay: 5, title: 'Read "Jam Mysliman"', total: 12, unit: "Ch." },
  { startDay: 6, endDay: 12, title: 'Read "The Prince"', total: 26, unit: "Ch." },
  { startDay: 13, endDay: 16, title: 'Read "Animal Farm"', total: 10, unit: "Ch." },
  { startDay: 17, endDay: 23, title: 'Read Book of Choice', total: 24, unit: "Ch." },
];

const SHOW_PLAN = [
  { startDay: 0, endDay: 6, title: "Cowboy Bebop", total: 26, unit: "Eps" },
  { startDay: 7, endDay: 8, title: "Chernobyl", total: 5, unit: "Eps" },
  { startDay: 9, endDay: 16, title: "FMAB", total: 64, unit: "Eps" },
  { startDay: 17, endDay: 23, title: "Better Call Saul", total: 63, unit: "Eps" },
];

const GAME_PLAN = [
  { startDay: 0, endDay: 8, title: "Assassin's Creed Origins" },
  { startDay: 9, endDay: 15, title: "Ghost of Tsushima" },
  { startDay: 16, endDay: 18, title: "Batman: Arkham City" },
  { startDay: 19, endDay: 21, title: "Batman: Arkham Knight" },
  { startDay: 22, endDay: 23, title: "CS2 / Free Play" },
];

const WEEKEND_MOVIES = [
  'Watch "Europa: The Last Battle" (Part 1)',
  'Watch "Europa: The Last Battle" (Part 2)',
  'Watch "Europa: The Last Battle" (Part 3)',
  'Watch "Planet Earth 1" (Eps 1-3)',
  'Watch "Planet Earth 1" (Eps 4-6)',
  'Watch "The Social Dilemma"',
  'Watch "Europa: The Last Battle" (Part 4)',
  'Watch "Europa: The Last Battle" (Part 5)',
  'Watch "Planet Earth 1" (Eps 7-9)',
  'Watch "Planet Earth 1" (Eps 10-11)',
];

const WEEKEND_PURCHASES = [
  "Research: CD Albums vs Vinyl",
  "Buy a CD Album purely for the music",
  "Research: Dimensions for Wall Mirrors",
  "Purchase the Wall Mirror",
  "Compare Attack on Titan Posters",
  "Buy Attack on Titan Poster",
  "Review remaining budget",
  "Savings optimization",
  "Plan future buys safely",
  "Finalize all planned purchases",
];

const WEEKEND_HUSTLES = [
  "Money: Brainstorm 3 side-hustle ideas",
  "Money: Setup Upwork / Profile",
  "Money: Research high-income skills",
  "Money: Send 15 cold DMs/Emails",
  "Money: Post freelance services online",
  "Money: Follow up on previous leads",
  "Money: Work on digital product / skill",
  "Money: Apply to 5 quick gigs",
  "Money: Cash out / Review earnings",
  "Money: Final push to hit $400 goal!",
];

// One Quest film per Monday with exact durations
const MONDAY_FILMS = [
  { title: '"Harakiri" (1962)', duration: 133 },
  { title: '"Come and See" (1985)', duration: 142 },
  { title: '"The Silence of the Lambs" (1991)', duration: 118 },
  { title: '"Oppenheimer" (2023)', duration: 180 },
  { title: '"Incendies" (2010)', duration: 131 },
];

const SKILL_ROTATION = [
  {
    name: "CS2: Aim Training & Deathmatch (30m)",
    tip: 'Open Aim Lab - do "Gridshot" and "Microshot" for 10 mins. Then CS2 deathmatch for 20 mins. Focus on crosshair placement before moving, not kill count.',
  },
  {
    name: "Chess: Puzzles + Rapid Game (30m)",
    tip: "Open chess.com. Do 15 tactics puzzles first, then play one 10+0 rapid game. After: review every blunder with the engine and study one opening line.",
  },
  {
    name: "EA FC 26: Skill & Game Study (30m)",
    tip: "Arena first: drill 3 skill moves until automatic. Then play 1 ranked match and review one goal you conceded.",
  },
  {
    name: "Ping Pong: Technique Drills (30m)",
    tip: 'Watch one technique video (search "forehand loop tutorial"), then drill 10 mins forehand topspin, 10 mins backhand push, and 10 mins serve variation.',
  },
];

const MONDAY_SHIFT_MINUTES = 40;
const MONDAY_SHIFTED_TASK_IDS = [
  "wake_up",
  "prayer",
  "meditate",
  "stretch",
  "looksmax",
  "work",
  "water",
  "exercise",
  "yt_vid",
  "mastery",
  "game_time",
  "relax",
  "stoic",
  "read_book",
  "sleep",
];

function normalizeDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function clampDate(date) {
  const normalized = normalizeDate(date);
  if (normalized < startDate) {
    return new Date(startDate);
  }
  if (normalized > endDate) {
    return new Date(endDate);
  }
  return normalized;
}

function allocateRange(total, slots, index) {
  const start = Math.floor((index * total) / slots) + 1;
  const end = Math.min(total, Math.floor(((index + 1) * total) / slots));
  return { start, end };
}

function buildSegmentTitle(dayIndex, plan) {
  const segment = plan.find(({ startDay, endDay }) => dayIndex >= startDay && dayIndex <= endDay) ?? plan[plan.length - 1];
  const slotIndex = dayIndex - segment.startDay;
  const slotCount = segment.endDay - segment.startDay + 1;
  const { start, end } = allocateRange(segment.total, slotCount, slotIndex);
  return `${segment.title} (${segment.unit} ${start}${end > start ? `-${end}` : ""})`;
}

function shiftClock(timeValue, shiftMinutes) {
  const [hours, minutes] = timeValue.split(":").map(Number);
  const totalMinutes = ((hours * 60) + minutes + shiftMinutes + (24 * 60)) % (24 * 60);
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
}

function shiftTimeRange(range, shiftMinutes) {
  if (!range.includes(":")) {
    return range;
  }

  if (!range.includes(" - ")) {
    return shiftClock(range, shiftMinutes);
  }

  const [start, end] = range.split(" - ");
  return `${shiftClock(start, shiftMinutes)} - ${shiftClock(end, shiftMinutes)}`;
}

export default function DailyTab({tasks,weekendTasks,completed,missed,onComplete,onUndo,onCompleteSub,onUndoSub,quotes,expanded,setExpanded}){
  const [qIdx, setQIdx] = useState(0);
  const [selectedDateObj, setSelectedDateObj] = useState(() => clampDate(new Date()));

  const isToday = normalizeDate(new Date()).getTime() === selectedDateObj.getTime();

  // Dynamic content logic based on selected date
  const dayOverrides = useMemo(() => {
    const dayIndex = Math.max(0, Math.floor((selectedDateObj.getTime() - startDate.getTime()) / MS_PER_DAY));
    const day = selectedDateObj.getDay();
    const isWeekend = day === 0 || day === 6;
    const weekendIdx = weekendDates.findIndex((date) => date.getTime() === selectedDateObj.getTime());

    const bookTitle = buildSegmentTitle(dayIndex, BOOK_PLAN);
    const tvTitle = buildSegmentTitle(dayIndex, SHOW_PLAN);

    // Calculate realistic TV block duration based on episodes × show duration
    const tvSegment = SHOW_PLAN.find(({ startDay, endDay }) => dayIndex >= startDay && dayIndex <= endDay) ?? SHOW_PLAN[SHOW_PLAN.length - 1];
    const tvEpDuration = SHOW_EP_DURATIONS[tvSegment.title] ?? 45;
    const tvSlotCount = tvSegment.endDay - tvSegment.startDay + 1;
    const tvSlotIndex = dayIndex - tvSegment.startDay;
    const { start: tvEpStart, end: tvEpEnd } = allocateRange(tvSegment.total, tvSlotCount, tvSlotIndex);
    const tvEpCount = Math.max(1, tvEpEnd - tvEpStart + 1);
    const tvBlockMinutes = tvEpCount * tvEpDuration;
    // relax start = 20:30 → compute end
    const RELAX_START_MINUTES = 20 * 60 + 30;
    const relaxEndMinutes = (RELAX_START_MINUTES + tvBlockMinutes) % (24 * 60);
    const relaxEndStr = `${String(Math.floor(relaxEndMinutes / 60)).padStart(2,'0')}:${String(relaxEndMinutes % 60).padStart(2,'0')}`;
    const relaxTimeStr = `20:30 - ${relaxEndStr}`;

    // -- 3. Games (Calculated exact days to finish each game) --
    const gameSegment = GAME_PLAN.find(({ startDay, endDay }) => dayIndex >= startDay && dayIndex <= endDay) || GAME_PLAN[GAME_PLAN.length - 1];
    const gameSlotCount = gameSegment.endDay - gameSegment.startDay + 1;
    const gameSlotIndex = dayIndex - gameSegment.startDay + 1;
    const gameTitle = `Play ${gameSegment.title} (Part ${gameSlotIndex}/${gameSlotCount})`;

    const movieTitle = WEEKEND_MOVIES[Math.max(0, weekendIdx)] || "Movie / Doc";
    const buyTitle = WEEKEND_PURCHASES[Math.max(0, weekendIdx)] || "Research / Buy";
    const hustleTitle = WEEKEND_HUSTLES[Math.max(0, weekendIdx)] || "Make $400";

    // Dynamic Challenge Injection
    let wakeTitle = "Wake Up";
    let wakeTip = "No snooze. Out of bed immediately. Win the first battle.";

    let workTip = "Execute job duties perfectly. Do not check social media.";
    if (dayIndex >= 7 && dayIndex < 10) {
      workTip = `Day ${dayIndex - 6}/3 of No Social Media Challenge. Focus deeply.`;
    }

    const workoutTitle = "Workout";
    const ALL_CATEGORIES = [
      "CS2", "War", "Books", "TV Show", "Anime", "Science", "AI", "History", 
      "Video Games", "Evolution", "Religion", "Economy", "Morality", 
      "Christianity", "Politics", "Hacking", "Coding", "Money", 
      "Football", "Music", "Psychology"
    ];
    const knowledgeTitle = dayIndex < ALL_CATEGORIES.length 
      ? `Learn: ${ALL_CATEGORIES[dayIndex]}`
      : "Watch an educational yt video";

    // Common Overrides
    const overrides = {
      wake_up: { name: wakeTitle, tip: wakeTip, time: "07:10 - 07:15" },
      prayer: { name: "Morning Prayer", tip: "Destroy the need for comfort. Pray for endurance.", time: "07:15 - 07:20" },
      meditate: { name: "Meditate", tip: "Box breathing to steady the mind. Total silence.", time: "07:20 - 07:25" },
      stretch: { name: "Morning Stretch", tip: "5 mins of targeted neck and spine mobility.", time: "07:25 - 07:30" },
      looksmax: { name: "Looksmax Routine", tip: "Facial aesthetics, skin care, hair optimization.", time: "07:30 - 08:00" },
      water: { name: "2L of Water", tip: "Start with 500ml before coffee. Set phone reminders every 2 hours.", time: "All day" },
      exercise: { name: workoutTitle, tip: "Focus intensively on the targeted muscle block.", time: "17:30 - 18:00" },
      yt_vid: { name: knowledgeTitle, tip: "Watch 1 educational video from the tab.", time: "18:00 - 18:30" },
      mastery: {
        name: SKILL_ROTATION[dayIndex % SKILL_ROTATION.length].name,
        tip: SKILL_ROTATION[dayIndex % SKILL_ROTATION.length].tip,
        time: "18:30 - 19:00",
      },
      game_time: { name: gameTitle, tip: "1.5 hours of focused gameplay. Execute your playstyle intention for today.", time: "19:00 - 20:30" },
      relax: { name: tvTitle, tip: "Analyze the character progression and story.", time: relaxTimeStr },
      nofap: { name: "NoFap", tip: "Every day of abstinence compounds. Redirect the energy into your goals.", time: "All day" },
      stoic: { name: "Stoic Quote & Reflection", tip: "Read daily quote. Log a 1-sentence thought in journal.", time: "22:30 - 22:40" },
      read_book: { name: bookTitle, tip: "No screens. Read and highlight the text.", time: "22:40 - 23:10" },
      sleep: { name: "Sleep", tip: "Total darkness, cold room. Recover.", time: "23:10" },
      // Weekend specifics
      wk_money: { name: hustleTitle, tip: "Work explicitly on earning your $400 goal.", time: "13:30 - 15:30" },
      wk_buy: { name: buyTitle, tip: "Look up specs, read reviews, check the budget.", time: "15:30 - 16:30" },
      wk_movie: { name: movieTitle, tip: "No phone allowed. Full cinematic immersion.", time: "17:30 - 20:00" },
    };

    if (day === 1) { // MONDAY
      overrides.wake_up.time  = "07:50 - 07:55";
      overrides.prayer.time   = "07:55 - 08:00";
      overrides.meditate.time = "08:00 - 08:05";
      overrides.stretch.time  = "08:05 - 08:10";
      overrides.looksmax.time = "08:10 - 08:40";
      overrides.work          = { name: "Remote Work (Deep Focus)", tip: workTip, time: "08:40 - 10:40" };
      overrides.exercise.time  = "10:40 - 11:10";
      overrides.yt_vid.time    = "11:10 - 11:40";
      overrides.mastery.time   = "11:40 - 12:10";
      overrides.game_time.time = "12:10 - 13:40";
      overrides.relax.name    = `${tvTitle}`;
      overrides.relax.tip     = "Watch your daily episode. Analyze the character progression and story.";
      overrides.relax.time    = "13:40 - 14:45";
      
      const mondayIdx = Math.floor(dayIndex / 7);
      const monFilmObj = MONDAY_FILMS[Math.min(MONDAY_FILMS.length - 1, mondayIdx)] || { title: "a Movie" };
      overrides.wk_movie = { name: `Watch ${monFilmObj.title}`, tip: "Full cinematic immersion. No phone allowed.", time: "14:45 - 17:00" };
      overrides.wk_money = { name: "Free Time & Relax", tip: "Enjoy the rest of your evening. Go out, chill, or work on side projects.", time: "17:00 - 22:30" };
      overrides.stoic.time     = "22:30 - 22:40";
      overrides.read_book.time = "22:40 - 23:10";
      overrides.sleep.time     = "23:30";

    } else if (isWeekend) { // WEEKEND
      overrides.wake_up.time  = "13:00 - 13:05";
      overrides.prayer.time   = "13:05 - 13:10";
      overrides.meditate.time = "13:10 - 13:15";
      overrides.stretch.time  = "13:15 - 13:20";
      overrides.looksmax.time = "13:20 - 13:45";
      
      overrides.wk_money = { name: "Side Hustle Ideas", tip: "Spend time explicitly on side hustle brainstorming and execution.", time: "13:45 - 14:45" };
      overrides.exercise.time = "14:45 - 15:15";
      
      overrides.wk_buy = { name: "Relax - Football or something", tip: "Decompress. Watch a football match or just relax.", time: "15:15 - 18:00" };
      overrides.mastery.time  = "18:00 - 18:30";
      overrides.game_time.time = "18:30 - 20:00";
      overrides.yt_vid.time   = "20:00 - 20:30";
      
      overrides.relax.name = "Watch Football";
      overrides.relax.tip = "Enjoy the match.";
      overrides.relax.time = "20:30 - 23:00";
      
      overrides.wk_movie = { name: movieTitle, tip: "No phone allowed. Full cinematic immersion.", time: "23:00 - 01:00" };
      overrides.stoic.time    = "01:00 - 01:10";
      overrides.read_book.time = "01:10 - 01:40";
      overrides.sleep.time    = "01:40";
      overrides.work          = { name: "Off Day", tip: "Off work.", time: "Off" };

    } else { // TUE–FRI
      overrides.wake_up.time  = "07:10 - 07:15";
      overrides.prayer.time   = "07:15 - 07:20";
      overrides.meditate.time = "07:20 - 07:25";
      overrides.stretch.time  = "07:25 - 07:30";
      overrides.looksmax.time = "07:30 - 08:00";
      overrides.work = { name: "At Work", tip: workTip, time: "08:00 - 17:00" };
      overrides.exercise.time  = "17:30 - 18:00";
      overrides.yt_vid.time    = "18:00 - 18:30";
      overrides.mastery.time   = "18:30 - 19:00";
      overrides.game_time.time = "19:00 - 20:30";
      overrides.relax.time     = "20:30 - 22:30";
      overrides.stoic.time     = "22:30 - 22:40";
      overrides.read_book.time = "22:40 - 23:10";
      overrides.sleep.time     = "23:30";
    }
    
    return overrides;
  }, [selectedDateObj]);

  // Map the overridden configurations to the rendering list
  // Keep water & nofap always at the bottom (All day tasks)
  const dynamicTasks = (() => {
    let baseTasks = tasks;
    if (selectedDateObj.getDay() === 1 && weekendTasks) {
       const wkMovie = weekendTasks.find(t => t.id === 'wk_movie');
       const wkMoney = weekendTasks.find(t => t.id === 'wk_money'); // Hijacked for Monday Free Time
       if (wkMovie) baseTasks = [...baseTasks, wkMovie];
       if (wkMoney) baseTasks = [...baseTasks, wkMoney];
    } else if ((selectedDateObj.getDay() === 0 || selectedDateObj.getDay() === 6) && weekendTasks) {
       const wkMovie = weekendTasks.find(t => t.id === 'wk_movie');
       const wkMoney = weekendTasks.find(t => t.id === 'wk_money');
       const wkBuy = weekendTasks.find(t => t.id === 'wk_buy');
       if (wkMovie) baseTasks = [...baseTasks, wkMovie];
       if (wkMoney) baseTasks = [...baseTasks, wkMoney];
       if (wkBuy) baseTasks = [...baseTasks, wkBuy];
    }
    const mapped = baseTasks.map(t => {
      const o = dayOverrides[t.id];
      return o ? { ...t, name: o.name, tip: o.tip, time: o.time } : t;
    }).filter(t => t.name !== "Off Day");
    const timed = mapped.filter(t => !ALL_DAY_TASK_IDS.includes(t.id));
    const allDay = mapped.filter(t => ALL_DAY_TASK_IDS.includes(t.id));
    
    // Sort timed tasks chronologically
    timed.sort((a, b) => {
      const parseTime = (str) => {
        const match = str.match(/(\d{2}):(\d{2})/);
        if (!match) return 0;
        let h = parseInt(match[1], 10);
        if (h < 5) h += 24; // shift past midnight for sorting
        return h * 60 + parseInt(match[2], 10);
      };
      return parseTime(a.time) - parseTime(b.time);
    });

    return [...timed, ...allDay];
  })();

  const done=dynamicTasks.filter(t=>completed[t.id]).length;
  const isStoicDone = completed['stoic'];
  const pct = Math.round((done/dynamicTasks.length)*100);

  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return(
    <div>
      {/* Date Picker Ribbon */}
      <div style={{display:'flex', alignItems:'center', gap:4, marginBottom:20}}>
        <button onClick={scrollLeft} style={{background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-subtle)', borderRadius:'50%', width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-secondary)', cursor:'pointer', flexShrink:0}}>
          &lt;
        </button>
        <div ref={scrollContainerRef} style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:8,scrollbarWidth:'none', flex: 1}}>
          {dates.map(date => {
            const isSelected = date.getTime() === selectedDateObj.getTime();
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDateObj(new Date(date))}
                style={{
                  flex:'0 0 auto',
                  padding:'10px 14px',
                  background:isSelected ? 'var(--bg-card)' : 'transparent',
                  border:isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                  borderRadius:12,
                  color:isSelected ? 'var(--accent-blue)' : 'var(--text-tertiary)',
                  textAlign:'center',
                  transition:'all 0.2s',
                  minWidth: 55
                }}
              >
                <div style={{fontSize:9,fontWeight:800,textTransform:'uppercase',marginBottom:4}}>{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                <div style={{fontSize:14,fontWeight:900}}>{date.getDate()}</div>
              </button>
            )
          })}
        </div>
        <button onClick={scrollRight} style={{background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-subtle)', borderRadius:'50%', width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-secondary)', cursor:'pointer', flexShrink:0}}>
          &gt;
        </button>
      </div>

      {/* Progress Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div>
          <div style={{fontSize:9,color:'var(--text-tertiary)',letterSpacing:'0.08em',textTransform:'uppercase',fontWeight:700}}>DAILY MISSIONS</div>
          <div style={{fontSize:12,color:'var(--text-secondary)',marginTop:2}}>{done} of {tasks.length} complete</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:50,height:50,position:'relative'}}>
            <svg width={50} height={50}>
              <circle cx={25} cy={25} r={20} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={4} />
              <circle cx={25} cy={25} r={20} fill="none" stroke="var(--accent-cyan)" strokeWidth={4}
                strokeDasharray={125.6} strokeDashoffset={125.6-(pct/100)*125.6} strokeLinecap="round"
                style={{transition:'stroke-dashoffset 1s ease',transform:'rotate(-90deg)',transformOrigin:'50% 50%'}}
              />
            </svg>
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span className="number-display" style={{fontSize:12,fontWeight:900,color:'var(--accent-cyan)'}}>{pct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stoic Quote Card */}
      <div className="glass-card" style={{padding:'16px 18px',marginBottom:14,borderLeft:'3px solid var(--accent-purple)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div style={{fontSize:9,letterSpacing:'0.08em',color:'var(--accent-purple)',fontWeight:700,textTransform:'uppercase'}}>
            📜 STOIC MANDATE ({qIdx+1}/10)
          </div>
          {isStoicDone && <span className="badge badge-done">✓ DONE</span>}
        </div>
        <div style={{fontSize:14,color:'var(--text-secondary)',fontStyle:'italic',lineHeight:1.75,minHeight:45}}>"{quotes[qIdx].q}"</div>
        <div style={{fontSize:11,color:'var(--accent-purple)',marginTop:8,fontWeight:600}}>— {quotes[qIdx].a}</div>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:14}}>
          <div>
            {qIdx > 0 && <button className="btn btn-ghost" onClick={()=>setQIdx(p=>p-1)} style={{padding:'5px 12px',fontSize:10}}>← PREV</button>}
          </div>
          <div>
            {qIdx < 9 ? (
              <button className="btn btn-ghost" onClick={()=>setQIdx(p=>p+1)} style={{padding:'5px 12px',fontSize:10,borderColor:'rgba(139,92,246,0.3)',color:'var(--accent-purple)'}}>NEXT →</button>
            ) : (
              !isStoicDone && <button className="btn" onClick={()=>{
                if(isToday) onComplete('stoic');
                else alert("You can only complete tasks for today!");
              }} style={{background:'rgba(52,211,153,0.1)',border:'1px solid rgba(52,211,153,0.3)',color:'var(--accent-green)',padding:'5px 14px',fontSize:10,borderRadius:8,fontWeight:800,letterSpacing:'0.06em', opacity: isToday ? 1 : 0.4}}>MARK DONE</button>
            )}
          </div>
        </div>
      </div>

      {missed.length>0&&(
        <div style={{background:'rgba(248,113,113,0.04)',border:'1px solid rgba(248,113,113,0.1)',borderRadius:12,padding:'10px 14px',marginBottom:12,fontSize:12,color:'rgba(248,113,113,0.7)',lineHeight:1.5}}>
          ⚠ {missed.length} carried-over task{missed.length>1?'s':''} — complete them today for recovery XP
        </div>
      )}

      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {dynamicTasks.map(task=>{
          const isDone=completed[task.id];
          const isMissed=missed.includes(task.id);
          const isExp=expanded===task.id;
          return(
            <div key={task.id} className="task-item" style={{
              background:isDone?'rgba(52,211,153,0.04)':isMissed?'rgba(248,113,113,0.04)':'var(--bg-card)',
              border:`1px solid ${isDone?'rgba(52,211,153,0.12)':isMissed?'rgba(248,113,113,0.12)':'var(--border-subtle)'}`,
              borderRadius:14,overflow:'hidden',transition:'all 0.25s',cursor:'pointer'
            }} onClick={()=>setExpanded(isExp?null:task.id)}>
              <div style={{display:'flex',alignItems:'center',gap:12,padding:'13px 14px'}}>
                <div style={{
                  width:40,height:40,borderRadius:10,
                  background:isDone?'rgba(52,211,153,0.1)':'rgba(255,255,255,0.03)',
                  border:`1px solid ${isDone?'rgba(52,211,153,0.2)':'var(--border-subtle)'}`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:20,flexShrink:0
                }}>{task.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                    <span style={{fontWeight:700,fontSize:14,color:isDone?'var(--accent-green)':isMissed?'rgba(248,113,113,0.8)':'var(--text-primary)',textDecoration:isDone?'line-through':'none'}}>{task.name}</span>
                    {isMissed&&!isDone&&<span className="badge badge-missed" style={{fontSize:8}}>MISSED</span>}
                  </div>
                  <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:3}}>
                    🕐 {task.time} • <span style={{color:'rgba(251,191,36,0.5)'}}>+{task.xp} XP</span>
                  </div>
                </div>
                <div style={{transition:'transform 0.25s ease',transform:isExp?'rotate(180deg)':'rotate(0deg)',color:'var(--text-muted)',fontSize:10,marginRight:4}}>▼</div>
                {!isDone&&(
                  <button className="btn btn-done" onClick={e=>{
                    e.stopPropagation();
                    if (isToday) onComplete(task.id);
                    else alert("You can only complete tasks for today!");
                  }} style={{ opacity: isToday ? 1 : 0.4 }}>
                    DONE
                  </button>
                )}
                {isDone&&(
                  <div style={{display:'flex', alignItems:'center', gap: 12}}>
                    <button className="btn" onClick={e=>{
                      e.stopPropagation(); 
                      if (isToday && onUndo) onUndo(task.id);
                      else if (!isToday) alert("You can only undo tasks for today!");
                    }} style={{background:'transparent', color:'var(--accent-red)', border:'1px solid rgba(248,113,113,0.3)', padding:'4px 8px', fontSize:10, borderRadius:6, opacity: isToday ? 1 : 0.4}}>
                      UNDO
                    </button>
                    <span style={{color:'var(--accent-green)',fontSize:22}}>✓</span>
                  </div>
                )}
              </div>
              {isExp&&(
                <div style={{padding:'0 14px 14px',borderTop:'1px solid var(--border-subtle)'}}>
                  <div style={{paddingTop:12,fontSize:13,color:'var(--text-secondary)',lineHeight:1.8}}>{task.tip}</div>
                  {task.subTasks && (
                    <div style={{marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6}}>
                      {task.subTasks.map((sub, index) => {
                        const subDone = completed[sub.id];
                        const baseSubXp = Math.floor(task.xp / task.subTasks.length);
                        const rem = task.xp % task.subTasks.length;
                        const subXp = index < rem ? baseSubXp + 1 : baseSubXp;

                        return (
                          <div key={sub.id} onClick={(e) => { 
                            e.stopPropagation(); 
                            if(!subDone) { onCompleteSub(sub.id, subXp, sub.n); }
                            else { if(onUndoSub) onUndoSub(sub.id, subXp, sub.n); }
                          }} style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                            background: subDone ? 'rgba(52,211,153,0.04)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${subDone ? 'rgba(52,211,153,0.15)' : 'var(--border-subtle)'}`,
                            borderRadius: 10, cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}>
                            <div style={{
                              width: 18, height: 18, borderRadius: 5,
                              border: `2px solid ${subDone ? 'var(--accent-green)' : 'var(--text-muted)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: subDone ? 'var(--accent-green)' : 'transparent',
                              transition: 'all 0.2s'
                            }}>
                              {subDone && <span style={{color: '#000', fontSize: 11, fontWeight: 900}}>✓</span>}
                            </div>
                            <span style={{fontSize: 13, color: subDone ? 'var(--accent-green)' : 'var(--text-secondary)', textDecoration: subDone ? 'line-through' : 'none', flex:1}}>{sub.n}</span>
                            {!subDone && <span style={{fontSize: 10, color: 'rgba(251,191,36,0.4)'}}>+{subXp} XP</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>


    </div>
  );
}
