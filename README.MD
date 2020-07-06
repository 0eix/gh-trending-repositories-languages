# backend-coding-challenge

## Instructions

- Develop a REST microservice that list the languages used by the 100 trending public repos on GitHub.
- For every language, you need to calculate the attributes below 👇:
    - Number of repos using this language
    - The list of repos using the language

More info [here](https://github.com/gemography/backend-coding-challenge)

## Solution
**Endpoints:**  
- `[GET] /api/github/trending-languages` for trending repositories languages

## Technical environment

**Language:** JavaScript (node.js)  
**Packages:** express, axios, moment.js, cors  
**Misc:** nodemon  
**Editor:** vscode