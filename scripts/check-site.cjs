const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { chromium } = require("playwright");
const { PNG } = require("pngjs");
const root = path.resolve(__dirname, "..");
const output = path.join(root, "qa");
const data = JSON.parse(
  fs.readFileSync(path.join(root, "assets/results.json")),
);
fs.mkdirSync(output, { recursive: true });
const paper = JSON.parse(fs.readFileSync(path.join(root, "assets/paper-content.json")));
let browser;

async function main() {
  browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const errors = [],
    failedRequests = [],
    report = { cases: [], viewports: [] };
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("requestfailed", (r) => {
    if (!r.failure()?.errorText.includes("ERR_ABORTED"))
      failedRequests.push([r.url(), r.failure()?.errorText]);
  });
  await page.goto(
    process.env.SITE_URL || pathToFileURL(path.join(root, "index.html")).href,
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(
    () => document.querySelectorAll("#task-tabs button").length === 4,
  );
  await page.waitForTimeout(700);
  assert.equal(await page.locator(".people .person").count(), 7);
  assert.equal(await page.locator(".people .lead-label").count(), 0);
  assert.equal(
    await page.locator(".author-notes .project-lead").textContent(),
    "\u2020 Project Lead",
  );
  assert.equal(
    await page.locator(".author-notes .corresponding-author").textContent(),
    "\u2021 Corresponding Author",
  );
  assert.equal(await page.locator('.people a[href$="~Shidu_Ren1"] sup').textContent(), "1,*,\u2020");
  assert.equal(await page.locator('.people a[href$="~Yunze_Liu2"] sup').textContent(), "2,\u2021");
  assert.equal(
    await page.locator(".equal-contribution").textContent(),
    "* Equal Contribution",
  );
  assert.equal(
    await page
      .locator(".people sup")
      .evaluateAll(
        (es) => es.filter((e) => e.textContent.includes("*")).length,
      ),
    3,
  );
  assert(
    (await page.locator(".affiliations").textContent()).includes(
      "Mila & Université de Montréal",
    ),
  );
  await page.screenshot({ path: path.join(output, "desktop-hero.png") });
  const images = await page
    .locator("img[src]")
    .evaluateAll((els) =>
      els.filter((e) => e.complete && !e.naturalWidth).map((e) => e.src),
    );
  assert.deepEqual(images, [], "Image did not decode");
  const links = await page
    .locator("[src],a[href],link[href]")
    .evaluateAll((els) =>
      els
        .map((e) => e.getAttribute("src") || e.getAttribute("href"))
        .filter(Boolean),
    );
  for (const url of links) {
    if (url.startsWith("#")) {
      if (url.length > 1)
        assert(await page.locator(url).count(), `Missing anchor ${url}`);
    } else if (!/^https?:|^data:/.test(url))
      assert(fs.existsSync(path.join(root, url)), `Missing file ${url}`);
  }
  assert.equal(await page.locator("#top video").count(), 0);
  assert.equal(await page.locator("#top canvas").count(), 1);
  assert.equal(await page.locator("#top").evaluate((e) => getComputedStyle(e).backgroundColor), "rgb(21, 23, 20)");
  assert.equal((await page.locator("#paper-abstract").textContent()).replace(/\s+/g, " ").trim(), paper.abstract);
  assert.equal(await page.locator(".paper-figure").count(), 6);
  assert.equal(await page.locator(".diagnostic-study").count(), 3);
  for (const [name, evidence] of Object.entries(paper.files)) {
    const hash = crypto.createHash("sha256").update(fs.readFileSync(path.join(root, "assets", name))).digest("hex");
    assert.equal(hash, evidence.sha256, `Paper figure changed: ${name}`);
  }
  const ambientBefore = await page.locator("#hero-canvas").evaluate((e) => e.toDataURL());
  await page.waitForTimeout(350);
  assert.notEqual(ambientBefore, await page.locator("#hero-canvas").evaluate((e) => e.toDataURL()), "Background is not moving");
  await page.getByRole("button", { name: "Pause background animation", exact: true }).click();
  const pausedFrame = await page.locator("#hero-canvas").evaluate((e) => e.toDataURL());
  await page.waitForTimeout(150);
  assert.equal(pausedFrame, await page.locator("#hero-canvas").evaluate((e) => e.toDataURL()), "Background did not pause");
  await page.getByRole("button", { name: "Play background animation", exact: true }).click();
  assert(await page.locator("#players video").evaluateAll((vs) =>
    vs.every((v) => v.paused)), "Recordings must not autoplay");

  for (const task of data.tasks) {
    await page.getByRole("tab", { name: new RegExp(task.name) }).click();
    for (const [caseIndex, c] of task.cases.entries()) {
      if (caseIndex)
        await page
          .getByRole("button", { name: "Next case", exact: true })
          .click();
      await page.waitForFunction(() =>
        [...document.querySelectorAll("#players video")].every(
          (v) => v.readyState >= 2,
        ),
      );
      assert.equal(await page.locator("#players video").count(), 5);
      await page
        .getByRole("button", { name: "Play all recordings", exact: true })
        .click();
      await page.waitForTimeout(450);
      const times = await page
        .locator("#players video")
        .evaluateAll((vs) => vs.map((v) => v.currentTime));
      assert(
        times.every((t) => t > 0.1),
        `${c.id} failed to play`,
      );
      assert(
        Math.max(...times) - Math.min(...times) < 0.2,
        `${c.id} synchronization drift`,
      );
      await page
        .getByRole("button", { name: "Pause all recordings", exact: true })
        .click();
      await page.locator("#timeline").evaluate((e, n) => {
        e.value = n;
        e.dispatchEvent(new Event("input", { bubbles: true }));
      }, c.distance + 5);
      await page.waitForFunction(() =>
        [...document.querySelectorAll("#players video")].every(
          (v) => !v.seeking,
        ),
      );
      assert.equal(
        await page.locator("#phase").textContent(),
        "AFTER REOBSERVATION",
      );
      const means = [];
      for (const v of await page.locator("#players video").all()) {
        const rgba = PNG.sync.read(await v.screenshot()).data;
        let sum = 0,
          squares = 0,
          count = 0;
        for (let i = 0; i < rgba.length; i++) {
          if (i % 4 === 3) continue;
          sum += rgba[i];
          squares += rgba[i] * rgba[i];
          count++;
        }
        const mean = sum / count,
          variance = squares / count - mean * mean;
        assert(variance > 20 && mean > 3, `Blank video ${c.id}`);
        means.push({ mean, variance });
      }
      await page.locator("#speed").selectOption("2");
      assert(
        await page
          .locator("#players video")
          .evaluateAll((vs) => vs.every((v) => v.playbackRate === 2)),
      );
      await page.locator("#speed").selectOption("1");
      await page
        .getByRole("button", { name: "Restart recordings", exact: true })
        .click();
      await page.waitForFunction(() =>
        [...document.querySelectorAll("#players video")].every(
          (v) => !v.seeking && v.currentTime < 0.05,
        ),
      );
      assert(await page.locator("#media-error").isHidden());
      for (const m of c.methods) {
        const status = await page
          .locator(`[data-method="${m.id}"] .outcome`)
          .getAttribute("title");
        assert.equal(status, m.success ? "Goal reached" : "Goal not reached");
      }
      report.cases.push({ id: c.id, synchronized: true, pixels: means });
    }
  }
  await page
    .getByRole("button", { name: "Enlarge shared goal", exact: true })
    .click();
  assert(await page.getByRole("dialog").isVisible());
  await page.keyboard.press("Escape");
  assert(await page.getByRole("dialog").isHidden());
  await page
    .getByRole("button", { name: "Enlarge training architecture", exact: true })
    .click();
  assert(await page.getByRole("dialog").isVisible());
  await page.getByRole("button", { name: "Close image", exact: true }).click();
  for (const figure of await page.locator(".paper-figure .image-zoom").all()) {
    await figure.scrollIntoViewIfNeeded();
    const img = figure.locator("img");
    await img.evaluate((e) => e.decode());
    const shape = await img.evaluate((e) => ({width:e.naturalWidth,height:e.naturalHeight,declaredWidth:e.width,declaredHeight:e.height}));
    assert.equal(shape.width, 2400);
    assert(Math.abs(shape.declaredWidth / shape.declaredHeight - shape.width / shape.height) < 0.02, "Figure aspect ratio distorted");
    await figure.click();
    assert(await page.getByRole("dialog").isVisible());
    assert.equal(await page.locator("#dialog-image").getAttribute("src"), await figure.getAttribute("data-image"));
    await page.keyboard.press("Escape");
  }
  await page.locator('[data-chunk="10"]').click();
  assert.equal(await page.locator("#predictor-count").textContent(), "3");
  assert.equal(await page.locator(".action-cell.boundary").count(), 3);
  await page.locator('[data-chunk="5"]').click();
  assert.equal(await page.locator("#predictor-count").textContent(), "5");
  await page.locator('[data-comparison="planners"]').click();
  assert.equal(await page.locator(".bar-row").count(), 3);
  await page.locator("#result-task").selectOption("0");
  assert(
    (await page.locator("#results-chart").textContent()).includes("60.39"),
  );
  await page.locator('[data-comparison="baselines"]').click();
  assert.equal(await page.locator(".bar-row").count(), 6);
  await page.locator("#result-task").selectOption("4");
  assert(
    (await page.locator("#results-chart").textContent()).includes("58.44"),
  );
  await page.locator('[data-distance="100"]').click();
  assert(
    (await page.locator("#latency-comparison").textContent()).includes("994.4"),
  );
  await page.locator('[data-distance="50"]').click();
  await page.locator(".results-details summary").click();
  assert(await page.locator("#results-table").isVisible());
  await page.locator(".results-details summary").click();
  await page
    .getByRole("button", { name: "Copy BibTeX citation", exact: true })
    .click();
  await page.waitForFunction(
    () => document.querySelector("#copy-status").textContent.length > 0,
  );
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width >= 1024 ? 1000 : 844 });
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(300);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Page horizontal overflow at ${width}`,
    );
    const overflow = await page
      .locator("h1,h2,h3,button,.metric,.bar-label")
      .evaluateAll((els) =>
        els
          .filter((e) => e.clientWidth > 0 && e.scrollWidth > e.clientWidth + 2)
          .map((e) => e.textContent),
      );
    assert.deepEqual(overflow, [], `Text overflow at ${width}`);
    const header = await page.locator("#top").boundingBox();
    assert(header.y + header.height < (width >= 1024 ? 1000 : 844),
      `Paper header hides the next section at ${width}`);
    if (width === 390) {
      await page
        .getByRole("button", { name: "Open navigation", exact: true })
        .click();
      assert(await page.locator("#navigation").isVisible());
      await page.locator('#navigation a[href="#rollouts"]').click();
      assert.equal(
        await page.locator("#menu-toggle").getAttribute("aria-expanded"),
        "false",
      );
    }
    for (const selector of [
      "#overview",
      "#rollouts",
      "#method",
      "#results",
      "#abstract",
      "#diagnostics",
      "#resources",
    ]) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(750);
    await page.screenshot({
      path: path.join(output, `${width}-full.png`),
      fullPage: true,
    });
    report.viewports.push({ width, overflow: false });
  }
  const reduced = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await reduced.goto(
    process.env.SITE_URL || pathToFileURL(path.join(root, "index.html")).href,
  );
  await reduced.waitForTimeout(300);
  assert(
    await reduced
      .locator("#players video")
      .evaluateAll((vs) => vs.every((v) => v.paused)),
  );
  assert.equal(
    await reduced
      .locator("#action-ribbon")
      .evaluate((e) => e.classList.contains("paused")),
    true,
  );
  assert.equal(await reduced.getByRole("button", { name: "Play background animation", exact: true }).count(), 1);
  await reduced.close();
  assert.deepEqual(errors, []);
  assert.deepEqual(failedRequests, []);
  report.errors = errors;
  report.failedRequests = failedRequests;
  report.reducedMotion = "passed";
  fs.writeFileSync(
    path.join(output, "report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(
    JSON.stringify({
      cases: report.cases.length,
      viewports: report.viewports,
      errors,
      failedRequests,
    }),
  );
  await browser.close();
}
main().catch(async (e) => {
  console.error(e);
  if (browser) await browser.close();
  process.exit(1);
});
