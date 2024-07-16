// Importar paquetes
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

// Crear servidor Express
const app = express();

// Número de puerto
const PORT = process.env.PORT || 3000;

// Configurar el motor de vistas
app.set('view engine', 'ejs'); // index.ejs no html
app.use(express.static('public')) // public como directorio raíz

// Parsear datos HTML para solicitudes POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.render("index");
});

app.post('/convert-mp3', async (req, res) => {
    const videoId = req.body.videoId;

    if (!videoId) {
        return res.render("index", { success: false, message: "Please enter a video ID" });
    }

    try {
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': process.env.API_KEY,
                'x-rapidapi-host': process.env.API_HOST
            }
        });
        const fetchResponse = await fetchAPI.json();

        console.log('fetchResponse:', fetchResponse); // Registro de la respuesta de la API

        if (fetchResponse.status === 'ok') {
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            return res.render('index', { 
                success: true, 
                song_title: fetchResponse.title, 
                song_link: fetchResponse.link,
                thumbnail: thumbnailUrl 
            });
        } else {
            return res.render('index', { success: false, message: fetchResponse.msg });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.render('index', { success: false, message: 'An error occurred while fetching data' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
