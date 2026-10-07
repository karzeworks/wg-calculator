(() => {
  const $ = (id) => document.getElementById(id);

  const dateInput = $("dateInput");
  const ltdInput = $("ltdInput");
  const mtdInput = $("mtdInput");
  const goalInput = $("goalInput");
  const goalSelect = $("goalSelect");
  const errorEl = $("error");

  const out = {
    proj: $("projOut"),
    percent: $("percentOut"),
    daily: $("dailyOut"),
    current: $("currentOut"),
  };

  const STORAGE = { LTD_Value: ltdInput, MTD_Value: mtdInput, Goal_Value: goalInput };

  const intFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
  const pctFmt = new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function todayString() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function parseNumber(text) {
    const cleaned = text.replace(/[,\s​]/g, "");
    if (cleaned === "") return NaN;
    return Number(cleaned);
  }

  function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate(); // month is 1-based
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = !msg;
  }

  function calculate() {
    const dateParts = dateInput.value.split("-").map(Number);
    const mtd = parseNumber(mtdInput.value);
    const goal = parseNumber(goalInput.value);

    if (dateParts.length !== 3 || dateParts.some(Number.isNaN)) return showError("請選擇日期");
    if (!Number.isFinite(mtd)) return showError("請輸入有效的 MTD");
    if (!Number.isFinite(goal) || goal <= 0) return showError("請輸入有效的目標業績");
    showError("");

    const [year, month, day] = dateParts;
    const totalDays = daysInMonth(year, month);
    const remainingDays = totalDays - day;

    const proj = (mtd / day) * totalDays;
    const percent = proj / goal;
    const currentNeed = (goal / totalDays) * day - mtd;

    out.proj.textContent = intFmt.format(proj);
    out.percent.textContent = pctFmt.format(percent);
    out.daily.textContent = remainingDays === 0 ? "月底已到" : intFmt.format((goal - mtd) / remainingDays);
    out.current.textContent = intFmt.format(currentNeed);
  }

  // 還原與保存輸入值
  for (const [key, input] of Object.entries(STORAGE)) {
    try {
      const saved = localStorage.getItem(key);
      if (saved) input.value = saved;
    } catch { /* storage 不可用時忽略 */ }
    input.addEventListener("input", () => {
      try {
        if (input.value) localStorage.setItem(key, input.value);
      } catch { /* ignore */ }
    });
  }

  dateInput.value = todayString();
  dateInput.addEventListener("change", () => {
    if (!dateInput.value) dateInput.value = todayString();
  });
  $("todayBtn").addEventListener("click", () => { dateInput.value = todayString(); });

  goalSelect.addEventListener("change", () => {
    if (!goalSelect.value) return;
    goalInput.value = goalSelect.value;
    goalInput.dispatchEvent(new Event("input"));
    goalSelect.value = "";
  });

  $("clearBtn").addEventListener("click", () => {
    dateInput.value = todayString();
    goalSelect.value = "";
    for (const [key, input] of Object.entries(STORAGE)) {
      input.value = "";
      try { localStorage.removeItem(key); } catch { /* ignore */ }
    }
    for (const el of Object.values(out)) el.textContent = "未計算";
    showError("");
  });

  $("calcForm").addEventListener("submit", (e) => {
    e.preventDefault();
    calculate();
  });

  const dialog = $("formulaDialog");
  $("menuBtn").addEventListener("click", () => dialog.showModal());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
})();
