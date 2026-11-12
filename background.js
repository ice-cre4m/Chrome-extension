const BLOCKED_PAGE_URL = chrome.runtime.getURL("blocked.html");

async function rebuildRules() {
  const { blockedDomains = [] } = await chrome.storage.local.get({
    blockedDomains: [],
  });

  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existingRules.map((rule) => rule.id);

  const addRules = blockedDomains.map((domain, index) => ({
    id: index + 1,
    priority: 1,
    action: {
      type: "redirect",
      redirect: { url: BLOCKED_PAGE_URL },
    },
    condition: {
      urlFilter: `||${domain}^`,
      resourceTypes: ["main_frame"],
    },
  }));

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds,
    addRules,
  });
}

chrome.runtime.onInstalled.addListener(rebuildRules);
chrome.runtime.onStartup.addListener(rebuildRules);

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.blockedDomains) {
    rebuildRules();
  }
});