const express = require('express');
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const gulp = require('gulp');
const clean = require('gulp-clean');

const app = express();
const port = 3000;
// let audioName = "";

const YD = new YoutubeMp3Downloader({
    "ffmpegPath": __dirname + "\\ffmpeg\\bin\\ffmpeg.exe",        // Where is the FFmpeg binary located?
    "outputPath": __dirname + "\\converted",    // Where should the downloaded and encoded files be stored?
    "youtubeVideoQuality": "highest",       // What video quality should be used?
    "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
    "progressTimeout": 2000                 // How long should be the interval of the progress reports
});

app.listen(port, () => console.log(`YouTube mp3 downloader is listening on port ${port}!`));

app.get('/', (req, res) => {
    res.send("localhost:300/getaudio/:vid");
});

app.get('/getaudio/:vid', (req, res) => {
    let audioName;
    if(req.params.vid)
        audioName = req.params.vid + ".mp3";
    else
        return;

    console.log(req.params + '\n');

    YD.download(req.params.vid, audioName);
    
    YD.on("finished", function(err, data) {
        console.log(JSON.stringify(data));
        res.download(__dirname +'\\converted\\' + audioName, () => {
            removeFile(audioName);
        }); 
    });
    
    YD.on("error", function(error) {
        res.send("Error!");
        console.log(error);
    });
    
    YD.on("progress", function(progress) {
        console.log(JSON.stringify(progress));
    });
});

app.post('/cancel/:vid', (req, res) => {
    //YD...
});

const removeFile = function(fileName){
    if(fileName){
        gulp.src('./converted/' + fileName, { read: false,  allowEmpty: true}).pipe(clean());
    }
    // else{
    //     gulp.src('./converted/*', { read: false }).pipe(clean());
    // }
}