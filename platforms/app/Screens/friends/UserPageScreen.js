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
  ListView,
} = React;

var list=[
  {
    "dateDate":"31",
    "dateMonth":"十月",
    "location":"shanghai",
    "items":[
      {
        "_id" : "52591a12c763d5e45855639a",
        "img_url":'book-1.png',
        "desc":"这是一张来自舒威分享的图片",
        "desc_id":"52591a12c763d5e45855639a"
      }
    ]
  },
  {
    "dateDate":"11",
    "dateMonth":"九月",
    "location":"chengdu",
    "items":[
      {
        "_id" : "52591a12c763d5e45855639e",
        "img_url":'book-1.png',
        "desc":"我在迪士尼拍的照片",
        "desc_id":"52591a12c763d5e45855639a"
      },
      {
        "_id" : "52591a12c763d5e4585563a0",
        "img_url":'book-1.png',
        "desc":"快来看，多美都风景啊",
        "desc_id":"52591a12c763d5e45855639a"
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
      <View style={styles.item}>
        <TouchableHighlight underlayColor='#dddddd'
          onPress={()=> {
              ;
          }}>
          <View style={styles.rowContainer}>
            <Image style={styles.thumb} source={{ uri: this.props.data.img_url }} />
            <Text style={styles.title} numberOfLines={1}>{this.props.data.desc}</Text>
          </View>
        </TouchableHighlight>
        </View>
    )
  }
});

var Thumb = React.createClass({
  getInitialState:function(){
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1._id !== row2._id,
    });

    return {
      dataSource: dataSource.cloneWithRows(this.props.data.items),
      showFlag:false,
    };
  },
  renderRow:function(data,i){
    return (
        <InfoThumb data={data}/>
    )
  },
  render:function(){
    return (
      <View style={styles.rowItem}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateFont}>
            {this.props.data.dateDate}
          </Text>
          <Text style={styles.monthFont}>
            {this.props.data.dateMonth}
          </Text>
        </View>
        <View style={styles.columnItem}>
          {this.props.data.items.map(this.renderRow)}
        </View>
      </View>
    )
  }
});

var UserPageScreen = React.createClass({
  getInitialState: function() {
      var dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1._id !== row2._id,
      });

      return {
        dataSource: dataSource.cloneWithRows(list),
        showFlag:false,
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

  // renderRow: function(rowData: string, sectionId: string, rowId: string): ReactElement {
  //   return rowData && (<Thumb data={rowData}/>) || null;
  // },

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

          <View style={styles.listview}>
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
		// padding: 10,
    flex:1
	},
  listview:{
    backgroundColor: 'white',
    marginHorizontal: 5,
    marginVertical: 3,
    padding: 5,
  },
  rowItem:{
    flexDirection:'row',
  },
  dateContainer:{
    width:100,
    flexDirection:'row',
    alignItems:'flex-end'
  },
  dateFont:{
    fontSize:40,
    fontWeight:'bold',
  },
  monthFont:{
    fontSize:24,
  },
  item:{
    flex:1,
    marginHorizontal: 5,
    marginVertical: 3,
  },
  columnItem:{
    flexDirection:'column',
    flex:1,
    marginHorizontal: 5,
    marginVertical: 3,
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
});

module.exports = UserPageScreen;
