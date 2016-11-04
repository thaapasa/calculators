"use strict"

var hetu = require("./calc/hetu");
var bankReference = require("./calc/bankreference");
var companyId = require("./calc/companyid");
var md5 = require("./calc/md5");
var sha1 = require("./calc/sha1");

module.exports = {
    hetu: hetu,
    bankReference: bankReference,
    companyId: companyId,
    md5: md5,
    sha1: sha1
};
