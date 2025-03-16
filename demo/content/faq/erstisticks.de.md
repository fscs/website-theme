---
title: Ersti-Stick-FAQ
lastmod: "2024-09-29T00:00:00+01:00"
---

Fertige Ersti-Sticks mit der Ersti-VM könnt ihr euch bei uns in der Fachschaft abholen. In der ersten Vorlesungswoche verteilen wir sie außerdem in der Vorlesung an Erstsemester.

Mit der <a href="https://de.wikipedia.org/wiki/Virtuelle_Maschine">Virtuellen Maschine</a> (VM) habt ihr die Möglichkeit, ein fürs Studium fertig eingerichtetes Linux-System innerhalb eures aktuellen Betriebssystems zu verwenden. Gerade für Windows-Nutzer ist dies am Anfang ggf. einfacher als die Einrichtung der Programme unter Windows. macOS- und Linux-Benutzer können die benötigte Software einfach selbst installieren; die Nutzung der VM für diese Benutzer ist auch möglich, aber nicht von uns empfohlen.

## Das Wichtigste kurzgefasst (WIP)

- **Version** WiSe 2024, Stand 28.09.2024 17 Uhr
- Alle Ersti-Stick Dateien + Anleitung: <a href="https://uni-duesseldorf.sciebo.de/s/HkJgx4knagURhsM">Download</a>
- <a rel="noreferrer noopener" href="https://www.virtualbox.org/" target="_blank">VirtualBox</a>
- Die VM hat nur 20 GB Speicherplatz. <a href="https://nextcloud.inphima.de/s/dALz2pfL63j9KbH">Hier</a> findet ihr eine Videoanleitung zur Vergrößerung.

## Ich habe keinen USB-Stick bekommen.

Wer keinen USB-Stick bekommen hat, kann sich die Ersti-VM auch oben herunterladen. Zur Benutzung wird außerdem eine Virtualisierungs-Software wie <a href="https://www.virtualbox.org/">VirtualBox</a> benötigt.

Die Ersti-VM läuft mit Linux Mint 22, dass für Anfänger geeignet ist. Da dieses Setup jedoch bei den meisten Laptops mit Performance Problemen auskommen muss, empfehlen wir ein Dual-Boot Setup aufzusetzen. Zu dem Thema "Dual-Boot Windows Linux" findet man online genug Tutorials und wir empfehlen hier ebenfalls Linux Mint als System.

## Was muss ich tun, damit ich die VM nutzen kann?

Der Stick muss an einem beliebigen USB-Port am Computer eingesteckt sein. Auf dem Computer muss <a href="https://www.virtualbox.org/">VirtualBox</a> installiert sein. Wenn man VirtualBox gestartet hat, geht man auf Datei → Appliance importieren und wählt die .ova Datei auf dem USB-Stick aus. Danach klickt man mehrfach auf weiter, sodass die VM importiert wird. Hierbei sollte man darauf achten, wie viele Ressourcen (CPU/Arbeitsspeicher) von einem selbst zur Verfügung gestellt werden. Wir empfehlen 50% des Arbeitsspeichers (vermutlich 4096 MB) und 50% der Prozessoren von der CPU (vermutlich 4 Kerne) freizugeben. Je mehr man zu Verfügung stellt, desto mehr Rechenleistung wird eurem Hostsystem temporär entzogen und der VM zur Verfügung gestellt. Falls es bei der Nutzung zu hohen Verzögerungen kommt, sollte man seine aktuelle Auslastung überprüfen und ggf. Anwendungen im Hostsystem (Browser, etc.) beenden. Die gesamte Konfiguration dauert ca. 2–5 Minuten und schon kann man die VM per Doppelklick starten.

Das Passwort der VM lautet „hhu“. Auf der VM sind Guest-Additions installiert. Das heißt, dass man per Copy&Paste zwischen PC und VM kopieren kann (und unter anderem einen Shared-Folder nutzen kann). Sollte in eurer VM diese Funktion fehlen, empfiehlt es sich über das Menü die Guest-Additions neu zu installieren. Solltet ihr Probleme damit haben einen Shared-Folder einzurichten, folgt folgender <a href="https://www.howtogeek.com/189974/how-to-share-your-computers-files-with-a-virtual-machine/">Anleitung</a>.

## Ich bekomme eine Fehlermeldung, dass Hardwarebeschleunigung nicht aktiviert ist.

VirtualBox benötigt VT-x/AMD-V, um die virtuelle Maschine ausführen zu können. Die Funktion kann im BIOS/EFI des Rechners aktiviert werden (es sei denn, dein Rechner ist seeeehr alt, dann geht das evtl. nicht). Je nach Rechner funktioniert dies unterschiedlich. Falls du nicht weiterkommst, kannst du uns um Hilfe fragen.

## Wie kann ich die Auflösung ändern?

Einfach unten links das Menü öffnen und “Anzeige” eintippen. Danach erscheint ein Fenster, wo man die passende Auflösung auswählen kann.
{{< img "images/faq/aufloesung.png">}}

## Wie öffne ich ein Terminal?

Einfach unten links das Menü öffnen und “Terminal” eintippen. Ebenfalls sollte die Tastenkombination STRG+ALT+T das Terminal öffnen. Eine andere Möglichkeit ist, ALT+F2 zu drücken und dort “Terminal” einzutippen.

{{< img "images/faq/terminal.png">}}

## Die VM hat kein Internet

VirtualBox hat leider aktuell den Fehler, dass die VM kein Internet hat, wenn keine Internetverbindung bestand, als die VM gestartet wurde. Um das Problem ohne VM-Neustart zu beheben, klicke mit der rechten Maustaste unten rechts im VM-Fenster auf das Netzwerk-Symbol (zwei Computer) von VirtualBox und nehm den Haken raus und setze danach den Haken wieder. Jetzt sollte die VM eine Internetverbindung haben.
{{< img "images/faq/netzwerkadapter.png" >}}

## Wie erstellt man eine zip-Datei?

Im Dateimanager wählt man die zu packenden Dateien und Ordner aus, klickt mit der rechten Maustaste auf eine markierte Datei bzw. Ordner und wählt <span style="color:var(--bs-orange)">Archiv erstellen… → .zip</span>.

Alternativ kann man auch über die Konsole Dateien und Ordner in eine zip-Datei packen. Das geht mit dem Befehl `zip -r dateinamen.zip dateiOderOrdner1 dateiOderOrdner2 …`.

## Sonstige Fragen

Bei anderen Problemen helfen Google oder wir persönlich in der Fachschaft, per Mail oder im <a href="https://rocketchat.hhu.de/channel/fscs">Rocket.Chat</a>. Allgemeine Informationen zu (X)Ubuntu findet man auch unter <a href="https://wiki.ubuntuusers.de/">https://wiki.ubuntuusers.de/</a>.

### Der Festplattenspeicher reicht nicht

Hier gibt es ein Video zum Download, wo gezeigt wird wie die Festplatte vergößert wird.

Zusammengefasst:

1. Virtuelle Festplatte in VirtualBox vergrößern
2. Gparted installieren
3. Bei Gparted die Festplatte mit dem freien Speicher vergrößern
4. Die Partition vergrößern

## Hilfreiche Videos (alte VM Version)

{{< youtube PYJxXtxol4s >}}

{{< youtube sIxy2eQMNy8 >}}
