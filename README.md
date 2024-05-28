# Gemini spatial example

![Screen recording of the demo](gemini-spatial-example.gif)

A cool thing about current Gemini models is that they can give bounding box information. This repo shows how to prompt and display bounding box info (there are some tricks). It's meant as a demonstrations and for other developers to build on. It uses vite-express with a minimal server to access the API.

To run locally (the only way to run it currently). Put your Gemini API Key (get from https://ai.google.dev/) into the `example.env` file and rename to `.env`. Use `npm install` and `npm run dev` to run locally.
