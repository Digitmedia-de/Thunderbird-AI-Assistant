console.log('Notification script loaded');

// Function to resize window to fit content
function resizeWindowToContent() {
    setTimeout(() => {
        try {
            const body = document.body;
            const totalHeight = body.scrollHeight;
            // Use the actual measured height of the entire body
            const newHeight = Math.max(140, Math.min(totalHeight, 600));
            
            browser.windows.update(browser.windows.WINDOW_ID_CURRENT, {
                height: newHeight
            }).catch(error => {
                console.error('Failed to resize window:', error);
            });
            
            console.log('Window resized to height:', newHeight, 'Body height:', totalHeight);
        } catch (error) {
            console.error('Error resizing window:', error);
        }
    }, 200); // Slightly longer delay to ensure all content is rendered
}

// Listen for messages from the background script
browser.runtime.onMessage.addListener((message) => {
    console.log('Message received:', message);
    
    if (message.type === 'error') {
        try {
            const titleElement = document.getElementById('errorTitle');
            const messageElement = document.getElementById('errorMessage');
            
            if (titleElement && messageElement) {
                titleElement.textContent = message.title || 'Error';
                messageElement.textContent = message.message;
                console.log('Error message updated successfully');
                
                // Resize window to fit content
                resizeWindowToContent();
            } else {
                console.error('Error elements not found in DOM');
            }
        } catch (error) {
            console.error('Error updating notification:', error);
        }
    } else if (message.type === 'success') {
        try {
            const titleElement = document.getElementById('successTitle');
            const messageElement = document.getElementById('successMessage');
            
            if (titleElement && messageElement) {
                titleElement.textContent = message.title || 'Success';
                messageElement.textContent = message.message || 'Operation completed successfully';
                console.log('Success message updated successfully');
                
                // Resize window to fit content
                resizeWindowToContent();
            } else {
                console.error('Success elements not found in DOM');
            }
        } catch (error) {
            console.error('Error updating notification:', error);
        }
    }
});

// Resize window when page loads (for static content like loading popup)
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all content is rendered
    setTimeout(resizeWindowToContent, 100);
});