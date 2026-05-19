# Hacibaba — Webshop To-Do

Stundensatz: **gestaffelt nach Feature-Typ** — günstige Pflichtfeatures damit kein Kunde drauf verzichtet, teure Specials damit nur echte Budget-Kunden sie beauftragen:

| Typ          | Rate    | Wann                                                |
| ------------ | ------- | --------------------------------------------------- |
| **Basis**    | 50 €/h  | Standard-Feature jedes Shops — günstig kalkuliert   |
| **Standard** | 65 €/h  | Wichtige Verbesserung mit klarem Nutzen             |
| **Wachstum** | 85 €/h  | Konversions- und Retention-Booster                  |
| **Premium**  | 110 €/h | Aufwändige Specials — nur bei entsprechendem Budget |

Preistag `0 €` = gesetzliche Pflicht oder technische Grundvoraussetzung.
Schätzungen gelten für **KI-gestützte Entwicklung**. Reine Redaktions- oder Design-Arbeit ist gesondert gekennzeichnet.

> **Hinweis fur Claude:** Eigeninitiativ werden nur noch To-Dos des Typs **Standard** umgesetzt. Alle anderen Typen (Basis, Wachstum, Premium) werden ausschliesslich bearbeitet, wenn der Nutzer sie explizit beim Namen nennt - niemals einfach so.

---

## I. Gesetzliche Pflichten

> Kein Shop darf ohne diese Punkte in Deutschland live sein.

| #   | Aufgabe                                                                                                                                                                             | ⏱    | 💶  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | --- |
| 1   | ~~**Impressum** `/impressum` — Firmenname, Adresse, Geschäftsführer, USt-IdNr., Handelsregisternummer~~ ✅                                                                          | 0.5h  | 0 € |
| 2   | ~~**Datenschutzerklärung** `/datenschutz` — DSGVO-konform: Stripe als Auftragsverarbeiter, Google OAuth, Newsletter, Hosting, Rechte des Nutzers~~ ✅                               | 1h    | 0 € |
| 3   | ~~**AGB** `/agb` — Vertragsschluss, Zahlungsbedingungen, Eigentumsvorbehalt, anwendbares Recht~~ ✅                                                                                 | 0.5h  | 0 € |
| 4   | ~~**Widerrufsbelehrung** `/widerruf` — 14-Tage-Recht, Musterformular als Download-Link~~ ✅                                                                                         | 0.5h  | 0 € |
| 5   | ~~**Lieferbedingungen** `/lieferbedingungen` — Versandzeiten, Partner, Lieferzonen, Transportschäden~~ ✅                                                                           | 0.25h | 0 € |
| 6   | ~~**Cookie-Consent-Banner** — DSGVO: technisch notwendige vs. Analyse-Cookies, Ablehnen prominent, Einwilligung vor Analytics~~ ✅                                                  | 2h    | 0 € |
| 7   | ~~**MwSt.-Anzeige** — "inkl. 7 % MwSt." (Lebensmittel!) überall wo Preise stehen, im Checkout und auf Produktseiten~~ ✅                                                            | 0.25h | 0 € |
| 8   | ~~**Preisangabenverordnung** — Versandkosten von Anfang an sichtbar (PAngV), nicht erst Schritt 2 im Checkout~~ ✅                                                                  | 0.25h | 0 € |
| 9   | ~~**Allergenkennzeichnung** — EU-LMIV: 14 Hauptallergene per Integer-Flags im Schema, Admin-UI (Checkboxen), Anzeige als Badges auf Produktseite~~ ✅                               | 1h    | 0 € |
| 10  | ~~**Zutaten- und Nährwertangaben** — Zutatenliste (mehrsprachig), Nährwerttabelle pro 100g als JSON, Admin-UI, Anzeige auf Produktseite~~ ✅                                        | 0h    | 0 € |
| 11  | ~~**MHD-Hinweis** — `shelf_life_months` im Schema, Admin-Feld, Anzeige auf Produktseite~~ ✅                                                                                        | 0h    | 0 € |
| 12  | ~~**Account-Löschfunktion** — DSGVO Art. 17: Recht auf Vergessenwerden. Formular im Kundenkonto, löscht alle personenbezogenen Daten außer steuerlich notwendiger Bestelldaten~~ ✅ | 1h    | 0 € |
| 13  | ~~**Datenexport für Kunden** — DSGVO Art. 20: JSON/CSV-Download aller eigenen Daten im Kundenkonto~~ ✅                                                                             | 1.5h  | 0 € |
| 14  | ~~**Newsletter Double-Opt-In** — Aktuell einfaches Speichern der E-Mail, was nach UWG §7 rechtswidrig ist. Bestätigungs-E-Mail mit Token-Link, erst dann aktiv setzen~~ ✅          | 1h    | 0 € |

**Summe: ~10h · 0 €** _(Pflicht, kein optionaler Aufschlag)_

---

## II. E-Mail-System

> SMTP ist konfiguriert aber toter Code. Komplette Infrastruktur fehlt.

