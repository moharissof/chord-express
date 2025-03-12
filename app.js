const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Inisialisasi Express app
const app = express();
app.use(cors());

// Inisialisasi Supabase client
const SUPABASE_URL = 'https://jmhbbmjqaercspxtxfrd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptaGJibWpxYWVyY3NweHR4ZnJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDE3NzYsImV4cCI6MjA1NjgxNzc3Nn0.2psBAdjTc98V-eaTqW7Ol7T1_wqGMvvcrBuivZ1uNn0';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Fungsi untuk membersihkan teks chord
function cleanChord(chord) {
    if (chord) {
        chord = chord.replace(/\r\n/g, '<br>');
    }
    return chord;
}

app.get('/', (req, res) => {
    try {
        res.json({ message: 'Selamat datang di API Chord Gitar' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route untuk menampilkan semua kategori
app.get('/kategori', async (req, res) => {
    try {
        const { data, error } = await supabase.from('kategori').select('*');
        if (error) throw error;
        res.json({ kategori: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route untuk menampilkan artis berdasarkan kategori
app.get('/kategori/:kategori_id', async (req, res) => {
    const kategoriId = req.params.kategori_id;
    try {
        const { data, error } = await supabase
            .from('artists')
            .select('*')
            .eq('kategori_id', kategoriId);
        if (error) throw error;
        res.json({ artists: data , nama_kategori: data[0].kategori });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route untuk menampilkan lagu berdasarkan artis
app.get('/kategori/:kategori_id/artist/:artist_id', async (req, res) => {
    const artistId = req.params.artist_id;
    try {
        const { data, error } = await supabase
            .from('songs')
            .select('*')
            .eq('artist_id', artistId);
        if (error) throw error;
        res.json({ songs: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route untuk menampilkan chord lagu berdasarkan id lagu
app.get('/chord/:song_id', async (req, res) => {
    const songId = req.params.song_id;
    try {
        const { data, error } = await supabase
            .from('songs')
            .select('title, chord')
            .eq('id', songId);
        if (error) throw error;
        if (data.length > 0) {
            const judulLagu = data[0].title;
            const chord = cleanChord(data[0].chord);
            res.json({ judul_lagu: judulLagu, chord: chord });
        } else {
            res.status(404).json({ error: 'Lagu tidak ditemukan' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});