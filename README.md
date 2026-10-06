# Test reakce – překonej pilota Formule 1

Aplikace Brembo pro měření reakční doby. Cílový čas: 201 ms
(Valtteri Bottas, start VC Rakouska 2017).

## Průběh hry

1. **Spořič** – smyčka videí, klepnutím se spustí návod.
2. **Jeden pokus** o 3 kolech (`ROUNDS`). Výsledek je průměr všech tří kol.
3. **Výherní stránka** – zobrazí se hned po třetím klepnutí: výsledný čas
   a srovnání s pilotem.
4. **Zápis do žebříčku** – jméno, telefon, nepovinný e-mail a poznámka obsluhy (co je to
   za klienta). Píše se na klávesnici přímo v aplikaci (písmena bez diakritiky a čísla,
   u telefonu jen čísla). **Telefon je lístek do losování**: je povinný (`PHONE_REQUIRED`)
   a každé číslo se dá zapsat jen jednou – `777 123 456` a `+420 777 123 456` je totéž číslo.

## Žebříček a kontakty

- **Žebříček** se vysouvá z boku tlačítkem 🏆 vlevo dole (na spořiči, v návodu i na výherní
  stránce). Telefony, e-maily ani poznámky v něm vidět nejsou. Po 30 s bez dotyku se sám zavře.
- **Správa** (⚙ vpravo nahoře nebo Ctrl+Shift+Delete, heslo správce): seznam hráčů s telefony
  a e-maily, ke každému lze kdykoli dopsat poznámku, **Export PDF**, **Export CSV** (pro Excel)
  a **Smazat vše**. Export PDF se zeptá, kam soubor uložit (výchozí je plocha), a uložené PDF
  rovnou otevře v okně nad aplikací; ve webové verzi otevře tisk (cíl „Uložit jako PDF“).

## Losování hlavního výherce

Ve správě je tlačítko **🎉 Losování**. Losuje se náhodně ze všech zapsaných telefonních čísel,
každé má jeden lístek. Vylosovaný se uloží, je zvýrazněný v seznamu, v PDF i v CSV.
**Losovat znovu** (potvrzuje se druhým klepnutím) vybere nového výherce ze zbylých – kdo už
byl jednou vylosován, do dalšího losování nejde. **Smazat vše** maže i výsledek losování.

## Pravidla proti podvádění

- **Předčasné starty**: klepnutí na červenou opakuje kolo, povoleny jsou
  jen 2 omyly (`MAX_EARLY`). Třetí pokus ukončí bez výsledku.
- **Tipnutý klik**: reakce pod 100 ms se počítá jako předčasný start (`MIN_REACTION_MS`).
- **Tlačítka** (Rozumím, Pokračovat, tlačítka na výherní stránce) jsou po zobrazení 0,7 s
  neaktivní (`BTN_LOCK_MS`), aby je neodklikl rozjetý prst. Zámek odemyká uplynulý čas, ne jen
  časovač – i když prohlížeč časovače zpomalí, první klepnutí po 0,7 s projde.

## Spuštění

- **Web**: otevřete `index.html` v prohlížeči (Chrome/Edge), nebo použijte GitHub Pages.
- **Windows aplikace (Electron)**: spusťte `TestReakceF1-portable.exe` (bez instalace)
  nebo `TestReakceF1-instalace.exe` (vytvoří zástupce na ploše). Aplikace brání zhasnutí displeje
  a zpomalování časovačů, když Windows považují okno za zakryté (dialog, okno s PDF).

## Obsluha na akci

| Akce | Jak |
| --- | --- |
| Celá obrazovka (web) | tlačítko ⛶ vpravo dole nebo F11 |
| Žebříček | tlačítko 🏆 vlevo dole |
| Kontakty, poznámky, export, reset | nenápadné tlačítko ⚙ vpravo nahoře nebo Ctrl+Shift+Delete, zadat heslo správce |
| Ukončení Electron aplikace | Ctrl+Q |
| Přepnutí kiosk / okno (Electron) | F11 |

Heslo správce je v souboru `config.local.js` (`adminPassword`).

Žebříček se ukládá na daném zařízení, každé zařízení má vlastní. Výsledky zůstávají
i po vypnutí, restartu nebo výpadku proudu – smazat je jde jen resetem s heslem.

- **Electron**: soubor `%APPDATA%\Test reakce F1\zebricek.json` (zapisuje se okamžitě
  s `fsync`, vedle je záloha `zebricek.json.bak`).
- **Web**: localStorage prohlížeče (nemazat data prohlížeče / nepoužívat anonymní okno).
Po 60 s nečinnosti se aplikace vrátí na úvodní spořič.

## Spořič (video)

Na úvodní obrazovce běží smyčka pěti záběrů `assets/video/f1-1.mp4` až `f1-5.mp4`
(1920×1080, bez zvuku, každý 5 s). Texty, startovní semafor, výzva ke hře a logo
`assets/brembo-logo.png` se vykreslují přes video v aplikaci – každý klip má vlastní
scénu (`.scene` v `index.html`, ve stejném pořadí jako klipy). Záběr vyměníte přepsáním
souboru se stejným názvem. Když videa chybí, spořič běží s texty na běžném pozadí.

## Sestavení Electron balíčků

```bash
npm install
npm run build
```

Výstup najdete ve složce `dist/`.