| #   | Aufgabe                                                                                                                                                    | ⏱    | 💶    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ----- |
| 15  | ~~**Transactional Email Setup** — Resend oder Postmark anbinden (nicht raw SMTP), HTML-Template-System aufsetzen~~ ✅                                      | 1h    | 0 €   |
| 16  | ~~**Bestellbestätigung** — Sofort nach Bestellung: Nummer, Artikelliste, Gesamtbetrag, voraussichtliche Lieferzeit~~ ✅                                    | 1h    | 0 €   |
| 17  | ~~**Zahlungsbestätigung** — Nach Stripe-Webhook: separate Mail oder kombiniert mit Bestellbestätigung~~ ✅                                                 | 0.5h  | 0 €   |
| 18  | ~~**Versandbestätigung** — Wenn Admin Status auf "shipped" setzt: automatische Mail mit Trackingnummer-Link _(Basis)_~~ ✅                                 | 0.5h  | 25 €  |
| 19  | ~~**Passwort-Vergessen-Flow** — Token-basierter Reset per E-Mail, `/auth/reset`, `/auth/reset/[token]` — aktuell komplett fehlend _(Basis)_~~ ✅           | 2h    | 100 € |
| 20  | ~~**Willkommens-E-Mail** — Nach Registrierung: Marke vorstellen, 2 Produkte highlighten, erster Kauf Anreiz _(Standard)_~~ ✅                              | 0.5h  | 35 €  |
| 21  | ~~**Bestellstatus-Updates** — E-Mail bei jeder Admin-Statusänderung (confirmed → shipped → delivered) _(Standard)_~~ ✅                                    | 0.5h  | 35 €  |
| 22  | ~~**E-Mail-Templates** — Markenkonsistentes, responsives HTML-E-Mail-Design: Logo, Farben, Typografie. _(Wachstum, Wiederverwendung über alle Mails)_~~ ✅ | 3h    | 255 € |
| 23  | ~~**Admin-Benachrichtigung** — Sofort-Mail an Admin-Adresse bei neuer Bestellung _(Basis)_~~ ✅                                                            | 0.25h | 15 €  |
| 24  | **Newsletter-Broadcast** — Admin-UI: Subscriber-Liste einsehen, Kampagne verfassen, Versenden mit Unsubscribe-Link _(Wachstum)_                            | 3h    | 255 € |
| 25  | **Bewertungsanfrage-Mail** — 10 Tage nach "delivered": freundliche Bitte um Produktbewertung mit Deep-Link _(Wachstum)_                                    | 0.5h  | 45 €  |
| 26  | **Abandoned-Cart-Reminder** — 3h nach Warenkorbabbruch: "Du hast etwas vergessen" (benötigt serverseitige Cart-Session aus Punkt 52) _(Premium)_           | 2h    | 220 € |

**Summe: ~15h · ~985 €** _(15+16+17 = Pflicht, Rest optional)_

---

## III. Produkt & Katalog

| #   | Aufgabe                                                                                                                                                                              | ⏱    | 💶      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | ------- |
| 27  | ~~**Lagerbestand / Inventar** — `stock_quantity` im Schema, "Ausverkauft"-State, Add-to-Cart blockieren, Low-Stock-Alert im Admin _(Basis)_~~ ✅                                     | 1.5h  | 75 €    |
| 28  | **Produktvarianten** — Gewichtsoptionen für dasselbe Produkt mit eigenem Preis. Schema-Redesign, Cart-Änderungen, Checkout-Änderungen. Größte Einzelaufgabe im Katalog. _(Wachstum)_ | 8h    | 680 €   |
| 29  | ~~**Mehrere Produktbilder (Admin-UI)** — Schema unterstützt JSON-Array, aber Admin hat nur 1 URL-Feld. Multi-Bild-Verwaltung im Admin. _(Basis)_~~ ✅                                | 1h    | 50 €    |
| 30  | **Bild-Upload im Admin** — Drag-and-Drop File-Upload statt URL-Eingabe. Automatische WebP-Konvertierung, Speicherung in `/static/products/` _(Standard)_                             | 2.5h  | 165 €   |
| 31  | **Produktbilder-Galerie mit Zoom** — Auf der Produktseite: Fullscreen-Lightbox, Zoom bei Klick/Tap _(Standard)_                                                                      | 1.5h  | 100 €   |
| 32  | ~~**Produktbadges / Tags** — Schema-Feld + Admin-Checkboxen: Halal, Vegan, Glutenfrei, Nussfrei, Bestseller, Neu, Saisonal _(Standard)_~~ ✅                                         | 1h    | 65 €    |
| 33  | **Geschmacksprofil-Tags** — Süß, nussig, blumig, intensiv, mild — wählbar im Admin, Anzeige auf Produktseite _(Standard)_                                                            | 0.5h  | 35 €    |
| 34  | ~~**Ursprungsinfo** — Herkunftsregion (z.B. "Istanbul"), Paarungsempfehlung (Tee, Kaffee) _(Basis)_~~ ✅                                                                             | 0.5h  | 25 €    |
| 35  | **Saisonale Verfügbarkeit** — `available_from` / `available_until` Datumsfelder für Ramadan-Spezialitäten, Weihnachten etc. _(Standard)_                                             | 0.5h  | 35 €    |
| 36  | ~~**Durchgestrichener Preis** — `original_price` Feld für Rabatt-Anzeige ("~~18,90 €~~ 14,90 €") _(Basis)_~~ ✅                                                                      | 0.25h | 15 €    |
| 37  | **Verwandte Produkte** — "Das könnte dir auch gefallen" auf Detailseite: gleiche Kategorie oder manuell kuratiert _(Wachstum)_                                                       | 1h    | 85 €    |
| 38  | **Kürzlich angesehen** — localStorage-basiert, Anzeige am Ende der Produktseite _(Wachstum)_                                                                                         | 0.5h  | 45 €    |
| 39  | **Geschenk-Sets / Bundle-Produkte** — Produkt-Typ "Geschenkbox" der mehrere Einzelprodukte bündelt. Schema-Erweiterung, spezielle Darstellung. _(Premium)_                           | 5h    | 550 €   |
| 40  | **Produktbeschreibungen & Copywriting** — Texte für alle Produkte: Geschichte, Geschmacksprofil, Keywords. _(Redaktionsaufgabe, Standard-Rate)_                                      | 20h   | 1.300 € |
| 41  | ~~**Zertifikate & Gütesiegel** — Halal-Zertifikat als PDF-Download und Siegel auf der Seite _(Basis)_~~ ✅ (FAQ erwähnt Halal; PDF-Link on request)                                  | 0.25h | 15 €    |
| 42  | ~~**Produktmengen-Ratgeber** — "Für eine Feier mit 20 Personen empfehlen wir..." — statischer Content _(Basis)_~~ ✅ (in FAQ integriert)                                             | 0.5h  | 25 €    |

