'use strict';

var now = new Date();
let list = [
  {
  "_id" : "52591a12c763d5e45855639a",
    "name" : "陈昌申",
    "desc" : "通过账号查找加入",
    "status": "accept",
    "account":"cangkun.chen@163.com",
    "img_url":'book-1.png'
  },
  {
  "_id" : "52591a12c763d5r45855639a",
  "name" : "舒威",
  "desc" : "我是舒威",
  "status": "request",
  "account":"wei.shu@163.com",
  "img_url":'book-1.png'
  },
  {
    "_id" : "52591a12c763d5e4585563d0",
    "name" : "王欣芸",
    "desc" : "通过账号查找加入",
    "status": "accept",
    "account":"xinyun.wang@163.com",
    "img_url":'book-1.png'
  },
  {
    "_id" : "52591a12c763d5e4585563bc",
    "name" : "冯婷晖",
    "desc" : "通过账号查找加入",
    "status": "accept",
    "account":"tinghui.feng@163.com",
    "img_url":'book-1.png'
  },
  {
    "_id" : "52591a12c763d5e4585563be",
    "name" : "管悦欣",
    "desc" : "我是管悦欣",
    "status": "request",
    "account":"yuexin.guan@163.com",
    "img_url":'book-1.png'
  },
  {
    "_id" : "52591a12c763d5e4585563c0",
    "name" : "黄文轩",
    "desc" : "通过账号查找加入",
    "status": "accept",
    "account":"wenxuan.huang@163.com",
    "img_url":'book-1.png'
  },
  {
    "_id" : "52591a12c763d5e4585563c2",
    "name" : "倪晨怡",
    "desc" : "通过账号查找加入",
    "status": "accept",
    "account":"chenyi.ni@163.com",
    "img_url":'book-1.png'
  },
  {
    "_id" : "52591a12c763d5e4585563c4",
    "name" : "田奕霖",
    "desc" : "通过账号查找加入",
    "status": "accept",
    "account":"yilin.tian@163.com",
    "img_url":'book-1.png'
  },
  {
    "_id" : "52591a12c763d5e4585563c6",
    "name" : "王昕",
    "desc" : "我是王昕",
    "status": "request",
    "account":"xin.wangn@163.com",
    "img_url":'book-1.png'
  },
  {
    "_id" : "52591a12c763d5e4585563c8",
    "name" : "喻王玮",
    "desc" : "通过账号查找加入",
    "status": "accept",
    "account":"wangwei.yu@163.com",
    "img_url":'book-1.png'
  },
  {
    "_id" : "52591a12c763d5e4585563ca",
    "name" : "殷奕蕊",
    "desc" : "通过账号查找加入",
    "status": "accept",
    "account":"yixin.yin@163.com",
    "img_url":'book-1.png'
  },
  {
    "_id" : "52591a12c763d5e4585563cc",
    "name" : "周璎泓",
    "desc" : "通过账号查找加入",
    "status": "accept",
    "account":"yinghong.zhou@163.com",
    "img_url":'book-1.png'
  },
  {
    "_id" : "52591a12c763d5e4585563ce",
    "name" : "许景凯",
    "desc" : "通过账号查找加入",
    "status": "accept",
    "account":"jingkai.xu163.com",
    "img_url":'book-1.png'
  }
];

var React = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var TimerMixin = require('react-timer-mixin');
var LinearGradient = require('react-native-linear-gradient');
var FriendUserScreen = require('./FriendUserScreen');

var {
  AlertIOS,
  Navigator,
  Image,
  LayoutAnimation,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  ScrollView
} = React;

