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
    // let self = this;
    //
    // this._navBarRouteMapper = {
    //   LeftButton: function(route, navigator, index, navState) {
    //     if (index === 0) {
    //       return null;
    //     }
    //
    //     var previousRoute = navState.routeStack[index - 1];
    //     var titleIconName;
    //     switch(previousRoute.id) {
    //       case "list":
    //         titleIconName = 'format-list-bulleted';
    //         break;
    //       case "user":
    //         titleIconName = 'textsms';
    //         break;
    //       case "group":
    //         titleIconName = 'textsms';
    //         break;
    //       case "discuss":
    //         titleIconName = 'textsms';
    //         break;
    //       case "newFriend":
    //         titleIconName = 'textsms';
    //         break;
    //     }
    //
    //     return (
    //       <TouchableOpacity
    //         onPress={() => {navigator.pop();previousRoute.id === "list" && self.hideNavBar();}}
    //         style={styles.navBarLeftButton}>
    //         <Icon name={titleIconName} size={24} style={[styles.navButtonIcon, ]}/>
    //       </TouchableOpacity>
    //     );
    //   },
    //
    //   RightButton: function(route, navigator, index, navState) {
    //     return null;
    //   },
    //
    //   Title: function(route, navigator, index, navState) {
    //     if (route.id === "list")
    //       return;
    //
    //     var titleIconName;
    //     switch(route.id) {
    //       case "list":
    //         titleIconName = 'format-list-bulleted';
    //         break;
    //       case "user":
    //         titleIconName = 'textsms';
    //         break;
    //       case "group":
    //           titleIconName = 'textsms';
    //         break;
    //       case "discuss":
    //           titleIconName = 'textsms';
    //         break;
    //       case "newFriend":
    //           titleIconName = 'textsms';
    //         break;
    //     }
    //
    //     return (
    //       <View style={[styles.title, ]}>
    //         <View style={styles.titleIconPlaceholder}>
    //           <Icon name={titleIconName} size={24} style={[styles.navButtonIcon, ]}/>
    //         </View>
    //         <Text style={styles.titleText}>{route.title}</Text>
    //       </View>
    //     );
    //   },
    // };
  },

  // renderScene(route, nav) {
  //   switch (route.id) {
  //       case 'list':
  //           return <FriendListScreen navigator={nav} mainScreen={this} style={styles.scene}/>;
  //       case 'group':
  //           return <FriendGroupScreen navigator={nav} style={styles.scene}/>;
  //       case 'user':
  //           return <FriendUserScreen navigator={nav} style={styles.scene}/>;
  //       case 'discuss':
  //           return <FriendDiscussScreen navigator={nav} style={styles.scene}/>;
  //       case 'newFriend':
  //           return <AddNewFriendScreen navigator={nav} style={styles.scene}/>;
  //       default:
  //           return <View />;
  //   }
  // },

  render: function() {
    return (
        <FriendListScreen  style={styles.scene} selectSubView={this.selectSubView}/>
    );
  },
  selectSubView:function(subName){
    let component = AddNewFriendScreen;
    if (subName === 'addUser'){
      component = AddNewFriendScreen;
    }else if (subName === 'group'){
      component = FriendGroupScreen;
    }else if (subName === 'discuss'){
      component = FriendDiscussScreen;
    }else if (subName==='detail'){
      component = FriendUserScreen;
    }

    this.props.navigator.push({
      title:subName,
      component:component,
      passProps:{navigator: this.props.navigator}
    })


    // return (
    //   <Navigator
    //     debugOverlay={false}
    //     style={styles.screen}
    //     initialRoute={{ id: 'list', title: ''}}
    //     renderScene={this.renderScene}
    //     navigationBar={
    //       <Navigator.NavigationBar
    //         routeMapper={this._navBarRouteMapper}
    //         style={[styles.navBar, this.state.showNavBar?{opacity:1}:{opacity:0}, ]}
    //       />
    //     }
    //   />
    // );
  },

  // showNavBar: function() {
  //   this.setState({showNavBar:true});
  // },
  //
  // hideNavBar: function() {
  //   this.setState({showNavBar:false});
  // },
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
