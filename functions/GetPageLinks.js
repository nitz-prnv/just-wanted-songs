const axios = require("axios");
const { JSDOM } = require("jsdom");

const GetPagelinks = (query) => {
  const encodedQuery = encodeURIComponent(
    `site:masstamilan.dev intext:Download ${query} song`
  );

  // Define the Google search URL
  const googleSearchUrl = `https://www.google.com/search?source=lnt&tbs=sbd:1&q=${encodedQuery}`;

  return axios
    .get(googleSearchUrl)
    .then((response) => {
      const results = [];

      // Create a DOM from the HTML content
      const dom = new JSDOM(response.data);
      const document = dom.window.document;

      // Extract the search result elements
      const searchResults = Array.from(
        document.querySelectorAll("#main>div")
      ).slice(2);

      // Iterate over each search result and extract the required information
      searchResults.forEach((searchResult) => {
        let title = searchResult.querySelector("h3>div")?.innerHTML
          ? searchResult.querySelector("h3>div").innerHTML
          : "";
        title = title
          .toLowerCase()
          .replace("download", "")
          .replace("masstamilan", "")
          .replace(/\s+/g, " ")
          .trim();
        let link = searchResult.querySelector("a").href;
        link = link.replace("/url?q=", "").replace("/url?q=", "").split("&")[0];
        if (!title.includes("songs") && title) {
          results.push({
            title,
            link,
          });
        }
      });

      return results;
    })
    .catch((error) => {
      throw error;
    });
};

module.exports = GetPagelinks;
