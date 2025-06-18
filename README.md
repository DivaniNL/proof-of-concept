# Schilderijenoverzicht Rijksmuseum met TSD-Viewer

## Beschrijving
Voor deze sprint heb ik een creatief overzicht gemaakt om de schildereijen uit het Rijksmuseum te tonen. Op de detailpagina is het schilderij ook te zien in een 3D-viewer van 270-Degrees. Verder is er de mogelijkheid om je eigen kunstwerk te uploaden in het Custom Museum.

[Bekijk website](https://proof-of-concept-main.onrender.com/)


### Responsive

Ik heb mijn Website responsive gemaakt

Hieronder is elke breakpoint te zien:

#### Mobiel/tablet: (320 t/m 720px)
Home:

<img src="https://github.com/user-attachments/assets/6c75db02-e238-48a8-b568-bda3b20a3bf0" width="400"/>


Detailpagina:

<img src="https://github.com/user-attachments/assets/490fa8a0-5c76-4139-a6f6-e32c07d3e3ab" width="400"/>


Uploadpagina:

<img src="https://github.com/user-attachments/assets/0e9bda7d-3f11-4111-93fc-99556b716deb" width="400"/>



#### Desktop:

Home:

<img src="https://github.com/user-attachments/assets/225bff8a-8c05-48ab-88a5-cdbba4df0935" width="800"/>

Detailpagina:

<img src="https://github.com/user-attachments/assets/4a6f7f0f-d427-4653-859d-ae9793310242" width="800"/>

Upload:

<img src="https://github.com/user-attachments/assets/0dcc4172-adc6-42ca-aa60-73449ae47461" width="800"/>

## Ontwerpkeuzens


NOG ERBIJ ZETTEN DA TIK DE PRE CSS DAY GRID HEB TOEGEPAST



















### Home

Ik heb ervoor gekozen om, als scroll-snap wordt gesupport om de afbeeldingen in een frame te hangen. Ik heb hiervoor gekozen omdat de opdrachtgever geen simpel rijtje wilt zien met alle afbeeldingen en dat we wat leuks moesten bedenken.

### Detailpagina

Ik heb op mijn detailpagina twee Gestalt-principes toegepast. Hieronder licht ik toe welke ik waar heb toegepast en waarom.

<img width="826" alt="Scherm­afbeelding 2025-06-18 om 11 26 33" src="https://github.com/user-attachments/assets/c2cfead3-57dc-4e69-8ce8-ebb2ba72c432" />


#### Law of Common Region 

Ik heb de Gestalt Principe Law of Common Region toegepast op dit design om te onderscheiden welke elementen bij een bepaalde sectie horen

#### Law of Proximity

Ik heb de Gestalt Principe Law of Proximity toegepast op dit ontwerp. door wat meer ruimte dan gebruikelijk toe te passen op dit ontwerp is het duidelijker welke onderdelen bij elkaar horen en welke niet.

## Kenmerken

### TSD Viewer
In dit project wordt gebruik gemaakt van de TSD Viewer van 270-degrees(https://270degrees.io/)

Met deze viewer heb ik op de detailpagina het schilderij in een 3D frame geplaatst.

Hiervoor heb ik gebruik gemaakt van de volgende documentatieartikelen:

**OnloadComplete** heb ik gebruikt om de viewer aan te spreken vadat deze is geinitialiseerd.

https://docs.270degrees.nl/options/?h=onloadcomplete#onloadcomplete

**setTexture** heb ik gebruikt om de achtergrond aan te passen.

https://docs.270degrees.nl/plugins/customiser/methods/?h=settexture#settexture

**setBackground** heb ik gebruikt om de achtergrondkleur aan te passen van de model

https://docs.270degrees.nl/methods/?h=setbackgr#setbackground

**cameraPosition** heb ik gebruikt om de beginpositie van de camera te bepalen.

https://docs.270degrees.nl/options/?h=cameraposi#cameraposition

**cameraZoomLevel** heb ik gebruikt om voor verschillende devices een ander start-zoom level te kiezen

https://docs.270degrees.nl/options/?h=camerazoomlevel#camerazoomlevel

In onderstaand bestand spreek ik de TSD viewer aan in mijn project:

https://github.com/DivaniNL/proof-of-concept/blob/6b8d75b53021ad7a66dbd36fb8bf7aa51214332b/public/js/detailViewer.js#L1-L52

### NodeJS
Met Node kan je server-side applicaties bouwen met JavaScript. In dit project wordt Node.js gebruikt om een webserver te draaien die de applicatie bedient.

### Express
Express is een framework voor Node.js dat functies biedt voor het bouwen van sites. In dit project wordt Express gebruikt om routes te definiëren en HTTP-verzoeken(post en get) af te handelen.

### Liquid
Liquid is een template engine voor JavaScript en Ruby. Het wordt gebruikt om HTML te genereren met dynamische data. In dit project wordt Liquid gebruikt om de HTML-pagina's te renderen met data die wordt opgehaald van de Rijksmuseum API

### Projectstructuur
Het project heeft de volgende structuur:
- server.js: Dit is het hoofdbestand van de server. Hier worden de Express-applicatie en routes gedefinieerd.
- views: Bevat de Liquid templates voor de HTML-pagina's.
- public: Bevat de statische bestanden zoals CSS, JavaScript en afbeeldingen.

### Routes
De routes worden gedefinieerd in server.js. Hier zijn enkele belangrijke routes:

- `GET /`: De hoofdpagina waar alle kunststukken staan
- `GET /artpiece/:artpiece/:artname`: De detailpagina van een specifiek kunstwerk
De naam van het kunstwerk en het objectnummer zitten encrypted in de url. Zoals De+Nachtwacht.
Een link kan dan zijn:
/artpiece/SK-A-4830/Stilleven+met+vergulde+bokaal
- `GET /upload`: de pagina om je kusntwerken te uploaden
- `GET /custom-gallery`: De pagina waar alle ingezonden kunststukken staan
- `GET /artpiece/custom/:artpiece/:artname`: De detailpagina van een custom kusntwerkt, functioneert hetzelfde als bij een officieel kusntstuk, alleen zonder een request voor de details.

### Data ophalen en posten
De data wordt opgehaald van de Directus API met behulp van `fetch`. Bijvoorbeeld, in de route `GET /` wordt de lijst van de eerste 10 kunstwerken ingeladen

https://github.com/DivaniNL/proof-of-concept/blob/1b8823cb7101b7a5bc3f1773cd9391ece8686089/server.js#L27-L29


### HTML renderen met data
De HTML wordt gerenderd met Liquid templates. Bijvoorbeeld, in de route `GET /` wordt de homepagina geladen met de volgende code

https://github.com/DivaniNL/proof-of-concept/blob/1b8823cb7101b7a5bc3f1773cd9391ece8686089/server.js#L31-L33


De Liquid template index.liquid gebruikt de data om dynamisch HTML te genereren:

https://github.com/DivaniNL/proof-of-concept/blob/1b8823cb7101b7a5bc3f1773cd9391ece8686089/views/index.liquid#L5-L49

## Installatie

Om dit project lokaal te installeren en te draaien, volg je de onderstaande stappen:

### Vereisten
- Node.js (versie 14 of hoger)
- npm (Node Package Manager, wordt meestal samen met Node.js geïnstalleerd)
- GitHub Desktop (niet per se nodig, maar werkt fijn)

### Stappen

1. **Clone de repository**
    - Ga naar de repository: https://github.com/DivaniNL/proof-of-concept/
    - Klik op Code (groene knop) -> Open with GitHub Desktop
    - Klik op Clone
    - Selecteer "For my own purposes"

2. **Open het project in je codeeditor**

3. **Installeer de afhankelijkheden**
   - Gebruik npm om de benodigde pakketten te installeren door het volgende commando in de terminal uit te voeren:
   ```bash
   npm install
   ```

4. **Start de ontwikkelserver**
   - Start de server met het volgende commando:
   ```bash
   npm start
   ```

5. **Open de applicatie in je browser**
   - De server draait nu op `http://localhost:8000`. Open deze URL in je webbrowser om de applicatie te bekijken.

Volg deze stappen om de ontwikkelomgeving in te richten en aan de repository te kunnen werken. Als je vragen hebt of tegen problemen aanloopt, neem contact op met de projectbeheerder (Dylan).



