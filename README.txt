LEOPOLDS GEBURTSTAGSQUIZ
========================

START
-----
1. Entpacke den ZIP-Ordner.
2. Im Quiz-Ordner gibt es den Unterordner "files".
3. Lege dort alle Videos und Bilder hinein:
   files/Frage01.mp4
   files/Frage02.mp4
   ...
   files/Frage12.mp4
   files/Bild1.png
   files/Bild2.png
4. Öffne index.html im Browser.

Es ist kein Server und keine Installation nötig.

DATEIEN
-------
index.html       Aufbau der Website
styles.css       gesamtes Design
app.js           Quiz-Logik, Versuche, Animationen, Video-Steuerung
quiz-config.js   Fragen, Lösungen, Buchstaben und Dateinamen
files/           alle Videos und Bilder
README.txt       diese Anleitung

VIDEO-ABLAUF
-------------
- Der Videoplayer selbst besitzt keinerlei sichtbare Steuerelemente.
- Vor dem Start ist das Video extrem verschwommen.
- Der Button rechts startet das Video mit "Los geht's!".
- Während das Video läuft, ist der Button deaktiviert und zeigt die Restzeit an.
- Nach dem vollständigen Abspielen erscheint anstelle des Videos ein Bild.
- Der Button wird danach zu "Nochmal abspielen".
- Bei erneutem Abspielen wird wieder das Video eingeblendet.
- Bild1.png und Bild2.png werden aktuell abwechselnd verwendet.

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

AKTUELL NOCH PROVISORISCH
-------------------------
Frage 08 (Kim / Buchstabe U):
Der vollständige Fragetext bzw. das eigentliche Lösungswort fehlt noch.
Aktuell wird testweise "U" akzeptiert.
Sobald die Frage feststeht, muss nur quiz-config.js angepasst werden.
