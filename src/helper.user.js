// ==UserScript==
// @name         Github helper
// @namespace    https://github.com/m4rii0
// @version      1.1.1
// @description  Github helper to speed up your work
// @author       m4rii0
// @match        https://github.com/*
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @downloadURL  https://raw.githubusercontent.com/m4rii0/github-helper/stable/src/helper.user.js
// @updateURL    https://raw.githubusercontent.com/m4rii0/github-helper/stable/src/helper.user.js
// @grant        none
// @license      GNU General Public License v3.0
// ==/UserScript==

(function () {
  'use strict';

  let previousPath;

  let pathObserver;
  let newBranchObserver;

  const MAX_BRANCH_LENGTH = 60;

  const config = {
    regexes: {
      'issue-list': /^.*\/issues\/?$/,
      'issue-detail': /^.*\/issues\/\d+$/,
      'new-pull-request': /^.*\/compare\/.*?$/
    },
  };

  /* UI STUFF */
  const pathType = () => {
    const path = window.location.pathname;
    if (!path) return;

    return Object.keys(config.regexes).find(key => config.regexes[key].test(path));
  }

  const onPathChange = (currentPathType) => {
    switch (currentPathType) {
      case 'issue-detail':
        createButton();
        initNewBranchObserver();
        break;
      case 'new-pull-request':
        fillNewPrForm();
        break;
      default:
        break;
    }
  }

  const createButton = () => {
    const header = document.querySelector('.gh-header-actions');
    if (!header) return;

    let button = document.createElement('button');
    button.id = 'button-generate-branch-name';
    button.innerText = '★ Generate branch name';
    button.classList.add('btn', 'btn-sm', 'mr-2');
    button.onclick = () => prompt('Branch name', getBranchName());

    header.prepend(button);
  }

  const initNewBranchObserver = () => {
    newBranchObserver = new MutationObserver(newBranchCallBack);

    const target = document.querySelector('[data-target=\'create-issue-branch.details\']');
    if (!target) return;
    newBranchObserver.observe(target, { childList: true, attributes: true, subtree: true });
  }

  const fillNewPrForm = () => {
    const branchRegex = /(?<type>\w+)\/(GH-)?(?<id>\d+)-(?<title>.*)/;

    let branchName = document.querySelector('#head-ref-selector span');
    if (!branchName) return;

    branchName = branchName.innerText;

    let match = branchName.match(branchRegex);
    if (!match) return;

    let { id, title } = match.groups;

    // Tittle
    let prTitleInput = document.querySelector('#pull_request_title');
    if (prTitleInput) {
      prTitleInput.value = getPrTitle(branchName, title);
    }

    // Set the Closes #XXX in the body
    let pullRequestBody = document.querySelector('#pull_request_body');
    if (pullRequestBody && pullRequestBody.value === '') { // Only writing if it's empty
      pullRequestBody.value = `Closes #${id}`;
    }

    // Auto assign
    let assignYourselfButton = document.querySelector('#assignees-select-menu+span button');
    if (assignYourselfButton) {
      assignYourselfButton.click();
    }

    // Set PR in draft mode
    let draftButton = document.querySelector('#draft_on[value=\'on\']');
    if (draftButton) draftButton.click();
  }

  /* CALLBACKS */
  const onPathChangeCallback = () => {
    const path = window.location.pathname;
    if (path === previousPath) return;

    const currentPathType = pathType();
    if (!currentPathType) return;

    onPathChange(currentPathType);

    previousPath = path;
  }

  const newBranchCallBack = (mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList' && mutation.target.getAttribute('aria-label') === 'Create a branch for this issue') {
        document.getElementById('branch-name').value = getBranchName();
        break;
      }
    }
  }

  /* HELPERS */
  const getBranchPrefix = (kind) => {
    let prefix;
    switch (kind) {
      case 'bug':
        prefix = 'bugfix';
        break;
      default:
        prefix = kind;
        break;
    }

    return prefix;
  }

  const getBranchName = () => {
    let title = document.querySelector('h1 > span.js-issue-title').innerText;
    title = title
              .trim()
              .toLowerCase()
              .replaceAll(' ', '-')
              .replace(/[^\w\-]+/, '');

    let issueId = document.querySelector('h1 > .f1-light').innerText;
    issueId = issueId.replace('#', '');

    let kind = [...document.querySelectorAll('.js-issue-labels a span')].map(e => e.innerText).find(e => e.startsWith('kind/'));
    if (!kind) kind = 'CHANGEME';

    kind = kind.replace('kind/', '');
    const prefix = getBranchPrefix(kind);

    let branchName = `${prefix}/GH-${issueId}-${title}`;
    return branchName.substring(0, MAX_BRANCH_LENGTH);
  }

  const getPrTitle = (branchName = '', regexTitle = '') => {
    let title = regexTitle
      .replaceAll('-', ' ')
      .trim();

    title = title.charAt(0).toUpperCase() + title.slice(1); // Capitalize first letter

    if (branchName.length >= MAX_BRANCH_LENGTH) {
      title = title + '...';
    }
    return title;
  }


  const init = () => {
    pathObserver = new MutationObserver(onPathChangeCallback);
    let target = document.querySelector('.application-main');
    if (!target) return;

    pathObserver.observe(target, { childList: true, subtree: true });
  }

  init();
})();
