"""Render the paper's existing figures without changing experimental data."""

import argparse
import hashlib
import json
import re
import subprocess
from pathlib import Path

import pymupdf


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("manuscript", type=Path)
    args = parser.parse_args()
    source = args.manuscript.resolve()
    assets = Path(__file__).resolve().parents[1] / "assets"
    figures = {
        "teaser.png": "flexiworld-teaser.pdf",
        "training.png": "odyssey-training.pdf",
        "arcem.png": "odyssey-arcem.pdf",
        "action-diagnostics.png": "action_diagnostics.pdf",
        "frozen-probes.png": "appendix_dynamics_probes.pdf",
        "paired-recovery.png": "appendix_recovery.pdf",
    }
    provenance = {
        "manuscriptCommit": subprocess.check_output(
            ["git", "rev-parse", "HEAD"], cwd=source, text=True
        ).strip(),
        "files": {},
    }
    for output, name in figures.items():
        path = source / "figures" / name
        with pymupdf.open(path) as doc:
            page = doc[0]
            scale = 2400 / page.rect.width
            pixmap = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), alpha=False)
            pixmap.save(assets / output)
        provenance["files"][output] = {
            "source": f"figures/{name}",
            "sourceSha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "sha256": hashlib.sha256((assets / output).read_bytes()).hexdigest(),
        }
    tex = (source / "iclr2027_conference.tex").read_text()
    abstract = tex.split(r"\begin{abstract}", 1)[1].split(r"\end{abstract}", 1)[0]
    abstract = re.sub(r"(?<!\\)%[^\n]*", "", abstract)
    abstract = abstract.replace(r"\%", "%").replace(r"$1.3\times$", "1.3\u00d7")
    provenance["abstract"] = " ".join(abstract.split())
    provenance["textSources"] = {}
    for name in ["iclr2027_conference.tex", "appendix/experimental_details.tex",
                 "appendix/failure_modes.tex", "sections/experiments.tex"]:
        provenance["textSources"][name] = hashlib.sha256((source / name).read_bytes()).hexdigest()
    (assets / "paper-content.json").write_text(json.dumps(provenance, indent=2) + "\n")
    manifest_path = assets / "provenance.json"
    manifest = json.loads(manifest_path.read_text())
    for name, evidence in provenance["files"].items():
        manifest["files"][name] = evidence["sha256"]
    manifest["paperContentManifest"] = "paper-content.json"
    manifest["paperFigureCommit"] = provenance["manuscriptCommit"]
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Rendered {len(figures)} paper figures; recorded the source abstract and checksums.")


if __name__ == "__main__":
    main()
