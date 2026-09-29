# BrowseGoal Extension

This is a Firefox/Chrome Extension that lets you set a goal when visiting a distracting website, and then keeps that goal on-screen so you don't forget.

# [Get for Firefox >](https://addons.mozilla.org/en-US/firefox/addon/browsegoal/)

# [Get for Chrome >](https://chrome.google.com/webstore/detail/browsegoal/fbjhfmebbdkmhgpmofcibfhegpiafpof)

## Submit feedback

If you have a Github account, submit an issue.

Otherwise, you can fill out [this google form](https://docs.google.com/forms/d/e/1FAIpQLSff96E7fury-1CBg1Tk5JN8ocEflXP98AC5Nd6rs89Q5IXIcQ/viewform?usp=sf_link).

## Dev setup
`src/manifest.json` is the Chrome (MV3) manifest and `src/manifest.firefox.json` is the Firefox (MV2) one.

To test in Chrome, load `src/` as an unpacked extension from `chrome://extensions`.

To test in Firefox, run `make firefox` from `src/`, then `web-ext run -s ../build/firefox`

To build, run `make` from `src/`. This puts both zips in `build/artifacts/`. Rebuilding a version that's already built fails unless you run `make FORCE=1`.

If you don't have web-ext, you can get it with `npm install --global web-ext`