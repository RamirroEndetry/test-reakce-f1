# Test reakce – překonej pilota Formule 1

Aplikace pro měření reakční doby ve třech kolech. Cílový čas: 201 ms
(Valtteri Bottas, start VC Rakouska 2017).

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
