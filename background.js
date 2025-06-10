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

browser.composeAction.onClicked.addListener(async (tab) => {
    try {
      const details = await messenger.compose.getComposeDetails(tab.id);
      const storage = await browser.storage.local.get(['apiUrl', 'apiKey']);
      
      if (!storage.apiUrl || !storage.apiKey) {
        const errorMessage = 'Please configure the API URL and API Key in the settings.';
        const errorTitle = 'Configuration Error';
        const size = calculatePopupSize(errorMessage, errorTitle);
        
        let notificationWindow = await messenger.windows.create({
          type: "popup",
          url: "/notifications/notification-error.html",
          width: size.width,
          height: size.height
        });
        
        // Wait until the window is fully loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const tabs = await browser.tabs.query({windowId: notificationWindow.id});
        if (tabs && tabs.length > 0) {
          try {
            await browser.tabs.sendMessage(tabs[0].id, {
              type: 'error',
              title: errorTitle,
              message: errorMessage
            });
            console.log('Error message sent to notification window');
          } catch (error) {
            console.error('Failed to send message:', error);
          }
        }
        
        setTimeout(() => {
          messenger.windows.remove(notificationWindow.id);
        }, 5000);
        
        return;
      }
      
      // Show loading notification
      let loadingWindow = await messenger.windows.create({
        type: "popup",
        url: "/notifications/notification-loading.html",
        width: 320,
        height: 180
      });
      
      try {
        // Send to API
        const response = await fetch(storage.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storage.apiKey}`
          },
          body: JSON.stringify({
            subject: details.subject,
            body: details.body,
            plainText: details.plainText,
            from: details.from,
            to: details.to
          })
        });

        // Close loading window
        await messenger.windows.remove(loadingWindow.id);

        console.log('API Response:', response);
        
        if (!response.ok) {
          let errorTitle = 'API Error';
          let errorMessage = 'An unexpected error occurred.';
          
          if (response.status === 403) {
            errorMessage = 'The API key is invalid or missing.';
          } else if (response.status === 404) {
            errorMessage = 'The API URL could not be found.';
          }
          
          const size = calculatePopupSize(errorMessage, errorTitle);
          
          let notificationWindow = await messenger.windows.create({
            type: "popup",
            url: "/notifications/notification-error.html",
            width: size.width,
            height: size.height
          });
          
          // Wait until the window is fully loaded
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const tabs = await browser.tabs.query({windowId: notificationWindow.id});
          if (tabs && tabs.length > 0) {
            try {
              await browser.tabs.sendMessage(tabs[0].id, {
                type: 'error',
                title: errorTitle,
                message: errorMessage
              });
              console.log('Error message sent to notification window');
            } catch (error) {
              console.error('Failed to send message:', error);
            }
          }
          
          setTimeout(() => {
            messenger.windows.remove(notificationWindow.id);
          }, 10000);
          
          return;
        }

        // Parse and handle response
        const responseData = await response.json();
        console.log('API Response:', responseData);

        if (responseData.code === 200) {
          const message = responseData.message;
          const currentDetails = await messenger.compose.getComposeDetails(tab.id);
          
          // Determine composition mode and append message at the end
          if (currentDetails.body && currentDetails.body.trim() !== "") {
            // Find the position after <body> tag to insert the message at the start
            const bodyContent = currentDetails.body;
            const bodyStart = bodyContent.indexOf('<body>') + 6;
            
            const newBody = 
              bodyContent.substring(0, bodyStart) + 
              `${message}<br><br>` +
              bodyContent.substring(bodyStart);
            
            await messenger.compose.setComposeDetails(tab.id, {
              body: newBody
            });
            console.log('HTML: message inserted at start');
          } else if (currentDetails.plainTextBody && currentDetails.plainTextBody.trim() !== "") {
            await messenger.compose.setComposeDetails(tab.id, {
              plainTextBody: `${message}\n\n${currentDetails.plainTextBody}`
            });
            console.log('Plain text: message added at start');
          } else {
            console.log('Fallback: no valid content detected');
          }
          
          // Show success notification
          const successMessage = 'AI response has been added to your email.';
          const successTitle = 'Response Added';
          const successSize = calculatePopupSize(successMessage, successTitle);
          
          let successWindow = await messenger.windows.create({
            type: "popup",
            url: "/notifications/notification-success.html",
            width: successSize.width,
            height: successSize.height
          });
          
          // Wait for window to load
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const successTabs = await browser.tabs.query({windowId: successWindow.id});
          if (successTabs && successTabs.length > 0) {
            try {
              await browser.tabs.sendMessage(successTabs[0].id, {
                type: 'success',
                title: successTitle,
                message: successMessage
              });
            } catch (error) {
              console.error('Failed to send success message:', error);
            }
          }
          
          // Auto-close after 3 seconds
          setTimeout(() => {
            messenger.windows.remove(successWindow.id);
          }, 3000);
          
        } else {
          console.log('Invalid server response');
        }
        
      } catch (error) {
        // Close loading window on error
        await messenger.windows.remove(loadingWindow.id);
        throw error;
      }
      
    } catch (error) {
      console.error('Error:', error);
      console.log('Error:', error.message);
    }
});