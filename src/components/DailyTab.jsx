import { useState, useMemo, useRef } from "react";

const startDate = new Date("2026-04-27T00:00:00");
const endDate = new Date("2026-06-01T00:00:00");

// Generate dates between start and end
const dates = [];
let cd = new Date(startDate);
while (cd <= endDate) {
  dates.push(new Date(cd));
  cd.setDate(cd.getDate() + 1);
}

export default function DailyTab({tasks,weekendTasks,completed,missed,onComplete,onUndo,onCompleteSub,onUndoSub,quotes,expanded,setExpanded}){
  const [qIdx, setQIdx] = useState(0);
  const [selectedDateObj, setSelectedDateObj] = useState(() => {
    const today = new Date();
    return today < startDate ? startDate : today;
  });

  const isToday = new Date().toDateString() === selectedDateObj.toDateString();

  // Dynamic content logic based on selected date
  const dayOverrides = useMemo(() => {
    const diffTime = selectedDateObj.getTime() - startDate.getTime();
    const dayIndex = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    const day = selectedDateObj.getDay();

    // -- 1. Books (48 chapters total across 36 days) --
    let bookTitle = "";
    if (dayIndex <= 8) { // 9 days for Jam Mysliman (12 chars)
      const ch1 = Math.floor(dayIndex * (12/9)) + 1;
      const ch2 = Math.min(12, Math.floor((dayIndex + 1) * (12/9)));
      bookTitle = `Read "Jam Mysliman" (Ch. ${ch1}${ch2 > ch1 ? `-${ch2}` : ''})`;
    } else if (dayIndex <= 15) { // 7 days for Animal Farm (10 chars)
      const d = dayIndex - 9;
      const ch1 = Math.floor(d * (10/7)) + 1;
      const ch2 = Math.min(10, Math.floor((d + 1) * (10/7)));
      bookTitle = `Read "Animal Farm" (Ch. ${ch1}${ch2 > ch1 ? `-${ch2}` : ''})`;
    } else { // 20 days for The Prince (26 chars)
      const d = dayIndex - 16;
      const ch1 = Math.floor(d * (26/20)) + 1;
      const ch2 = Math.min(26, Math.floor((d + 1) * (26/20)));
      bookTitle = `Read "The Prince" (Ch. ${ch1}${ch2 > ch1 ? `-${ch2}` : ''})`;
    }

    // -- 2. TV Shows & Anime (244 episodes total across 36 days) --
    let tvTitle = "";
    if (dayIndex <= 2) { // 3 days for Chernobyl (5 eps)
      const d = dayIndex;
      const ep1 = Math.floor(d * (5/3)) + 1;
      const ep2 = Math.min(5, Math.floor((d + 1) * (5/3)));
      tvTitle = `Chernobyl (Eps ${ep1}${ep2 > ep1 ? `-${ep2}` : ''})`;
    } else if (dayIndex <= 6) { // 4 days for Cowboy Bebop (26 eps)
      const d = dayIndex - 3;
      const ep1 = Math.floor(d * (26/4)) + 1;
      const ep2 = Math.min(26, Math.floor((d + 1) * (26/4)));
      tvTitle = `Cowboy Bebop (Eps ${ep1}${ep2 > ep1 ? `-${ep2}` : ''})`;
    } else if (dayIndex <= 15) { // 9 days for FMAB (64 eps)
      const d = dayIndex - 7;
      const ep1 = Math.floor(d * (64/9)) + 1;
      const ep2 = Math.min(64, Math.floor((d + 1) * (64/9)));
      tvTitle = `FMAB (Eps ${ep1}${ep2 > ep1 ? `-${ep2}` : ''})`;
    } else if (dayIndex <= 25) { // 10 days for Better Call Saul (63 eps)
      const d = dayIndex - 16;
      const ep1 = Math.floor(d * (63/10)) + 1;
      const ep2 = Math.min(63, Math.floor((d + 1) * (63/10)));
      tvTitle = `Better Call Saul (Eps ${ep1}${ep2 > ep1 ? `-${ep2}` : ''})`;
    } else { // 10 days for The Sopranos (86 eps)
      const d = dayIndex - 26;
      const ep1 = Math.floor(d * (86/10)) + 1;
      const ep2 = Math.min(86, Math.floor((d + 1) * (86/10)));
      tvTitle = `The Sopranos (Eps ${ep1}${ep2 > ep1 ? `-${ep2}` : ''})`;
    }

    // -- 3. Games (Split cleanly across the 36 days) --
    let gameTitle = "";
    const gameIdx = Math.floor(dayIndex / 9);
    if (gameIdx === 0) gameTitle = `Play Assassin's Creed Origins (Part ${dayIndex + 1}/9)`;
    else if (gameIdx === 1) gameTitle = `Play Ghost of Tsushima (Part ${dayIndex - 9 + 1}/9)`;
    else if (gameIdx === 2) gameTitle = `Play Batman: Arkham City (Part ${dayIndex - 18 + 1}/9)`;
    else gameTitle = `Play Batman: Arkham Knight (Part ${dayIndex - 27 + 1}/9)`;

    // -- 4. Weekend Specifics (10 weekend days between Apr 27 and Jun 1) --
    // Saturday index mapping: dayIndex 5->0, 6->1, 12->2, 13->3, etc.
    const weekendIdx = Math.floor((dayIndex - 5) / 7) * 2 + (day === 6 ? 0 : 1);
    
    const moviesList = [
      'Watch "American Psycho" (2000)',
      'Watch "Heat" (1995)',
      'Watch "Europa: The Last Battle" (Part 1)',
      'Watch "Europa: The Last Battle" (Part 2)',
      'Watch "Children of Men" (2006)',
      'Watch "Zodiac" (2007)',
      'Watch "Planet Earth 1" (Marathon)',
      'Watch "Prisoners" (2013)',
      'Watch "The Truman Show" (1998)',
      'Watch "The Social Dilemma"'
    ];
    let movieTitle = moviesList[Math.min(9, Math.max(0, weekendIdx))] || "Movie / Doc";

    const buysList = [
      'Research: CD Albums vs Vinyl',
      'Buy a CD Album purely for the music',
      'Research: Dimensions for Wall Mirrors',
      'Purchase the Wall Mirror',
      'Compare Attack on Titan Posters',
      'Buy Attack on Titan Poster',
      'Review remaining budget',
      'Savings optimization',
      'Plan future buys safely',
      'Finalize all planned purchases'
    ];
    let buyTitle = buysList[Math.min(9, Math.max(0, weekendIdx))] || "Research / Buy";

    const hustleList = [
      'Money: Brainstorm 3 side-hustle ideas',
      'Money: Setup Upwork / Profile',
      'Money: Research high-income skills',
      'Money: Send 15 cold DMs/Emails',
      'Money: Post freelance services online',
      'Money: Follow up on previous leads',
      'Money: Work on digital product / skill',
      'Money: Apply to 5 quick gigs',
      'Money: Cash out / Review earnings',
      'Money: Final push to hit $400 goal!'
    ];
    let hustleTitle = hustleList[Math.min(9, Math.max(0, weekendIdx))] || "Make $400";

    // Dynamic Challenge Injection
    let wakeTitle = "Wake Up";
    let wakeTip = "No snooze. Out of bed immediately. Win the first battle.";

    
    let workTip = "Execute job duties perfectly. Do not check social media.";
    if (dayIndex >= 7 && dayIndex < 10) {
      workTip = `Day ${dayIndex - 6}/3 of No Social Media Challenge. Focus deeply.`;
    }

    const workoutTitle = `Workout: ${["Chest & Triceps", "Back & Pullups", "Legs & Squats", "Shoulders & Pike", "Full Body HIIT", "Active Recovery", "Heavy Core"][dayIndex % 7]}`;
    const knowledgeTitle = `Learn: ${["AI & Tech", "Stoicism & Philosophy", "History", "Economy", "Science", "Coding", "Psychology"][dayIndex % 7]}`;

    // Common Overrides
    const overrides = {
      wake_up: { name: wakeTitle, tip: wakeTip, time: "07:10 - 07:15" },
      prayer: { name: "Morning Prayer", tip: "Destroy the need for comfort. Pray for endurance.", time: "07:15 - 07:20" },
      meditate: { name: "Meditate", tip: "Box breathing to steady the mind. Total silence.", time: "07:20 - 07:25" },
      stretch: { name: "Morning Stretch", tip: "5 mins of targeted neck and spine mobility.", time: "07:25 - 07:30" },
      looksmax: { name: "Looksmax Routine", tip: "Facial aesthetics, skin care, hair optimization.", time: "07:30 - 08:00" },
      water: { name: "Hydrate & Breakfast", tip: "Drink 500ml water and consume high protein.", time: "10:00 - 10:30" },
      exercise: { name: workoutTitle, tip: "Focus intensively on the targeted muscle block.", time: "17:30 - 18:00" },
      yt_vid: { name: knowledgeTitle, tip: "Watch 1 educational video from the tab.", time: "18:00 - 18:30" },
mastery: (() => {
  const skillRota = [
    {
      name: 'CS2: Aim Training & Deathmatch (30m)',
      tip: 'Open Aim Lab — do "Gridshot" and "Microshot" for 10 mins. Then CS2 deathmatch for 20 mins. Focus on crosshair placement before moving, not kill count.',
    },
    {
      name: 'Chess: Puzzles + Rapid Game (30m)',
      tip: 'Open chess.com. Do 15 tactics puzzles first (builds pattern recognition fast). Then play one 10+0 rapid game. After: review every blunder with the engine. Study one opening line.',
    },
    {
      name: 'EA FC 26: Skill & Game Study (30m)',
      tip: 'Arena first: drill 3 skill moves (elastico, ball roll, scoop turn) until automatic. Then 1 ranked match. After: rewatch one goal you conceded and identify the defensive mistake.',
    },
    {
      name: 'Ping Pong: Technique Drills (30m)',
      tip: 'Watch one technique video (Tom Lodziak or PingSkills on YouTube — search "forehand loop tutorial"). Then drill: 10 mins forehand topspin, 10 mins backhand push, 10 mins serve variation.',
    },
  ];
  const s = skillRota[dayIndex % 4];
  return { name: s.name, tip: s.tip, time: '18:30 - 19:00' };
})(),
game_time: { name: gameTitle, tip: "1.5 hours of focused gameplay. Execute your playstyle intention for today.", time: "19:00 - 20:30" },      relax: { name: tvTitle, tip: "Analyze the character progression and story.", time: "20:30 - 22:30" },
      nofap: { name: "Free Time / Bonus Tasks", tip: "Use this time to go out, handle errands, or do extra side-hustle tasks.", time: "17:00 - 22:30" },
      stoic: { name: "Stoic Quote & Reflection", tip: "Read daily quote. Log a 1-sentence thought in journal.", time: "22:30 - 22:40" },
      read_book: { name: bookTitle, tip: "No screens. Read and highlight the text.", time: "22:40 - 23:10" },
      sleep: { name: "Sleep", tip: "Total darkness, cold room. Recover.", time: "23:10" },
      // Weekend specifics
      wk_money: { name: hustleTitle, tip: "Work explicitly on earning your $400 goal.", time: "13:30 - 15:30" },
      wk_buy: { name: buyTitle, tip: "Look up specs, read reviews, check the budget.", time: "15:30 - 16:30" },
      wk_movie: { name: movieTitle, tip: "No phone allowed. Full cinematic immersion.", time: "17:30 - 20:00" }
    };

    if (day === 1) { // MONDAY — wake up 07:50 (+40 min shift)
      overrides.wake_up.time = "07:50 - 07:55";
      overrides.prayer.time = "07:55 - 08:00";
      overrides.meditate.time = "08:00 - 08:05";
      overrides.stretch.time = "08:05 - 08:10";
      overrides.looksmax.time = "08:10 - 08:40";
      overrides.water.time = "10:40 - 11:10";
      overrides.work = { name: "Remote Work (Deep Focus)", tip: workTip, time: "08:40 - 10:40" };
      overrides.exercise.time = "11:10 - 12:10";
      overrides.yt_vid.time = "12:40 - 13:40";
      overrides.game_time.time = "13:40 - 15:10";
      overrides.relax.time = "15:10 - 17:10";
    } else if (day === 0 || day === 6) { // WEEKEND — wake up 13:00
      overrides.wake_up.time = "13:00 - 13:05";
      overrides.prayer.time = "13:05 - 13:10";
      overrides.meditate.time = "13:10 - 13:15";
      overrides.looksmax.time = "13:15 - 13:30";
      
      // Inject walking / cooking challenges into the weekend tips
      const isWalkDay = weekendIdx === 2 || weekendIdx === 6; // random weekends
      const isCookDay = weekendIdx === 1 || weekendIdx === 4 || weekendIdx === 8;
      
      overrides.exercise = { 
        name: isWalkDay ? "10,000 Steps Walk" : workoutTitle, 
        tip: isWalkDay ? "Go outside, hit 10k steps minimum. Challenge." : "Intensive muscle group targeting.",
        time: "16:30 - 17:30" 
      };
      if (isCookDay) {
        overrides.relax.name = `Cook Healthy Meal & ${tvTitle}`;
        overrides.relax.tip = "Cook a fully healthy meal from scratch while watching.";
      }
      
      overrides.game_time.time = "20:00 - 21:30";
      overrides.yt_vid.time = "21:30 - 22:30";
      overrides.relax.time = "22:30 - 23:30";
      overrides.work = { name: "Off Day", tip: "Off work.", time: "Off" };
    } else { // WEEKDAY
      overrides.work = { name: "At Work", tip: workTip, time: "08:00 - 17:30" };
    }
    
    return overrides;
  }, [selectedDateObj]);

  // Map the overridden configurations to the rendering list
  const dynamicTasks = tasks.map(t => {
    const o = dayOverrides[t.id];
    return o ? { ...t, name: o.name, tip: o.tip, time: o.time } : t;
  }).filter(t => t.name !== "Off Day");

  const dynamicWeekendTasks = weekendTasks ? weekendTasks.map(t => {
    const o = dayOverrides[t.id];
    return o ? { ...t, name: o.name, tip: o.tip, time: o.time } : t;
  }) : [];

  const done=tasks.filter(t=>completed[t.id]).length;
  const isStoicDone = completed['stoic'];
  const pct = Math.round((done/tasks.length)*100);

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
                onClick={() => setSelectedDateObj(date)}
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
          ⚠ {missed.length} task{missed.length>1?'s':''} missed — complete them today for recovery XP
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
                      {task.subTasks.map(sub => {
                        const subDone = completed[sub.id];
                        return (
                          <div key={sub.id} onClick={(e) => { 
                            e.stopPropagation(); 
                            if(!subDone) { onCompleteSub(sub.id, 20, sub.n); }
                            else { if(onUndoSub) onUndoSub(sub.id, 20, sub.n); }
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
                            {!subDone && <span style={{fontSize: 10, color: 'rgba(251,191,36,0.4)'}}>+20 XP</span>}
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

      {weekendTasks && weekendTasks.length > 0 && (
        <div style={{marginTop:28}}>
          <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:12}}>
            <div style={{fontSize:10,color:'var(--accent-purple)',letterSpacing:'0.08em',fontWeight:700,textTransform:'uppercase'}}>⭐ WEEKEND MISSIONS</div>
            <div style={{flex:1, height: 1, background: 'linear-gradient(90deg, rgba(139,92,246,0.3), transparent)'}}></div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {dynamicWeekendTasks.map(task=>{
              const isDone=completed[task.id];
              const isExp=expanded===task.id;
              return(
                <div key={task.id} className="task-item" style={{
                  background:isDone?'rgba(52,211,153,0.04)':'var(--bg-card)',
                  border:`1px solid ${isDone?'rgba(52,211,153,0.12)':'var(--border-subtle)'}`,
                  borderRadius:14,overflow:'hidden',transition:'all 0.25s',cursor:'pointer'
                }} onClick={()=>setExpanded(isExp?null:task.id)}>
                  <div style={{display:'flex',alignItems:'center',gap:12,padding:'13px 14px'}}>
                    <div style={{
                      width:40,height:40,borderRadius:10,
                      background:isDone?'rgba(52,211,153,0.1)':'rgba(139,92,246,0.06)',
                      border:`1px solid ${isDone?'rgba(52,211,153,0.2)':'rgba(139,92,246,0.15)'}`,
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:20,flexShrink:0
                    }}>{task.icon}</div>
                    <div style={{flex:1}}>
                      <span style={{fontWeight:700,fontSize:14,color:isDone?'var(--accent-green)':'var(--text-primary)',textDecoration:isDone?'line-through':'none'}}>{task.name}</span>
                      <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:3}}>⭐ {task.time} • <span style={{color:'rgba(251,191,36,0.5)'}}>+{task.xp} XP</span></div>
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
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