var Thumb = React.createClass({
  getInitialState: function() {
    return {
      btnValue:''
    };
    // return {};
  },
  componentDidMount: function () {
    this.setState({btnValue: this.props.data.status});
  },
  onAccept: function(){
    this.setState({btnValue: 'accept'});
  },
  render: function() {
    if (this.state.btnValue === 'accept'){
      return (
        <TouchableHighlight underlayColor='#dddddd'
          onPress={()=> {
              this.props.selectUserView(this.props.data);
          }}>
  				<View>
  					<View style={styles.rowContainer}>
  						<Image style={styles.thumb} source={{ uri: this.props.data.img_url }} />
  						<View style={styles.textContainer}>
  							<Text style={styles.name}>{this.props.data.name}</Text>
  							<Text style={styles.title} numberOfLines={1}>{this.props.data.desc}</Text>
  						</View>
              <View style={[styles.rowVertical]}>
                <Text style={styles.status} >已接受</Text>
              </View>
  					</View>
  					<View style={styles.separator} />
  				</View>
  			</TouchableHighlight>
      );
    }else {
      return (
        <TouchableHighlight underlayColor='#dddddd'
          onPress={()=> {
              this.props.selectUserView(this.props.data);
          }}>
  				<View>
  					<View style={styles.rowContainer}>
  						<Image style={styles.thumb} source={{ uri: this.props.data.img_url }} />
  						<View style={styles.textContainer}>
  							<Text style={styles.name}>{this.props.data.name}</Text>
  							<Text style={styles.title} numberOfLines={1}>{this.props.data.desc}</Text>
  						</View>
              <View style={[styles.rowVertical]}>
                <TouchableHighlight
                  style={styles.btnWarp}
                  onPress={()=>this.onAccept()}>
                    <Text style={styles.btn}>未接受</Text>
                </TouchableHighlight>
              </View>
  					</View>
  					<View style={styles.separator} />
  				</View>
  			</TouchableHighlight>
      );
    }
  }
});

