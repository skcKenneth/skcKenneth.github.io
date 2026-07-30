import assert from "node:assert/strict";
import test from "node:test";
import {
  collectStaleScienceAssets,
  resolveWithin,
  validatePublishSvg,
  validateScienceProjects,
} from "./science-sync-policy.mjs";

function project(overrides = {}) {
  return {
    slug: "safe-project",
    title: "Safe project",
    summary: "A complete test project used to exercise publication policy.",
    status: "Reproducible study",
    year: 2026,
    topics: ["Testing"],
    methods: ["Assertions"],
    featured: false,
    technical_url: "https://example.com/technical",
    repository_url: "https://example.com/repository",
    code_available: false,
    data_available: false,
    student_suitable: true,
    last_updated: "2026-07-30",
    project_root: "safe-project",
    hero_image: "safe-project/figures/publish/result.svg",
    publish_assets: [{
      filename: "result.svg",
      alt: "A test result.",
      caption: "A test result caption.",
      generated_by: "test.mjs",
    }],
    ...overrides,
  };
}

test("normalizes an approved figures/publish source path", () => {
  const [validated] = validateScienceProjects([project()]);
  assert.equal(validated.publish_assets[0].source_path, "safe-project/figures/publish/result.svg");
});

test("rejects traversal in project_root", () => {
  assert.throws(
    () => validateScienceProjects([project({ project_root: "../private" })]),
    /unsafe path segment/,
  );
});

test("rejects unsafe filenames and undeclared hero images", () => {
  assert.throws(
    () => validateScienceProjects([project({
      publish_assets: [{
        filename: "../notebook.ipynb",
        alt: "Unsafe",
        caption: "Unsafe",
        generated_by: "test",
      }],
    })]),
    /unsafe publish filename/,
  );
  assert.throws(
    () => validateScienceProjects([project({ hero_image: "safe-project/figures/publish/other.svg" })]),
    /exactly match/,
  );
});

test("resolveWithin cannot escape its root", () => {
  assert.throws(() => resolveWithin("C:/approved", "../secret", "fixture"), /unsafe path segment/);
});

test("stale managed assets remain reported across repeated syncs", () => {
  const stale = collectStaleScienceAssets({
    assets: [],
    stale: [{ public_path: "/science/old/figure.svg", status: "stale-preserved" }],
  }, new Set());
  assert.equal(stale.length, 1);
  assert.equal(stale[0].status, "stale-preserved");
});

test("SVG policy requires accessibility text and explicit black labels", () => {
  assert.doesNotThrow(() => validatePublishSvg(
    '<svg><title>Result</title><desc>Details</desc><text style="fill: #111111">x</text></svg>',
    "valid.svg",
  ));
  assert.throws(
    () => validatePublishSvg('<svg><text fill="#cc0000">x</text></svg>', "invalid.svg"),
    /missing a non-empty SVG title/,
  );
});
