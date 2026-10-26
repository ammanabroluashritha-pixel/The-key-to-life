// =====================================================
//  SIDEQUEST - turn adulting into a game
// =====================================================

// ---------- 1. THE DATA ----------
// Each zone has quests. "ages" says who the quest is for: "teen", "adult" or "both"

var zones = [
  {
    name: "🏝️ Money Island", color: "#2fbf85",
    quests: [
      { id: "m1", title: "Make your first budget", xp: 20, ages: "both",
        steps: ["List the money you get each month", "List what you must pay for", "Pick an amount to save", "See what is left to spend"] },
      { id: "m2", title: "Spot a scam message", xp: 15, ages: "both",
        steps: ["Look for scary 'act now' words", "Check who sent it", "Never click strange links", "Delete and report it"] },
      { id: "m3", title: "Open a savings account", xp: 25, ages: "teen",
        steps: ["Ask a parent to come with you", "Compare two banks", "Bring your ID"] },
      { id: "m4", title: "Start building credit", xp: 25, ages: "adult",
        steps: ["Learn what a credit score is", "Check your free credit report", "Pay every bill on time"] }
    ]
  },
  {
    name: "🏙️ Job Town", color: "#ff5c8a",
    quests: [
      { id: "j1", title: "Write a first resume", xp: 25, ages: "both",
        steps: ["Add your contact info", "List school and activities", "Add your skills", "Ask a friend to check it"] },
      { id: "j2", title: "Read a pay stub", xp: 20, ages: "both",
        steps: ["Find gross pay", "Find the taxes taken out", "Find net pay (what you get)"] },
      { id: "j3", title: "Learn your work rights", xp: 20, ages: "teen",
        steps: ["Find the minimum wage", "Learn the hour limits for your age", "Know who to tell if something is wrong"] },
      { id: "j4", title: "Ask for a raise", xp: 30, ages: "adult",
        steps: ["Research the pay range", "Write down 3 reasons you deserve it", "Practice in Script Mode"] }
    ]
  },
  {
    name: "🏫 School City", color: "#4b7bec",
    quests: [
      { id: "s1", title: "Email a teacher or boss", xp: 15, ages: "both",
        steps: ["Write a clear subject line", "Say who you are and what you need", "Say thank you"] },
      { id: "s2", title: "Find scholarships", xp: 25, ages: "teen",
        steps: ["Search 3 scholarship sites", "Write down the deadlines", "Add them to Deadline Radar"] },
      { id: "s3", title: "Understand student loans", xp: 25, ages: "adult",
        steps: ["Learn grant vs loan", "Find your interest rate", "Learn when payments start"] }
    ]
  },
  {
    name: "⛰️ Health Hills", color: "#ffb100",
    quests: [
      { id: "h1", title: "Book your own appointment", xp: 20, ages: "both",
        steps: ["Find a clinic near you", "Practice the call in Script Mode", "Make the call"] },
      { id: "h2", title: "Cook 3 easy meals", xp: 20, ages: "both",
        steps: ["Pick 3 simple recipes", "Make a shopping list", "Cook one this week"] },
      { id: "h3", title: "Understand health insurance", xp: 25, ages: "adult",
        steps: ["Learn premium, deductible and copay", "Find your insurance card", "Check which doctors are in network"] }
    ]
  }
];

// Phone call scripts. "you" lines are what you say, "them" is the other person.
var scripts = [
  {
    title: "📞 Book a doctor's appointment",
    lines: [
      ["you", "Hi, I'd like to make an appointment, please."],
      ["them", "Sure! Are you a new patient?"],
      ["you", "Yes. Do you have anything open next week?"],
      ["them", "We have Tuesday at 3 PM."],
      ["you", "That works, thank you! Do I need to bring anything?"]
    ],
    whatIf: [
      "They have nothing open? Ask: 'Can you put me on a cancellation list?'",
      "They ask for insurance? Say: 'Let me read it off my card.'",
      "You get nervous? Say: 'Sorry, can you repeat that?' Totally fine!"
    ]
  },
  {
    title: "💼 Ask for a job in person",
    lines: [
      ["you", "Hi, I'm Alex. Are you hiring right now?"],
      ["them", "Maybe. What position?"],
      ["you", "I'm interested in a cashier job. I'm reliable and learn fast."],
      ["them", "Do you have a resume?"],
      ["you", "Yes, here it is. Who should I follow up with?"]
    ],
    whatIf: [
      "They say no? Reply: 'Thanks! Can I check back in a few weeks?'",
      "No experience? Talk about school projects, clubs or volunteering."
    ]
  },
  {
    title: "💸 Dispute a wrong bill",
    lines: [
      ["you", "Hi, I think there's a mistake on my bill."],
      ["them", "What seems to be the problem?"],
      ["you", "I was charged for something I didn't use."],
      ["them", "Let me look into that."],
      ["you", "Thanks! Can I get your name and a reference number?"]
    ],
    whatIf: [
      "They say it's correct? Ask: 'Can I speak to a supervisor?'",
      "Long hold time? Write down the time and who you talked to."
    ]
  }
];

