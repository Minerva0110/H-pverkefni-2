
# Vef1 2024 H2


## Verkefnalýsing

Þetta verkefni er hluti af áfanganum Vef1 2024 og snýst um að búa til vefsíðu með JavaScript, HTML, og CSS. Markmiðið er að þróa notendavæna, aðgengilega og stílhreina vefsíðu sem byggir á gagnavinnslu úr JSON-skrám. Verkefnið sameinar forritun, vefhönnun og tækni sem nýtist í raunverulegum verkefnum í vefforritun.

## Hvernig á að keyra verkefnið

Til að keyra verkefnið skaltu fylgja þessum skrefum:

1. Keyrðu eftirfarandi skipanir í rót verkefnis:
   ```bash
   npm install
   npm run dev
   ```
   eða
   ```bash
   npm start
   ```

### Lintun

Til að keyra lintun:
```bash
npm run lint
```
Þessi skipun keyrir bæði `eslint` og `stylelint` til að tryggja samræmi í kóða og stílum.

---

## Uppsetning og skipulag

### Möppur og skrár

- **`index.html`**: Aðalsíða verkefnisins.
- **`main.js`**: Aðal JavaScript skráin sem inniheldur virkni verkefnisins.
- **`styles.css`**: Aðal stílsíða verkefnisins.
- **`data/`**: Inniheldur gögn sem verkefnið notar.
- **`img/`**: Inniheldur myndir sem notaðar eru í verkefninu.
- **`lib/`**: Möppan inniheldur sérsniðna JavaScript virkni.
- **`node_modules/`**: Sjálfvirk uppsetning á ytri háðum pakka.

### Skipulag CSS/Sass

- Stílskráin `styles.css` er skipulögð með hlutmótaaðferð þar sem hver hluti verkefnis er með sína sértæku stíla.
- Yfirlitsstílar eru settir efst í skrána, á meðan smærri stílar fyrir einstaka hluti koma á eftir.

---
## Skipulag JS

- main.js er aðal JavaScript skráin í þessu verkefni og sér um allar helstu aðgerðir og notendavirkni á vefsíðunni. Skráin notar DOM (Document Object Model) til að bæta og breyta innihaldi síðunnar í rauntíma, ásamt því að sækja gögn úr JSON-skrám.

-Þegar síðan hleðst inn, er hlustað á DOMContentLoaded atburðinn til að tryggja að allt HTML-innihald sé tilbúið áður en JavaScript kóðinn keyrir.

-Aðalsvæðið fyrir viðmótið er skilgreint (flashcardsContainer), og breytur eins og rétt/röng svör, valið efni, og fjöldi spurninga eru settar upp.

---

## Fyrirlestrar 
Þegar valið er að skoða fyrirlestra:
- Gögn eru sótt úr viðkomandi JSON-skrá (t.d. lectures.json).
- Viðmótið er hreinsað áður en nýtt efni er birt.


## Lykilhugtök
Þegar valið er að skoða lykilhugtök:
- Gögn eru sótt úr JSON-skrá (t.d. keywords.json).
- Flashcards eru búin til fyrir hvert hugtak með:
- Titli hugtaks.
- Lýsingu hugtaks.
- Kortin eru birt eitt í einu, og notandinn getur skoðað næsta kort með því að - smella á hnappinn „Næsta“.

## Spurningar
Þegar valið er að svara spurningum:
- Gögn eru sótt úr JSON-skrá (t.d. questions.json).
- Spurningarnar eru birtar ein í einu, og notandinn velur svar.
- Rétt og röng svör eru merkt og talin.
- Þegar allar spurningar eru svaraðar, birtist stigatafla sem sýnir hlutfall réttra svara.

## Framvinduskráning
- Framvinda notandans (rétt og röng svör) er geymd í localStorage með dagsetningu og viðeigandi efni.
- Ef notandi heimsækir framvindusíðuna (progress.html), birtist framvindan í lista.
---
## Hnappastjórnun
Skráin finnur alla hnappa sem notaðir eru til að velja efni (t.d. CSS, HTML, JavaScript).
Þegar ýtt er á hnapp:
- Hnapparnir eru endurstillaðir (litir og ástand).
- Valinn hnappur er merktur með sérstökum lit.
- Nýir valkostir (t.d. „Fyrirlestrar“, „Lykilhugtök“, „Spurningar“) eru búnir - til og birtir í viðmótinu.

---
## Aukaaðgerðir
- Confetti: Ef notandinn svarar réttri spurningu, þá birtist confetti sem hvatning.
- Shuffle: Spurningar og svör eru slembiraðaðar til að bæta fjölbreytni.
- Hnappar til baka: Þegar notandinn klárar efni eða spurningar, getur hann auðveldlega farið aftur á upphafssvæðið.


---
## Hvað hefur verið útfært?

- Full virkni til að birta efni á vefsíðu úr JSON-gögnum.
- Einföld uppsetning á JavaScript fyrir notendavirkni.
- Aðlögun fyrir snjallsíma (responsive design).
- Keyrir lintun til að tryggja gæði og samræmi í kóða.

---

## Þátttakendur

- **Nöfn**: Mínerva Hjörleifsdóttir og Rafael Darri Sævarsson
- **HÍ Notendanöfn**: mih13@hi.is og rds8@hi.is
- **GitHub notendanöfn**: Minerva0110 og Rafaeldarri33
