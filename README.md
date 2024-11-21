# RAG Chatbot omalla tietopankilla

Retrieval-Augmented Generation (RAG) chatbot-toteutus, joka on rakennettu käyttäen Next.js:ää, Vercel AI SDK:ta ja OpenAI:ta. Chatbot mahdollistaa käyttäjien omien dokumenttien lataamisen, joita käytetään keskustelujen tietopankkina.

## Ominaisuudet

- 🤖 RAG-pohjainen chatbot OpenAI:n malleilla
- 📁 Tiedostojen latausmahdollisuus omaan tietopankkiin
- 🔍 Älykäs dokumenttien pilkkominen ja upottaminen
- 🗄️ PostgreSQL-tietokantaintegraatio upotuksien tallentamiseen
- 🔐 Käyttäjien tunnistautuminen
- 📍 Erityisominaisuus: Antiikkiliikkeiden haku Suomessa
- ⚡ Rakennettu Vercelin serverless-infrastruktuuriin

## Vaatimukset

Ennen aloittamista varmista, että sinulla on:

- Node.js asennettuna
- Vercel-tili (https://vercel.com)
- API-avaimet seuraaville:
  - OpenAI
  - Serper (antiikkiliikkeiden hakutoimintoa varten)

## Aloittaminen

1. Kloonaa repositorio
2. Luo `.env.local` tiedosto `.env.example` tiedoston pohjalta
3. Asenna riippuvuudet:
   ```bash
   npm install
   ```

Jos sinulla ei ole vielä Vercel-tiliä tai alustettua tietokantaa:

4. Luo tili Verceliin (https://vercel.com)
5. Alusta uusi projekti Vercelissä
6. Luo PostgreSQL-tietokanta Vercelin kautta
7. Alusta tietokanta:
   ```bash
   npm run build
   ```
   Tämä ajaa migraatiot käyttäen Drizzle ORM:ää.

Jos sinulla on jo Vercel-tili ja tietokanta alustettuna:

4. Yhdistä projekti olemassa olevaan Vercel-projektiisi
5. Käynnistä kehityspalvelin:
   ```bash
   npm run dev
   ```

## Ympäristömuuttujat

Luo `.env.local` tiedosto seuraavilla muuttujilla:

```env
POSTGRES_URL=postgres_yhteysmerkkijono
NEXT_PUBLIC_SERPER_API_KEY=serper_api_avain
# Lisää muut tarvittavat API-avaimet
```

## Tietokannan asennus

Projekti käyttää Vercel Postgres ja Drizzle ORM:ää. Tietokanta alustetaan automaattisesti komennolla:

```bash
npm run build
```

Tämä suorittaa migraatioskriptin (`migrate.ts`), joka luo kaikki tarvittavat taulut.

## Tunnistautuminen

Tunnistautuminen hoidetaan NextAuth.js:llä. Oletuksena sovellus käyttää käyttäjätunnus/salasana-tunnistautumista. Voit muokata tunnistautumisasetuksia tiedostossa:

```
app/(auth)/auth.config.ts
```

Rekisteröitymisen käyttöönottamiseksi lisää rekisteröitymispolku tunnistautumiskonfiguraatioon.

## Tiedostojen lataus ja RAG-toteutus

Sovelluksen RAG-toteutus koostuu kahdesta pääosasta:

1. Tiedostojen käsittely (`app/api/files/upload`):

   - Dokumenttien pilkkominen pienempiin osiin
   - Upotuksien luominen OpenAI:n embedding-mallilla
   - Tietojen tallennus Vercel Blob Storageen ja PostgreSQL-tietokantaan

2. Retriever-toiminnallisuus (`ai/rag-middleware.ts`):
   - Analysoi jokaisen käyttäjän viestin
   - Luokittelee viestin tyypin (kysymys, väite, muu)
   - Luo hypoteettisen vastauksen kysymykseen
   - Hakee tietokannasta relevanteimmat dokumentin osat käyttäen upotuksia ja kosinietäisyyttä
   - Lisää löydetyn kontekstin alkuperäiseen viestiin ennen kielimallille lähettämistä

Tiedostojen lataukset käsitellään `app/api/files/upload`-endpointissa, jossa dokumentit:

- Pilkotaan käyttäen RecursiveCharacterTextSplitter:iä
- Upotetaan käyttäen OpenAI:n text-embedding-3-small mallia
- Tallennetaan Vercel Blob Storageen ja PostgreSQL:ään

## Käyttörajoitukset

Koska sovellus käyttää Vercelin ilmaista tasoa:

- Vältä tarpeettoman suurien tiedostojen lataamista
- Huomioi kuukausittaiset serverless-funktioiden suoritusrajoitukset
- Huomioi tietokannan tallennustilan rajoitukset

## Erityisominaisuudet

### Antiikkiliikkeiden haku

Sovellus sisältää erityistyökalun antiikkiliikkeiden hakuun Suomessa käyttäen Serper API:a. Tämä toiminnallisuus on toteutettu chat-reitissä ja työkalujen konfiguraatiossa.

```javascript
  tools: {
      searchAntiqueStores: searchSerperLocations,
    },
```

## Tekninen toteutus

- Next.js
- Vercel AI SDK
- OpenAI API
- PostgreSQL (Vercel)
- Drizzle ORM
- NextAuth.js
- Vercel Blob Storage
- Tailwind CSS

## Tärkeät huomiot

- Muista hoitaa tietokannan migraatio käyttöönotossa
- Seuraa Vercelin käyttörajoituksia
- Suojaa API-avaimesi ja ympäristömuuttujat
- Harkitse maksullisiin tasoihin siirtymistä, jos tarvitset korkeampia käyttörajoja

## Lisenssi

MIT License - katso [LICENSE](LICENSE) tiedosto lisätietoja varten.