**Summe: ~45h · ~3.265 €**

---

## IV. Suche & Discovery

| #   | Aufgabe                                                                                                                                                                         | ⏱   | 💶    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ----- |
| 43  | **Instant Search / Autocomplete** — Suchfeld im Header mit Dropdown-Vorschlägen inkl. Produktbild und Preis während der Eingabe (Debounce, API-Endpunkt) _(Wachstum)_           | 2h   | 170 € |
| 44  | **Dedizierte Suchergebnisseite** — `/suche?q=...` mit Ergebnisanzahl, Filtern, Sortierung _(Standard)_                                                                          | 1h   | 65 €  |
| 45  | ~~**Filter-System auf Produktlisting** — Preisspanne (Slider), Gewicht, Badges, Sortierung (Preis ↑↓, Neuheit). URL-Parameter-basiert für Deep-Links und SEO. _(Standard)_~~ ✅ | 2.5h | 165 € |
| 46  | ~~**Kategorie-Beschreibungen** — Einleitungstext + Banner-Bild pro Kategorie. Admin-verwaltbar. _(Basis)_~~ ✅ (entfällt - kein Kategorie-System geplant)                       | 1h   | 50 €  |
| 47  | **"Wird oft zusammen gekauft"** — Auf Basis von Bestellhistorie (Co-Occurrence): Upsell auf Detailseite _(Premium)_                                                             | 2h   | 220 € |
| 48  | **Suchanfragen-Log** — Was suchen Kunden? Tabellarisch im Admin. _(Wachstum)_                                                                                                   | 0.5h | 45 €  |

**Summe: ~9h · ~715 €**

---

## V. Warenkorb & Checkout

| #   | Aufgabe                                                                                                                                                                                                                              | ⏱    | 💶    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | ----- |
| 49  | **Gutscheincode-System** — Schema (codes, discounts, uses), Checkout-Feld mit Live-Validierung, Admin-Verwaltung _(Wachstum)_                                                                                                        | 3h    | 255 € |
| 50  | ~~**Mehr Zahlungsarten** — Klarna (Kauf auf Rechnung), SEPA-Lastschrift, giropay über Stripe Payment Element aktivieren. **Größter Einzelhebel für DE-Markt.** _(Basis)_~~ ✅ (Stripe PE unterstützt alle - im Dashboard aktivieren) | 1h    | 50 €  |
| 51  | ~~**Apple Pay / Google Pay** — Über Stripe Payment Element aktivieren und testen _(Basis)_~~ ✅ (Stripe PE unterstützt beides - im Dashboard aktivieren)                                                                             | 0.5h  | 25 €  |
| 52  | **Serverseitige Cart-Session** — Für eingeloggte Nutzer: Warenkorb in DB persistieren. Grundlage für Cross-Device-Sync und Abandoned-Cart. _(Wachstum)_                                                                              | 3h    | 255 € |
| 53  | ~~**Geschenknachricht** — Freitextfeld "Persönliche Nachricht beilegen?" im Checkout _(Basis)_~~ ✅                                                                                                                                  | 0.5h  | 25 €  |
| 54  | **Geschenkverpackung-Option** — Zusatz-Service: +2,90 € für Geschenkverpackung, wählbar im Checkout _(Standard)_                                                                                                                     | 0.75h | 50 €  |
| 55  | **Lieferdatum-Schätzung** — "Bestelle bis 14:00 Uhr — Lieferung voraussichtlich Mo. 03.05." im Checkout _(Standard)_                                                                                                                 | 1h    | 65 €  |
| 56  | ~~**Bestellzusammenfassung mit Produktbildern** — Im Checkout rechts: Miniatur-Thumbnails der bestellten Artikel _(Basis)_~~ ✅                                                                                                      | 0.25h | 15 €  |
| 57  | **Warenkorb-Flyout** — Seitenleiste die aufgeht beim Klick auf Warenkorb-Icon: schneller Überblick ohne Seitenwechsel _(Wachstum)_                                                                                                   | 1.5h  | 130 € |
| 58  | **Upsell im Checkout** — "Andere Kunden kauften auch..." — 2–3 Ergänzungsprodukte vor der Zahlungsseite _(Premium)_                                                                                                                  | 1h    | 110 € |