// Fake friends for the Crew tab (a real app would load these from a server)
var friends = [
  { name: "Maya", xp: 85 },
  { name: "Jordan", xp: 140 },
  { name: "Sam", xp: 40 }
];

// The pet grows as you level up
var petStages = ["🥚", "🐣", "🐥", "🦆", "🦅", "🐉"];


// ---------- 2. THE PLAYER'S SAVED INFO ----------
var player = { mode: "teen", xp: 0, done: {}, deadlines: [], focusMinutes: 0 };

// Load from the browser's saved storage (if there is any)
var saved = localStorage.getItem("sidequest");
if (saved) {
  player = JSON.parse(saved);
}

function save() {
  localStorage.setItem("sidequest", JSON.stringify(player));
}

var currentTab = "map";
var view = document.getElementById("view");


// ---------- 3. SMALL HELPER FUNCTIONS ----------

// Shows a message at the bottom of the screen
function showToast(message) {
  var toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, 2200);
}

// Rains confetti emojis down the screen
function confetti() {
  var pieces = ["🎉", "⭐", "✨", "🎊", "💛"];
  for (var i = 0; i < 30; i++) {
    var piece = document.createElement("div");
    piece.className = "confetti";
    piece.textContent = pieces[Math.floor(Math.random() * pieces.length)];
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.animationDelay = Math.random() * 0.6 + "s";
    document.body.appendChild(piece);
    setTimeout(function (p) { p.remove(); }, 3200, piece);
  }
}

// Gives XP and checks if you leveled up
function addXP(amount) {
  var oldLevel = Math.floor(player.xp / 100);
  player.xp = player.xp + amount;
  save();
  updateTopBar();

  var newLevel = Math.floor(player.xp / 100);
  if (newLevel > oldLevel) {
    confetti();
    showToast("LEVEL UP! You are now level " + (newLevel + 1) + " 🚀");
    jumpPet();
  }
}

function jumpPet() {
  var pet = document.getElementById("pet");
  pet.classList.remove("jump");
  void pet.offsetWidth;          // restarts the animation
  pet.classList.add("jump");
}

// Updates the level, XP bar, pet and highlighted buttons
function updateTopBar() {
  var level = Math.floor(player.xp / 100) + 1;
  var stage = Math.min(level - 1, petStages.length - 1);

  document.getElementById("level").textContent = "Level " + level;
  document.getElementById("xpText").textContent = player.xp + " XP";
  document.getElementById("barFill").style.width = (player.xp % 100) + "%";
  document.getElementById("pet").textContent = petStages[stage];

  document.getElementById("teenBtn").className = player.mode === "teen" ? "on" : "";
  document.getElementById("adultBtn").className = player.mode === "adult" ? "on" : "";

  var names = ["map", "scripts", "radar", "crew", "focus"];
  for (var i = 0; i < names.length; i++) {
    document.getElementById("tab-" + names[i]).className = names[i] === currentTab ? "on" : "";
  }
}


// ---------- 4. LIFE MAP ----------
function showMap() {
  var html = "<h2>Pick a zone and start a quest!</h2><div class='zones'>";

  for (var z = 0; z < zones.length; z++) {
    var zone = zones[z];
    html += "<div class='zone' style='border-color:" + zone.color + "'>";
    html += "<h3>" + zone.name + "</h3>";

    for (var q = 0; q < zone.quests.length; q++) {
      var quest = zone.quests[q];

      // only show quests that match the age mode
      if (quest.ages === "both" || quest.ages === player.mode) {
        var doneClass = player.done[quest.id] ? "done" : "";
        var check = player.done[quest.id] ? "✔ " : "";
        html += "<button class='quest " + doneClass + "' onclick=\"openQuest('" + quest.id + "')\">";
        html += "<span>" + check + quest.title + "</span><small>+" + quest.xp + " XP</small></button>";
      }
    }
    html += "</div>";
  }

  view.innerHTML = html + "</div>";
}

