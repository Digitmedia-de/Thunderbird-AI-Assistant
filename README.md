# Thunderbird-N8N-Responder

Ein Thunderbird-Add-on zur automatischen E-Mail-Beantwortung mittels N8N-Integration.

## Features

- Sendet E-Mail-Inhalte an eine konfigurierbare N8N-API
- Empfängt automatisch generierte Antworten
- Fügt die Antwort direkt in die E-Mail-Komposition ein
- Unterstützt HTML und Plain-Text E-Mails
- Sichere API-Authentifizierung via Bearer Token

## Installation

1. Laden Sie die neueste Version des Add-ons herunter
2. Öffnen Sie Thunderbird
3. Gehen Sie zu: Menü → Add-ons und Themes
4. Klicken Sie auf das Zahnrad-Symbol und wählen "Add-on aus Datei installieren..."
5. Wählen Sie die heruntergeladene .xpi Datei aus

## Konfiguration

Nach der Installation müssen Sie folgende Einstellungen vornehmen:

1. Öffnen Sie die Add-on-Einstellungen
2. Konfigurieren Sie:
   - **API URL**: Die vollständige URL Ihres N8N-Endpoints
   - **API Key**: Ihr API-Schlüssel für die Authentifizierung

## Verwendung

1. Öffnen Sie eine neue E-Mail oder antworten Sie auf eine bestehende
2. Klicken Sie auf den "N8N Email Assistant" Button in der Compose-Toolbar
3. Die API-Antwort wird automatisch am Anfang Ihrer E-Mail eingefügt

## Fehlerbehandlung

- Bei fehlender Konfiguration erscheint eine Benachrichtigung
- API-Fehler werden in der Browser-Konsole protokolliert
- Bei ungültigem API-Key erscheint ein Popup-Fenster

## Technische Anforderungen

- Thunderbird Version 115.0 oder höher
- Aktive N8N-Installation mit konfiguriertem Workflow
- Gültige API-Zugangsdaten

## Entwicklung

Das Add-on basiert auf der WebExtension-API von Thunderbird und verwendet:
- JavaScript für die Hauptlogik
- HTML/CSS für die Benutzeroberfläche
- Fetch API für HTTP-Requests

## Lizenz

Entwickelt von Digitmedia e.K.