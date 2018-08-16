
 "applications": {
  "gecko": {
    "id": "seekr@trendypublishing.com",
    "strict_min_version": "42.0"
  }
},

browser.menus.create({
  id: "seekrside",
  title: "autoSEEKr",
  contexts: ["all"]
});

browser.menus.onClicked.addListener() => {
  browser.sidebarAction.open();
};