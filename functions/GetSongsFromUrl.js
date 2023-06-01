const axios = require("axios");
const { JSDOM } = require("jsdom");

const GetSongsFromUrl = (url) => {
  return axios
    .get(url)
    .then((response) => {
      // Create a DOM from the HTML content
      const dom = new JSDOM(response.data, {
        url,
      });
      const document = dom.window.document;
      const main = document.querySelector(".post-content");
      const raw_song_data = main
        .querySelector("#movie-handle")
        .innerHTML.trim();
      const link = main.querySelector(".dlink").href;

      const nameRegex = /<b>Name:<\/b>\s+(.*?)<br>/i;
      const singersRegex = /<b>Singers:<\/b>\s+(.*?)<br>/i;
      const musicRegex = /<b>Music:<\/b>\s+<a[^>]+>(.*?)<\/a><br>/i;
      const lyricsRegex = /<b>Lyrics:<\/b>\s+(.*?)<br>/i;
      const lengthRegex = /<b>Length:<\/b>\s+(.*?)<br>/i;
      const name = raw_song_data.match(nameRegex)?.[1];
      const singers = raw_song_data.match(singersRegex)?.[1];
      const music = raw_song_data.match(musicRegex)?.[1];
      const lyrics = raw_song_data.match(lyricsRegex)?.[1];
      const length = raw_song_data.match(lengthRegex)?.[1];
      const img = main.querySelector("img").src;
      const song_data = {
        name,
        singers,
        img,
        music,
        lyrics,
        length,
        link,
      };

      // console.log(song_data);

      //more from the album :
      const more = [];

      if (main.querySelectorAll("table").length === 2) {
        const more_songs_element = Array.from(
          main.querySelectorAll("table")[1].querySelectorAll("tr")
        ).slice(1);
        more_songs_element.forEach((row) => {
          const name = row.querySelector("h2").textContent.trim();
          const link = row.querySelector(".dlink").href;
          more.push({ name, link, img });
        });
      }
      const result = { song_data, more };

      return result;
    })
    .catch((error) => {
      throw error;
    });
};

module.exports = GetSongsFromUrl;