// Finds a quest by its id
function findQuest(id) {
  for (var z = 0; z < zones.length; z++) {
    for (var q = 0; q < zones[z].quests.length; q++) {
      if (zones[z].quests[q].id === id) return zones[z].quests[q];
    }
  }
}

function openQuest(id) {
  var quest = findQuest(id);
  var alreadyDone = player.done[id];

  var html = "<h3>" + quest.title + "</h3>";
  html += "<p>Do each step in real life, then check it off.</p>";
  for (var i = 0; i < quest.steps.length; i++) {
    html += "<label><input type='checkbox' class='step'" + (alreadyDone ? " checked disabled" : "") + "> " + quest.steps[i] + "</label>";
  }
  html += "<div class='row' style='margin-top:14px'>";
  if (!alreadyDone) {
    html += "<button class='btn' onclick=\"finishQuest('" + id + "')\">Finish quest</button>";
  }
  html += "<button class='btn dark' onclick='closePopup()'>Close</button></div>";

  document.getElementById("popup").innerHTML = html;
  document.getElementById("overlay").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("overlay").classList.add("hidden");
}

function finishQuest(id) {
  // make sure every checkbox is ticked
  var boxes = document.getElementsByClassName("step");
  for (var i = 0; i < boxes.length; i++) {
    if (!boxes[i].checked) {
      showToast("Check every step first!");
      return;
    }
  }

  var quest = findQuest(id);
  player.done[id] = true;
  closePopup();
  confetti();
  jumpPet();
  addXP(quest.xp);
  showToast("Quest complete! +" + quest.xp + " XP");
  showMap();
}


// ---------- 5. SCRIPT MODE ----------
function showScripts() {
  var html = "<h2>Script Mode</h2><p>Scared of phone calls? Read the script, then practice out loud.</p>";

  for (var s = 0; s < scripts.length; s++) {
    var script = scripts[s];
    html += "<div class='card'><h3>" + script.title + "</h3>";

    for (var l = 0; l < script.lines.length; l++) {
      var who = script.lines[l][0];
      var text = script.lines[l][1];
      html += "<div class='line " + who + "'><b>" + (who === "you" ? "You" : "Them") + ":</b> " + text + "</div>";
    }

    html += "<div class='whatif'><b>What if...</b>";
    for (var w = 0; w < script.whatIf.length; w++) {
      html += "<p>" + script.whatIf[w] + "</p>";
    }
    html += "</div><button class='btn' onclick='practiced()'>I practiced this! (+5 XP)</button></div>";
  }
  view.innerHTML = html;
}

function practiced() {
  addXP(5);
  showToast("Nice practice! +5 XP");
}


// ---------- 6. DEADLINE RADAR ----------

// How many days until a date?
function daysUntil(dateText) {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var due = new Date(dateText + "T00:00:00");
  return Math.round((due - today) / (1000 * 60 * 60 * 24));
}

function showRadar() {
  var html = "<h2>Deadline Radar</h2>";
  html += "<div class='card row'>";
  html += "<input id='dlName' placeholder='What is due? (rent, FAFSA...)'>";
  html += "<input id='dlDate' type='date'>";
  html += "<button class='btn' onclick='addDeadline()'>Add</button></div>";

  // put the closest dates first
  player.deadlines.sort(function (a, b) {
    return a.date.localeCompare(b.date);
  });

  if (player.deadlines.length === 0) {
    html += "<p>Nothing here yet. Add your first deadline!</p>";
  }

  for (var i = 0; i < player.deadlines.length; i++) {
    var d = player.deadlines[i];
    var days = daysUntil(d.date);
    var color = "";
    var label = days + " days left";

    if (days < 0) { color = "late"; label = "Past due"; }
    else if (days === 0) { color = "urgent"; label = "Today!"; }
    else if (days <= 3) { color = "urgent"; }
    else if (days <= 7) { color = "soon"; }

    html += "<div class='deadline " + color + "'>";
    html += "<div><b>" + d.name + "</b><br>" + d.date + "</div>";
    html += "<div class='row'><span>" + label + "</span>";
    html += "<button class='btn dark' onclick='finishDeadline(" + i + ")'>Done</button></div></div>";
  }
  view.innerHTML = html;
}

