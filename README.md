# Gemini spatial example

![Screen recording of the demo](gemini-spatial-example.gif)

A cool thing about current Gemini models is that they can give bounding box information. This repo shows how to prompt and display bounding box info (there are some tricks). It's meant as a demonstrations and for other developers to build on. It uses vite-express with a minimal server to access the API.

## Normalization

If you're looking to make your own application. Keep in mind that gemini returns coordinates normalize to 1000x1000. It also better when using the coordinate order in the example prompt. See BoundingBoxOverlay.tsx for an example of how to transform these for use in HTML and javascript.

## More examples

A simpler example with a JSON prompt is available at https://github.com/GrantCuster/gemini-json-bounding-box-example.

## Running

To run locally (the only way to run it currently). Put your Gemini API Key (get from https://ai.google.dev/) into the `example.env` file and rename to `.env`. Use `npm install` and `npm run dev`.
