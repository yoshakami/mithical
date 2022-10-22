// sorry to the guy running that other website, but I can't scrape these from the official website anymore
const fs = require("fs");
const https = require("https");

let rawdata = fs.readFileSync("../../data.json");
let waccaData = JSON.parse(rawdata);

for (song of waccaData.songs) {
  const coverName = song.imageName;

  // check if file exists
  if (fs.existsSync(`./${coverName}`)) {
    console.log(`Skipping ${coverName}`);
    continue;
  }

  // download file
  const file = fs.createWriteStream(`./${coverName}`);
  const request = https.get(
    `https://dp4p6x0xfi5o9.cloudfront.net/wacca/img/cover/${coverName}`,
    function (response) {
      response.pipe(file);

      // after download completed close filestream
      file.on("finish", () => {
        file.close();
        console.log("Download Completed");
      });
    }
  );
}
