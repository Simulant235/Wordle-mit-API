# Wordle-mit-API

Eine minimalistische Wordle-Variante in HTML, CSS und JavaScript. Spieler geben ein Fünf-Buchstaben-Wort ein, das per API geprüft wird. Richtige Buchstaben werden grün, falsche Position gelb, nicht enthalten grau angezeigt; Animationen und Fehlerprüfungen inklusive.

## Features

- 🎮 **Klassisches Wordle-Gameplay**: Rate ein deutsches 5-Buchstaben-Wort in 6 Versuchen
- 🎨 **Farbcodiertes Feedback**:
  - 🟩 Grün: Buchstabe ist korrekt und an der richtigen Position
  - 🟨 Gelb: Buchstabe ist im Wort, aber an der falschen Position
  - ⬜ Grau: Buchstabe ist nicht im Wort enthalten
- ✨ **Animationen**: Flüssige Animationen beim Eingeben und Aufdecken der Buchstaben
- 🔤 **Tastaturunterstützung**: Sowohl Bildschirmtastatur als auch physische Tastatur
- ✅ **API-Validierung**: Wortvalidierung über Dictionary API mit Fallback auf Wortliste
- 📱 **Responsive Design**: Funktioniert auf Desktop und Mobilgeräten
- 🌙 **Dunkles Theme**: Moderne, augenfreundliche Benutzeroberfläche

## Spielanleitung

1. Öffne `index.html` in deinem Browser
2. Gib ein 5-Buchstaben-Wort ein (entweder mit der Tastatur oder der Bildschirmtastatur)
3. Drücke ENTER, um deine Vermutung abzusenden
4. Beobachte das Farbfeedback:
   - Grüne Kacheln zeigen korrekte Buchstaben an der richtigen Position
   - Gelbe Kacheln zeigen Buchstaben, die im Wort vorkommen, aber an der falschen Position sind
   - Graue Kacheln zeigen Buchstaben, die nicht im Wort vorkommen
5. Du hast 6 Versuche, um das Wort zu erraten
6. Klicke auf "Neues Spiel", um ein neues Wort zu starten

## Technische Details

- **HTML**: Semantische Struktur mit Spielfeld, Tastatur und Nachrichten-Bereich
- **CSS**: Moderne Animationen und Übergänge, responsives Grid-Layout
- **JavaScript**: 
  - Vanilla JS ohne externe Abhängigkeiten
  - API-Integration mit [Free Dictionary API](https://dictionaryapi.dev/)
  - Fallback auf lokale Wortliste (70+ deutsche Wörter)
  - Event-Handler für Tastatur- und Maus-Eingaben

## Installation

Keine Installation erforderlich! Einfach die Repository-Dateien herunterladen und `index.html` in einem modernen Browser öffnen.

```bash
# Repository klonen
git clone https://github.com/Simulant235/Wordle-mit-API.git

# In das Verzeichnis wechseln
cd Wordle-mit-API

# index.html in deinem Browser öffnen
```

Oder starte einen lokalen Webserver:

```bash
# Mit Python 3
python3 -m http.server 8000

# Mit Node.js (npx)
npx http-server

# Dann öffne http://localhost:8000 in deinem Browser
```

## Projektstruktur

```
Wordle-mit-API/
├── index.html      # Hauptdatei mit HTML-Struktur
├── styles.css      # Styling und Animationen
├── script.js       # Spiellogik und API-Integration
└── README.md       # Diese Datei
```

## Browser-Unterstützung

- Chrome/Edge (empfohlen)
- Firefox
- Safari
- Opera

Moderne Browser mit ES6-Unterstützung erforderlich.

## Lizenz

MIT License - siehe LICENSE-Datei für Details.