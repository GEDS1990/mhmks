import React from 'react';
import styles from './main.less';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import ContactsIcon from 'material-ui/svg-icons/communication/contact-phone';
import MyIcon from 'material-ui/svg-icons/action/account-circle';
import StoreIcon from 'material-ui/svg-icons/action/store';
import HomeIcon from 'material-ui/svg-icons/action/home';

import Home from './home/home';
import StoreView from './store/store';
import Contacts from './contacts/contacts';
import Aboutme from './aboutme/aboutme';
import Location from './aboutme/location';


const contactsIcon = <ContactsIcon />;
const myIcon = <MyIcon />;
const storeIcon = <StoreIcon />;
const homeIcon = <HomeIcon />;


class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      subview:'',
    };
    this.select = this.select.bind(this);
    this.onChangeView = this.onChangeView.bind(this);
  }
  componentDidMount() {
    Store.addChangeListener(StoreEvent.SE_VIEW,this.onChangeView);
  }
  componentWillUnmount() {
    Store.removeChangeListener(StoreEvent.SE_VIEW,this.onChangeView);
  }
  
  select(index) {
    this.setState({ subview:'',selectedIndex: index });
  }
  onChangeView(subview){
    this.setState({subview});
  }

  getContent() {
    if(this.state.subview == 'localtionview'){
      return <Location />
    }    
    else if(this.state.selectedIndex == 0){
      return <Home />
    }else if(this.state.selectedIndex == 1){
      return <StoreView />
    }else if(this.state.selectedIndex == 2){
      return <Contacts />
    }else if(this.state.selectedIndex == 3){
      return <Aboutme />
    }
    return <Home />
  }
  render() {
    const PaperStyle = {
      position: 'absolute',
      bottom: 0
    }
    return (
      <div className={styles.container}>
        {this.getContent()}
        <Paper style={PaperStyle} zDepth={1}>
          <BottomNavigation selectedIndex={this.state.selectedIndex}>
            <BottomNavigationItem
              label="首页"
              icon={homeIcon}
              onTouchTap={() => this.select(0) }
              />
            <BottomNavigationItem
              label="门店"
              icon={storeIcon}
              onTouchTap={() => this.select(1) }
              />
            <BottomNavigationItem
              label="通讯录"
              icon={contactsIcon}
              onTouchTap={() => this.select(2) }
              />
            <BottomNavigationItem
              label="我"
              icon={myIcon}
              onTouchTap={() => this.select(3) }
              />
          </BottomNavigation>
        </Paper>
      </div>
    );
  }
}

export default Main;