**Summe: ~13h · ~980 €**

---

## VI. Kundenkonto

| #   | Aufgabe                                                                                                                                                                          | ⏱    | 💶    |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ----- |
| 59  | ~~**Passwort ändern** — Formular im Kundenkonto: aktuelles Passwort + neues Passwort mit Bestätigung _(Basis)_~~ ✅                                                              | 1h    | 50 €  |
| 60  | **E-Mail ändern** — Mit Bestätigungs-E-Mail an die neue Adresse _(Standard)_                                                                                                     | 1.5h  | 100 € |
| 61  | ~~**Account löschen** — DSGVO Art. 17. Bereits unter Pflicht gelistet (Punkt 12).~~ ✅                                                                                           | 1h    | 0 €   |
| 62  | ~~**Adressbuch** — Mehrere Lieferadressen speichern. Standardadresse wählbar. Im Checkout vorausfüllen. _(Standard)_~~ ✅                                                        | 2.5h  | 165 € |
| 63  | ~~**Newsletter-Präferenz** — An-/Abmelden direkt im Account _(Basis)_~~ ✅                                                                                                       | 0.25h | 15 €  |
| 64  | ~~**Vollständige Bestelldetailansicht** — Aktuell: nur Status und Nummer. Artikelliste, Versandadresse, Invoice-Download. _(Basis)_~~ ✅ (Artikelliste + Tracking, expandierbar) | 1h    | 50 €  |
| 65  | **Wiederkaufen-Button** — "Nochmals bestellen" in der Bestellhistorie: Artikel direkt in den Warenkorb _(Standard)_                                                              | 0.5h  | 35 €  |
| 66  | **Wunschliste / Favoriten** — Für eingeloggte Nutzer in DB, für Gäste in localStorage. Herzchen-Icon auf Produktkarten. _(Wachstum)_                                             | 2h    | 170 € |
| 67  | ~~**Bestellverfolgung mit Trackingnummer** — Direktlink zur DHL/DPD-Tracking-Seite in der Bestellansicht _(Basis)_~~ ✅                                                          | 0.5h  | 25 €  |

**Summe: ~10h · ~610 €**

---

## VII. Bewertungen & Social Proof

| #   | Aufgabe                                                                                                                       | ⏱    | 💶    |
| --- | ----------------------------------------------------------------------------------------------------------------------------- | ----- | ----- |
| 68  | **Produkt-Bewertungssystem** — 1–5 Sterne + Freitext. Nur von verifizierten Käufern. Moderations-Queue im Admin. _(Wachstum)_ | 4h    | 340 € |
| 69  | **Bewertungs-Aggregat auf Produktkarten** — Durchschnitt + Anzahl sichtbar in der Produktliste - benötigt #68 _(Wachstum)_    | 0.5h  | 45 €  |
| 70  | **Bewertungs-Widget auf Detailseite** — Sternverteilung, einzelne Reviews mit "verifizierter Kauf"-Badge _(Standard)_         | 0.75h | 50 €  |
| 71  | ~~**Trustbadges im Footer und Checkout** — "SSL-verschlüsselt", "Zahlung über Stripe", "14 Tage Rückgabe" _(Basis)_~~ ✅      | 0.5h  | 25 €  |
| 72  | ~~**Kundenstimmen auf Homepage** — 3–5 kuratierte Testimonials mit Name, Admin-verwaltbar _(Standard)_~~ ✅                   | 0.75h | 50 €  |
| 73  | **Social Sharing** — WhatsApp, Facebook, Link-Kopieren auf Produktseiten _(Standard)_                                         | 0.5h  | 35 €  |
| 74  | **Instagram-Feed-Integration** — Eingebetteter UGC-Feed mit Produktfotos von echten Kunden _(Premium)_                        | 1h    | 110 € |

**Summe: ~8h · ~635 €**

---

## VIII. SEO

