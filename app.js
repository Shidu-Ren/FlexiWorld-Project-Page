(() => {
  "use strict";
  const data = window.RESEARCH_DATA;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  const icons = () => window.lucide?.createIcons();
  const icon = (name) => `<i data-lucide="${name}"></i>`;
  const asset = (name) => `assets/${name}`;
  const taskNames = ["PushT", "Cube", "Reacher", "TwoRoom"];
  let taskIndex = 0,
    playback = false,
    frameRequest = 0,
    loadToken = 0;
  let comparison = "baselines",
    resultIndex = 4;
  const currentTask = () => data.tasks[taskIndex];
  const currentCase = () => currentTask().cases[0];
  const videos = () => $$("#players video");

  $("#task-tabs").innerHTML = data.tasks
    .map(
      (t, i) =>
        `<button id="task-${t.id}" role="tab" aria-controls="rollout-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-task="${i}"><span class="tab-index">0${i + 1}</span>${t.name}</button>`,
    )
    .join("");
  function selectTask(index) {
    taskIndex = index;
    $$("#task-tabs button").forEach((b, i) => {
      b.setAttribute("aria-selected", String(i === index));
      b.tabIndex = i === index ? 0 : -1;
    });
    $("#rollout-panel").setAttribute(
      "aria-labelledby",
      `task-${currentTask().id}`,
    );
    renderCase();
  }
  $$("#task-tabs button").forEach((button, i) => {
    button.addEventListener("click", () => selectTask(i));
    button.addEventListener("keydown", (e) => {
      let next;
      if (e.key === "ArrowRight") next = (i + 1) % 4;
      if (e.key === "ArrowLeft") next = (i + 3) % 4;
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = 3;
      if (next !== undefined) {
        e.preventDefault();
        selectTask(next);
        $(`#task-tabs button[data-task="${next}"]`).focus();
      }
    });
  });
  function playerMarkup(m, reference = false) {
    const family = reference
      ? "reference"
      : m.id === "direct" || m.id === "arcem"
        ? "flexi"
        : "intact";
    const outcome = reference
      ? "Dataset reference"
      : m.success
        ? "Goal reached"
        : "Goal not reached";
    const label = reference ? "Expert reference" : m.label;
    const status = reference ? "minus" : m.success ? "check" : "x";
    const subtitle = reference
      ? "Recorded trajectory"
      : m.firstSuccess
        ? "First-plan success"
        : m.success
          ? "Success after reobservation"
          : "Unsuccessful after both plans";
    return `<article class="player" data-family="${family}" data-method="${reference ? "expert" : m.id}"><div class="player-head"><span class="label">${label}</span><span class="outcome ${!m.success && !reference ? "fail" : ""}" title="${outcome}">${icon(status)}<span class="sr-only">${outcome}</span></span></div><video muted playsinline preload="metadata" poster="${asset(m.poster)}" aria-label="${label} ${currentTask().name} recording"><source src="${asset(m.video)}" type="video/mp4"></video><div class="player-foot">${subtitle}</div></article>`;
  }
  function renderCase() {
    stopPlayback();
    ++loadToken;
    const c = currentCase();
    $("#case-meta").textContent =
      `${currentTask().name.toUpperCase()} / D = ${c.distance} / k = 5`;
    $("#case-title").textContent =
      c.category === "direct"
        ? "A goal reached without search."
        : "When residual search makes the difference.";
    $("#case-description").textContent = c.description;
    $("#shared-goal").src = asset(c.goal);
    $("#players").innerHTML =
      (c.expert ? playerMarkup(c.expert, true) : "") +
      c.methods.map((m) => playerMarkup(m)).join("");
    $("#timeline").max = 2 * c.distance;
    $("#timeline").value = 0;
    $("#media-error").hidden = true;
    videos().forEach((v) => {
      v.muted = true;
      v.playbackRate = Number($("#speed").value);
      v.addEventListener("error", () => {
        $("#media-error").hidden = false;
        stopPlayback();
      });
      v.querySelector("source").addEventListener("error", () => {
        $("#media-error").hidden = false;
        stopPlayback();
      });
      v.addEventListener("ended", () => {
        if (v === videos()[0]) stopPlayback();
      });
    });
    updateTimeline();
    icons();
  }
  function updateTimeline() {
    const step = Number($("#timeline").value),
      d = currentCase().distance;
    $("#frame-count").textContent = `${step} / ${2 * d}`;
    $("#phase").textContent =
      step >= 2 * d
        ? "BUDGET COMPLETE"
        : step >= d
          ? "AFTER REOBSERVATION"
          : "FIRST PLAN";
    $("#timeline").setAttribute(
      "aria-valuetext",
      `${step} of ${2 * d} primitive steps`,
    );
  }
  function stopPlayback() {
    playback = false;
    cancelAnimationFrame(frameRequest);
    videos().forEach((v) => v.pause());
    $("#play-all").setAttribute("aria-label", "Play all recordings");
    $("#play-all").title = "Play all recordings";
    $("#play-all").innerHTML = icon("play");
    icons();
  }
  function playbackTick() {
    if (!playback) return;
    const vs = videos(),
      master = vs[0];
    if (!master) return;
    vs.slice(1).forEach((v) => {
      if (!v.seeking && Math.abs(v.currentTime - master.currentTime) > 0.12)
        v.currentTime = master.currentTime;
    });
    $("#timeline").value = Math.min(
      2 * currentCase().distance,
      Math.floor(master.currentTime * currentCase().fps),
    );
    updateTimeline();
    frameRequest = requestAnimationFrame(playbackTick);
  }
  async function playAll() {
    if (playback) {
      stopPlayback();
      return;
    }
    const token = loadToken,
      vs = videos();
    if (Number($("#timeline").value) >= 2 * currentCase().distance) {
      vs.forEach((v) => {
        v.currentTime = 0;
      });
      $("#timeline").value = 0;
    }
    $("#play-all").disabled = true;
    try {
      await Promise.all(vs.map((v) => v.play()));
      if (token !== loadToken) {
        vs.forEach((v) => v.pause());
        return;
      }
      playback = true;
      $("#play-all").innerHTML = icon("pause");
      $("#play-all").setAttribute("aria-label", "Pause all recordings");
      $("#play-all").title = "Pause all recordings";
      icons();
      playbackTick();
    } catch (e) {
      if (token === loadToken) {
        $("#media-error").hidden = false;
        stopPlayback();
      }
    } finally {
      $("#play-all").disabled = false;
    }
  }
  $("#play-all").addEventListener("click", playAll);
  $("#timeline").addEventListener("input", () => {
    stopPlayback();
    const time = Number($("#timeline").value) / currentCase().fps;
    videos().forEach((v) => {
      v.currentTime = time;
    });
    updateTimeline();
  });
  $("#speed").addEventListener("change", () =>
    videos().forEach((v) => {
      v.playbackRate = Number($("#speed").value);
    }),
  );
  $("#restart").addEventListener("click", () => {
    stopPlayback();
    videos().forEach((v) => {
      v.currentTime = 0;
    });
    $("#timeline").value = 0;
    updateTimeline();
  });
  $("#retry-media").addEventListener("click", renderCase);
  renderCase();

  const dialog = $("#image-dialog");
  function openImage(src, caption, goal = false) {
    $("#dialog-image").src = src;
    $("#dialog-image").alt = caption;
    $("#dialog-caption").textContent = caption;
    dialog.classList.toggle("goal-modal", goal);
    dialog.showModal();
  }
  $("#goal-button").addEventListener("click", () =>
    openImage(
      asset(currentCase().goal),
      `${currentTask().name} / shared goal observation`,
      true,
    ),
  );
  $$(".image-zoom").forEach((b) =>
    b.addEventListener("click", () =>
      openImage(b.dataset.image, b.dataset.caption),
    ),
  );
  $("#close-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        dialog.close();
    }
  });

  function renderResults() {
    const rows = comparison === "baselines" ? data.results : data.planners;
    $("#results-chart").innerHTML = rows
      .map((r) => {
        const v = r.values[resultIndex],
          ours = r.label.startsWith("FlexiWorld"),
          label = r.label === "FlexiWorld" ? "FlexiWorld + ARCEM" : r.label;
        return `<div class="bar-row ${ours ? "ours" : ""}" data-name="${r.label}"><span class="bar-label ${ours ? "ours" : ""}">${label}</span><div class="bar-track"><div class="bar-fill" style="--value:${v.mean}%"></div><span class="bar-error" style="--left:${Math.max(0, v.mean - v.sd)}%;--error:${Math.min(100, v.mean + v.sd) - Math.max(0, v.mean - v.sd)}%"></span></div><span class="bar-number">${v.mean.toFixed(2)} <small>± ${v.sd.toFixed(2)}</small></span></div>`;
      })
      .join("");
    $("#results-chart").setAttribute(
      "aria-label",
      `${resultIndex === 4 ? "Four-task average" : taskNames[resultIndex]} success rate. ${rows.map((r) => `${r.label}: ${r.values[resultIndex].mean.toFixed(2)} percent, sample standard deviation ${r.values[resultIndex].sd.toFixed(2)}`).join(". ")}`,
    );
  }
  $$("[data-comparison]").forEach((b) =>
    b.addEventListener("click", () => {
      comparison = b.dataset.comparison;
      $$("[data-comparison]").forEach((el) => {
        const active = el === b;
        el.classList.toggle("active", active);
        el.setAttribute("aria-pressed", String(active));
      });
      renderResults();
    }),
  );
  $("#result-task").addEventListener("change", () => {
    resultIndex = Number($("#result-task").value);
    renderResults();
  });
  $("#results-table tbody").innerHTML = data.results
    .map(
      (r) =>
        `<tr><th scope="row">${r.label === "FlexiWorld" ? "FlexiWorld + ARCEM" : r.label}</th>${r.values.map((v) => `<td>${v.mean.toFixed(2)} ± ${v.sd.toFixed(2)}</td>`).join("")}</tr>`,
    )
    .join("");
  renderResults();
  function renderLatency(distance) {
    const d = data.latency.find((l) => l.distance === distance);
    $("#latency-comparison").innerHTML =
      [5, 10]
        .map(
          (k) =>
            `<div class="latency-item"><div><span>ARCEM / k = ${k}</span><b>${d[`ms${k}`].toFixed(1)} <small>ms</small></b></div><div class="latency-track"><div style="--time:${(d[`ms${k}`] / d.ms5) * 100}%"></div></div><p>${d[`sr${k}`].toFixed(2)}% mean success</p></div>`,
        )
        .join("") +
      `<div class="speedup-note">${icon("zap")} ${(d.ms5 / d.ms10).toFixed(2)}× faster planning at D = ${d.distance}</div>`;
    $$("[data-distance]").forEach((b) => {
      const active = Number(b.dataset.distance) === distance;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    icons();
  }
  $$("[data-distance]").forEach((b) =>
    b.addEventListener("click", () =>
      renderLatency(Number(b.dataset.distance)),
    ),
  );
  renderLatency(50);

  $("#copy-citation").addEventListener("click", async () => {
    const text = $("#citation-text").textContent;
    try {
      if (navigator.clipboard && window.isSecureContext)
        await navigator.clipboard.writeText(text);
      else {
        const a = document.createElement("textarea");
        a.value = text;
        a.style.position = "fixed";
        a.style.opacity = "0";
        document.body.append(a);
        a.select();
        if (!document.execCommand("copy")) throw new Error("Copy unavailable");
        a.remove();
      }
      $("#copy-status").textContent = "Copied";
      $("#copy-citation").innerHTML = icon("check");
      icons();
      setTimeout(() => {
        $("#copy-status").textContent = "";
        $("#copy-citation").innerHTML = icon("copy");
        icons();
      }, 2200);
    } catch (e) {
      $("#copy-status").textContent = "Select the citation to copy.";
      const range = document.createRange();
      range.selectNodeContents($("#citation-text"));
      getSelection().removeAllRanges();
      getSelection().addRange(range);
    }
  });

  $("#menu-toggle").addEventListener("click", () => {
    const open = $("#navigation").classList.toggle("open");
    $("#menu-toggle").setAttribute("aria-expanded", String(open));
    $("#menu-toggle").setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    $("#menu-toggle").innerHTML = icon(open ? "x" : "menu");
    icons();
  });
  $$("#navigation a").forEach((a) =>
    a.addEventListener("click", () => {
      $("#navigation").classList.remove("open");
      $("#menu-toggle").setAttribute("aria-expanded", "false");
      $("#menu-toggle").setAttribute("aria-label", "Open navigation");
      $("#menu-toggle").innerHTML = icon("menu");
      icons();
    }),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $("#navigation").classList.contains("open"))
      $("#menu-toggle").click();
  });
  const trackedSections = $$("#overview,#rollouts,#method,#results,#diagnostics");
  function scrollUpdate() {
    const end = document.documentElement.scrollHeight - innerHeight;
    $(".reading-progress").style.transform =
      `scaleX(${end > 0 ? scrollY / end : 0})`;
    let active = "";
    trackedSections.forEach((s) => {
      if (s.getBoundingClientRect().top < innerHeight * 0.4) active = s.id;
    });
    $$("nav a").forEach((a) =>
      a.classList.toggle("active", a.hash === `#${active}`),
    );
  }
  addEventListener("scroll", scrollUpdate, { passive: true });
  scrollUpdate();
  if (!motionPreference.matches) {
    document.body.classList.add("js-motion");
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            reveal.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    $$(".reveal").forEach((el) => reveal.observe(el));
  }
  const visible = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.target.id === "rollouts" && !e.isIntersecting) stopPlayback();
      }),
    { threshold: 0 },
  );
  visible.observe($("#rollouts"));
  const mechanismVideos = $$(".mechanism-film video");
  const visibleMechanisms = new Set();
  const mechanismObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) visibleMechanisms.add(target);
      else visibleMechanisms.delete(target);
      if (isIntersecting && !motionPreference.matches && !document.hidden) {
        target.play().catch(() => {});
      } else target.pause();
    });
  }, { threshold: 0.35 });
  mechanismVideos.forEach(video => mechanismObserver.observe(video));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopPlayback();
    if (document.hidden) mechanismVideos.forEach(video => video.pause());
    else if (!motionPreference.matches) visibleMechanisms.forEach(video => video.play().catch(() => {}));
  });
  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches) document.body.classList.remove("js-motion");
    if (motionPreference.matches) mechanismVideos.forEach(video => video.pause());
  });

  // Decorative chunk traces illustrate time scales, not experimental results.
  const canvas = $("#hero-canvas");
  const ctx = canvas.getContext("2d");
  let ambientPaused = motionPreference.matches;
  let ambientVisible = true;
  let ambientFrame = 0;
  let canvasWidth = 0;
  let canvasHeight = 0;
  function drawAmbient(now = 0) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const t = ambientPaused ? 0 : now * 0.012;
    for (let row = 0; row < Math.ceil(canvasHeight / 56); row++) {
      const y = 36 + row * 56;
      ctx.strokeStyle = "rgba(178,205,137,0.075)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(24, y);
      ctx.lineTo(canvasWidth - 24, y);
      ctx.stroke();
      for (let col = 0; col < Math.ceil(canvasWidth / 253); col++) {
        const x = ((col * 253 + t * (row % 2 ? -1 : 1) + row * 79 +
          canvasWidth * 10) % (canvasWidth + 120)) - 60;
        const edge = Math.abs(x - canvasWidth / 2) / (canvasWidth / 2);
        ctx.fillStyle = `rgba(${row % 3 ? "196,243,107" : "112,190,208"},${0.055 + 0.09 * edge})`;
        ctx.fillRect(x, y - 3, [17, 34, 53, 25, 40][(row + col) % 5], 6);
        ctx.strokeStyle = "rgba(177,206,139,0.16)";
        ctx.beginPath();
        ctx.moveTo(x, y - 9);
        ctx.lineTo(x, y + 9);
        ctx.stroke();
      }
    }
    if (!ambientPaused && ambientVisible && !document.hidden)
      ambientFrame = requestAnimationFrame(drawAmbient);
  }
  function updateAmbient() {
    cancelAnimationFrame(ambientFrame);
    const label = ambientPaused ? "Play background animation" : "Pause background animation";
    $("#hero-motion").setAttribute("aria-label", label);
    $("#hero-motion").title = label;
    $("#hero-motion").innerHTML = icon(ambientPaused ? "play" : "pause");
    icons();
    drawAmbient(performance.now());
  }
  new ResizeObserver(() => {
    const rect = $("#top").getBoundingClientRect();
    canvasWidth = rect.width;
    canvasHeight = rect.height;
    const ratio = Math.min(devicePixelRatio, 2);
    canvas.width = Math.round(canvasWidth * ratio);
    canvas.height = Math.round(canvasHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    updateAmbient();
  }).observe($("#top"));
  new IntersectionObserver(([entry]) => {
    ambientVisible = entry.isIntersecting;
    updateAmbient();
  }).observe($("#top"));
  $("#hero-motion").addEventListener("click", () => {
    ambientPaused = !ambientPaused;
    updateAmbient();
  });
  document.addEventListener("visibilitychange", updateAmbient);
  motionPreference.addEventListener("change", () => {
    ambientPaused = motionPreference.matches;
    updateAmbient();
  });
  icons();
})();
