// Load stored settings
function loadOptions() {
    browser.storage.local.get(['apiUrl', 'apiKey']).then((result) => {
        document.querySelector("#apiUrl").value = result.apiUrl || '';
        document.querySelector("#apiKey").value = result.apiKey || '';
    });
}

// Save settings
function saveOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
        apiUrl: document.querySelector("#apiUrl").value,
        apiKey: document.querySelector("#apiKey").value
    });
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
