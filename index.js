const express = require("express");
const ytdl = require("ytdl-core");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/info", async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).send("Missing video URL");
    }

    try {
        const info = await ytdl.getInfo(videoUrl);
        const videoTitle = info.videoDetails.title;
        const thumbnails = info.videoDetails.thumbnails;
        const formats = info.formats.filter(format => format.hasVideo && format.hasAudio && format.container === 'mp4');
        const videoDuration = formatDuration(info.videoDetails.lengthSeconds);
        const authorName = info.videoDetails.author.name;

        res.send(`
            <html>
            <head>
                <title>Video Info</title>
                <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                }
                
                .container {
                    max-width: 960px;
                    margin: 0 auto;
                }
                
                #navbar {
                    background: #fff; 
                    border-bottom: 1px solid #e1e1e1;
                    color: #888;
                }
                
                .topnav {
                    overflow: hidden;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .nav-logo {
                    padding: 10px 0;
                }
                
                .nav-logo a {
                    text-decoration: none;
                    color: #007BFF;
                    font-size: 20px;
                    font-weight: bold;
                }
                
                .nav-item {
                    display: flex;
                    align-items: center;
                }
                
                .nav-item a {
                    text-decoration: none;
                    color: #333;
                    padding: 14px 16px;
                    text-align: center;
                    font-size: 16px;
                }
                
                .dropdown {
                    position: relative;
                    display: inline-block;
                }
                
                .dropdown-title {
                    cursor: pointer;
                    padding: 14px 16px;
                }
                
                .dropdown-content {
                    display: none;
                    position: absolute;
                    background-color: #f9f9f9;
                    min-width: 160px;
                    z-index: 1;
                }
                
                .dropdown-content a {
                    color: #333;
                    padding: 12px 16px;
                    text-decoration: none;
                    display: block;
                }
                
                .dropdown:hover .dropdown-content {
                    display: block;
                }
                
                .icon {
                    display: none;
                    font-size: 24px;
                    cursor: pointer;
                }
                


                .h1-1 {
                    text-align: center;
                    margin-top: 30px;
                    color: #007BFF;
                    font-size: 1.5em;
                }
                .h1-1-1 {
                    text-align: center;
                    padding-bottom:30px;
                    color: #007BFF;
                    font-size: 16px;
                    margin: 0 auto;
                    color: #4a474c;
                }
                .container-principal {
                    padding: 20px; 
                    background-color: #e9ecef;
                    border-radius: 14px;
                    margin: 0 auto;
                    max-width: 960px;
                }
                .container-1 {
                    display: flex;
                    padding: 15px 15px 0px 15px;
                }
                .item-0 {
                    margin-right: 20px;
                }
                .item {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .img-1 {
                    max-width: 300px;
                    height: auto;
                }
                .select-1 {
                    flex-grow: 1;
                    margin-right: 10px;
                }
                .button-1 {
                    background-color: #007BFF;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                    padding: 10px 20px;
                    font-size: 16px;
                }
                .button-1:hover {
                    background-color: #0056b3;
                }
                

                .form-control-small {
                    display: block;
                    font-size: 16px;
                    font-family: Roboto, sans-serif;
                    font-weight: 700;
                    color: #444;
                    line-height: 1.3;
                    padding: 10px 30px 10px 10px;
                    margin-right: 10px !important;
                    box-sizing: border-box;
                    border: 1px solid #aaa;
                    box-shadow: 0 1px 0 1px rgba(0, 0, 0, .04);
                    border-radius: 0.5em;
                    -moz-appearance: none;
                    -webkit-appearance: none;
                    appearance: none;
                    background-color: #fff;
                    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOTIuNCIgaGVpZ2h0PSIyOTIuNCI+PHBhdGggZmlsbD0iIzAwN0NCMiIgZD0iTTI4NyA2OS40YTE3LjYgMTcuNiAwIDAgMC0xMy01LjRIMTguNGMtNSAwLTkuMyAxLjgtMTIuOSA1LjRBMTcuNiAxNy42IDAgMCAwIDAgODIuMmMwIDUgMS44IDkuMyA1LjQgMTIuOWwxMjggMTI3LjljMy42IDMuNiA3LjggNS40IDEyLjggNS40czkuMi0xLjggMTIuOC01LjRMMjg3IDk1YzMuNS0zLjUgNS40LTcuOCA1LjQtMTIuOCAwLTUtMS45LTkuMi01LjUtMTIuOHoiLz48L3N2Zz4=), linear-gradient(to bottom, #fff 0%, #e5e5e5 100%);
                    background-repeat: no-repeat, repeat;
                    background-position: right 0.7em top 50%, 0 0;
                    background-size: 0.65em auto, 100%;
                  }
                  .select-and-button {
                    display: flex;
                    align-items: center; 
                    gap: 10px; 
                  }
                  .btn-blue-small, .btn-gray-small, .btn-white-small {
                    background: #515bd4;
                     border-radius: 0.5em;
                     border: none;
                     width: 150px;
                     padding: 13px 0;
                     font-weight: 600;
                     font-size: 13px;
                     cursor: pointer;
                     transition: all .3s;
                   }

                   .btn-blue-small {
                    background: #007BFF;
                    color: #fff;
                    
                  }
                  .ada{
                    padding-top: 30px;
                  }

                  @media screen and (max-width: 1010px) {
                    .topnav.responsive {
                        flex-direction: column;
                    }
        
                    .topnav {
                        display: block;
                    }
        
                    .nav-item {
                        flex-direction: column;
                        align-items: flex-start;
                        display: none;
        
                    }
        
                    .nav-item.active {
                        display: flex;
                    }
        
                    .icon {
                        display: block;
                        font-size: 25px;
        
                        cursor: pointer;
                    }
        
                    .nav-item a {
                        padding: 14px 0px;
                    }
        
                    .dropdown-title {
                        padding: 14px 0px;
                    }
        
                    .nav-item.active {
                        display: flex;
                    }
        
                    .nav-logo {
                        display: block;
                    }
        
                    .flx {
                        display: flex;
                        justify-content: space-between;
                    }
        
                    .container {
                        padding: 14px;
                    }

                    .container-principal {
                        padding: 14px;
                    }
                
                    .container-1 {
                        padding: 10px;
                    }
                
                    .container-1 {
                        flex-direction: column; /* Display items in a column */
                        align-items: center; /* Center content horizontally */
                    }
                
                    .img-1 {
                        max-width: 100%; /* Make sure the image doesn't overflow */
                        height: auto;
                        margin-left: 10px;
                        padding-bottom:10px;
                    }
                
                    .select-and-button {
                        flex-direction: column; /* Display select and button in a column */
                    }

                    .form-control-small{
                        width: 150px;
                        margin-right: 0px !important;
                    }
                    .select-1 {
                        margin-right: 0px !important;
                    }
                    .resname{
                        display:none;
                    }

                    .nametit{
                        padding-bottom:10px;
                    }
                }

                  @media screen and (max-width: 600px) {
                    .topnav.responsive {
                        flex-direction: column;
                    }
                    .nametit{
                        font-size: 14px;
                        padding-bottom:10px;
                    }
                    .resname{
                        display:none;
                    }
        
                    .topnav {
                        display: block;
                    }
        
                    .nav-item {
                        flex-direction: column;
                        align-items: flex-start;
                        display: none;
        
                    }
        
                    .nav-item.active {
                        display: flex;
                    }
        
                    .icon {
                        display: block;
                        font-size: 25px;
        
                        cursor: pointer;
                    }
        
                    .nav-item a {
                        padding: 14px 0px;
                    }
        
                    .dropdown-title {
                        padding: 14px 0px;
                    }
        
                    .nav-item.active {
                        display: flex;
                    }
        
                    .nav-logo {
                        display: block;
                    }
        
                    .flx {
                        display: flex;
                        justify-content: space-between;
                    }
        
                    .container {
                        padding: 14px;
                    }

                    .container-principal {
                        padding: 14px;
                    }
                
                    .container-1 {
                        padding: 10px;
                    }
                
                    .container-1 {
                        flex-direction: column; /* Display items in a column */
                        align-items: center; /* Center content horizontally */
                    }
                
                    .img-1 {
                        max-width: 100%; /* Make sure the image doesn't overflow */
                        height: auto;
                        margin-left: 10px;
                        padding-bottom:10px;
                    }
                
                    .select-and-button {
                        flex-direction: column; /* Display select and button in a column */
                    }

                    .form-control-small{
                        width: 150px;
                        margin-right: 0px !important;
                    }
                    .select-1 {
                        margin-right: 0px !important;
                    }
                }
                </style>
            </head>
            <body>
            <header id="navbar">
            <div class="container">
                <div class="flx">
                    <div class="topnav" id="myTopnav">
                        <div class="nav-logo">
                            <a class="navbar-brand waves-effect" href="/">
                                <span class="logo-name">SnapTube</span>
                            </a>
                        </div>
                        <div class="nav-item" itemscope="" itemtype="http://www.schema.org/SiteNavigationElement">
                            <a itemprop="url" href="https://mp4-link-downloader.onrender.com/terms-of-service"><span
                                    itemprop="name">Términos de servicio</span></a>
                            <a itemprop="url" href="https://mp4-link-downloader.onrender.com/privacy-policy"><span
                                    itemprop="name">Política de privacidad</span></a>
                            <a itemprop="url" href="https://mp4-link-downloader.onrender.com"><span itemprop="name">Youtube
                                    to
                                    MP4</span></a>
                            <a itemprop="url" href="https://mp3-link-downloader.onrender.com"><span itemprop="name">Youtube
                                    to
                                    MP3</span></a>
                            <div class="dropdown">
                                <div class="dropbtn dropdown-title"> Español
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 16 8"
                                        fill="none">
                                        <path
                                            d="M15.0449 0.291415C14.8464 0.0929657 14.5239 0.0929657 14.3255 0.291415L7.9999 6.6294L1.66192 0.291415C1.46347 0.0929657 1.14099 0.0929657 0.942538 0.291415C0.744089 0.489865 0.744089 0.812346 0.942538 1.0108L7.62781 7.69606C7.72703 7.79529 7.85107 7.8449 7.9875 7.8449C8.11153 7.8449 8.24796 7.79529 8.34719 7.69606L15.0325 1.0108C15.2433 0.812346 15.2433 0.489865 15.0449 0.291415Z"
                                            fill="#888"></path>
                                    </svg>
                                </div>
                                <div class="dropdown-content">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="icon" onclick="toggleMenu()">
                        &#9776;
                    </div>
                </div>
            </div>
        </header>
<div class="container">
            <h1 class="h1-1">Convertir Youtube a MP4</h1>
            <p class="h1-1-1">Convierta YouTube a MP4 en 1080p, 2k, 4k, 8k en línea</p>
            <div class="container-principal">
                <div class="container-1">
                    <div class="item-0">
                        <img class="img-1" src="${thumbnails[0].url}" alt="Video Thumbnail">
                    </div>
                    
                    <div class="item">
                        <span class="nametit">${videoTitle}</span>
                        <div class="info-row resname">
                            <span>${authorName}</span>
                        </div>
                        <div class="info-row resname">
                            <span>${videoDuration}</span>
                        </div>
                        <form action="/download" method="get">
                            <input type="hidden" name="url" value="${videoUrl}">
                            
                            <div class="info-row select-and-button">
                                <label for="format">Select Video Quality:</label>
                                <select class="select-1 form-control form-control-small" id="format" name="format">
                                ${formats.map(format => `
                                    <option value="${format.itag}">${format.qualityLabel}</option>
                                `).join('')}
                            </select>
                                <button class=" button-1 btn-blue-small form-control btn-ads" type="submit">Get link</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>

            <div class="container ada">

            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1431012531703295"
            crossorigin="anonymous"></script>
       <!-- Uno -->
       <ins class="adsbygoogle"
            style="display:block"
            data-ad-client="ca-pub-1431012531703295"
            data-ad-slot="5406578885"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
       <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
       </script>

       <div class="test">
       <script async
           src="https://nwwais.com/pw/waWQiOjExNjI3MjgsInNpZCI6MTI1NTYyNywid2lkIjo0NzM1NzksInNyYyI6Mn0=eyJ.js"></script>

       <script>(function (d) { let s = d.createElement('script'); s.async = true; s.src = 'https://frenchequal.pro/code/pops.js?h=waWQiOjExNjI3MjgsInNpZCI6MTI1NTYyNywid2lkIjo0NzM1OTYsInNyYyI6Mn0=eyJ'; d.head.appendChild(s); })(document);</script>
   </div>

       </div>

            <script>
            function toggleMenu() {
                var navItem = document.querySelector(".nav-item");
                navItem.classList.toggle("active");
            }
        </script>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Error occurred");
    }
});

app.get("/download", async (req, res) => {
    const videoUrl = req.query.url;
    const selectedQuality = parseInt(req.query.format);  // Convierte a número entero
    if (!videoUrl || isNaN(selectedQuality)) {  // Verifica si es un número válido
        return res.status(400).send("Missing video URL or invalid format");
    }

    try {
        const info = await ytdl.getInfo(videoUrl);
        const videoTitle = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, "_");
        res.header("Content-Disposition", `attachment; filename="${videoTitle}.mp4"`);
        ytdl(videoUrl, {
            format: "mp4",
            quality: selectedQuality,
        }).pipe(res);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Error occurred");
    }
});

app.get("/privacy-policy", (req, res) => {
    res.sendFile(__dirname + '/public/privacy-policy.html');
});

app.get("/terms-of-service", (req, res) => {
    res.sendFile(__dirname + '/public/terms-of-service.html');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
