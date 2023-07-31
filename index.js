const express = require("express");
const ytdl = require("ytdl-core");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});
app.get("/download", async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.status(400).send("Missing video URL");
    }
    try {
        const info = await ytdl.getInfo(videoUrl);
        const videoTitle = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, "_");
        const filteredFormats = info.formats.filter((format) => {
            return format.hasVideo && format.hasAudio && format.audioBitrate;
        });
        filteredFormats.sort((a, b) => b.audioBitrate - a.audioBitrate);
        const selectedFormat = filteredFormats[0];
        res.header("Content-Disposition", `attachment; filename="${videoTitle}.mp4"`);
        ytdl(videoUrl, {
            format: selectedFormat
        }).pipe(res);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Error occurred");
    }
});
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
