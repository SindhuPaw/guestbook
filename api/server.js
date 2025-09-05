const express = require('express');
const { createClient } = require('redis'); // Impor dari paket 'redis' yang baru
const app = express();

// Buat koneksi client ke database Redis Anda
// Ini secara otomatis akan membaca REDIS_URL dari environment variables
const client = createClient({
  url: process.env.REDIS_URL
});

// Listener untuk error koneksi database
client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

// Fungsi untuk memastikan client terhubung sebelum server mulai
// Kita menjalankan ini di luar agar koneksi dibuat sekali saja
(async () => {
  try {
    await client.connect();
    console.log('Berhasil terhubung ke database Redis.');
  } catch (err) {
    console.error('Gagal terhubung ke database Redis:', err);
  }
})();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route untuk MENDAPATKAN pesan (menggunakan client.lRange)
app.get('/messages', async (req, res) => {
    try {
        const messages = await client.lRange('messages', 0, -1);
        res.json(messages);
    } catch (error) {
        console.error("ERROR SAAT MENGAMBIL PESAN:", error);
        res.status(500).json({ error: 'Gagal mengambil pesan' });
    }
});

// Route untuk MENAMBAHKAN pesan (menggunakan client.lPush)
app.post('/messages', async (req, res) => {
    const newMessage = req.body.message;
    if (newMessage) {
        try {
            await client.lPush('messages', newMessage);
            res.redirect('/');
        } catch (error) {
            console.error("DETAIL ERROR SAAT MENYIMPAN:", error);
            return res.status(500).send('Gagal menyimpan pesan');
        }
    } else {
        return res.status(400).send('Pesan tidak boleh kosong');
    }
});

module.exports = app;