Kubikpreis-Rechner (Cubic Price Calculator)

Ein progressive Web App (PWA) zum Verwalten und Berechnen von Kubikpreisen verschiedener Holzarten mit Mehrsprachigkeit (Deutsch & Englisch) und Offline-Support.
⚙️ Features

    Mehrsprachigkeit: Deutsch und Englisch über Dropdown steuerbar

    Dark Mode: Automatisch oder manuell umschaltbar

    Holzartenverwaltung: Hinzufügen, Auswählen und Löschen von Holzarten über ein Dropdown

    Preiskalkulation: Berechnung von Gesamtpreisen basierend auf m³-Menge

    Persistenz: Alle Daten werden in localStorage gespeichert

    Offline-fähig: Service-Worker cached Assets für Offline-Nutzung

    Export-Funktion: Ergebnisse als Text- oder PDF-Datei herunterladen

    GitHub Pages: Einfache Veröffentlichung als Live-Demo

🚀 Installation & Deployment

    Clone das Repository:
    git clone https://github.com/teki1234/kubikpreis-pwa.git
    cd kubikpreis-pwa

    (Optional) Webserver starten, z. B. mit npx serve oder einer Entwicklungsumgebung.

    Ö ffne index.html im Browser oder besuche die GitHub Pages URL:

https://teki1234.github.io/kubikpreis-pwa/

## 📖 Nutzung

1. Sprache über das Dropdown oben rechts auswählen.
2. Neue Holzarten unter **"1. Neue Holzart speichern"** hinzufügen.
3. Unter **"2. Holzart auswählen & berechnen"** Menge eintragen und auf **Berechnen & speichern** klicken.
4. Zwischengespeicherte Positionen unter **Zwischengespeicherte Berechnungen** ansehen.
5. Mit den Export-Buttons PDF oder Text-Ausgabe generieren.

## 🛠️ Entwicklung

- `styles.css` – Alle Styles getrennt von Logik
- `app.js`      – Hauptlogik, Übersetzungen und Event-Handler
- `manifest.json` & `service-worker.js` – PWA-Konfiguration & Caching

### Lokaler Workflow

```bash
# Änderungen per Branch develop durchführen
git checkout -b feature/meine-aenderung
# nach Fertigstellung:
git add .
git commit -m "feat: Beschreibung der Änderung"
git push origin feature/meine-aenderung
📄 Lizenz

MIT © Teki1234


