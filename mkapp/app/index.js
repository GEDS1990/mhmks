import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './components/app';
import './index.css';
import './components/config';
import './flux/Store';
import './flux/Actions';
import './flux/event-const';
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

window.isEmptyObject = function (e) {
    var t;
    for (t in e)
        return !1;
    return !0
}
injectTapEventPlugin();
ReactDOM.render(<App />, document.getElementById('root'));

