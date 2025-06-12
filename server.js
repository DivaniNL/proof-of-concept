// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'
import multer from 'multer';
import fs from 'fs/promises';
// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid()
app.engine('liquid', engine.express())

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')

const artPiecesResponse = await fetch('https://www.rijksmuseum.nl/api/nl/collection?key=pWKXy0OF&ps=10');
const artPiecesResponseJSON = await artPiecesResponse.json();

app.get('/', async function (req, res) {
  res.render('index.liquid', { artPieces: artPiecesResponseJSON.artObjects })
})
app.get('/custom-gallery', async function (req, res) {
  const customArtPiecesResponse = await fetch('https://fdnd-agency.directus.app/items/degrees270_gallery?filter={"for":"Divani/Gallery270"}&limit=-1&fields=*,image.id,image.width,image.height');
  const customArtPiecesResponseJSON = await customArtPiecesResponse.json();
  res.render('custom-gallery.liquid', { artPieces: customArtPiecesResponseJSON.data })
})
app.get('/upload{/:status}', async function (req, res) {
  if (req.query.status){
    res.render('upload.liquid', {status: "ok"})

  }else{
    res.render('upload.liquid')

  }
})
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'Geen bestand ontvangen' });
    
  try {
    const fileBuffer = await fs.readFile(file.path);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);

    const multipartBody =
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="${file.originalname}"\r\n` +
      `Content-Type: ${file.mimetype}\r\n\r\n` +
      fileBuffer +
      `\r\n--${boundary}--\r\n`;

    const uploadResponse = await fetch('https://fdnd-agency.directus.app/files', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        // 'Authorization': 'Bearer YOUR_TOKEN_HERE', // indien nodig
      },
      body: Buffer.concat([
        Buffer.from(multipartBody.split(fileBuffer)[0], 'utf8'),
        fileBuffer,
        Buffer.from(multipartBody.split(fileBuffer)[1], 'utf8')
      ]),
    });

    if (!uploadResponse.ok) {
      const text = await uploadResponse.text();
      throw new Error(`Upload failed: ${uploadResponse.status} - ${text}`);
    }

    const uploaded = await uploadResponse.json();
    const fileId = uploaded.data.id;

    // 2. Maak een record aan
    const record = {
      for: 'Divani/Gallery270',
      title: req.body.title,
      image: fileId,
    };

    const recordResponse = await fetch('https://fdnd-agency.directus.app/items/degrees270_gallery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_TOKEN_HERE',
      },
      body: JSON.stringify(record),
    });

    if (!recordResponse.ok) {
      const text = await recordResponse.text();
      throw new Error(`Record creation failed: ${recordResponse.status} - ${text}`);
    }

    const recordResult = await recordResponse.json();
    await fs.unlink(file.path);

    res.redirect(303, `/upload/success`, );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload mislukt', details: err.message });
  }
});

app.get('/artpiece/:artpiece/:artname', async function (req, res) {
  const detailArtPiececombinedInfo = [];
  let selectedArtPiece = req.params.artpiece
  let artName = req.params.artname;
  const headerImageResponse = await fetch('https://www.rijksmuseum.nl/api/nl/collection?key=pWKXy0OF&q='+artName+'&format=json&ps=1');
  const headerImageResponseJSON = await headerImageResponse.json();
  let headerImage = headerImageResponseJSON.artObjects[0].headerImage;

  const detailArtPieceResponse = await fetch('https://www.rijksmuseum.nl/api/nl/collection/'+selectedArtPiece+'?key=pWKXy0OF')
  const detailArtPieceResponseJSON = await detailArtPieceResponse.json();
  let thisArtPieceObject = detailArtPieceResponseJSON.artObject;
  console.log(thisArtPieceObject);
  detailArtPiececombinedInfo.push({
    ...thisArtPieceObject,
    headerImage: headerImage
  })
  res.render('detail.liquid', { artPiece: detailArtPiececombinedInfo[0] })
})

app.get('/artpiece/custom/:artpiece/:artname', async function (req, res) {
  let selectedArtPiece = req.params.artpiece
  const detailArtPieceResponse = await fetch('https://fdnd-agency.directus.app/items/degrees270_gallery/'+selectedArtPiece+'?fields=*,image.id,image.width,image.height');
  const detailArtPieceResponseJSON = await detailArtPieceResponse.json();
  let dataToPass = detailArtPieceResponseJSON.data
  res.render('detail-custom.liquid', { artPiece: dataToPass})
})


// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  console.log(`Project draait via http://localhost:${app.get('port')}/\n\nYippie`)
})