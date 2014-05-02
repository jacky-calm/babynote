var moment = require("moment");

exports.formatDatetime = function(timeInMS) {
  return moment(timeInMS).format("HH:mm MM-DD-YYYY");
};
exports.formatDate= function(timeInMS) {
  return moment(timeInMS).format("MM-DD-YYYY");
};
exports.parseDate= function(s) {
  if(s){
    return moment(s, "MM-DD-YYYY").valueOf();
  }
  return undefined;
};
exports.asDays = function(toMs, fromMs) {
  //console.log("toMs:" + toMs);
  //console.log("fromMs:" + fromMs);
  return moment.duration(toMs - fromMs).asDays();
};
