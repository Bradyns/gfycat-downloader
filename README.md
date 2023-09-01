
# GFYCAT DOWNLOADER

---

### Update (September 1st, 2023):

[Gfycat](https://gfycat.com) has now closed, so I will be archiving this repo.

---

The website [Gfycat](https://gfycat.com) is shutting down on September 1st, 2023.. and with it, it will delete all content.

This project was made in order for me to download Rocket League clips I'd uploaded to the website over the years.

I originally wrote it in Python, but realised that gfycats API only accepted web requests, so I swapped over to javascript.

It now uses an .mjs script in Node.js.

### There are 3 files

##### - `gfycat-download.mjs` is a Node.js script which will download the gfycat videos.
##### - `config.json` is a configuration file for the Node.js script. It must be configured before the script is run.
##### - For Windows users, I've added `gfycat.bat`. This batch file is intended to streamline the process.

###### ⚠️ Please use this project responsibly and in accordance with Gfycat's terms of service.

<br>
<br>

## Getting Started


### Prerequisites

##### - Node.js
  - You can download Node.js from here: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

##### - You will need to obtain your Client ID and Client Secret from Gfycat.
  - These can be found at: [https://developers.gfycat.com/signup/#/apiform](https://developers.gfycat.com/signup/#/apiform)

<br>

### Installing

##### 0. Clone the repo
##### 1. Edit the config.json file
##### 2. Install dependencies
##### 3. Run the script

<br>
<br>

## How to Use the Script

### Step 0: Clone the repo

```sh
git clone https://github.com/Bradyns/gfycat-downloader.git
```

###### ℹ️ **NOTE: Make sure all 3 files are in the same directory.**

<br>

### Step 1: Configure `config.json` (See below)

##### Open `config.json` in your text-editor or IDE of choice.
##### Configure the following settings to your liking:

##### - `clientId` - Your Gfycat Client ID - Replace with your own client ID ( Example: 'abcd1234' )
##### - `clientSecret` - Your Gfycat Client Secret - Replace with your own client secret ( Example: 'abcdefghijklmnopqrstuvwxyz1234567890' )
##### - `username` - Your Gfycat username - Replace with your actual Gfycat username
##### - `password` - Your Gfycat password - Replace with your actual Gfycat password
##### - `maxConcurrentDownloads` - The maximum number of videos to download at once (Default is set to 3)
##### - `downloadSpeed` - in MB/s (megabytes per second). You can change this value to set the download speed. (Default is set to 0.25 MB/s)
##### - `videoFormat` - The format of the video to download. This can be 'mp4', 'webm', or 'both'. (Default is set to 'webm')

###### ℹ️ *Note: Refer to Prerequisites for obtaining your Client ID and Client Secret.*

###### ⚠️ Please adhere to Gfycat's API terms of service: [https://gfycat.com/api-terms](https://gfycat.com/api-terms)

###### *Windows users, running the batch file will install the dependencies for you, so you can skip Step 2 and run `gfycat.bat`.*



<br>

### Step 2: Install dependencies

##### Once you've installed Node.js, you can install the other dependencies by running the following command:

```sh
npm install stream node-fetch fs util stream-throttle progress

```

<br>

### Step 3: Run the script

##### Once you've configured `config.json`, and installed the dependencies you can run the script by running the following command:

```sh
node gfycat-download.mjs
```

<br>

##### Once the script is run, it will make a new folder called `gfycat_downloads` in the same directory as the script.

##### It will then download all of your gfycat videos into either a `webm` or `mp4` folder (or both, depending on your choice).

##### It will prefix the filename of each video with the date you uploaded the video.

##### *I personally downloaded 342 .webm files which totalled 9.2GB.*

##### The script should print the percentage of videos downloaded.

##### It will take a while so be patient.

<br>
<br>

## Contributing

If you have a suggestion or fix, please submit a pull request. I'm still pretty new to this stuff and am all ears.

## License

This project is licensed under the MIT License.

Go ham.

## Acknowledgments

- I'd like to thank the creators of Gfycat for creating such a great website over all these years. ❤️
