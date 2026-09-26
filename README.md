# FlexiWorld

Research project page for **FlexiWorld: Learning and Planning via Flexible Action
Chunks Across Multiple Time Scales**.

Shidu Ren (Project Lead), Qilin Gu, Zhenghao Ni, Junhan Sun, Jiaqi Wang,
Damien Scieur, Yunze Liu.
The first three authors contributed equally. Shidu Ren is also Project Lead.

## Website

Live page: https://shidu-ren.github.io/flexiworld/

A self-contained static site for GitHub Pages. Open `index.html` directly in a
browser; no build step, web server, analytics, or third-party runtime requests
are required. All links also work under a GitHub Pages repository subpath.

- Recorded four-benchmark, five-way comparisons with synchronized playback,
  seek, speed controls, goal enlargement, and ten verified cases.
- Interactive benchmark and planner results; exact means and SDs are taken
  from the manuscript tables, not inferred from selected recordings.
- A conceptual, animated action-partition field and chunk-boundary schematic.
  These are explanatory visuals, not scientific measurements.
- Downloadable manuscript and structured results; paired videos play on the page.
- Keyboard navigation, mobile layouts, reduced-motion support, locally hosted fonts.

This is the **website repository**, not the training implementation. It does not
claim a model-code release or conference acceptance. The named website is kept
separate from the anonymous manuscript source.

## Provenance and updates

`assets/provenance.json` records the source manuscript commit and checksums of
copied media. `assets/recording-manifest.json` preserves the verified recording
metadata. `assets/results.json` contains the plotted numbers and seed protocol.

To refresh the assets from a local manuscript checkout:

```sh
node scripts/prepare-assets.mjs /path/to/manuscript
```

The script validates the media hashes and reads the existing paper tables. It
does not train models, generate experimental trajectories, change paper results,
or access a cluster. Review updated assets before publishing.

## Browser checks

```sh
npm install
npm test
```

Chrome must be installed. Tests cover all ten cases, actual video pixels,
synchronized playback, seeking, filters, diagrams, image dialogs, downloads,
five viewport widths, and reduced motion. `qa/` is local-only.

To test the deployed page, set `SITE_URL` to its URL before `npm test`.

## GitHub Pages

Publish the `main` branch, root directory, in Settings > Pages. The `.nojekyll`
file disables Jekyll processing. The site needs no secrets or build services.

## Design references and credits

The implementation is original. The content-first media structure takes cues
from [Nerfies](https://nerfies.github.io/), the task-wise demonstrations from
[Diffusion Policy](https://diffusion-policy.cs.columbia.edu/), and the visual
research narrative from [V-JEPA](https://ai.meta.com/research/vjepa/).
No third-party research videos or illustrations are reproduced.

Lucide icons: ISC license in `assets/LUCIDE-LICENSE`.
Space Grotesk: SIL Open Font License in `assets/SPACE-GROTESK-LICENSE`.
Research assets and manuscript retain their original ownership.
