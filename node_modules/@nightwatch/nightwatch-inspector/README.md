
# Nightwatch Inspector 🕵️
<p align="center">
  <img alt="Nightwatch.js Logo" src="https://raw.githubusercontent.com/nightwatchjs/nightwatch/main/.github/assets/nightwatch-logo.png" width=200 />
</p>

Nightwatch Inspector is a developer tool 🛠️ which currently supports Google Chrome. It is designed to help you CSS selectors for elements on a webpage. It also allows you to tests nightwatch commands directly from the browser in Nightwatch debug mode. 

This developer tool doesn't require any setup or downloads. You can simply use the version of Nightwatch where the Nightwatch Inspector is supported. It is specifically designed to work with [Nightwatch.js](https://nightwatchjs.org/), a popular end-to-end testing framework.

## 🚀 Getting Started With Nightwatch 
1. Make sure Nightwatch is already installed and it supports the Nightwatch Inspector. If it is not installed, you can refer to the [documentation](https://nightwatchjs.org/guide/quickstarts/create-and-run-a-nightwatch-test.html) 📖
2. Add `pause` or `debug` command in your test to wait. For e.g.
   
   ```js
   it('Demo test ecosia.org', async function(browser) {
     browser
      .navigateTo('https://www.ecosia.org')
      .debug()
   });
   ```
3. Run your Nightwatch tests by passing `--debug` flag

   ```sh
    npx nightwatch ./nightwatch/examples/basic/ecosia.js -e chrome --debug
   ```
4. In chrome browser, inspect the elements  of the webpage and go to `Nightwatch Inspector` tab
5. Click the `Explore Mode` button to find CSS selectors for the elements on the webpage.
6. Use these selectors in Nightwatch commands and click the Try button to see the results


## 🎉 Key Features
1. Easily find CSS selectors for elements on a webpage
2. Test Nightwatch commands directly from the browser
3. Copy selectors to clipboard with one click
4. Highlight elements on hover for easy identification
5. History table of selectors and commands.


## 🎥 Demo
Check out the demo of the playground in action 👀

![playground](https://user-images.githubusercontent.com/94462364/221351842-f47ac331-325f-4098-b540-be3bd637496f.gif)


## 🔧 Use in Other Projects (with a limitation)
This tool is not limited to Nightwatch.js and can be used in any project that needs CSS selectors. However, it comes with a limitation; you cannot test Nightwatch commands directly from the browser because it doesn't connected to the Nightwatch Server.

```js
import {crxfile} from '@nightwatch/nightwatch-inspector';
```

This code snippet shows how to import the Nightwatch Inspector in other projects. 💻

## 🚫 Limitations
- Currently, the tool only supports serial mode and does not support parallelism.
- Including this tool in other projects does not allow you to test commands directly from the browser.


## 🤝 Contributing
Contributions are always welcome! If you have any suggestions, bug reports, or pull requests, please feel free to open an issue or pull request.

