const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware untuk membaca data JSON
app.use(express.urlencoded({ extended: true })); // Middleware untuk membaca data dari form

// Tempat kita akan menyimpan pesan (untuk sementara di memori)
let messages = [];

// Route untuk mendapatkan semua pesan
app.get('/messages', (req, res) => {
    res.json(messages);
});

// Route untuk menambahkan pesan baru
app.post('/messages', (req, res) => {
    const newMessage = req.body.message;
    messages.push(newMessage);
    res.redirect('/'); // Arahkan kembali ke halaman utama setelah mengirim pesan
});

app.use(express.static('public')); // Memberitahu server untuk menggunakan file di folder 'public'

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});