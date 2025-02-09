browser.composeAction.onClicked.addListener(async (tab) => {
    try {
      const details = await messenger.compose.getComposeDetails(tab.id);
      const storage = await browser.storage.local.get(['apiUrl', 'apiKey']);
      
      if (!storage.apiUrl || !storage.apiKey) {
        throw new Error('API URL and API Key must be configured');
      }
      
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
          plainText: details.plainText
        })
      });

      console.log('API Response:', response);
      
      if (!response.ok) {
        if (response.status === 403) {
          // Create notification window using local HTML file
          let notificationWindow = await messenger.windows.create({
            type: "popup",
            url: "/notifications/notification.html",
            width: 400,
            height: 200
          });
          
          // Auto-close after 3 seconds
          setTimeout(() => {
            messenger.windows.remove(notificationWindow.id);
          }, 3000);
          
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse and handle response
      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (responseData.code === 200) {
        const message = responseData.message;
        const currentDetails = await messenger.compose.getComposeDetails(tab.id);
        
        // Enhanced debugging
        console.log('Current Details:', {
          body: currentDetails.body,
          plainTextBody: currentDetails.plainTextBody
        });
        
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
      } else {
        console.log('Invalid server response');
      }
      
    } catch (error) {
      console.error('Error:', error);
      console.log('Error:', error.message);
    }
  });