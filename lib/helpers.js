function getToken(req) {
  return req == undefined || req.replace('Bearer ', '');
}

module.exports.getToken = getToken;
