'use strict';

var _ = require('lodash')
var React = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var BlurView = require('react-native-blur').BlurView;
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
        img_url:'book-1.png'
      },
      variable: false
    };
  },
  componentDidMount: function () {
    // alert(this.props.uid);
    // this._fetchData(this.props.uid);
    // alert(this.props.navigator.props);
    // this.props.navigator.initialRoute={
    //   rightButtonTitle:'eeeeeee',
    // };
    // this.props.navigator.addListener(this.props.navigator.events, 'rightButtonPress', this._handleRightBtnPress);
    // this.addListenerOn(this.props.navigator.events, 'rightButtonPress', this._handleRightBtnPress)

    AppEventEmitter.addListener('myRightBtnEvent', this.miscFunction);
  },
  miscFunction: function(args){
       this.setState({
           variable: args.someArg
       });
      //  console.log('state='+this.state.variable);
      //  console.log('args='+args.someArg);
      //  alert(this.state.variable);
   },

  _handleRightBtnPress:function(){
    // alert('wtf');
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
            <Text style={styles.userName}>{this.props.uid}</Text>
            <Text style={styles.userName}>帐号: sdf</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.txtLeft}>地区</Text>
            <Text style={styles.txtLeft}>上海</Text>
          </View>
          <TouchableHighlight>
            <View style={styles.row}>
              <Text style={styles.txtLeft}>个人相册</Text>
              <Image style={styles.thumb} source={{ uri: this.state.userInfo.img_url }} />
              <Image style={styles.thumb} source={{ uri: this.state.userInfo.img_url }} />
              <Image style={styles.thumb} source={{ uri: this.state.userInfo.img_url }} />
                <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableHighlight>
        </View>

        <View>
          <Text style={styles.button}>发消息</Text>
        </View>

        {this._renderCancel()}
        </ScrollView>
      );
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
		marginRight: 10
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
    height: 36,
    width: 200,
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign:'center',
  },
});

module.exports = FriendUserScreen;
