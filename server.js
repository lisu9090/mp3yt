const express = require('express');
const YoutubeMp3Downloader = require("youtube-mp3-downloader");

const app = express();
const port = 3000;

const YD = new YoutubeMp3Downloader({
    "ffmpegPath": __dirname + "\\ffmpeg\\bin\\",        // Where is the FFmpeg binary located?
    "outputPath": __dirname + "\\converted",    // Where should the downloaded and encoded files be stored?
    "youtubeVideoQuality": "highest",       // What video quality should be used?
    "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
    "progressTimeout": 2000                 // How long should be the interval of the progress reports
});

app.get('/', (req, res) => {
    res.send("localhost:300/getaudio/:vid");
});

app.get('/getaudio/:vid', (req, res) => {

    console.log(req.params);
    const audioName = req.params.vid + ".mp3";

    YD.download(req.params.vid, audioName);
    
    YD.on("finished", function(err, data) {
        console.log(JSON.stringify(data));
        res.download(__dirname +'\\converted\\' + audioName); 
    });
    
    YD.on("error", function(error) {
        res.send("Error!");
        console.log(error);
    });
    
    YD.on("progress", function(progress) {
        console.log(JSON.stringify(progress));
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));