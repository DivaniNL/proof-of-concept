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
      full_name: 'Lisanne Bronkhorst',
      status: 'draft',
      cover: fileId,
    };

    const recordResponse = await fetch('https://fdnd-agency.directus.app/items/mh_users', {
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

    res.json({
      message: 'Upload en record succesvol',
      record: recordResult,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload mislukt', details: err.message });
  }
});
// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  console.log(`Project draait via http://localhost:${app.get('port')}/\n\nYippie`)
})