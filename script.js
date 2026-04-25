const bedtimeInput = document.querySelector("#bedtime");
const latencyInput = document.querySelector("#latency");
const latencyValue = document.querySelector("#latency-value");
const cycleButtons = [...document.querySelectorAll(".segment")];
const summaryHeadline = document.querySelector("#summary-headline");
const summaryCopy = document.querySelector("#summary-copy");
const sleepStartNode = document.querySelector("#sleep-start");
const bestWakeNode = document.querySelector("#best-wake");
const bestDurationNode = document.querySelector("#best-duration");
const recommendedList = document.querySelector("#recommended-list");
const avoidList = document.querySelector("#avoid-list");

const CYCLE_MIN = 80;
const CYCLE_MAX = 100;
const CYCLE_CENTER = 90;
const DEFAULT_CYCLES = 4;
let selectedCycles = DEFAULT_CYCLES;

function pad(value) {
  return String(value).padStart(2, "0");
}

function parseTime(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(totalMinutes) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${pad(hours)}:${pad(minutes)}`;
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hours) return `${mins} min`;
  if (!mins) return `${hours} h`;
  return `${hours} h ${mins} min`;
}

function getNowTime() {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function buildRecommendedWindows(sleepStartMinutes) {
  const results = [];
  for (let cycles = 1; cycles <= 6; cycles += 1) {
    const start = sleepStartMinutes + cycles * CYCLE_MIN;
    const end = sleepStartMinutes + cycles * CYCLE_MAX;
    const midpoint = sleepStartMinutes + cycles * CYCLE_CENTER;

    results.push({
      cycles,
      start,
      end,
      midpoint,
      duration: cycles * CYCLE_CENTER
    });
  }
  return results;
}

function buildAvoidWindows(recommended) {
  return recommended.slice(0, -1).map((window, index) => {
    const next = recommended[index + 1];
    return {
      afterCycles: window.cycles,
      start: window.end,
      end: next.start
    };
  });
}

function getCycleAdvice(cycles) {
  const adviceMap = {
    1: {
      tone: "hard",
      label: "Muy mala idea",
      headline: "Te vas a levantar muy corto de sueno.",
      body: "Apenas seria una siesta larga. Es muy probable que sigas con sueno, poca claridad mental y nada de energia."
    },
    2: {
      tone: "hard",
      label: "Fatiga alta",
      headline: "Si despiertas aqui, lo normal es sentirte cansado.",
      body: "Son unas 3 horas de descanso. Aunque cierres ciclos, sigue siendo muy poco para rendir bien al dia siguiente."
    },
    3: {
      tone: "caution",
      label: "Aguantas",
      headline: "Podrias funcionar, pero no llegas al minimo ideal.",
      body: "Al cerrar 3 ciclos suele sentirse mejor que despertar a medias, pero para la mayoria de adultos sigue siendo insuficiente."
    },
    4: {
      tone: "caution",
      label: "Aceptable",
      headline: "Es una salida funcional, aunque todavia corta.",
      body: "Ronda 6 horas. Puede sacarte del apuro, pero sigues por debajo del rango recomendado para adultos."
    },
    5: {
      tone: "best",
      label: "Mas optimo",
      headline: "Este suele ser el punto mas equilibrado para despertar con mejor energia.",
      body: "Ronda 7.5 horas, cae dentro del rango recomendado y para mucha gente es la opcion con mejor balance entre descanso y horario."
    },
    6: {
      tone: "good",
      label: "Muy buena opcion",
      headline: "Tambien es una gran hora para despertar si tu agenda lo permite.",
      body: "Ronda 9 horas. Sueles completar mas descanso total, aunque a algunas personas les resulta menos practico entre semana."
    }
  };

  return adviceMap[cycles];
}

function renderRecommended(items) {
  recommendedList.innerHTML = items
    .map((item) => {
      const advice = getCycleAdvice(item.cycles);
      const isSelected = item.cycles === selectedCycles;
      return `
        <article class="schedule-item advice ${advice.tone} ${isSelected ? "selected" : ""}">
          <div class="item-title-row">
            <strong>Ciclo ${item.cycles} - ${formatTime(item.midpoint)}</strong>
            <span class="pill">${advice.label}</span>
          </div>
          <span class="item-meta">${formatDuration(item.duration)} de descanso aproximado</span>
          <span class="item-headline">${advice.headline}</span>
          <span class="item-body">${advice.body}</span>
          <span class="item-range">Ventana realista: ${formatTime(item.start)} - ${formatTime(item.end)}</span>
        </article>
      `;
    })
    .join("");
}

function renderAvoid(items) {
  avoidList.innerHTML = items
    .map(
      (item) => `
        <article class="schedule-item avoid">
          <div class="item-title-row">
            <strong>${formatTime(item.start)} - ${formatTime(item.end)}</strong>
            <span class="pill">Evitar</span>
          </div>
          <span class="item-meta">Entre ${item.afterCycles} y ${item.afterCycles + 1} ciclos</span>
          <span class="item-range">Mas probable que despiertes en medio de una transicion de fase.</span>
        </article>
      `
    )
    .join("");
}

function syncCycleButtons() {
  cycleButtons.forEach((button) => {
    const isActive = Number(button.dataset.cycles) === selectedCycles;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function update() {
  const bedtime = parseTime(bedtimeInput.value);
  const latency = Number(latencyInput.value);
  const sleepStart = bedtime + latency;
  const recommended = buildRecommendedWindows(sleepStart);
  const chosenWindow = recommended.find((item) => item.cycles === selectedCycles) ?? recommended[0];
  const avoid = buildAvoidWindows(recommended);
  const chosenAdvice = getCycleAdvice(chosenWindow.cycles);

  sleepStartNode.textContent = formatTime(sleepStart);
  bestWakeNode.textContent = `Ciclo ${chosenWindow.cycles} a las ${formatTime(chosenWindow.midpoint)}`;
  bestDurationNode.textContent = formatDuration(chosenWindow.duration);
  summaryHeadline.textContent = `Si te despiertas en el ciclo ${chosenWindow.cycles}, ${chosenAdvice.headline.toLowerCase()}`;
  summaryCopy.textContent = `Si te acuestas a las ${bedtimeInput.value} y tardas ${latency} minutos en dormirte, empezarias a dormir cerca de las ${formatTime(sleepStart)}. Despertar en el ciclo ${chosenWindow.cycles} te pondria sobre las ${formatTime(chosenWindow.midpoint)}, dentro de una ventana de ${formatTime(chosenWindow.start)} a ${formatTime(chosenWindow.end)}. ${chosenAdvice.body}`;

  renderRecommended(recommended);
  renderAvoid(avoid);
}

bedtimeInput.value = getNowTime();
latencyValue.textContent = `${latencyInput.value} min`;

latencyInput.addEventListener("input", () => {
  latencyValue.textContent = `${latencyInput.value} min`;
  update();
});

bedtimeInput.addEventListener("input", update);

cycleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedCycles = Number(button.dataset.cycles);
    syncCycleButtons();
    update();
  });
});

syncCycleButtons();
update();
