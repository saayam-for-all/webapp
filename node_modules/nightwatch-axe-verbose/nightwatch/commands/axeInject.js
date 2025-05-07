const fs = require('fs');

const axePath = require.resolve('axe-core/axe.min.js');
const axe = fs.readFileSync(axePath, 'utf8');

module.exports = class AxeInject {
  command() {
    return this.api.execute(
      (js) => {
        // eslint-disable-next-line no-eval
        eval(js);
      },
      [axe]
    );
  }
};
