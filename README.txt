LEOPOLDS GEBURTSTAGSQUIZ
========================

START
-----
1. Entpacke den ZIP-Ordner.
2. Lege alle Videos DIREKT in denselben Ordner wie index.html.
3. Benenne sie so:
   Frage01.mp4
   Frage02.mp4
   ...
   Frage12.mp4
4. Öffne index.html im Browser.

Es ist kein Server und keine Installation nötig.

DATEIEN
-------
index.html       Aufbau der Website
styles.css       gesamtes Design
app.js           Quiz-Logik, Versuche, Animationen, Video-Steuerung
quiz-config.js   Fragen, Lösungen, Buchstaben und Dateinamen
README.txt       diese Anleitung

QUIZ-ABLAUF
-----------
- Insgesamt gibt es 12 Fragen und 12 Videos.
- Frage 01 ergibt die Zahl 12.
- Danach erscheinen 12 Platzhalter für das finale Lösungswort.
- Das Leerzeichen an Stelle 6 wird Leopold automatisch geschenkt.
- Die Fragen 02 bis 12 liefern die 11 Buchstaben.
- Bei einer richtigen Antwort fliegt der gewonnene Buchstabe in seinen Platzhalter.
- Pro Frage gibt es 3 Versuche.
- Nach 3 falschen Versuchen wird die richtige Lösung angezeigt.
- Groß-/Kleinschreibung wird ignoriert.
- Es wird KEIN Fortschritt gespeichert.
- Nach der letzten Frage wird "CANIS AUREUS" als Geschenk enthüllt.

VIDEOS
------
Die Videofläche ist für Handy-Hochformat (9:16) ausgelegt.
Die Videos werden mit object-fit: contain angezeigt und deshalb nicht abgeschnitten.

AKTUELL NOCH PROVISORISCH
-------------------------
Frage 08 (Kim / Buchstabe U):
Der vollständige Fragetext bzw. das eigentliche Lösungswort fehlt noch.
Aktuell wird testweise "U" akzeptiert.
Sobald die Frage feststeht, muss nur quiz-config.js angepasst werden.
