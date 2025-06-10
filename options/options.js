// Function to calculate optimal popup size based on message content
function calculatePopupSize(message, title = '') {
  const baseWidth = 320;
  const baseHeight = 200; // More conservative base height
  const charWidth = 7;
  const lineHeight = 22;
  
  // Simplified calculation with generous padding
  const contentWidth = baseWidth - 80; // Conservative content width
  const charsPerLine = Math.floor(contentWidth / charWidth);
  const messageLines = Math.ceil(message.length / charsPerLine);
  
  // Base elements + dynamic content + generous padding
  const fixedElements = 140; // Icon, title, padding, margins
  const dynamicContent = messageLines * lineHeight;
  const estimatedHeight = Math.max(baseHeight, Math.min(fixedElements + dynamicContent, 600));
  
  return { width: baseWidth, height: estimatedHeight };
}

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
    }).then(() => {
        // Show success notification
        const successMessage = 'Your settings have been saved successfully.';
        const successTitle = 'Settings saved';
        const size = calculatePopupSize(successMessage, successTitle);
        
        browser.windows.create({
            url: browser.runtime.getURL("notifications/notification-success.html"),
            type: "popup",
            width: size.width,
            height: size.height
        }).then(async (notificationWindow) => {
            // Wait for window to load
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const tabs = await browser.tabs.query({windowId: notificationWindow.id});
            if (tabs && tabs.length > 0) {
                try {
                    await browser.tabs.sendMessage(tabs[0].id, {
                        type: 'success',
                        title: successTitle,
                        message: successMessage
                    });
                } catch (error) {
                    console.error('Failed to send message:', error);
                }
            }
            
            // Auto-close after 3 seconds
            setTimeout(() => {
                browser.windows.remove(notificationWindow.id);
            }, 3000);
        });
    });
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
