var moment = require("moment");

exports.formatDatetime = function(timeInMS) {
  return moment(timeInMS).format("HH:mm MM-DD-YYYY");
};
exports.formatDate= function(timeInMS) {
  return moment(timeInMS).format("MM-DD-YYYY");
};
