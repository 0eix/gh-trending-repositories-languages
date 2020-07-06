const express = require("express");
const axios = require("axios");
const moment = require("moment");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
const app = express();

// Enable All CORS Requests
app.use(cors());

// Default
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
});

// Trending repositories languages endpoint
app.get("/api/github/trending-languages", (req, res) => {
  let date = moment().subtract(30, "days").toISOString();
  axios
    .get(
      `https://api.github.com/search/repositories?q=created:>${date}&sort=stars&order=desc&per_page=100&page=1`,
      { headers: { Accept: "application/vnd.github.v3+json" } }
    )
    .then((response) => {
      let repos = response.data.items;
      let out = []; // res output

      // Put the language in each repo in a set and remove null if any
      let languages = new Set();
      repos.map((repo) => languages.add(repo.language));
      languages.delete(null);

      // Put each language in the ouput array along with the number of repos and the list of repos
      [...languages].map((lang) => {
        out.push({
          language: lang,
          repositories_count: repos.filter((repo) => repo.language === lang)
            .length,
          repositories: repos.filter((repo) => repo.language === lang),
        });
      });

      // sort the output array by the number of repos for each language in descending order
      out.sort((a, b) => {
        let comparison = 0;
        if (a.repositories_count > b.repositories_count) {
          comparison = -1;
        } else if (a.repositories_count < b.repositories_count) {
          comparison = 1;
        }
        return comparison;
      });

      res.json(out);
    })
    .catch((err) => {
      throw err;
    });
});

// Not found middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(404).send("not found");
});

const listener = app.listen(PORT, () => {
  console.log("App is listening on port " + listener.address().port);
});