| #   | Aufgabe                                                                                                                                                                                        | ⏱    | 💶    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ----- |
| 75  | ~~**Meta-Title und Meta-Description** — Für jede Route individuell: Produkt, Kategorie, Statische Seiten _(Basis)_~~ ✅                                                                        | 1h    | 50 €  |
| 76  | ~~**Open Graph + Twitter Card Tags** — og:title, og:description, og:image für Social Sharing _(Basis)_~~ ✅                                                                                    | 0.5h  | 25 €  |
| 77  | ~~**JSON-LD Structured Data** — `Product`, `BreadcrumbList`, `Organization`, `ItemList` _(Standard)_~~ ✅ (Product + Organization; BreadcrumbList in JSON-LD skipped, visual breadcrumbs done) | 1.5h  | 100 € |
| 78  | ~~**Sitemap.xml** — Automatisch generiert: alle Produktseiten + statische Seiten _(Basis)_~~ ✅                                                                                                | 0.5h  | 25 €  |
| 79  | ~~**Robots.txt** — Admin-Bereich ausschließen~~ ✅                                                                                                                                             | 0.1h  | 0 €   |
| 80  | ~~**Hreflang-Tags** — `<link rel="alternate" hreflang="de/en/tr">` für alle drei Sprachversionen _(Standard)_~~ ✅                                                                             | 0.5h  | 35 €  |
| 81  | **Canonical URLs** — Besonders bei Kategorie-Filter-Kombinationen: Duplikate vermeiden _(Standard)_                                                                                            | 0.5h  | 35 €  |
| 82  | ~~**Breadcrumb-Navigation** — Sichtbar auf Produkt- und Kategorieseiten: Startseite > Lokum > Sultan Lokum _(Standard)_~~ ✅                                                                   | 0.75h | 50 €  |
| 83  | ~~**Alt-Texte auf allen Produktbildern** — Beschreibende Alt-Texte, programmatisch generiert _(Basis)_~~ ✅                                                                                    | 0.5h  | 25 €  |
| 84  | **Core Web Vitals Optimierung** — LCP, CLS, FID: Bild-Optimierung, kritisches CSS, Prefetch. _(Messung + Iteration, Wachstum)_                                                                 | 3h    | 255 € |
| 85  | **Keyword-Optimierung in Texten** — In Kategorie- und Produktbeschreibungen. _(Redaktionsarbeit, Standard)_                                                                                    | 6h    | 390 € |
| 86  | ~~**Sprachschalter im Header** — DE / EN / TR prominent im Header statt nur im Footer _(Basis)_~~ ✅                                                                                           | 0.5h  | 25 €  |

**Summe: ~16h · ~1.015 €**

---

## IX. Performance & Technik

| #   | Aufgabe                                                                                                              | ⏱    | 💶    |
| --- | -------------------------------------------------------------------------------------------------------------------- | ----- | ----- |
| 87  | ~~**Bild-Optimierung** — Alle Produktbilder WebP, responsive `srcset`, `loading="lazy"`, explizite Dimensionen~~ ✅  | 1h    | 0 €   |
| 88  | ~~**Rate-Limiting** — API-Endpunkte `/api/orders`, `/api/newsletter`, `/auth/login` gegen Brute-Force absichern~~ ✅ | 1h    | 0 €   |
| 89  | ~~**Input-Validierung mit Zod** — Alle API-Route-Inputs durch Zod-Schemas~~ ✅                                       | 1.5h  | 0 €   |
| 90  | ~~**Session-Cleanup-Job** — Abgelaufene Sessions aus DB löschen (Startup-Task)~~ ✅                                  | 0.25h | 0 €   |
| 91  | ~~**Environment-Validierung beim Start** — Pflicht-Env-Vars prüfen, klare Fehlermeldung~~ ✅                         | 0.25h | 0 €   |
| 92  | **Error Monitoring (Sentry)** — Sentry einbinden, unhandled errors abfangen _(Standard)_                             | 0.5h  | 35 €  |
| 93  | **Strukturiertes Logging** — Server-Logging für Bestellungen, Auth-Events, Fehler _(Standard)_                       | 0.75h | 50 €  |
| 94  | ~~**Health-Check-Endpoint** — `GET /api/health` mit DB-Ping~~ ✅                                                     | 0.1h  | 0 €   |
| 95  | ~~**Graceful Shutdown** — SIGTERM-Handler~~ ✅                                                                       | 0.25h | 0 €   |
| 96  | **DB-Migrations statt Push** — Für Produktion: versionierte SQL-Migrations _(Standard)_                              | 1h    | 65 €  |
| 97  | **Test-Suite** — Unit-Tests: Preisberechnung, Cart-Logik. Integration-Tests: Checkout-Flow, Auth. _(Wachstum)_       | 8h    | 680 € |
| 98  | **CI/CD Pipeline** — GitHub Actions: type-check, lint, tests bei jedem Push _(Standard)_                             | 1h    | 65 €  |
| 99  | ~~**CSRF-Überprüfung** — API-Endpunkte manuell prüfen~~ ✅                                                           | 0.25h | 0 €   |

**Summe: ~16h · ~895 €**

---

## X. Design & UX

