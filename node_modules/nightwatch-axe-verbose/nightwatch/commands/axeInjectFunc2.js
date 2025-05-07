/* eslint-disable */
module.exports = function(selector, options, done) {
  var axe = window.axe;
  if (!axe) {
    done(new Error('aXe not found. Make sure it has been injected'))
    return;
  }

  axe.run(selector, options, function(err, results) {
    if (err) {
      done(err);
    }

    done(results);
  });
};

