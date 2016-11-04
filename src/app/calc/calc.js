"use strict"

var hetu = require("./hetu");
var bankReference = require("./bankreference");
var companyId = require("./companyid");
var md5 = require("./md5");
var sha1 = require("./sha1");

module.exports = {
    hetu: hetu,
    bankReference: bankReference,
    companyId: companyId,
    md5: md5,
    sha1: sha1
};
