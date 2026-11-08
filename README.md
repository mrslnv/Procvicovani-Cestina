# Elina čeština

Jednoduché procvičování češtiny pro tablet, vytvořené podle šesti dodaných fotografií pracovního sešitu.

**Otevřít cvičení:** https://mrslnv.github.io/Procvicovani-Cestina/

## Co obsahuje

128 úloh v osmi oblastech:

1. Vyjmenovaná a příbuzná slova po P, S, V (20).
2. Pravopis po Z (14).
3. Opakování vyjmenovaných slov napříč skupinami (16).
4. Jedno n a dvě nn (15).
5. Souhlásky na rozhraní částí slova (12).
6. Předpony a předložky: dohromady, nebo zvlášť (16).
7. Předpony roz-, bez-, vz- a předložka bez (17).
8. Předpony s-, z-, vz- (18).

Běžná série má náhodných 8 úloh. Promíchaný test znalostí vybírá po 3 úlohách z každé oblasti, celkem 24. Každá následující otázka je z jiné oblasti, pořadí oblastí i výběr úloh se při každém spuštění mění. Odpovědi i označení předpony/předložky se v tomto testu píší ručně, bez rozbalovacích voleb. U předpon zůstává pokyn, ze které skupiny předpon se doplňuje, aby zadání mělo jednoznačné řešení. Oblasti otázek jsou skryté až do kontroly. Opakování chyb i obnovení rozepsaného testu zachovává ruční zadávání. Po kontrole se zobrazí výsledek a vysvětlení; lze opravit odpovědi, kontrolu opakovat nebo procvičovat jen nezvládnuté úlohy. Nevyplněné úlohy jsou označeny zvlášť. Každá úloha se počítá jako jeden bod; u úloh se dvěma volbami musí být správné obě.

Celé výrazy se kontrolují včetně hranic slov a diakritiky. Velikost písmen, mezery na začátku a konci a počet mezer mezi slovy se ignorují. Aplikace vždy zachovává rozdíl např. mezi „pod stromem“ a „podstromem“.

Rozepsaná série se ukládá do localStorage daného prohlížeče. Žádný účet, serverové ukládání, sledování ani externí knihovny. Postup se mezi zařízeními nesynchronizuje. Pokud prohlížeč ukládání zakáže, stránka funguje a oznámí, že se postup nezachová. Pro načtení webu je potřeba připojení k internetu.

## Správná řešení

Viz [RESENI.md](RESENI.md), včetně vysvětlení a zdrojů ověření z ÚJČ a dalších jazykových zdrojů. Veřejný repozitář obsahuje pouze vybrané, místy upřesněné úlohy; původní fotografie se nezveřejňují. Nejde o přesný přepis všech příkladů na fotografiích.

## Spuštění a úpravy

Statický web bez sestavování. Pro místní náhled spusťte `python3 -m http.server 8080` a otevřete `http://localhost:8080`. HTML stránku je nutné obsloužit přes HTTP kvůli modulům JavaScriptu.

- `index.html`: základ stránky a dialog se zdroji.
- `data.js`: zadání, správné odpovědi a vysvětlení.
- `logic.js`: normalizace, kontrola a promíchání.
- `app.js`: výběr sad, formuláře, zpětná vazba a lokální ukládání.
- `style.css`: vzhled a přizpůsobení pro tablet a telefon.

`npm test` spouští testy pomocí Node.js bez instalace závislostí. Ověřuje všech 128 odpovědí, přípustné možnosti, prázdné a chybné odpovědi, diakritiku, mezery a dvojitou kontrolu předpony/předložky.

## GitHub Pages

Publikace z větve `main`, složka `/ (root)`. Soubor `.nojekyll` zajistí přímé zveřejnění statických souborů. Každý další push do `main` aktualizuje web.
