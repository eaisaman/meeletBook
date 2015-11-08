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
  TouchableHighlight,
  TouchableOpacity,
  View,
  Navigator,
  ScrollView,
} = React;

var list=[
  {
    "dateDate":"31",
    "dateMonth":"10",
    "location":"shanghai",
    "items":[
      {
        "_id" : "52591a12c763d5e45855639a",
        "name" : "陈昌申",
        "img_url":'book-1.png',
      }
    ]
  },
  {
    "dateDate":"11",
    "dateMonth":"09",
    "location":"chengdu",
    "items":[
      {
        "_id" : "52591a12c763d5e45855639e",
        "name" : "梁天祐",
        "img_url":'book-1.png',
      },
      {
        "_id" : "52591a12c763d5e4585563a0",
        "name" : "李壮",
        "img_url":'book-1.png',

      }
    ],
  },
]
var InfoThumb = React.createClass({
  getInitialState:function(){
    return {};
  },

  render:function(){
    return (
      <TouchableHighlight underlayColor='#dddddd'
        onPress={()=> {
            ;
        }}>
        <View style={styles.rowContainer}>
          <Image style={styles.thumb} source={{ uri: this.props.data.img_url }} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{this.props.data.name}</Text>
            <Text style={styles.title} numberOfLines={1}>{this.props.data.desc}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
});

var Thumb = React.createClass({
  getInitialState:function(){
    return {
    };
  },
  renderRow:function(data,i){
    return (
      <InfoThumb data={data}/>
    )
  },
  render:function(){
    return (
      <View>
        <Text>
          {this.props.data.dateDate}/{this.props.data.dateMonth}
        </Text>
        <View>
          {this.props.data.items.map(this.renderRow)}
        </View>
      </View>
    )
  }
});

var UserPageScreen = React.createClass({
  getInitialState: function() {
    return {

    };
  },
  componentDidMount: function () {
    // alert(this.props.uid);
    // this._fetchData(this.props.uid);
  },

  // _fetchData: function (groupName) {
  //   var that = this;
  //   //todo get userInfo by uid
  // },

  renderRow:function(data,i){
    return (
      <Thumb data={data}/>
    )
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

          <View>
            {list.map(this.renderRow)}
          </View>
        </ScrollView>
      );
    },
})

var styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#dde1dc',
  },
  rowContainer: {
		flexDirection: 'row',
		padding: 10
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

module.exports = UserPageScreen;
