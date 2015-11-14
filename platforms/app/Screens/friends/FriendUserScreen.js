'use strict';

var _ = require('lodash')
var React = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var BlurView = require('react-native-blur').BlurView;
var UserPageScreen = require('./UserPageScreen');
var TalkScreen = require('../TalkScreen');

var {
  AlertIOS,
  Image,
  LayoutAnimation,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Navigator,
  ScrollView,
} = React;

var FriendUserScreen = React.createClass({
  getInitialState: function() {
    return {
      userInfo:{
        img_url:'book-1.png',
        img_url2:'book-2.png',
        img_url3:'book-3.png',
        // userName:'张三'
      },
      variable: false
    };
  },
  componentDidMount: function () {
    // alert(this.props.uid);
    // this._fetchData(this.props.uid);

    //just for test event emmiter
    // AppEventEmitter.addListener('myRightBtnEvent', this.miscFunction);
  },
  //just fot test
  miscFunction: function(args){
       this.setState({
           variable: args.someArg
       });
   },
  // _fetchData: function (groupName) {
  //   var that = this;
  //   //todo get userInfo by uid
  // },
  _renderCancel: function () {
    // alert(this.props.showFlag);
        if (this.state.variable) {
            return (
                <View>
                  <Text>sdfsdfsdf</Text>
                </View>
            );
        }
    },

  render: function() {
      return (
        <ScrollView style={styles.screen}>
        <TouchableOpacity style={[styles.header,]}>
          <Icon name='account-circle' size={60} color='#2ecc71' style={styles.avatar}/>
          <View style={styles.nameList}>
            <Text style={styles.userName}>{this.props.info.name}</Text>
            <Text style={styles.userName}>帐号: {this.props.info.account}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.txtLeft}>地区</Text>
            <Text style={styles.txtLeft}>上海</Text>
          </View>
          <TouchableHighlight onPress={()=>this.onShowUserPage(this.props.info)}>
            <View style={styles.row}>
              <Text style={styles.txtLeft}>个人相册</Text>
              <Image style={styles.thumb} source={{ uri: this.state.userInfo.img_url }} />
              <Image style={styles.thumb} source={{ uri: this.state.userInfo.img_url2 }} />
              <Image style={styles.thumb} source={{ uri: this.state.userInfo.img_url3 }} />
              <Icon name='keyboard-arrow-right' style={styles.arrowEnd} size={40} color='#2ecc71'/>
            </View>
          </TouchableHighlight>
        </View>

        <View style={{opacity:0}}>
          <Text onPress={()=>{this.talkView(this.props.info.uid,this.props.info.name)}} style={styles.button}>发消息</Text>
        </View>
        </ScrollView>
      );
    },
    onShowUserPage:function(info){
      this.props.navigator.push({
        title:info.name,
        component:UserPageScreen,
        passProps:{navigator: this.props.navigator,info:info}
      })
    },
    talkView:function(uid,userName){
      this.props.navigator.push({
        title:userName,
        component:TalkScreen,
        passProps:{navigator: this.props.navigator,uid:uid}
      })
    }
})

var styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#dde1dc',
  },
  header: {
    height: 80,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 3,
    padding: 5,
  },
  section:{
    justifyContent: 'flex-start',
    flex:1,
    flexDirection: 'column',
    backgroundColor: 'white',
    marginHorizontal: 5,
    marginVertical: 3,
    padding: 5,
  },
  txtLeft:{
    marginRight:50,
    flexDirection:'column'
  },
  thumb: {
		width: 80,
		height: 80,
		marginRight: 10,
	},
  arrow: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  userName: {
    fontSize: 16,
    height: 24,
    marginVertical: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 3,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 3,
    flex:1,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    // height: 36,
    width: 200,
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
    borderWidth: 1,
    borderRadius: 8,
    // marginBottom: 10,
    padding:10,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign:'center',
  },
  arrowEnd:{
    // flex: 1,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    // flexDirection: 'row',
    // flex: 1,
    marginRight:90,
    // marginRight:10,
  }
});

module.exports = FriendUserScreen;