var dataBlob = {};
// var sectionIds = "*ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
// var rowIds = [];
// for (let sectionId of sectionIds) dataBlob[sectionId] = sectionId;
// for (let ii of sectionIds.keys()) { rowIds[ii] = []; }
// rowIds[0].push("btn_add_friend", "btn_add_group", "btn_join_talk");
// for (let item of list) { var rowId = item._id; dataBlob[rowId] = item; rowIds[sectionIds.indexOf(item.alphabet.charAt(0).toUpperCase())].push(rowId); }
var PAGE_SIZE = 4;
var AddNewFriendScreen = React.createClass({
  mixins: [TimerMixin],

  timeoutId: (null: any),

  getInitialState: function() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1._id !== row2._id,
    });

    return {
      dataSource: dataSource.cloneWithRows(list),
      showFlag:false,
    };
  },

  componentDidMount:function(){
  },

  // getInitialState: function() {
  //   var dataSource = new ListView.DataSource({
  //     getRowData: (dataBlob, sectionId, rowId) => dataBlob[rowId],
  //     getSectionHeaderData: (dataBlob, sectionId) => dataBlob[sectionId],
  //     rowHasChanged: (row1, row2) => row1 !== row2,
  //     sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
  //   });
  //
  //   return {
  //     dataSource: dataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
  //     textAlign: "center",
  //     data: [],
  //   };
  // },

  renderRow: function(rowData: string, sectionId: string, rowId: string): ReactElement {
    return rowData && (<Thumb data={rowData} selectUserView={this.selectUserView}/>) || null;
  },

  renderSectionHeader: function(sectionData: string, sectionId: string) {
    return sectionId !=="*" && (
      <View style={[styles.sectionHeader,]}>
        <LinearGradient colors={["#27ae60", "#2ecc71"]} start={[0,0.5]} end={[1, 0.5]} locations={[0.5, 0.75]} style={styles.linearGradient}>
          <Text style={styles.sectionTitle}>
            {sectionData}
          </Text>
        </LinearGradient>
      </View>
    ) || null;
  },

  renderHeader: function() {
    return (
      <View style={styles.header}>
        <TextInput
          autoCapitalize="none"
          placeholder="搜索"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={(event) => this.updateSearchInput(event.nativeEvent.text) }
          style={styles.searchInput}
        />
      </View>
    );
  },

  render: function() {
    return (
      <ScrollView>
        <ListView
          style={styles.listview}
          dataSource={this.state.dataSource}
          renderHeader={this.renderHeader}
          // renderSectionHeader={this.renderSectionHeader}
          renderRow={this.renderRow}
          initialListSize={10}
          pageSize={PAGE_SIZE}
          scrollRenderAheadDistance={2000}
        />

      </ScrollView>
    );
  },

  selectUserView:function(info){
    this.props.navigator.push({
      title:'详细资料',
      component:FriendUserScreen,
      // rightButtonTitle:'...',
      // onRightButtonPress:this.onRightButtonPress,
      passProps:{navigator: this.props.navigator,info:info}
    })
  },
  onRightButtonPress: function() {
      AppEventEmitter.emit('myRightBtnEvent', { someArg: true });
  },

  updateSearchInput: function(text) {
    this.clearTimeout(this.timeoutId);
    this.timeoutId = this.setTimeout(() => this.doSearch(text), 100);
  },

  doSearch: function(text) {
    this.timeoutId = null;

    if (text && text.length) {
      for (let item of list) {
        var rowId = item._id;
        if (item.name.startsWith(text)) {
          dataBlob[rowId] = item;
        } else {
          delete dataBlob[rowId];
        }
      }
    } else {
      for (let item of list) { var rowId = item._id; dataBlob[rowId] = item; }
    }

    var dataSource = new ListView.DataSource({
      getRowData: (dataBlob, sectionId, rowId) => dataBlob[rowId],
      getSectionHeaderData: (dataBlob, sectionId) => dataBlob[sectionId],
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.setState({
      dataSource: dataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
    })
  }
});
var styles = StyleSheet.create({
  listview: {
    // marginTop: Navigator.NavigationBar.Styles.General.TotalNavHeight,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dde1dc',
    flexDirection: 'row',
  },
  searchInput: {
    backgroundColor: 'white',
    borderColor: '#cccccc',
    borderRadius: 3,
    borderWidth: 0.5,
    marginHorizontal: 10,
    marginVertical: 10,
    height: 40,
    flex: 1,
    fontSize: 24,
    textAlign: "center",
  },
	thumb: {
		width: 80,
		height: 80,
		marginRight: 10
	},
	textContainer: {
		flex: 1
	},
	separator: {
		height: 1,
		backgroundColor: '#dddddd'
	},
	name: {
		fontSize: 25,
		fontWeight: 'bold',
		color: '#48BBEC'
	},
	title: {
		fontSize: 20,
		color: '#656565'
	},
  status:{
    marginRight:100,
    // flexDirection: 'row',
  },
  rowVertical:{
    justifyContent: 'center',
    height: 80,
  },
	rowContainer: {
		flexDirection: 'row',
		padding: 10
	},
  btnWarp : {
    marginRight:90,
  	borderWidth : 1,
  	padding : 5,
  	borderColor : '#3164ce',
  	borderRadius : 3
  },
  btn : {
  	color : '#3164ce'
  }
});
// var styles = StyleSheet.create({
  // listview: {
  //   backgroundColor: '#dde1dc',
  //   marginTop: Navigator.NavigationBar.Styles.General.TotalNavHeight,
  // },
  // header: {
  //   height: 60,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#dde1dc',
  //   flexDirection: 'row',
  // },
//   searchInput: {
//     backgroundColor: 'white',
//     borderColor: '#cccccc',
//     borderRadius: 3,
//     borderWidth: 0.5,
//     marginHorizontal: 10,
//     marginVertical: 10,
//     height: 40,
//     flex: 1,
//     fontSize: 24,
//     textAlign: "center",
//   },
//   thumbText: {
//     fontSize: 20,
//     color: '#888888',
//     textAlign: "left",
//   },
//   friendRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     marginHorizontal: 5,
//     marginVertical: 3,
//     padding: 5,
//     backgroundColor: 'white',
//     borderRadius: 3,
//   },
//   btnRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     flex: 1,
//   },
//   btn: {
//     width: 40,
//     height: 40,
//   },
//   btnLabel: {
//     fontSize: 16,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     marginHorizontal: 5,
//     backgroundColor: '#dde1dc',
//     borderRadius: 3,
//   },
//   linearGradient: {
//     flex: 1,
//     height: 40,
//   },
//   sectionTitle: {
//     color: 'white',
//     fontSize: 16,
//     textAlign: 'left',
//     backgroundColor: 'transparent',
//     marginLeft: 10,
//     marginVertical: 12,
//   },
// });

module.exports = AddNewFriendScreen;
