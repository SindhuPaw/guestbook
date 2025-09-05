import { createClient } from 'redis';
import { NextResponse } from 'next/server';

const redis = await createClient().connect();

export const POST = async () => {
  // Fetch data from Redis
  const result = await redis.get("item");
  
  // Return the result in the response
  return new NextResponse(JSON.stringify({ result }), { status: 200 });
};

const express = require('express');
const { kv } = require('@vercel/kv'); // Impor Vercel KV
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Memberitahu server untuk menggunakan file di folder 'public'
app.use(express.static('public'));

// Route untuk MENDAPATKAN semua pesan dari database KV
app.get('/messages', async (req, res) => {
    try {
        // Mengambil semua item dari list 'messages' di database
        const messages = await kv.lrange('messages', 0, -1);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil pesan' });
    }
});

// Route untuk MENAMBAHKAN pesan baru ke database KV
app.post('/messages', async (req, res) => {
    const newMessage = req.body.message;
    if (newMessage) {
        try {
            // Menyimpan pesan baru ke list 'messages' di database
            await kv.lpush('messages', newMessage);
        } catch (error) {
            return res.status(500).send('Gagal menyimpan pesan');
        }
    }
    res.redirect('/'); // Arahkan kembali ke halaman utama
});

// PENTING: Hapus app.listen() dan ekspor 'app' untuk Vercel
module.exports = app;