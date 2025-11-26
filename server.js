const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/download", (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL tidak boleh kosong" });
    }

    const command = `yt-dlp -j "${url}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(stderr);
            return res.status(500).json({ error: "Gagal menjalankan yt-dlp" });
        }

        try {
            const result = JSON.parse(stdout);

            const formats = result.formats
                .filter(f => f.ext === "mp4" && f.url)
                .map(f => ({
                    quality: f.format_note || (f.height + "p"),
                    url: f.url
                }));

            res.json({
                title: result.title,
                thumbnail: result.thumbnail,
                formats
            });
        } catch (e) {
            return res.status(500).json({ error: "Gagal parsing output yt-dlp" });
        }
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server berjalan di port " + PORT));
