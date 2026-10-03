# Test reakce – překonej pilota Formule 1

Aplikace pro měření reakční doby ve třech kolech. Cílový čas: 201 ms
(Valtteri Bottas, start VC Rakouska 2017).

## Pravidla proti podvádění

- **Předčasné starty**: kliknutí na červenou opakuje kolo, ale za celý test jsou povoleny
  jen 2 omyly – třetí test ukončí bez výsledku (konstanta `MAX_EARLY`).
- **Tipnutý klik**: reakce pod 100 ms se počítá jako předčasný start (`MIN_REACTION_MS`).
- **Tlačítka testu** (Pokračovat, Zkusit znovu) jsou u spodního okraje mimo střed obrazovky
  a po zobrazení jsou 0,7 s neaktivní (`BTN_LOCK_MS`), aby je neodklikly rychlé kliky za sebou.
- **Návod**: tlačítko **Rozumím** pod návodem je po zobrazení stejně dlouho neaktivní,
  takže se návod nedá omylem přeskočit rozjetým dotykem z úvodní obrazovky.

## Obrazovka výsledků

Výsledky se vejdou na jednu obrazovku bez posouvání. Žebříček Top 10 je okno, které ukáže
tolik řádků, kolik se vejde, a zbytek samo projíždí od 1. místa dolů (krok `BOARD_STEP_MS`,
pauza na začátku a konci `BOARD_HOLD_MS`). Po zápisu jména najede na řádek hráče.
Tlačítko **Hrát znovu** je pod žebříčkem vždy vidět.

## Spuštění

- **Web**: otevřete `index.html` v prohlížeči (Chrome/Edge), nebo použijte GitHub Pages.
- **Windows aplikace (Electron)**: spusťte `TestReakceF1-portable.exe` (bez instalace)
  nebo `TestReakceF1-instalace.exe` (vytvoří zástupce na ploše).

## Obsluha na akci

| Akce | Jak |
| --- | --- |
| Celá obrazovka (web) | tlačítko ⛶ vpravo dole nebo F11 |
| Reset žebříčku | nenápadné tlačítko ⚙ vpravo nahoře nebo Ctrl+Shift+Delete, zadat heslo správce |
| Ukončení Electron aplikace | Ctrl+Q |
| Přepnutí kiosk / okno (Electron) | F11 |

Heslo správce je uloženo v `index.html` v konstantě `RESET_PASSWORD`.

Žebříček se ukládá na daném zařízení, každé zařízení má vlastní. Výsledky zůstávají
i po vypnutí, restartu nebo výpadku proudu – smazat je jde jen resetem s heslem.

- **Electron**: soubor `%APPDATA%\Test reakce F1\zebricek.json` (zapisuje se okamžitě
  s `fsync`, vedle je záloha `zebricek.json.bak`).
- **Web**: localStorage prohlížeče (nemazat data prohlížeče / nepoužívat anonymní okno).
Po 60 s nečinnosti se aplikace vrátí na úvodní spořič.

## Sestavení Electron balíčků

```bash
npm install
npm run build
```

Výstup najdete ve složce `dist/`.
