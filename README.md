# Email AI Assistant Add-on

A Thunderbird add-on for automatic email responses using AI API integration.

## Features

- Sends email content to a configurable REST API
- Receives automatically generated responses
- Inserts the response directly into the email composition
- Supports HTML and plain-text emails
- Secure API authentication via Bearer Token

## Installation

### Installation from the Thunderbird Add-on Store

1. Visit the add-on page at: [https://addons.thunderbird.net/de/thunderbird/addon/ai-email-assistant/](https://addons.thunderbird.net/de/thunderbird/addon/ai-email-assistant/)
2. Click on "Add to Thunderbird"
3. Follow the installation instructions

### Installation from File

1. Download the latest version of the add-on (.xpi file)
2. Open Thunderbird
3. Go to: Menu → Add-ons and Themes
4. Click on the gear icon and select "Install Add-on From File..."
5. Select the downloaded .xpi file

### Installation from Folder (for Developers)

1. Clone or download the repository
2. Open Thunderbird
3. Go to: Menu → Add-ons and Themes
4. Click on the gear icon and select "Debug Add-ons..."
5. Click "Load Temporary Add-on..." and select the `manifest.json` file from the project folder

## Configuration

After installation, you need to configure the following settings:

1. Open the add-on settings
2. Configure:
   - **API URL**: The complete URL of the API endpoint
   - **API Key**: Your API key for authentication

## Important Note on API Integration

**Please note:** This add-on requires a custom API endpoint that processes email content and returns AI-generated responses. Direct API endpoints from OpenAI, Anthropic Claude, or Google Gemini **cannot be used directly** with this add-on.

You will need to develop or deploy an intermediary API service that:
1. Receives the email content from this add-on
2. Processes it through your preferred AI service
3. Returns the response in the expected format

For non-developers, NoCode solutions like [n8n](https://n8n.io/) offer an excellent way to build this integration without coding experience. n8n allows you to create workflows that connect this add-on to various AI services through their APIs.

## Usage

1. Open a new email or reply to an existing one
2. Click the "AI Reply" button in the compose toolbar
3. The API response will be automatically inserted at the beginning of your email

## API Request Format

The add-on sends requests to the API in the following format:

```json
{
  "subject": "Email Subject",
  "body": "Email content in HTML format",
  "plainText": "Email content in plain-text format",
  "from": "sender@example.com",  // The local email account being used
  "to": ["recipient1@example.com", "recipient2@example.com"]  // The recipient(s) of the email
}
```

### API Authentication

The API Key is sent in the HTTP request header as a Bearer token:

```
Authorization: Bearer your-api-key-here
```

This ensures that your API credentials are securely transmitted with each request while keeping them separate from the request body.

## API Response Format

The API responds in the following format:

```json
{
  "code": 200,
  "message": "The generated response appears here"
}
```

The response is automatically extracted from the `message` field and inserted into the email.

## Error Handling

- Missing configuration triggers a notification
- API errors are logged in the browser console
- Invalid API key triggers a popup window

## Technical Requirements

- Thunderbird version 115.0 or higher
- Access to a compatible API endpoint
- Valid API credentials

## Development

The add-on is based on Thunderbird's WebExtension API and uses:
- JavaScript for core logic
- HTML/CSS for user interface
- Fetch API for HTTP requests

## Changelog

### Version 0.1.4
- Extended API request: Sender (`from`) and recipient (`to`) information are now included in the API request
- Success notification: A confirmation popup "Settings saved" now appears after saving settings
- Localization: All user interface texts have been translated from German to English

### Version 0.1.2
- Initial release

## License

Developed by Digitmedia e.K.