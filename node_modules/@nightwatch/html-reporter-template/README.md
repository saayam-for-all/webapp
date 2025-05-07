# Nightwatch HTML Reporter template

[![npm][npm-badge]][npm]
[![Discord][discord-badge]][discord]

> This package is used internally by the Nightwatch HTML reporter and it's not designed to be used directly.

This Repo contains template for HTML and VRT Reporter.

## 🏗 Installation

```sh
npm install @nightwatch/html-reporter-template
```

## 🚀 Usage

```javascript
const { writeNightwatchHTMLReport } = require('@nightwatch/html-reporter-template');;

/**
 * This function will insert the result object within the HTML **reporter**
 * and add it to the destination folder.
 * The result object will be available in the "window.nightwatchReport" variable.
 *
 */
writeNightwatchHTMLReport(<destFolder>, <destFileName>, <result object>);
```

> **Note**
> You can find about more about function [here](docs/README.md)

## 🐛 Issues

Issues with this Reporter Template can filed [here](https://github.com/nightwatchjs/html-reporter/issues)

If you want to contribute (or have contributed in the past), feel free to add yourself to the list of contributors in the package.json before you open a PR!

## 👨‍💻 Development

### Getting started

🛠️ [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) are required for the scripts. Make sure it's installed on your machine.

⬇️ **Install** the dependencies for the nightwatch reporter template

```bash
npm install
```

🏃 **Run** the tool

```bash
# To run HTML Reporter
npm run dev:html

# To run VRT Reporter
npm run dev:vrt
```

👷‍♂️ **Build** both reporters

```bash
npm run build:html
npm run build:vrt
```

### ♻️ Clean build files

```bash
npm run clean
```

[npm-badge]: https://img.shields.io/npm/v/@nightwatch/html-reporter-template.svg
[npm]: https://www.npmjs.com/package/@nightwatch/html-reporter-template
[discord-badge]: https://img.shields.io/discord/618399631038218240.svg?color=7389D8&labelColor=6A7EC2&logo=discord&logoColor=ffffff&style=flat-square
[discord]: https://discord.gg/SN8Da2X
