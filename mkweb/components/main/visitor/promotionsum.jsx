import React from 'react';
import { Table, Button, Icon, Modal, Input, Popconfirm, message, Tag, Select } from 'antd';
import styles from './visitor.less';

class PromotionSum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storeArea: Store.getStoreArea(),
      promotionSum: Store.getPromotionSum(),
      promotionImage: []
    };

    this.onStoreAreaChange = this.onStoreAreaChange.bind(this);
    this.onPromotionSumChange = this.onPromotionSumChange.bind(this);
    this.onPromotionImageChange = this.onPromotionImageChange.bind(this);
    this.onAreaChange = this.onAreaChange.bind(this);

    this.onClickQuery = this.onClickQuery.bind(this);
    this.onTextChange = this.onTextChange.bind(this);

    this.areaid = "";
    this.schedule = "";
  }
  componentDidMount() {
    Store.addChangeListener(StoreEvent.SE_STOREAREA, this.onStoreAreaChange);
    Store.addChangeListener(StoreEvent.SE_PROMOTIONSUM, this.onPromotionSumChange);
    Store.addChangeListener(StoreEvent.SE_PROMOTIONIMAGE, this.onPromotionImageChange);

    Action.getStoreArea();
  }
  componentWillUnmount() {
    Store.removeChangeListener(StoreEvent.SE_STOREAREA, this.onStoreAreaChange);
    Store.removeChangeListener(StoreEvent.SE_PROMOTIONSUM, this.onPromotionSumChange);
    Store.removeChangeListener(StoreEvent.SE_PROMOTIONIMAGE, this.onPromotionImageChange);
  }

  onStoreAreaChange() {
    this.setState({
      storeArea: Store.getStoreArea()
    })
  }

  checkPromotion() {
    var promotionSum = Store.getPromotionSum();
    var pro_name = "";
    for (var i = 0; i < promotionSum.length; i++) {
      if (i == 0) {
        pro_name = promotionSum[i].Pro_name;
      } else {
        if (pro_name != promotionSum[i].Pro_name) {
          return false;
        }
      }
    }
    return true;
  }

  getAllProduct() {
    var promotionSum = Store.getPromotionSum();
    var product_hb = [];
    var product_ip = [];
    for (var i = 0; i < promotionSum.length; i++) {
      var product = promotionSum[i];
      var product_name = product.product_name;
      if (product.Promotion_type == "002") { //海报促销
        if (product_hb.indexOf(product_name) < 0) {
          product_hb.push(product_name);
        }
      } else {
        if (product_ip.indexOf(product_name) < 0) {
          product_ip.push(product_name);
        }
      }
    }
    console.log("getAllProduct", product_hb, product_ip);
    return {
      product_hb,
      product_ip
    }
  }

  getProductDom() {
    var product = this.getAllProduct();
    var product_hb_dom = <div className={styles.productcontent} >
      <span style={{ width: '80px', display: 'inline-block' }}>{"海报产品(" + product.product_hb.length + ")"}</span>
      {product.product_hb.map((pro) => {
        return <Tag color="rgb(98, 132, 108)">{pro||"未知产品"}</Tag>
      }) }
    </div>


    var product_ip_dom = <div className={styles.productcontent} >
      <span style={{ width: '80px', display: 'inline-block' }}>{"IP产品(" + product.product_ip.length + ")"}</span>
      {product.product_ip.map((pro) => {
        return <Tag color="rgb(98, 132, 108)">{pro||"未知产品"}</Tag>
      }) }
    </div>
    return [
      product_hb_dom,
      product_ip_dom
    ]
  }

  onPromotionSumChange() {
    if (!this.checkPromotion()) {
      message.info("该条件有多个促销，请确认条件后重新查询");
      return;
    }
    var promotionSum = Store.getPromotionSum();
    promotionSum.forEach((ps, index) => {
      ps.sortIndex = index;
    })
    this.setState({
      promotionSum
    })

    if (promotionSum.length > 0) {
      var data = {
        areaid: this.areaid,
        begindate: new Date(promotionSum[0].Date3).Format("yyyy-MM-dd"),
        enddate: new Date(promotionSum[0].Date4).Format("yyyy-MM-dd"),
      };
      console.log(data);
      Action.getPromotionImage(data);
    }
  }
  onPromotionImageChange(promotionImage) {
    this.setState({
      promotionImage
    })
  }
  onAreaChange(e) {
    this.areaid = e;
  }

  onClickQuery() {
    if (this.areaid == "" || this.schedule == "") {
      message.info("请输入查询条件！");
      return;
    }
    var data = {
      areaid: this.areaid,
      schedule: this.schedule,
    };
    console.log(data);
    Action.getPromotionSum(data);

  }

  onTextChange(e) {
    this.schedule = e.target.value;
  }

  getAreaOption() {
    return this.state.storeArea.map((sa) => {
      return <Option value={sa.Region_id}>{sa.Region_name}</Option>
    })
  }

  getproductCount(store_id, hb) {
    var promotionSum = this.state.promotionSum;
    var productCount = 0;
    for (var i = 0; i < promotionSum.length; i++) {
      if (promotionSum[i].Store_id == store_id &&
        ((hb && promotionSum[i].Promotion_type == "002") ||
          (!hb && promotionSum[i].Promotion_type != "002"))) {
        productCount++;
      }
    }
    return productCount;
  }

  getProduct(store_id, product_id) {
    var promotionSum = this.state.promotionSum;
    var productCount = 0;
    for (var i = 0; i < promotionSum.length; i++) {
      if (promotionSum[i].Store_id == store_id &&
        promotionSum[i].Product_id == product_id) {
        return promotionSum[i];
      }
    }
  }

  getImageCount(store_id, hb) {
    var promotionImage = this.state.promotionImage;
    var productCount = 0;
    for (var i = 0; i < promotionImage.length; i++) {
      if (promotionImage[i].store_id == store_id) {
        var productInfo = this.getProduct(store_id, promotionImage[i].product_id);
        if (productInfo &&
          ((hb && productInfo.Promotion_type == "002") ||
            (!hb && productInfo.Promotion_type != "002"))) {
          productCount++;
        }
      }
    }
    return productCount;
  }

  getTableColumn() {
    var context = this;
    return [{
      title: '促销名称',
      dataIndex: 'Pro_name',
      key: 'Pro_name',
    }, {
        title: '销售代表',
        dataIndex: 'realname',
        key: 'realname',
      }, {
        title: '门店名称',
        dataIndex: 'store_name',
        key: 'store_name',
      }, {
        title: '海报产品量',
        dataIndex: 'hb_count',
        key: 'hb_count'
      }, {
        title: 'IP产品量',
        dataIndex: 'ip_count',
        key: 'ip_count'
      }, {
        title: '照片',
        dataIndex: 'username',
        key: 'username',
      }, {
        title: '海报陈列量',
        dataIndex: 'hb_image',
        key: 'hb_image'
      }, {
        title: 'IP陈列量',
        dataIndex: 'ip_image',
        key: 'ip_image'
      }, {
        title: '海报调整量',
        dataIndex: 'username',
        key: 'username',
      }, {
        title: 'IP调整量',
        dataIndex: 'username',
        key: 'username',
      }, {
        title: '海报陈列率',
        dataIndex: 'username',
        key: 'username',
      }, {
        title: 'IP陈列率',
        dataIndex: 'username',
        key: 'username',
      }, {
        title: '合计陈列率',
        dataIndex: 'username',
        key: 'username',
      }];
  }
  getTableData() {
    var context = this;
    var promotionSum = this.state.promotionSum;
    promotionSum.sort((a, b) => {
      return a.user_id - b.user_id || a.sortIndex - b.sortIndex;
    })
    var promotionSum_data = [];
    var isExist = function (ps) {
      for (var i = 0; i < promotionSum_data.length; i++) {
        if (promotionSum_data[i].user_id == ps.user_id &&
          promotionSum_data[i].Store_id == ps.Store_id) {
          return true;
        }
      }
      return false;
    }
    promotionSum.forEach((ps) => {
      if (!isExist(ps)) {
        ps.hb_image = context.getImageCount(ps.Store_id, true);
        ps.ip_image = context.getImageCount(ps.Store_id, false);
        ps.hb_count = context.getproductCount(ps.Store_id, true);
        ps.ip_count = context.getproductCount(ps.Store_id, false);

        promotionSum_data.push(ps);
      }
    })

    return promotionSum_data;
  }
  render() {
    var scrolly = 350;
    var height = document.body.clientHeight;
    if (height > 0) {
      scrolly = height - 350;
    }
    return (
      <div className={styles.visitorcontent}>
        <p className={styles.visitortitle}>促销陈列统计</p>
        <div className={styles.queryContainer}>
          <Select onChange={this.onAreaChange} placeholder="请选择系统区域" style={{ width: 120, marginRight: '10px' }}>
            {this.getAreaOption() }
          </Select>
          <Input onChange={this.onTextChange} style={{ width: '120px', marginRight: '20px' }} prefix={<Icon type="calendar" style={{ fontSize: 13 }} />} placeholder="请输入档期" />
          <Button icon="search" onClick={this.onClickQuery} type="primary">查询</Button>
        </div>
        <div className={styles.promotionresult}>
          {this.getProductDom() }
        </div>
        <div className={styles.promotiontable}>
          <div className={styles.signList}>
            <Table size="small" pagination={false} scroll={{ y: scrolly }} columns={this.getTableColumn() } dataSource={this.getTableData() } />
          </div>
        </div>
      </div>
    );
  }
}

export default PromotionSum;