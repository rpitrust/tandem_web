'use strict';

// a simple function to sort the 'noises' object by its keys
// to make the code compatible with Firefox
var sortNoiseObject = function(map) {
  var keys = _.sortBy(_.keys(map), function(a) { return a; });
  var newmap = {};
  _.each(keys, function(k) {
      newmap[k] = map[k];
  });
  return newmap;
};

// sort the plot data before returning it so that the values on the
// interactive guide line are easier to understand
var plotDataCompare = function(a, b) {
  if (a.key[0] > b.key[0]) {
    return -1;
  }
  if (a.key[0] < b.key[0]) {
    return 1;
  }
  if (a.key[1] > b.key[1]) {
    return -1;
  }
  if (a.key[1] < b.key[1]) {
    return 1;
  }
  return 0;
};
