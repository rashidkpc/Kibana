define(function (require) {
  return function PointSeriesGetPoint() {
    function unwrap(aggConfigResult, def) {
      return aggConfigResult ? aggConfigResult.value : def;
    }

    return function getPoint(x, series, yScale, row, y, radius) {
      var point = {
        x: unwrap(row[x.i], '_all'),
        y: unwrap(row[y.i]),
        radius: unwrap(row[(radius || {}).i]),
        aggConfigResult: row[y.i],
        yScale: yScale
      };

      if (series) {
        point.series = unwrap(row[series.i]);
      }

      if (yScale) {
        point.y *= yScale;
      }

      return point;
    };
  };
});