function addDeadline() {
  var name = document.getElementById("dlName").value;
  var date = document.getElementById("dlDate").value;
  if (name === "" || date === "") {
    showToast("Add a name and a date!");
    return;
  }
  player.deadlines.push({ name: name, date: date });
  save();
  addXP(5);
  showRadar();
}

function finishDeadline(index) {
  player.deadlines.splice(index, 1);
  save();
  addXP(10);
  showToast("Handled it! +10 XP");
  showRadar();
}


// ---------- 7. CREW ----------
function showCrew() {
  // make a list that has the friends AND you, then sort by XP
  var everyone = friends.slice();
  everyone.push({ name: "You", xp: player.xp, me: true });
  everyone.sort(function (a, b) { return b.xp - a.xp; });

  var html = "<h2>Your Crew</h2><p>Climb the leaderboard with your friends!</p>";
  for (var i = 0; i < everyone.length; i++) {
    var p = everyone[i];
    html += "<div class='member " + (p.me ? "me" : "") + "'>";
    html += "<span><b>#" + (i + 1) + "</b> " + p.name + " - " + p.xp + " XP</span>";
    if (!p.me) {
      html += "<button class='btn' onclick=\"cheer('" + p.name + "')\">👏 Cheer</button>";
    }
    html += "</div>";
  }
  view.innerHTML = html;
}

function cheer(name) {
  showToast("You cheered for " + name + "! 🎉");
}


// ---------- 8. FOCUS ROOM ----------
var secondsLeft = 25 * 60;
var timer = null;

function formatTime(total) {
  var minutes = Math.floor(total / 60);
  var seconds = total % 60;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}

function showFocus() {
  var html = "<h2>Focus Room</h2><div class='card'>";
  html += "<p>3 people are studying quietly with you right now 🤫</p>";
  html += "<div class='timer' id='clock'>" + formatTime(secondsLeft) + "</div>";
  html += "<div class='row' style='justify-content:center'>";
  html += "<button class='btn' onclick='toggleTimer()'>" + (timer ? "Pause" : "Start") + "</button>";
  html += "<button class='btn dark' onclick='resetTimer()'>Reset</button></div>";
  html += "<p style='text-align:center'>Finish 25 minutes to earn +10 XP. Total focus time: " + player.focusMinutes + " min</p></div>";
  view.innerHTML = html;
}

function toggleTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  } else {
    timer = setInterval(tick, 1000);
  }
  showFocus();
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  secondsLeft = 25 * 60;
  showFocus();
}

// runs once every second while the timer is on
function tick() {
  secondsLeft = secondsLeft - 1;
  var clock = document.getElementById("clock");
  if (clock) clock.textContent = formatTime(secondsLeft);

  if (secondsLeft <= 0) {
    clearInterval(timer);
    timer = null;
    secondsLeft = 25 * 60;
    player.focusMinutes = player.focusMinutes + 25;
    confetti();
    addXP(10);
    showToast("Focus session done! +10 XP");
    if (currentTab === "focus") showFocus();
  }
}


// ---------- 9. SWITCHING TABS AND MODES ----------
function show(tabName) {
  currentTab = tabName;
  updateTopBar();

  if (tabName === "map") showMap();
  if (tabName === "scripts") showScripts();
  if (tabName === "radar") showRadar();
  if (tabName === "crew") showCrew();
  if (tabName === "focus") showFocus();
}

function setMode(mode) {
  player.mode = mode;
  save();
  show(currentTab);
}

document.getElementById("tab-map").onclick = function () { show("map"); };
document.getElementById("tab-scripts").onclick = function () { show("scripts"); };
document.getElementById("tab-radar").onclick = function () { show("radar"); };
document.getElementById("tab-crew").onclick = function () { show("crew"); };
document.getElementById("tab-focus").onclick = function () { show("focus"); };
document.getElementById("teenBtn").onclick = function () { setMode("teen"); };
document.getElementById("adultBtn").onclick = function () { setMode("adult"); };

document.getElementById("resetBtn").onclick = function () {
  if (confirm("Delete all your progress?")) {
    localStorage.removeItem("sidequest");
    location.reload();
  }
};

// Start the app on the Life Map
show("map");
