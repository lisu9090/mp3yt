const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const youtubeStream = require('youtube-audio-stream');
const express = require('express');
const path = require('path');
const router = express.Router();
const gulp = require('gulp');
const clean = require('gulp-clean');

const app = express();
const port = process.env.PORT || 3000;

const YD = new YoutubeMp3Downloader({
    "ffmpegPath": __dirname + "/vendor/ffmpeg/ffmpeg",        // Where is the FFmpeg binary located?
    "outputPath": __dirname + "/converted",    // Where should the downloaded and encoded files be stored?
    "youtubeVideoQuality": "highest",       // What video quality should be used?
    "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
    "progressTimeout": 2000                 // How long should be the interval of the progress reports
});

app.listen(port, () => console.log(`YouTube mp3 downloader is listening on port ${port}!`));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'))
});

app.get('/scripts/:name', (req, res) => {
    res.sendFile(__dirname + '/scripts/' + req.params.name);
});

app.get('/styles/:name', (req, res) => {
    res.sendFile(__dirname + '/styles/' + req.params.name);
});

app.get('/assets/:name', (req, res) => {
    res.sendFile(__dirname + '/assets/' + req.params.name);
});

app.get('/process/:vid', (req, res) => {
    let audioName = getAudioName(req, res);
    if(!audioName)
        return;

    try{
        YD.download(req.params.vid, audioName);
    
        YD.on("finished", function(err) {
            if(!err){
                res.download(__dirname +'/converted/' + audioName, () => {
                    removeFile(audioName);
                });
            }
            else{
                res.status(500).send(JSON.stringify(err));
            }
        });
        
        YD.on("error", function(error) {
            res.status(500).send(JSON.stringify(error));
        });
        
        // YD.on("progress", function(progress) {
        //     console.log(JSON.stringify(progress));
        // });
    }
    catch(exception){
        console.log(exception)
        res.status(500).send("Internal server error");
    }

});

app.post('/convert/:vid', (req, res) => {
    let audioName = getAudioName(req, res);
    if(!audioName)
        return;

        try{
            YD.download(req.params.vid, audioName);
        
            YD.on("finished", function(err, data) {
                if(!err){
                    res.status(200).send(JSON.stringify(data))
                }
                else{
                    res.status(500).send(JSON.stringify(err))
                }
                
            });
            
            YD.on("error", function(error) {
                res.status(500).send(JSON.stringify(error))
            });   
            
        }
        catch(exception){
            console.log(exception)
            res.status(500).send("Internal server error");
        }
});

app.get('/getaudio/:vid', (req, res) => {
    let audioName = getAudioName(req, res);
    if(!audioName)
        return;

    try{
        res.download(__dirname +'/converted/' + audioName, () => {
            removeFile(audioName);
        });
    }
    catch(exception){
        console.log(exception)
        res.status(500).send("Internal server error");
    }
});

app.get('/getaudio/stream/:vid', (req, res) => {
    if(!req.params.vid)
        return;

    const requestUrl = 'http://youtube.com/watch?v=' + req.params.vid

    try{
        youtubeStream(requestUrl).pipe(res)
    }
    catch(exception){
        console.log(exception)
        res.status(500).send("Internal server error");
    }
});

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/scripts'));
app.use('/', router);

const getAudioName = function(req, res){
    let audioName;
    if(req.params.vid)
        audioName = req.params.vid + ".mp3";
    else{
        res.status(400).send("Bad resource id");
        return null;
    }
    return audioName
}

const removeFile = function(fileName){
    if(fileName){
        gulp.src('./converted/' + fileName, { read: false,  allowEmpty: true}).pipe(clean());
    }
}