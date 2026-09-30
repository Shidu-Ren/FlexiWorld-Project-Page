const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      await page.goto(pathToFileURL(path.resolve(__dirname, '../index.html')).href);
      const videos = page.locator('.mechanism-film video');
      const expected = [[1600, 1112, 20], [1280, 500, 15.6], [1280, 500, 20], [1280, 500, 37], [1280, 720, 13]];
      assert.equal(await videos.count(), expected.length);
      for (let i = 0; i < expected.length; i++) {
        const video = videos.nth(i);
        await video.scrollIntoViewIfNeeded();
        await page.waitForFunction(({i, expected}) => {
          const v = document.querySelectorAll('.mechanism-film video')[i];
          return v.videoWidth === expected[0] && v.videoHeight === expected[1] && Math.abs(v.duration - expected[2]) < 0.1 && v.currentTime > 0;
        }, { i, expected: expected[i] });
        assert.ok(await video.evaluate(v => v.controls && v.muted && v.loop));
        const before = await video.evaluate(v => v.currentTime);
        await page.waitForTimeout(300);
        assert.ok(await video.evaluate((v, t) => v.currentTime > t, before));
        await page.locator('.mechanism-film').nth(i).screenshot({ path: path.resolve(__dirname, `../qa/mechanism-${width}-${i}.png`) });
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.ok(await page.evaluate(() => document.querySelector('#method').offsetTop < document.querySelector('#rollouts').offsetTop));
      assert.ok(await page.evaluate(() => document.querySelector('#method .paper-figure').offsetTop < document.querySelector('.mechanism-films').offsetTop));
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForTimeout(100);
      assert.ok(await videos.evaluateAll(items => items.every(v => v.paused)));
      await videos.first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      assert.ok(await videos.first().evaluate(v => v.paused));
      await page.close();
      console.log(`${width}px: dimensions, playback, reduced motion, and overflow passed`);
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
