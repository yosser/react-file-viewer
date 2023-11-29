# react-file-viewer

Extendable file viewer for web

## Supported file formats:

-   Images: png, jpeg, gif, bmp, including 360-degree images
-   pdf
-   csv
-   xslx
-   docx
-   Video: mp4, webm
-   Audio: mp3

## Usage

Note this module works best with react 16+. If you are using React < 16 you will likely need to use version 0.5. `npm install react-file-viewer@0.5.0`.

There is one main React component, `FileViewer`, that takes the following props:

`fileType` string: type of resource to be shown (one of the supported file
formats, eg `'png'`). Passing in an unsupported file type will result in displaying
an `unsupported file type` message (or a custom component).

`filePath` string: the url of the resource to be shown by the FileViewer.

`onError` function [optional]: function that will be called when there is an error in the file
viewer fetching or rendering the requested resource. This is a place where you can
pass a callback for a logging utility.

`errorComponent` react element [optional]: A component to render in case of error
instead of the default error component that comes packaged with react-file-viewer.

`unsupportedComponent` react element [optional]: A component to render in case
the file format is not supported.

To use a custom error component, you might do the following:

```
// MyApp.js
import React, { Component } from 'react';
import logger from 'logging-library';
import FileViewer from 'react-file-viewer';
import { CustomErrorComponent } from 'custom-error';

const file = 'http://example.com/image.png'
const type = 'png'

class MyComponent extends Component {
  render() {
    return (
      <FileViewer
        fileType={type}
        filePath={file}
        errorComponent={CustomErrorComponent}
        onError={this.onError}/>
    );
  }

  onError(e) {
    logger.logError(e, 'error in file-viewer');
  }
}
```

## Development

There is a demo app built into this library that can be used for development
purposes.

### To start demo app

`npm run dev` will start the demo app

### To run the linter

`npm run lint`

### Extending the file viewer

Adding supported file types is easy (and pull requests are welcome!). Say, for
example, you want to add support for `.rtf` files. First, you need to create a
"driver" for that file type. A driver is just a component that is capable of
rendering that file type. (See what exists now in `src/components/drivers`.) After
you've created the driver component and added it to `src/components/drivers`, you
simply need to import the component into `file-vewer.jsx` and add a switch clause
for `rtf` to the `getDriver` method. Ie:

```
case 'rtf':
  return RtfViewer;
```

## Roadmap

-   Remove ignored linting rules and fix them

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

-   Configure the top-level `parserOptions` property like this:

```js
export default {
    // other rules...
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json", "./tsconfig.node.json"],
        tsconfigRootDir: __dirname,
    },
};
```

-   Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
-   Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
-   Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
