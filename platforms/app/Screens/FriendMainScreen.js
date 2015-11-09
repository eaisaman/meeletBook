'use strict';

var React = require('react-native');
var {
  Navigator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var FriendListScreen = require('./friends/FriendListScreen');
var FriendUserScreen = require('./friends/FriendUserScreen');
var FriendGroupScreen = require('./friends/FriendGroupScreen');
var FriendDiscussScreen = require('./friends/FriendDiscussScreen');
var AddNewFriendScreen = require('./friends/AddNewFriendScreen');

var FriendMainScreen = React.createClass({
  getInitialState: function() {
    return {showNavBar:false,value:'hello'};
  },

  componentWillMount: function() {

  },

  render: function() {
    return (
        <FriendListScreen  style={styles.scene} selectSubView={this.selectSubView}/>
    );
  },
  selectSubView:function(subName){
    let component = AddNewFriendScreen,
    title = '';

    if (subName === 'addUser'){
      component = AddNewFriendScreen;
      title = '添加朋友';
    }else if (subName === 'group'){
      component = FriendGroupScreen;
      title = '添加群';
    }else if (subName === 'discuss'){
      component = FriendDiscussScreen;
      title = '添加讨论组';
    }else if (subName==='detail'){
      component = FriendUserScreen;
      title = '详细资料';
    }

    this.props.navigator.push({
      title:title,
      component:component,
      // rightButtonTitle:'sdfsdf',
      passProps:{navigator: this.props.navigator}
    })


  },

})

var styles = StyleSheet.create({
  screen: {
    marginTop: Navigator.NavigationBar.Styles.General.TotalNavHeight,
    flex: 1,
    backgroundColor: '#666666',
  },
  scene: {
    flex: 1,
  },
  navBar: {
    backgroundColor: '#666666',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    opacity: 0,
  },
  navBarLeftButton: {
    paddingLeft: 10,
    width: 36,
    height: Navigator.NavigationBar.Styles.General.NavBarHeight,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  navBarRightButton: {
    paddingRight: 10,
    width: 36,
    height: Navigator.NavigationBar.Styles.General.NavBarHeight,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  navButtonIcon: {
    flex: 1,
    alignSelf: 'center',
    color: "white",
  },
  title: {
    width: 120,
    alignSelf: 'center',
    height: Navigator.NavigationBar.Styles.General.NavBarHeight,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    color: 'white',
    textAlign: 'left',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  titleIconPlaceholder: {
    width: 24,
    height: Navigator.NavigationBar.Styles.General.NavBarHeight,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: "transparent",
  },
});

module.exports = FriendMainScreen;
