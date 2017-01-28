'use strict';

var keyMirror = require('keymirror');

var eventMap = {
  ActionEvent: keyMirror({
    AE_LOGIN: null,
    AE_LOGOUT: null,
    AE_USER: null,
    AE_DEPARTMENT: null,

    AE_STOREAREA: null,
    AE_STOREBASIC: null,
    AE_STORECONTACTS: null,
    AE_STOREDISPLAY: null,
    AE_PRODUCT: null,
    AE_PRODUCTPRICE: null,
    AE_PRODUCTPRICECOUNT: null,
    AE_PRODUCTSTOCK: null,
    AE_PRODUCTSTOCKCOUNT: null,
    AE_PRODUCTBRAND: null,
    AE_PROMOTION: null,
    AE_PROMOTIONTYPE: null,
  }),

  StoreEvent: keyMirror({
    SE_KEYPRESS: null,
    SE_LOGIN: null,
    SE_USER: null,
    SE_DEPARTMENT: null,

    SE_VIEW: null,
    SE_STOREAREA: null,
    SE_STOREBASIC: null,
    SE_STORECONTACTS: null,
    SE_STOREDISPLAY: null,
    SE_PRODUCT: null,
    SE_PRODUCTPRICE: null,
    SE_PRODUCTPRICECOUNT: null,
    SE_PRODUCTSTOCK: null,
    SE_PRODUCTSTOCKCOUNT: null,
    SE_PRODUCTBRAND: null,
    SE_PROMOTION: null,
    SE_PROMOTIONTYPE: null,
  })
};

window.ActionEvent = eventMap.ActionEvent;
window.StoreEvent = eventMap.StoreEvent;
module.exports = eventMap;