| #   | Aufgabe                                                                                                                                          | ⏱    | 💶            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | ------------- |
| 100 | **Brand Identity** — Typografie-System, konsistenter Foto-Stil, Icon-Set. _(Überwiegend Design-Arbeit, Wachstum)_                                | 15h   | 1.275 €       |
| 101 | **Lifestyle-Fotografie** — Holzbrett, orientalische Teekanne, warmes Licht. _(Fotografie-Auftrag, kein Dev-Ticket)_                              | —     | 1.500–3.000 € |
| 102 | **Homepage Hero** — Emotionale Headline, hochwertiges Lifestyle-Foto als Hintergrund, klarer CTA _(Standard)_                                    | 1.5h  | 100 €         |
| 103 | **Kategorie-Seiten mit eigenem Charakter** — Banner-Bild + Einleitungstext pro Kategorie _(Standard)_                                            | 2h    | 130 €         |
| 104 | **Produktkarten-Redesign** — Hover-Effekte, Quick-Add ohne Seitenwechsel, Badges besser platziert _(Standard)_                                   | 1h    | 65 €          |
| 105 | ~~**Sticky Header visuell verbessern** — Schatten und Hintergrund beim Scrollen _(Basis)_~~ ✅                                                   | 0.5h  | 25 €          |
| 106 | **Loading Skeletons** — Skeleton-Screens statt leerer Seiten beim Laden _(Standard)_                                                             | 1.5h  | 100 €         |
| 107 | **Microinteractions** — Produkt fliegt visuell zum Warenkorb-Icon beim Hinzufügen _(Premium)_                                                    | 2h    | 220 €         |
| 108 | ~~**Mobile Navigation** — Slide-In-Hamburger-Menü, Kategorie-Schnellzugriff _(Standard)_~~ ✅                                                    | 1h    | 65 €          |
| 109 | ~~**Sticky "In den Warenkorb" auf Mobile** — Button bleibt beim Scrollen auf Produktseite sichtbar _(Basis)_~~ ✅                                | 0.5h  | 25 €          |
| 110 | **Seiten-Übergänge** — Sanfte Transitions zwischen Seiten (SvelteKit transitions) _(Premium)_                                                    | 0.75h | 85 €          |
| 111 | **Dark Mode** — Tailwind `dark:` Klassen, System-Preference-Detection, Toggle _(Premium)_                                                        | 4h    | 440 €         |
| 112 | ~~**Self-hosted Web Fonts** — Lokal hosten (kein Google Fonts wegen DSGVO) _(Basis)_~~ ✅ (App nutzt bereits System-Fonts, keine externen Fonts) | 0.5h  | 25 €          |
| 113 | **Schöne Leere Zustände** — Warenkorb leer, Suche ohne Ergebnisse, Bestellhistorie leer: Illustration + Next-Action _(Standard)_                 | 1h    | 65 €          |
| 114 | ~~**"Zurück nach oben"-Button** — Erscheint nach 300px Scroll _(Basis)_~~ ✅                                                                     | 0.1h  | 15 €          |
| 115 | **Herkunftskarte** — Statische Karte: woher die Produkte kommen (Istanbul, Afyon...) _(Premium)_                                                 | 1.5h  | 165 €         |

**Summe: ~34h · ~2.800 €** _(exkl. Fotografie)_

---

## XI. Admin-Panel

| #   | Aufgabe                                                                                                                                          | ⏱    | 💶    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | ----- |
| 116 | **Kategorie-Management UI** — UI zum Anlegen, Bearbeiten, Löschen von Kategorien inkl. Beschreibungstext _(Standard)_                            | 1.5h  | 100 € |
| 117 | **Drag & Drop Produktsortierung** — Visuelles Reorder statt `sort_order`-Nummern manuell _(Wachstum)_                                            | 1.5h  | 130 € |
| 118 | ~~**Kunden-Verwaltung** — Liste: Registrierungsdatum, Bestellanzahl, Gesamtumsatz, Account sperren _(Standard)_~~ ✅                             | 2h    | 130 € |
| 119 | ~~**Bestellungen CSV-Export** — Export mit Filtern (Zeitraum, Status) als Download _(Basis)_~~ ✅                                                | 0.75h | 40 €  |
| 120 | **Rechnungs-PDF-Generierung** — Invoice als PDF pro Bestellung, downloadbar _(Wachstum)_                                                         | 2.5h  | 215 € |
| 121 | ~~**Trackingnummer-Feld** — Bei Status "versendet": Trackingnummer eintragen, geht per Mail an Kunden _(Basis)_~~ ✅ (war bereits implementiert) | 0.5h  | 25 €  |
| 122 | **Bulk-Status-Updates** — Mehrere Bestellungen auf einmal auf "versendet" setzen _(Standard)_                                                    | 0.75h | 50 €  |
| 123 | ~~**Interne Bestellnotizen** — Freitextfeld für Admin-interne Notizen _(Basis)_~~ ✅                                                             | 0.25h | 15 €  |
| 124 | **Bewertungen moderieren** — Neue Bewertungen in Warteschlange: genehmigen oder ablehnen _(Standard)_                                            | 1h    | 65 €  |
| 125 | **Analytics-Dashboard** — Umsatz pro Tag/Woche/Monat (Chart), Top-Produkte, Kennzahlen _(Premium)_                                               | 5h    | 550 € |
| 126 | **Gutschein-Verwaltung** — Codes anlegen, deaktivieren, Nutzungsstatistiken _(Standard)_                                                         | 1.5h  | 100 € |
| 127 | ~~**Pagination in allen Admin-Tabellen** — Bestellliste, Produktliste, Kundenliste _(Basis)_~~ ✅                                                | 1h    | 50 €  |
| 128 | **Produktbeschreibungen Bulk-Edit** — Mehrere Produkte nacheinander schnell bearbeiten _(Standard)_                                              | 0.75h | 50 €  |

