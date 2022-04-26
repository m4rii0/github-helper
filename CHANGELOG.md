# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2022-04-26

### Improved

- Generated branch name now limits to 60 characters
- Generated branch name now removes non-basic characters

## [1.0.0] - 2022-04-25

- v1 release 🥳
- New README
- Added LICENSE

### Breaking Changes

- Script remote name was renamed to `helper.user.js` breaking the remote reference in the previous releases.
A fresh installation is required to use the new remote name and get updates automatically. (Get it [here](https://raw.githubusercontent.com/m4rii0/github-helper/stable/src/helper.user.js))

## [0.3.3] - 2022-04-20

### Fixed

- Now loading the button and the text in all repos

## [0.3.2] - 2022-04-18

### Fixed

- Fixed issue that in some occasions the default branch name wasn't being replaced
- Removed button appearing in the pull requests section

### Refactored

- Refactored internal UI watcher to make it easy to check changes in the UI

## [0.3.1] - 2022-04-06

### Fixed

- Fixed a bug where text wasn't replaced on Firefox

## [0.3.0] - 2022-04-06

### Changed

- Versioning moved to Semantic Versioning

### Fixed

- Button and text on the 'Create a Branch' not appearing in some cases.

- Message not being generated if a `kind` label is not found.

## [0.2] - 2022-04-04

- First release