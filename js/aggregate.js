function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function toArrayOfArrays(arr, cols) {
  let result = _.map(arr, function (item) {
    result = [];
    cols.forEach(function (col) {
      result.push(item[col]);
    })
    return result;
  });
  return ([cols]).concat(result);
}

function select(arr, col) {
  return _.map(arr, function (item) {
    return item[col];
  });
}

function agg(arr, col, funs, groupBy) {
  let groups = _.groupBy(arr, function(item) {
    let key = '';
    groupBy.forEach(function (group) {
      key += item[group] + '|';
    });
    return key.slice(0, -1);
  });
  let result = [];
  Object.keys(groups).forEach(function (key) {
    arr = key.split('|');
    funs.forEach(function (fun) {
      arr.push(fun(select(groups[key], col)));
    })
    result.push(arr);
  })
  arr = groupBy;
  funs.forEach(function (fun) {
    arr.push(fun.name + '_' + col);
  })
  return ([arr]).concat(result);
}

function count(arr) {
  return arr.length;
}

function min(arr) {
	/*return ss.min(arr.filter(function (item) {
		return item != null;
	}));*/
	return ss.min(arr);
}

function firstQuartile(arr) {
  return ss.quantile(arr, 0.25);
}

function median(arr) {
  return ss.quantile(arr, 0.5);
}

function thirdQuartile(arr) {
  return ss.quantile(arr, 0.75);
}

function tryNumber(val) {
  if (isNaN(+val)) {
    return val;
  } else {
    return +val;
  }
}
