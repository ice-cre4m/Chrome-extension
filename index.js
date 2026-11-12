const input = document.getElementById("domainInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");

function normalizeDomain(raw) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];
}

function render(domains) {
  list.innerHTML = "";
  if (domains.length === 0) {
    list.innerHTML = '<div class="empty"> No sites blocked yet. </div>';
    return;
  }
  domains.forEach((domain) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = domain;
    const remove = document.createElement("span");
    remove.className = "remove";
    remove.textContent = "x";
    remove.addEventListener("click", () => removeDomain(domain));
    li.append(span, remove);
    list.appendChild(li);
  });
}

function loadDomains() {
  chrome.storage.local.get({ blockedDomains: [] }, ({ blockedDomains }) => {
    render(blockedDomains);
  });
}

function addDomain() {
  const domain = normalizeDomain(input.value);
  if (!domain) return;
  chrome.storage.local.get({ blockedDomains: [] }, ({ blockedDomains }) => {
    if (!blockedDomains.includes(domain)) {
      blockedDomains.push(domain);
      chrome.storage.local.set({ blockedDomains }, () => {
        input.value = "";
        render(blockedDomains);
      });
    }
  });
}

function removeDomain(domain) {
  chrome.storage.local.get({ blockedDomains: [] }, ({ blockedDomains }) => {
    const updated = blockedDomains.filter((d) => d !== domain);
    chrome.storage.local.set({ blockedDomains: updated }, () =>
      render(updated),
    );
  });
}

addBtn.addEventListener("click", addDomain);
input.addEventListener("keydown", (e) => {
  if (e.key == "Enter") addDomain();
});

loadDomains();