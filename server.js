const express = require("express");
const cors = require("cors");
const ytdlp = require("yt-dlp-exec");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/download", async (req, res) => {
    const url = req.body.url;

    if (!url) return res.status(400).json({ error: "URL tidak boleh kosong" });

    try {
        const result = await ytdlp(url, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true
        });

        res.json({
            title: result.title,
            thumbnail: result.thumbnail,
            formats: result.formats
                .filter(f => f.ext === "mp4" && f.url)
                .map(f => ({
                    quality: f.format_note,
                    url: f.url
                }))
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gagal memproses URL" });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server berjalan di port " + PORT));
