# Email AI Assistant Add-on

A Thunderbird add-on for automatic email responses using AI API integration.

## Features

- Sends email content to a configurable REST API
- Receives automatically generated responses
- Inserts the response directly into the email composition
- Supports HTML and plain-text emails
- Secure API authentication via Bearer Token

## Installation

1. Download the latest version of the add-on
2. Open Thunderbird
3. Go to: Menu → Add-ons and Themes
4. Click on the gear icon and select "Install Add-on From File..."
5. Select the downloaded .xpi file

## Configuration

After installation, you need to configure the following settings:

1. Open the add-on settings
2. Configure:
   - **API URL**: The complete URL of the API endpoint
   - **API Key**: Your API key for authentication

## Usage

1. Open a new email or reply to an existing one
2. Click the "AI Reply" button in the compose toolbar
3. The API response will be automatically inserted at the beginning of your email

## API Request Format

The add-on sends requests to the API in the following format:

```json
{
  "body": {
    "subject": "Email Subject",
    "body": "Email content in HTML or plain-text format"
  }
}
```

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

## License

Developed by Digitmedia e.K.