**Summe: ~20h · ~1.520 €**

---

## XII. Marketing & Wachstum

| #   | Aufgabe                                                                                                                  | ⏱    | 💶    |
| --- | ------------------------------------------------------------------------------------------------------------------------ | ----- | ----- |
| 129 | **Über-uns-Seite** — Geschichte hinter "Hacibaba". _(Größtenteils Content-Arbeit, Standard)_                             | 1.5h  | 100 € |
| 130 | ~~**FAQ-Seite** — "Sind die Produkte Halal?", "Wie lange haltbar?", etc. _(Content-Arbeit, Basis)_~~ ✅                  | 1h    | 50 €  |
| 131 | ~~**Kontaktseite** — Formular + Adresse + Öffnungszeiten + WhatsApp-Link _(Basis)_~~ ✅                                  | 0.5h  | 25 €  |
| 132 | **Blog / Magazin** — `/magazin`: Rezepte, Kulturartikel, Ratgeber. CMS-Light mit Admin-UI. _(Content ongoing, Wachstum)_ | 3h    | 255 € |
| 133 | **Google Analytics 4** — Event-Tracking: add*to_cart, begin_checkout, purchase *(Standard)\_                             | 0.75h | 50 €  |
| 134 | **Meta Pixel** — Facebook/Instagram-Retargeting _(Standard)_                                                             | 0.5h  | 35 €  |
| 135 | **Google Merchant Center Feed** — Produktdaten-Feed `/api/feed/google.xml` für Google Shopping _(Wachstum)_              | 1h    | 85 €  |
| 136 | **Exit-Intent-Popup** — "10 % Rabatt" mit E-Mail-Capture (DSGVO-konform) _(Wachstum)_                                    | 0.75h | 65 €  |
| 137 | **Saisonale Landing Pages** — Ramadan/Eid, Weihnachten, Muttertag: kuratierte Produktauswahl, eigene URL _(Standard)_    | 1.5h  | 100 € |
| 138 | ~~**WhatsApp Business Chatbutton** — Fester Button am Seitenrand _(Basis)_~~ ✅                                          | 0.1h  | 15 €  |
| 139 | **Referral-Programm** — Einzigartiger Link, Tracking, Gutschrift nach erstem Kauf des Geworbenen _(Premium)_             | 4h    | 440 € |
| 140 | **Treuepunkte-System** — Für jeden Euro X Punkte, einlösbar als Rabatt im Checkout _(Premium)_                           | 6h    | 660 € |
| 141 | **Digitale Geschenkkarte** — 25/50/100 € Wert, per E-Mail versendbar, als Gutscheincode einlösbar _(Premium)_            | 3h    | 330 € |

**Summe: ~24h · ~2.210 €**

---

## XIII. Versand & Fulfillment

| #   | Aufgabe                                                                                                                                           | ⏱    | 💶    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ----- |
| 142 | **Mehrere Versandoptionen** — Standard, Express, Selbstabholung. Im Checkout wählbar. _(Standard)_                                                | 2h    | 130 € |
| 143 | **Versandzonen** — Deutschland, Österreich, Schweiz, EU mit eigenen Preisen _(Standard)_                                                          | 1h    | 65 €  |
| 144 | **Gewichtsbasierter Versand** — Versandpreis nach Gesamtgewicht der Bestellung _(Standard)_                                                       | 1h    | 65 €  |
| 145 | **DHL-Integration** — Versandlabel direkt aus Admin (DHL Geschäftskunden-API). _(API-Setup + Testing, Abhängigkeit von DHL-Credentials, Premium)_ | 4h    | 440 € |
| 146 | **Lieferdatum-Anzeige im Shop** — "Bestelle bis 12:00 Uhr — Lieferung voraussichtlich Mi." _(Standard)_                                           | 0.75h | 50 €  |
| 147 | ~~**Klimaneutraler Versand** — DHL GoGreen Badge im Checkout und Footer _(Basis)_~~ ✅                                                            | 0.25h | 15 €  |

**Summe: ~9h · ~765 €**

---

## XIV. Accessibility

| #   | Aufgabe                                                                                        | ⏱  | 💶  |
| --- | ---------------------------------------------------------------------------------------------- | --- | --- |
| 148 | ~~**ARIA-Labels** — Alle Icon-Buttons, Formulare, Navigationselemente für Screenreader~~ ✅    | 2h  | 0 € |
| 149 | ~~**Keyboard-Navigation** — Vollständige Bedienung ohne Maus, Tab-Reihenfolge korrekt~~ ✅     | 2h  | 0 € |
| 150 | ~~**Fokus-Management** — In Modals, Toasts, Flyouts: Fokus landet an der richtigen Stelle~~ ✅ | 1h  | 0 € |
| 151 | ~~**Farbkontrast WCAG AA** — Audit + Korrekturen wo nötig~~ ✅                                 | 1h  | 0 € |

