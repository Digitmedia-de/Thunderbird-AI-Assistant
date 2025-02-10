console.log('Notification script loaded');

// Listen for messages from the background script
browser.runtime.onMessage.addListener((message) => {
    console.log('Message received:', message);
    
    if (message.type === 'error') {
        try {
            const titleElement = document.getElementById('errorTitle');
            const messageElement = document.getElementById('errorMessage');
            
            if (titleElement && messageElement) {
                titleElement.textContent = message.title || 'Fehler';
                messageElement.textContent = message.message;
                console.log('Error message updated successfully');
            } else {
                console.error('Error elements not found in DOM');
            }
        } catch (error) {
            console.error('Error updating notification:', error);
        }
    }
});