const express = require("express");
const GetPagelinks = require("./functions/GetPageLinks");
const GetSongsFromUrl = require("./functions/GetSongsFromUrl");

const app = express();

app.get("/search", (req, res) => {
  const query = req.query.q; // Assuming the search query is passed as a query parameter

  // Call the GetPagelinks function
  GetPagelinks(query)
    .then((results) => {
      // Handle the results
      res.json(results);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("An error occurred");
    });
});
app.get("/song", (req, res) => {
  const url = req.query.url;

  GetSongsFromUrl(url)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("An error occurred");
    });
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