**Summe: ~6h · 0 €**

---

## XV. PWA & Mobile

| #   | Aufgabe                                                                                        | ⏱   | 💶    |
| --- | ---------------------------------------------------------------------------------------------- | ---- | ----- |
| 152 | ~~**PWA Manifest** — App-Name, Icons, Theme-Color. "Zum Homescreen hinzufügen". _(Basis)_~~ ✅ | 0.5h | 25 €  |
| 153 | **Service Worker** — Offline-Fallback-Seite, Cache statischer Assets _(Wachstum)_              | 2h   | 170 € |
| 154 | **Touch-Gesten** — Swipe durch Produktbilder auf Mobile _(Premium)_                            | 1h   | 110 € |
| 155 | **Push-Benachrichtigungen** — Opt-in: Benachrichtigung wenn Bestellung versendet _(Premium)_   | 3h   | 330 € |

**Summe: ~6.5h · ~635 €**

---

## XVI. B2B & Langfristig

| #   | Aufgabe                                                                                                   | ⏱    | 💶    |
| --- | --------------------------------------------------------------------------------------------------------- | ----- | ----- |
| 156 | **B2B-Kanal** — Separates Preisschema für Restaurants, Cafés. B2B-Account-Typ, Rechnungskauf. _(Premium)_ | 7h    | 770 € |
| 157 | **Abo-Box** — Monatliche Lieferung mit kuratierten Produkten. Stripe Subscriptions. _(Premium)_           | 7h    | 770 € |
| 158 | **Marktplatz-Präsenz (Amazon / Otto)** — Produkt-Feed, Inventory-Sync _(Premium)_                         | 4h    | 440 € |
| 159 | **Affiliate-Programm** — Tracking-Links, Admin-Übersicht, Auszahlung _(Premium)_                          | 4h    | 440 € |
| 160 | **Wholesale PDF-Katalog** — Herunterladbarer Produktkatalog für B2B-Anfragen _(Standard)_                 | 0.75h | 50 €  |

**Summe: ~23h · ~2.470 €**

---

## Gesamtübersicht

| Bereich                         | Stunden   | Preis         |
| ------------------------------- | --------- | ------------- |
| ~~I. Gesetzliche Pflichten~~    | ~10h      | 0 €           |
| II. E-Mail-System               | ~15h      | ~985 €        |
| III. Produkt & Katalog          | ~45h      | ~3.265 €      |
| IV. Suche & Discovery           | ~9h       | ~715 €        |
| V. Warenkorb & Checkout         | ~13h      | ~980 €        |
| VI. Kundenkonto                 | ~10h      | ~610 €        |
| VII. Bewertungen & Social Proof | ~8h       | ~635 €        |
| VIII. SEO                       | ~16h      | ~1.015 €      |
| IX. Performance & Technik       | ~16h      | ~895 €        |
| X. Design & UX                  | ~34h      | ~2.800 €      |
| XI. Admin-Panel                 | ~20h      | ~1.520 €      |
| XII. Marketing & Wachstum       | ~24h      | ~2.210 €      |
| XIII. Versand & Fulfillment     | ~9h       | ~765 €        |
| XIV. Accessibility              | ~6h       | 0 €           |
| XV. PWA & Mobile                | ~7h       | ~635 €        |
| XVI. B2B & Langfristig          | ~23h      | ~2.470 €      |
| **Gesamt**                      | **~265h** | **~19.300 €** |

_(Redaktions- und Design-Arbeiten sind in den jeweiligen Punkten als solche gekennzeichnet. Fotografie (Punkt 101) ist separat zu beauftragen.)_

---

## Priorisierung

### Sofort (vor Go-Live Pflicht)

Punkte 1–14, 87–91, 94, 99, 148–151 — rechtliche Absicherung, Sicherheitsbasis, Barrierefreiheit

### Kurzfristig (direkter Konversionseinfluss)

- Passwort-Vergessen (19) — fehlt komplett
- Bestellbestätigung per E-Mail (16) — Kunden erwarten das
- Mehr Zahlungsarten / Klarna (50) — größter Einzelhebel für DE-Markt
- Hochwertige Produktbilder (101) — Lebensmittel werden mit den Augen gekauft
- Meta-Tags / SEO Basics (75–78) — kostenloser Traffic

### Mittelfristig (Wachstum und Retention)

- Bewertungssystem (68–70)
- Gutscheincodes (49)
- Treuepunkte (140)
- Blog (132)
- Analytics-Dashboard (125)
- Serverseitige Cart-Session (52) — Grundlage für Abandoned-Cart

### Langfristig (Skalierung)

- Produktvarianten (28)
- B2B-Kanal (156)
- Abo-Box (157)
- DHL-Integration (145)
- Vollständige Test-Suite (97)
