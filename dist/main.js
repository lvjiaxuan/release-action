"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// src/main.ts
var core = __toESM(require("@actions/core"));
var github = __toESM(require("@actions/github"));
async function run() {
  try {
    const { owner, repo } = github.context.repo;
    const tagName = core.getInput("tag_name", { required: false }) || github.context.ref.replace("refs/tags/", "");
    const name = core.getInput("name", { required: false });
    const body = core.getInput("body", { required: false });
    const draft = core.getBooleanInput("draft", { required: false });
    const prerelease = core.getBooleanInput("prerelease", { required: false });
    const generateReleaseNotes = core.getBooleanInput("generate_release_notes", { required: false });
    const update = core.getBooleanInput("update", { required: false });
    core.info("Print inputs: " + JSON.stringify({
      owner,
      repo,
      tag_name: tagName,
      name,
      body,
      draft,
      prerelease,
      generate_release_notes: generateReleaseNotes
    }, null, 2));
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
    const id = await octokit.rest.repos.getReleaseByTag({ owner, repo, tag: tagName }).then(({ data: { id: id2 } }) => id2).catch(() => false);
    if (typeof id === "number") {
      core.info(`${tagName}'s release exists.`);
    } else {
      void octokit.rest.repos.createRelease({
        owner,
        repo,
        tag_name: tagName,
        name,
        body,
        draft,
        prerelease,
        generate_release_notes: generateReleaseNotes
      }).then(() => {
        core.info("Create a release successfully.");
      });
    }
  } catch (error) {
    if (error instanceof Error)
      core.setFailed(error.message);
  }
}
void run();
