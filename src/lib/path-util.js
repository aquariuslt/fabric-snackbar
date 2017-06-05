/*** Created by aquariuslt on 6/2/17.*/
var path = require('path');
var fs = require('fs');
var glob = require('glob');

var _ = require('lodash');


const _root = path.resolve(__dirname, '../..');


function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join(...[_root].concat(args));
}

function calGlobPaths(patterns, excludes) {
  let urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');
  let output = [];
  if (_.isArray(patterns)) {
    patterns.forEach(function (globPattern) {
      output = _.union(output, calGlobPaths(globPattern, excludes));
    });
  } else if (_.isString(patterns)) {
    if (urlRegex.test(patterns)) {
      output.push(patterns);
    } else {
      let files = glob.sync(patterns);
      if (excludes) {
        files = files.map(function (file) {
          if (_.isArray(excludes)) {
            for (let i in excludes) {
              if (excludes.hasOwnProperty(i)) {
                file = file.replace(excludes[i], '');
              }
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }


  return output;
}

function checkFileExist(args) {
  args = Array.prototype.slice.call(arguments, 0);
  let checkFilePath = path.join.apply(path, [_root].concat(args));
  return fs.existsSync(checkFilePath);
}


module.exports = {
  root,
  checkFileExist,
  calGlobPaths
};
