browser.composeAction.onClicked.addListener(async (tab) => {
    try {
      const details = await messenger.compose.getComposeDetails(tab.id);
      const storage = await browser.storage.local.get(['apiUrl', 'apiKey']);
      
      if (!storage.apiUrl || !storage.apiKey) {
        let notificationWindow = await messenger.windows.create({
          type: "popup",
          url: "/notifications/notification-error.html ",
          width: 400,
          height: 250
        });
        
        // Warte bis das Fenster vollständig geladen ist
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const tabs = await browser.tabs.query({windowId: notificationWindow.id});
        if (tabs && tabs.length > 0) {
          try {
            await browser.tabs.sendMessage(tabs[0].id, {
              type: 'error',
              title: 'Konfigurationsfehler',
              message: 'Bitte konfigurieren Sie die API URL und den API Key in den Einstellungen.'
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
      
      // Show loading notification
      let loadingWindow = await messenger.windows.create({
        type: "popup",
        url: "/notifications/notification-loading.html",
        width: 400,
        height: 250
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
            plainText: details.plainText
          })
        });

        // Close loading window
        await messenger.windows.remove(loadingWindow.id);

        console.log('API Response:', response);
        
        if (!response.ok) {
          let errorTitle = 'API Fehler';
          let errorMessage = 'Ein unerwarteter Fehler ist aufgetreten.';
          
          if (response.status === 403) {
            errorMessage = 'Der API Key ist ungültig oder fehlt.';
          } else if (response.status === 404) {
            errorMessage = 'Die API-URL konnte nicht gefunden werden.';
          }
          
          let notificationWindow = await messenger.windows.create({
            type: "popup",
            url: "/notifications/notification-error.html ",
            width: 400,
            height: 250
          });
          
          // Warte bis das Fenster vollständig geladen ist
          await new Promise(resolve => setTimeout(resolve, 500));
          
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