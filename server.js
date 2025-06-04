// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'
import { exec } from 'node:child_process'
import fs from 'fs';
import FormData from 'form-data';
import multer from 'multer';
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

const artPiecesResponse = await fetch('https://www.rijksmuseum.nl/api/nl/collection?key=pWKXy0OF&ps=100');
const artPiecesResponseJSON = await artPiecesResponse.json();

app.get('/', async function (req, res) {
  res.render('index.liquid', { artPieces: artPiecesResponseJSON.artObjects[0] })
})
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Geen bestand ontvangen' });
    console.log(file);
  try {
    // 1. Upload bestand naar Directus /files endpoint
    exec('curl -F "file=@/Users/dylannierop/Documents/github/proof-of-concept/uploads/' + file.filename + ';filename=' + file.originalname + ';type=' + file.mimetype + '" https://fdnd-agency.directus.app/files', async function(err, stdout) {
        console.log(stdout);
        const uploadData = JSON.parse(stdout)
        const fileId = uploadData.data.id;
        console.log(uploadData);
        // 2. Maak record aan met het bestand als cover
        const record = {
        full_name: 'Lisanne Bronkhorst',
        status: 'draft',
        cover: fileId,
        };

        const recordResponse = await fetch('https://fdnd-agency.directus.app/items/mh_users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
        });

        if (!recordResponse.ok) {
        throw new Error(`Record creation failed with status ${recordResponse.status}`);
        }

        const recordData = await recordResponse.json();

        // Opruimen van tijdelijk bestand
        fs.unlinkSync(file.path);

        res.json({
        message: 'Upload en record succesvol',
        record: recordData,
        });
    })
  } catch (error) {
    res.status(500).json({ error: 'Upload mislukt', details: error.message });
  }
});
// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  console.log(`Project draait via http://localhost:${app.get('port')}/\n\nYippie`)
})