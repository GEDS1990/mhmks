import React from 'react';
import { Table, Select, Button, Icon, Modal, Input, Popconfirm, message, DatePicker } from 'antd';
import styles from './visitor.less';
const { MonthPicker, RangePicker } = DatePicker;


class Expense extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: Store.getUser(),
      monthDate: moment(),
      loading: false,
      visitorPlan: Store.getVisitorPlan(),
      subsidy: Store.getSubsidy(),
      routeCost: Store.getRouteCost(),
      expense: [],
      showVisitor: false,
      currecord: {},
      modalvalue: '',
      adjustvisible: false,
      showPicture: false,
      bigPicture: ""
    };
    this.onVisitorPlanChange = this.onVisitorPlanChange.bind(this);
    this.onExpenseChange = this.onExpenseChange.bind(this);
    this.onExpenseAdjustChange = this.onExpenseAdjustChange.bind(this);

    this.onClickQuery = this.onClickQuery.bind(this);
    this.onMonthChange = this.onMonthChange.bind(this);

    this.onUserChange = this.onUserChange.bind(this);
    this.onUserTextChange = this.onUserTextChange.bind(this);
    this.onRouteCostChange = this.onRouteCostChange.bind(this);
    this.onSubsidyChange = this.onSubsidyChange.bind(this);
    this.handleVisitorCancel = this.handleVisitorCancel.bind(this);
    this.onModalvalueChange = this.onModalvalueChange.bind(this);
    this.handleAdjustOk = this.handleAdjustOk.bind(this);
    this.handleAdjustCancel = this.handleAdjustCancel.bind(this);
    this.handlePictureCancel = this.handlePictureCancel.bind(this);
    this.onClickShowPicture = this.onClickShowPicture.bind(this);
    this.onSaveErpChange = this.onSaveErpChange.bind(this);
    this.onClickSaveErp  = this.onClickSaveErp.bind(this);
    this.userid = "";

    this.expenseType = [
      { type: 'wcbt', name: '误餐费', enableChange: false },
      { type: 'snjt', name: '市内交通费', enableChange: false },
      { type: 'ccdsnjt', name: '出差地交通费', enableChange: true },
      { type: 'ctjt', name: '长途交通费', enableChange: true },
      { type: 'ccbt', name: '出差补贴', enableChange: true },
      { type: 'zsbt', name: '住宿费', enableChange: true },
      { type: 'txf', name: '通讯费', enableChange: true },
      { type: 'kdf', name: '快递费', enableChange: true },
    ]
    this._routeNature = [{
      nature: "1",
      name: "市内拜访"
    }, {
      nature: "2",
      name: "出差住宿"
    }, {
      nature: "3",
      name: "出差不住宿"
    }, {
      nature: "4",
      name: "电话拜访"
    }]
  }
  componentDidMount() {
    Store.addChangeListener(StoreEvent.SE_SUBSIDY, this.onSubsidyChange);
    Store.addChangeListener(StoreEvent.SE_VISITOR_PLANLIST, this.onVisitorPlanChange);
    Store.addChangeListener(StoreEvent.SE_USER, this.onUserChange);
    Store.addChangeListener(StoreEvent.SE_ROUTECOST, this.onRouteCostChange);
    Store.addChangeListener(StoreEvent.SE_EXPENSE, this.onExpenseChange);
    Store.addChangeListener(StoreEvent.SE_EXPENSE_ADJUST, this.onExpenseAdjustChange);
    Store.addChangeListener(StoreEvent.SE_SAVEEXPENSEERP, this.onSaveErpChange);
    Action.getUser();
    Action.getSubsidy();
  }
  componentWillUnmount() {
    Store.removeChangeListener(StoreEvent.SE_USER, this.onUserChange);
    Store.removeChangeListener(StoreEvent.SE_SUBSIDY, this.onSubsidyChange);
    Store.removeChangeListener(StoreEvent.SE_VISITOR_PLANLIST, this.onVisitorPlanChange);
    Store.removeChangeListener(StoreEvent.SE_ROUTECOST, this.onRouteCostChange);
    Store.removeChangeListener(StoreEvent.SE_EXPENSE, this.onExpenseChange);
    Store.removeChangeListener(StoreEvent.SE_EXPENSE_ADJUST, this.onExpenseAdjustChange);
    Store.removeChangeListener(StoreEvent.SE_SAVEEXPENSEERP, this.onSaveErpChange);
  }
  handlePictureCancel() {
    console.log('handlePictureCancel');
    this.setState({
      showPicture: false,
      bigPicture: ""
    })
  }
  onExpenseAdjustChange(expenseAdjust) {
    console.log("expenseAdjust", expenseAdjust);
    var expense = this.state.expense;
    for (var i = 0; i < expense.length; i++) {
      var expenseInfo = expense[i];
      console.log("expenseAdjust for", expenseInfo);
      if (new Date(expenseInfo.plandate).Format("yyyy-MM-dd") == expenseAdjust.plandate &&
        expenseInfo.userid == expenseAdjust.userid &&
        expenseInfo.expensetype == expenseAdjust.expensetype) {
        console.log("expense find!!");
        expenseInfo.adjustmoney = expenseAdjust.adjustmoney;
        this.setState({ expense, adjustvisible: false });
        return;
      }
    }
    expense.push({
      plandate: new Date(expenseAdjust.plandate),
      userid: expenseAdjust.userid,
      expensetype: expenseAdjust.expensetype,
      adjustmoney: expenseAdjust.adjustmoney
    })
    this.setState({ expense, adjustvisible: false });
  }
  onModalvalueChange(e) {
    this.setState({
      modalvalue: e.target.value
    })
  }
  handleAdjustOk() {
    var data = {
      plandate: this._curRecord.plandate,
      userid: this.userid,
      expensetype: this._curRecord.expensetype,
      adjustmoney: this.state.modalvalue,
    }
    console.log("adjustExpense", data);
    Action.adjustExpense(data);
  }
  handleAdjustCancel() {
    this.setState({ adjustvisible: false })
  }
  onClickText(text, record) {
    this._curRecord = record;
    if (text == "调整") {
      text = "";
    }
    this.setState({
      adjustvisible: true,
      modalvalue: text,
    })
  }
  onVisitorPlanChange(saleActual) {
    this.setState({
      visitorPlan: Store.getVisitorPlan(),
      loading: false
    })
  }

  onSubsidyChange() {
    this.setState({
      subsidy: Store.getSubsidy()
    })
  }

  onRouteCostChange() {
    this.setState({
      routeCost: Store.getRouteCost()
    })
  }

  onExpenseChange(expense) {
    this.setState({
      expense,
      adjustvisible: false,
    })
  }

  onUserChange() {
    this.setState({ user: Store.getUser() })
  }

  onUserTextChange(e) {
    this.userid = e;
  }

  getUserOption() {
    var userlist = this.state.user;
    var userDom = [];
    for (var i = 0; i < userlist.length; i++) {
      if (userlist[i].enableapp == 1) {
        userDom.push(<Option value={userlist[i].username}>{userlist[i].realname}</Option>)
      }
    }
    return userDom;
  }

  getUserInfo(userid) {
    for (var i = 0; i < this.state.user.length; i++) {
      if (this.state.user[i].username == userid) {
        return this.state.user[i];
      }
    }
  }

  getRouteInfo(plan_date) {
    var pathid = this.getPlanPath(plan_date);
    if (pathid) {
      for (var i = 0; i < this.state.routeCost.length; i++) {
        var routeInfo = this.state.routeCost[i];
        if (routeInfo.path_id == pathid && routeInfo.routemark == 1) {
          return routeInfo;
        }
      }
    }
  }

  getRouteCtjt(plan_date) {
    var ctjt = 0;
    var pathid = this.getPlanPath(plan_date);
    if (pathid) {
      for (var i = 0; i < this.state.routeCost.length; i++) {
        var routeInfo = this.state.routeCost[i];
        if (routeInfo.path_id == pathid && routeInfo.routemark == 2) {
          ctjt += routeInfo.ctjtf ? parseInt(routeInfo.ctjtf) : 0;
        }
      }
    }
    return ctjt;
  }

  getPlanPath(plan_date) {
    for (var i = 0; i < this.state.visitorPlan.length; i++) {
      var planInfo = this.state.visitorPlan[i];
      if (new Date(planInfo.plan_date).Format("yyyy-MM-dd") == plan_date && planInfo.plan_type == 1) {
        return planInfo.path_id;
      }
    }
  }

  getNatureName(nature) {
    for (var i = 0; i < this._routeNature.length; i++) {
      if (this._routeNature[i].nature == nature) {
        return this._routeNature[i].name;
      }
    }
    return `未知(${nature})`;
  }

  onClickQuery() {
    if (this.userid == "") {
      message.info("请选择销售代表");
      return;
    }
    var begindate = this.state.monthDate.startOf('month').format("YYYY-MM-DD");
    var enddate = this.state.monthDate.endOf('month').format("YYYY-MM-DD");
    var data = {
      userid: this.userid,
      begindate,
      enddate,
    };

    //console.log(data);
    Action.getVisitorPlan(data);
    Action.getExpense(data);
    var routedata = {
      routedate: moment().format("YYYY-MM"),
    }

    console.log("getRouteCost", routedata);
    Action.getRouteCost(routedata);

    this.setState({
      loading: true
    })
  }
  onClickSaveErp() {
    if (!this.erpData) {
      message.info("请先查询数据");
      return;
    }

    Action.saveExpenseErp({
      expense: JSON.stringify(this.erpData)
    });

    this.setState({
      loading: true
    })
  }
  onSaveErpChange() {
    this.setState({
      loading: false
    })
  }
  onClickVisitor(record) {
    this.setState({
      showVisitor: true,
      currecord: record
    })
  }

  handleVisitorCancel() {
    this.setState({ showVisitor: false })
  }

  onMonthChange(date, dateString) {
    this.setState({
      monthDate: date
    })
    console.log(date, dateString);
  }

  getSubsidy(role_id, city_lev, nature, expenseType, plan_date) {
    //console.log(plan_date, nature, city_lev, expenseType);
    if (expenseType == 'ctjt') {
      if (nature == 2 || nature == 3) {
        return this.getRouteCtjt(plan_date);
      }
    } else if (expenseType == 'zsbt') {
      if (nature == 2) {
        var routeInfo = this.getRouteInfo(plan_date);
        if (routeInfo) {
          return routeInfo.cczs;
        }
      }
    }
    for (var i = 0; i < this.state.subsidy.length; i++) {
      if (this.state.subsidy[i].role_id == role_id) {
        var subsidyInfo = this.state.subsidy[i];
        if (expenseType == "wcbt") {
          if (city_lev == 1) {
            return subsidyInfo.gzdcf1;
          } else if (city_lev == 2) {
            return subsidyInfo.gzdcf2;
          } else if (city_lev == 3) {
            return subsidyInfo.gzdcf3;
          }
        } else if (expenseType == "snjt") {
          if (nature == 2 || nature == 3) {
            return 0;
          }
          if (city_lev == 1) {
            return subsidyInfo.gzdjt1;
          } else if (city_lev == 2) {
            return subsidyInfo.gzdjt2;
          } else if (city_lev == 3) {
            return subsidyInfo.gzdjt3;
          }
        } else if (expenseType == "ccdsnjt") {
          if (nature == 1 || nature == 4) {
            return 0;
          }
          if (city_lev == 1) {
            return subsidyInfo.ccjt1;
          } else if (city_lev == 2) {
            return subsidyInfo.ccjt2;
          } else if (city_lev == 3) {
            return subsidyInfo.ccjt3;
          }
        } else if (expenseType == "ccbt") {
          if (nature == 1 || nature == 4) {
            return 0;
          }
          if (city_lev == 1) {
            return subsidyInfo.ccbt1;
          } else if (city_lev == 2) {
            return subsidyInfo.ccbt2;
          } else if (city_lev == 3) {
            return subsidyInfo.ccbt3;
          }
        } else if (expenseType == "txf") {
          return subsidyInfo.txf;
        } else if (expenseType == "kdf") {
          return subsidyInfo.kdf;
        }
      }
    }
    return 0;
  }

  getExpense(plandate, expenseType) {
    for (var i = 0; i < this.state.expense.length; i++) {
      var expenseInfo = this.state.expense[i];
      if (new Date(expenseInfo.plandate).Format("yyyy-MM-dd") == plandate &&
        (!expenseType || expenseInfo.expensetype == expenseType)) {
        return expenseInfo;
      }
    }
  }
  getRecordTableColumn() {
    return [{
      title: '计划拜访门店',
      dataIndex: 'planstore',
      key: 'planstore',
    }, {
      title: '实际拜访门店',
      dataIndex: 'realstore',
      key: 'realstore',
    }, {
      title: '拜访类型',
      dataIndex: 'plantypename',
      key: 'plantypename',
    }];
  }
  getRecordTableData() {
    var tableData = []
    for (var i = 0; i < this.state.visitorPlan.length; i++) {
      var planInfo = this.state.visitorPlan[i];
      if (new Date(planInfo.plan_date).Format("yyyy-MM-dd") == this.state.currecord.plandate) {
        var planstore = "";
        var realstore = "";
        var plantypename = "";
        if (planInfo.plan_type == 1) {
          planstore = planInfo.Store_name;
          if (planInfo.isfinish == 1) {
            realstore = planInfo.Store_name;
          }
          plantypename = "路线拜访";
        } else {
          realstore = planInfo.Store_name;
          if(planInfo.plan_type == 2){
            plantypename = "临时拜访";
          }else if(planInfo.plan_type == 3){
            plantypename = "电话拜访";
          }          
        }
        tableData.push({
          planstore,
          realstore,
          plantypename
        })
      }
    }
    tableData.sort((a, b) => {
      return a.planstore - b.planstore;
    })
    return tableData;
  }

  onClickShowPicture(record) {
    if (record.fpname) {
      this.setState({
        showPicture: true,
        bigPicture: 'url("' + '../upload/' + record.fpname + '.jpg")'
      })
    } else {
      message.info("没有照片")
    }

  }

  getTableColumn() {
    var context = this;
    return [{
      title: '销售代表',
      dataIndex: 'realname',
      key: 'realname',
      width: 70,
      render: function (text, record) {
        const obj = {
          children: text,
          props: {},
        };
        if (!record.btnr || record.btnr == context.expenseType[0].name) {
          obj.props.rowSpan = 6;
        } else {
          if (record.btnr == context.expenseType[6].name || record.btnr == context.expenseType[7].name || record.realname == "市内拜访合计") {
            obj.props.rowSpan = 1;
          } else {
            obj.props.rowSpan = 0;
          }
        }
        return obj;
      }
    }, {
      title: '日期',
      dataIndex: 'plandate',
      key: 'plandate',
      width: 90,
      render: function (text, record) {
        const obj = {
          children: text,
          props: {},
        };
        if (!record.btnr || record.btnr == context.expenseType[0].name) {
          obj.props.rowSpan = 6;
        } else {
          if (record.btnr == context.expenseType[6].name || record.btnr == context.expenseType[7].name || record.realname == "市内拜访合计") {
            obj.props.rowSpan = 1;
          } else {
            obj.props.rowSpan = 0;
          }
        }
        return obj;
      }
    }, {
      title: '计划类型',
      dataIndex: 'plannature',
      key: 'plannature',
      width: 80,
      render: function (text, record) {
        const obj = {
          children: text,
          props: {},
        };
        if (!record.btnr || record.btnr == context.expenseType[0].name) {
          obj.props.rowSpan = 6;
        } else {
          if (record.btnr == context.expenseType[6].name || record.btnr == context.expenseType[7].name || record.realname == "市内拜访合计") {
            obj.props.rowSpan = 1;
          } else {
            obj.props.rowSpan = 0;
          }
        }
        return obj;
      }
    }, {
      title: '实际类型',
      dataIndex: 'realnature',
      key: 'realnature',
      width: 80,
      render: function (text, record) {
        const obj = {
          children: text,
          props: {},
        };
        if (!record.btnr || record.btnr == context.expenseType[0].name) {
          obj.props.rowSpan = 6;
        } else {
          if (record.btnr == context.expenseType[6].name || record.btnr == context.expenseType[7].name || record.realname == "市内拜访合计") {
            obj.props.rowSpan = 1;
          } else {
            obj.props.rowSpan = 0;
          }
        }
        return obj;
      }
    }, {
      title: '拜访情况',
      key: 'planinfo',
      width: 100,
      render: function (text, record) {
        var operateDom = [
          <a onClick={function () {
            context.onClickVisitor(record);
          }}>拜访情况</a>
        ];
        if (!record.btnr || record.realname == "市内拜访合计" ) {
          return null;
        }
        const obj = {
          children: operateDom,
          props: {},
        };
        if (record.btnr == context.expenseType[0].name) {
          obj.props.rowSpan = 6;
        } else {
          if (record.btnr == context.expenseType[6].name || record.btnr == context.expenseType[7].name || record.realname == "市内拜访合计") {
            obj.props.rowSpan = 1;
          } else {
            obj.props.rowSpan = 0;
          }
        }
        return obj;
      }
    }, {
      title: '补贴内容',
      dataIndex: 'btnr',
      key: 'btnr',
      width: 110,
    }, {
      title: '补贴标准',
      dataIndex: 'btbz',
      key: 'btbz',
      width: 80,
    }, {
      title: '实际上报',
      dataIndex: 'report',
      key: 'report',
      width: 80,
    }, {
      title: '发票数量',
      dataIndex: 'fpcount',
      key: 'fpcount',
      width: 80,
    }, {
      title: '发票照片',
      key: 'fpphoto',
      width: 80,
      render: function (text, record) {
        var operateDom = [
          <a onClick={function () {
            context.onClickShowPicture(record);
          }}>发票照片</a>
        ];
        if (!record.btnr || record.realname == "市内拜访合计" ) {
          return null;
        }
        return operateDom;
      }
    }, {
      title: '调整金额',
      dataIndex: 'adjustmoney',
      key: 'adjustmoney',
      width: 80,
      render: function (text, record) {
        if (!text) {
          text = "调整";
        }
        return <p style={{ whiteSpace: 'pre-wrap', color: "rgb(16,142,233)", cursor: 'pointer' }}
          onClick={function () { context.onClickText(text, record) }} >{text}</p>
      }
    }];
  }
  getTableData() {
    var context = this;

    var planData = [];
    var visitorPlan = this.state.visitorPlan;

    visitorPlan.sort((a, b) => {
      return new Date(a.plan_date).getTime() - new Date(b.plan_date).getTime();
    })
    var userInfo = this.getUserInfo(this.userid);
    if (!userInfo) {
      return;
    }
    var btsum = 0;
    var expensesum = 0;
    var snwcbzsum = 0;
    var snwctzsum = 0;
    var snjtbzsum = 0;
    var snjttzsum = 0;
    var lastPlandate = "";
    for (var i = 0; i < visitorPlan.length; i++) {
      if(visitorPlan[i].plan_type == 3){
        //如果是电话拜访，不应该去计算补贴标准
        continue;
      }
      var plandate = new Date(visitorPlan[i].plan_date).Format("yyyy-MM-dd");
      if (plandate != lastPlandate) {
        var routeInfo = this.getRouteInfo(plandate);
        //console.log("tabledata", plandate, routeInfo);
        var plannature = "无计划";
        var realnature = "未提交";
        var plannatureid = 1;
        var expenseInfoMain = this.getExpense(plandate, "no");
        console.log("render expenseInfoMain", plandate, expenseInfoMain, routeInfo);
        if (routeInfo) {
          plannature = this.getNatureName(routeInfo.nature);
          plannatureid = routeInfo.nature;
        }
        if (expenseInfoMain) {
          realnature = this.getNatureName(expenseInfoMain.nature);
          console.log("render realnature", realnature);
        }

        for (var j = 0; j < this.expenseType.length - 2; j++) {
          var expenseType = this.expenseType[j].type;
          var btbz = this.getSubsidy(userInfo.role, visitorPlan[i].City_lev, plannatureid, expenseType, plandate);
          btsum += parseFloat(btbz);
          if(j == 0){
            //误餐费
            snwcbzsum += parseFloat(btbz);
          }else if(j == 1){
            //室内交通费
            snjtbzsum += parseFloat(btbz);
          }
          
          var report = 0;
          var fpcount = 0;
          var adjustmoney = null;
          var fpname = "";
          var expenseInfo = this.getExpense(plandate, expenseType);
          if (expenseInfo) {
              adjustmoney = expenseInfo.adjustmoney;
          }
          if (expenseType == "wcbt" || expenseType == "snjt" || expenseType == "ccbt") {
            report = btbz;
            //adjustmoney = " "
          } else {
            var expenseInfo = this.getExpense(plandate, expenseType);
            if (expenseInfo) {
              report = expenseInfo.money;
              //adjustmoney = expenseInfo.adjustmoney;
              fpcount = expenseInfo.fpcount;
              fpname = expenseInfo.fpname;
            }
          }
          // if(adjustmoney == ""){
          //   adjustmoney = " "
          // }
          expensesum += (adjustmoney && adjustmoney != " ") ? parseFloat(adjustmoney) : parseFloat(report);
          if(j == 0){
            //误餐费
            snwctzsum += (adjustmoney && adjustmoney != " ") ? parseFloat(adjustmoney) : parseFloat(report);
          }else if(j == 1){
            //室内交通费
            snjttzsum += (adjustmoney && adjustmoney != " ") ? parseFloat(adjustmoney) : parseFloat(report);
          }
          planData.push({
            plandate,
            plannature,
            realnature,
            realname: visitorPlan[i].realname,
            btnr: this.expenseType[j].name,
            btbz,
            report,
            fpcount,
            fpname,
            userid: this.userid,
            expensetype: expenseType,
            adjustmoney,
          })
        }
        lastPlandate = plandate;
      }
    }

    if (visitorPlan.length > 0) {
      var btbz = this.getSubsidy(userInfo.role, 0, 0, 'txf', '');
      btsum += parseFloat(btbz);
      var adjustmoney = "";
      var expenseInfo = this.getExpense(this.state.monthDate.startOf('month').format("YYYY-MM-DD"), 'txf');
      if (expenseInfo) {
        //report = expenseInfo.money;
        adjustmoney = expenseInfo.adjustmoney;
      }
      expensesum += adjustmoney ? parseFloat(adjustmoney) : parseFloat(btbz);
      planData.push({
        plandate: this.state.monthDate.format("YYYY-MM-DD"),
        plannature: ' ',
        realnature: ' ',
        realname: visitorPlan[visitorPlan.length - 1].realname,
        btnr: '通讯费',
        btbz,
        report: btbz,
        fpcount: ' ',
        fpname: ' ',
        userid: this.userid,
        expensetype: "txf",
        adjustmoney,
      })

      btbz = this.getSubsidy(userInfo.role, 0, 0, 'kdf', '');
      btsum += parseFloat(btbz);
      var adjustmoney = "";
      var expenseInfo = this.getExpense(this.state.monthDate.startOf('month').format("YYYY-MM-DD"), 'kdf');
      if (expenseInfo) {
        //report = expenseInfo.money;
        adjustmoney = expenseInfo.adjustmoney;
      }
      expensesum += adjustmoney ? parseFloat(adjustmoney) : parseFloat(btbz);
      planData.push({
        plandate: this.state.monthDate.format("YYYY-MM-DD"),
        plannature: ' ',
        realnature: ' ',
        realname: visitorPlan[visitorPlan.length - 1].realname,
        btnr: '快递费',
        btbz,
        report: btbz,
        fpcount: ' ',
        fpname: ' ',
        userid: this.userid,
        expensetype: "kdf",
        adjustmoney,
      })
      console.log("planData", planData);
    }

    this.erpData = Object.assign([], planData);
    if (planData.length > 0) {
      planData.push({        
        realname: '市内拜访合计',        
        btnr: "误餐标准：" + snwcbzsum,
        btbz: "市内交通标准：" + snjtbzsum,
        report: "误餐调整后:" + snwctzsum,
        fpcount: "市内交通调整后：" + snjttzsum,
        adjustmoney: ' ',
      })
    }
    if (planData.length > 0) {
      planData.push({        
        realname: '总计',
        btbz: "补贴：" + btsum,
        report: "发放：" + expensesum,
        adjustmoney: ' ',
      })
    }
    return planData;
  }

  render() {
    var context = this;
    var scrolly = 350;
    var height = document.body.clientHeight;
    if (height > 0) {
      scrolly = height - 300;
    };
    return (
      <div className={styles.visitorcontent}>
        <p className={styles.visitortitle}>报销费用审核</p>
        <div className={styles.queryContainer}>
          <MonthPicker value={this.state.monthDate} onChange={this.onMonthChange} style={{ width: 120, marginRight: '10px' }} placeholder="Select month" />
          <Select onChange={this.onUserTextChange} placeholder="请选择销售代表" style={{ width: 120, marginRight: '10px' }}>
            {this.getUserOption()}
          </Select>
          <Button icon="search" onClick={this.onClickQuery} type="primary">查询</Button>
          <div style={{ flexGrow: 1 }}></div>
          <Button icon="save" onClick={this.onClickSaveErp} type="primary">保存ERP数据</Button>
        </div>
        <div className={styles.resultContent}>
          <Table loading={this.state.loading} bordered pagination={false} scroll={{ y: scrolly, x: 1000 }}
            size="small" columns={this.getTableColumn()} dataSource={this.getTableData()} />
        </div>
        <Modal title="拜访信息" width={500} footer={null} visible={this.state.showVisitor}
          onCancel={this.handleVisitorCancel} >
          <Table pagination={false}
            size="small" columns={this.getRecordTableColumn()} dataSource={this.getRecordTableData()} />
        </Modal>
        <Modal width={350} title="调整" visible={this.state.adjustvisible}
          onOk={this.handleAdjustOk} onCancel={this.handleAdjustCancel}
        >
          <div className={styles.formcontent}>
            <span className={styles.formtitle}>调整金额</span>
            <div className={styles.form}>
              <Input value={this.state.modalvalue} autoFocus="autoFocus" onChange={this.onModalvalueChange} placeholder="请输入金额" />
            </div>
          </div>
        </Modal>

        <div style={{
          backgroundImage: this.state.bigPicture,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          visibility: this.state.showPicture ? "visible" : "hidden",
          position: 'absolute',
          backgroundColor: '#ccc',
          top: 0,
          height: '100%',
          width: '100%',
        }}>
          <Icon onClick={this.handlePictureCancel} style={{ position: 'absolute', right: '5px', top: '5px', fontSize: "20px" }} type="close-square" />
        </div>


      </div>
    );
  }
}

export default Expense;