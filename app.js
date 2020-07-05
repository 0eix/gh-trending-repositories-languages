const express = require("express");
const axios = require("axios");
const moment = require("moment");

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {
  res.send(
    "<a href='/api/github/trending-languages'>/api/github/trending-languages</a>"
  );
  res.end();
});

app.get("/api/github/trending-languages", (req, res) => {
  let date = moment().subtract(30, "days").toISOString();
  axios
    .get(
      `https://api.github.com/search/repositories?q=created:>${date}&sort=stars&order=desc&per_page=100&page=1`,
      { headers: { Accept: "application/vnd.github.v3+json" } }
    )
    .then((response) => {
      let repos = response.data.items;
      let out = [];

      let languages = new Set();
      repos.map((repo) => languages.add(repo.language));
      languages.delete(null);

      [...languages].map((lang) => {
        out.push({
          language: lang,
          repositories_count: repos.filter((repo) => repo.language === lang)
            .length,
          repositories: repos.filter((repo) => repo.language === lang),
        });
      });

      function compare(a, b) {
        let comparison = 0;
        if (a.repositories_count > b.repositories_count) {
          comparison = -1;
        } else if (a.repositories_count < b.repositories_count) {
          comparison = 1;
        }
        return comparison;
      }
      
      out.sort(compare);

      res.json(out);
    })
    .catch((err) => {
      throw err;
    });
});

const listener = app.listen(PORT, () => {
  console.log("App is listening on port " + listener.address().port);
});
