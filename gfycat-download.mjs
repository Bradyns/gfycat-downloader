// Script to download all of your gfycat videos.

// =================================================================================================
// Prerequisites
// =================================================================================================
// Before running this script, make sure you have Node.js installed.
// You can download Node.js from https://nodejs.org/en/download/
// =================================================================================================

// =================================================================================================
// Instructions
// =================================================================================================
// 1. Replace the values of the configurable variables with your own values.



// 2. Open a terminal and navigate to the directory containing this script.
// Client ID and secret can be found at https://developers.gfycat.com/signup/#/apiform
// =================================================================================================

// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// =================================================================================================
// --- Script begins here --------------------------------------------------------------------------
// =================================================================================================

// Import the required modules

import fetch from 'node-fetch';
import fs from 'fs';
import util from 'util';
import { pipeline as _pipeline } from 'stream';
import { promisify } from 'util';
import { Throttle } from 'stream-throttle';

// The above packages can be installed with the following console command:
// $ npm install stream fs util node-fetch stream-throttle progress

// // ================================================================================================
// // Configurable variables
// // ================================================================================================

// // --- Client ID ----------------------------------------------------------------------------------
// // Replace with your own client ID ( Example: 'abcd1234' )
// const clientId = 'abcd1234';

// // --- Client Secret ------------------------------------------------------------------------------
// // Replace with your own client secret ( Example: 'abcdefghijklmnopqrstuvwxyz1234567890' )
// const clientSecret = 'abcdefghijklmnopqrstuvwxyz1234567890';

// // --- Gfycat Username & Password -----------------------------------------------------------------
// const username = 'gfycat_username'; // Replace with your actual Gfycat username
// const password = 'gfycat_password'; // Replace with your actual Gfycat password

// // --- Max concurrent downloads -------------------------------------------------------------------
// const maxConcurrentDownloads = 3; // Default is set to 3

// // --- Download Speed -----------------------------------------------------------------------------
// const downloadSpeed = 0.25; // in MB/s (megabytes). You can change this value to set the download speed. Default is set to 0.25 MB/s

// // --- Video File Type ----------------------------------------------------------------------------
// const videoFormat = 'webm'; // can be 'mp4', 'webm', or 'both'
// // ================================================================================================


// =================================================================================================
// --- Reads from the config.json file -------------------------------------------------------------

const readFile = util.promisify(fs.readFile);

async function getConfig() {
    let data = await readFile('./config.json');
    return JSON.parse(data);
}

// Call getConfig function to get the config values
getConfig().then(config => {
    let clientId = config.clientId;
    let clientSecret = config.clientSecret;
    let username = config.username;
    let password = config.password;
    let maxConcurrentDownloads = config.maxConcurrentDownloads;
    let downloadSpeed = config.downloadSpeed;
    let videoFormat = config.videoFormat;

    // Call the main function with the config values (this was doing my head in for a while)
    main(clientId, clientSecret, username, password, maxConcurrentDownloads, downloadSpeed, videoFormat).catch(console.error);
});

// ==================================================================================================
// --- Don't edit these constants -------------------------------------------------------------------

const pipeline = promisify(_pipeline);
const tokenUrl = 'https://api.gfycat.com/v1/oauth/token';
const gfycatUrl = 'https://api.gfycat.com/v1/gfycats/';
const userUploadsUrl = `https://api.gfycat.com/v1/me/gfycats`;

// ==================================================================================================

const getAuthToken = async (clientId, clientSecret, username, password) => {
  const response = await fetch(tokenUrl, {
    method: 'POST',
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'password',
      username: username,
      password: password,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Unexpected response ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
};

const getUserUploads = async (authToken, cursor) => {
  const response = await fetch(`${userUploadsUrl}?count=999${cursor ? '&cursor=' + cursor : ''}`, {
    headers: { Authorization: 'Bearer ' + authToken },
  });

  if (!response.ok) {
    throw new Error(`Unexpected response ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

const downloadVideo = async (video, format, downloadSpeed) => {
  const response = await fetch(video[format + 'Url']);

  if (!response.ok) {
    throw new Error(`Unexpected response ${response.statusText}`);
  }

  const date = new Date(video.createDate * 1000);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  const filename = `gfycat_downloads/${format}/${year}-${month}-${day}_${video.gfyId}.${format}`;
  const fileStream = fs.createWriteStream(filename);

  // Throttle instance to limit download speed 
  // My poor aussie internet couldn't handle 10 concurrent downloads at 1 MB/s
  const throttle = new Throttle({ rate: 1024 * 1024 * downloadSpeed }); // downloadSpeed MB/s (megabytes per second)

  await pipeline(response.body, throttle, fileStream);
};

const main = async (clientId, clientSecret, username, password, maxConcurrentDownloads, downloadSpeed, videoFormat) => {
  if (!fs.existsSync(`gfycat_downloads/${videoFormat}`)) {
    fs.mkdirSync(`gfycat_downloads/${videoFormat}`, { recursive: true });
  }

  const authToken = await getAuthToken(clientId, clientSecret, username, password);

  let userUploads = await getUserUploads(authToken);
  let videos = userUploads.gfycats;

  while (userUploads.cursor) {
    userUploads = await getUserUploads(authToken, userUploads.cursor);
    videos = [...videos, ...userUploads.gfycats];
  }

  const totalSize = videos.reduce((total, video) => total + video[videoFormat + 'Size'], 0);
  let downloadedSize = 0;

  const queue = [];  // Initialize the queue here

  for (const video of videos) {
    const downloadPromise = downloadVideo(video, videoFormat, downloadSpeed).then(() => {
      downloadedSize += video[videoFormat + 'Size'];
      process.stdout.write(`Download progress: ${((downloadedSize / totalSize) * 100).toFixed(2)}%\r`);

      // Remove the completed download from the queue (took a while to get this working as intended)
      queue.splice(queue.indexOf(downloadPromise), 1);
    });

    queue.push(downloadPromise);

    if (queue.length >= maxConcurrentDownloads) {
      await Promise.race(queue);
    }
  }

  // Wait for all downloads to finish
  await Promise.all(queue);
  console.log('Download completed.');
};

// Fin.