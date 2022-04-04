// ==UserScript==
// @name         Github helper
// @namespace    https://github.com/m4rii0
// @version      0.2
// @description  Github helper
// @author       m4rii0
// @match        https://github.com/*/issues
// @match        https://github.com/*/issues/*
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @downloadURL  https://raw.githubusercontent.com/m4rii0/github-helper/stable/src/script.js
// @updateURL    https://raw.githubusercontent.com/m4rii0/github-helper/stable/src/script.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const getBranchPrefix = (kind) => {
    let prefix;
    switch (kind) {
      case "bug":
        prefix = "bugfix";
        break;
      default:
        prefix = kind;
        break;
    }

    return prefix;
  }

  const onClick = () => {
    prompt("Branch name", getBranchName());
  }

  const getBranchName = () => {
    let title = document.querySelector("h1 > span.js-issue-title").innerText;
    title = title.trim().toLowerCase().replaceAll(" ", "-");

    let issueId = document.querySelector("h1 > .f1-light").innerText;
    issueId = issueId.replace("#", "");

    let kind = [...document.querySelectorAll(".js-issue-labels a span")].map(e => e.innerText).find(e => e.startsWith("kind/"));
    if (kind === null) kind = "CHANGEME";

    kind = kind.replace("kind/", "");
    const prefix = getBranchPrefix(kind);
    const branchName = `${prefix}/GH-${issueId}-${title}`;

    return branchName;
  }

  const createButton = () => {
    if (document.getElementById("button-generate-branch-name") != null) return;

    const header = document.querySelector(".gh-header-actions");
    if (header == null) return;
    let button = document.createElement("button");
    button.id = "button-generate-branch-name";
    button.innerText = "★ Generate branch name";
    button.classList.add("btn", "btn-sm", "mr-2");
    button.onclick = onClick;

    header.prepend(button);
  }

  const initObserver = () => {
    let targetNode = document.querySelector('[data-target=\'create-issue-branch.details\']');
    let config = { childList: true, attributes: false, subtree: true };

    const obvCallback = (mutationsList, obv) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.target.ariaLabel === 'Create a branch for this issue') {
          document.getElementById('branch-name').value = getBranchName();
          return;
        }
      }
    }

    let observer = new MutationObserver(obvCallback);
    observer.observe(targetNode, config);
  }

  createButton();
  initObserver();
})();