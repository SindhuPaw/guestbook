const express = require('express');
const { kv } = require('@vercel/kv');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/messages', async (req, res) => {
    try {
        const messages = await kv.lrange('messages', 0, -1);
        res.json(messages);
    } catch (error) {
        console.error("ERROR SAAT MENGAMBIL PESAN:", error);
        res.status(500).json({ error: 'Gagal mengambil pesan' });
    }
});

app.post('/messages', async (req, res) => {
    // LOG PALING AWAL: Apakah fungsi ini bahkan dijalankan
    console.log("Fungsi POST /messages dipanggil. Body request:", req.body);

    const newMessage = req.body.message;

    if (!newMessage) {
        console.log("Pesan tidak ditemukan di body, proses dihentikan.");
        return res.status(400).send('Pesan tidak boleh kosong.');
    }
    
    try {
        console.log(`Mencoba menyimpan pesan: "${newMessage}"`);
        await kv.lpush('messages', newMessage);
        console.log("Pesan berhasil disimpan.");
        res.redirect('/');
    } catch (error) {
        console.error("DETAIL ERROR SAAT MENYIMPAN KE KV:", error);
        return res.status(500).send('Gagal menyimpan pesan');
    }
});

module.exports = app;