'use strict';

let list = [
    {
      "_id" : "52591a12c763d5e45855639a",
      "name" : "陈昌申",
      "alphabet" : "chenchangshen1"
    },
    {
      "_id" : "52591a12c763d5e45855639c",
      "name" : "冯智豪",
      "alphabet" : "fengzhihao2"
    },
    {
      "_id" : "52591a12c763d5e45855639e",
      "name" : "梁天祐",
      "alphabet" : "liangtianyou3"
    },
    {
      "_id" : "52591a12c763d5e4585563a0",
      "name" : "李壮",
      "alphabet" : "lizhuang4"
    },
    {
      "_id" : "52591a12c763d5e4585563a2",
      "name" : "林振远",
      "alphabet" : "linzhenyuan5"
    },
    {
      "_id" : "52591a12c763d5e4585563a4",
      "name" : "钱辛杰",
      "alphabet" : "qianxinjie6"
    },
    {
      "_id" : "52591a12c763d5e4585563a6",
      "name" : "孙越凡",
      "alphabet" : "sunyuefan7"
    },
    {
      "_id" : "52591a12c763d5e4585563a8",
      "name" : "田奕恒",
      "alphabet" : "tianyiheng8"
    },
    {
      "_id" : "52591a12c763d5e4585563aa",
      "name" : "王臻萱",
      "alphabet" : "wangzhenxuan9"
    },
    {
      "_id" : "52591a12c763d5e4585563ac",
      "name" : "杨钧文",
      "alphabet" : "yangjunwen10"
    },
    {
      "_id" : "52591a12c763d5e4585563ae",
      "name" : "朱隽浩",
      "alphabet" : "zhujuanhao11"
    },
    {
      "_id" : "52591a12c763d5e4585563b0",
      "name" : "周思杰",
      "alphabet" : "zhousijie12"
    },
    {
      "_id" : "52591a12c763d5e4585563b2",
      "name" : "葛晟宏",
      "alphabet" : "geshenghong13"
    },
    {
      "_id" : "52591a12c763d5e4585563b4",
      "name" : "毕嘉利",
      "alphabet" : "bijiali14"
    },
    {
      "_id" : "52591a12c763d5e4585563b6",
      "name" : "陈羽",
      "alphabet" : "chenyu15"
    },
    {
      "_id" : "52591a12c763d5e4585563b8",
      "name" : "陈妍文",
      "alphabet" : "chenyanwen16"
    },
    {
      "_id" : "52591a12c763d5e4585563ba",
      "name" : "蔡智先",
      "alphabet" : "caizhixian17"
    },
    {
      "_id" : "52591a12c763d5e4585563bc",
      "name" : "冯婷晖",
      "alphabet" : "fengtinghui18"
    },
    {
      "_id" : "52591a12c763d5e4585563be",
      "name" : "管悦欣",
      "alphabet" : "guanyuexin19"
    },
    {
      "_id" : "52591a12c763d5e4585563c0",
      "name" : "黄文轩",
      "alphabet" : "huangwenxuan20"
    },
    {
      "_id" : "52591a12c763d5e4585563c2",
      "name" : "倪晨怡",
      "alphabet" : "nichenyi21"
    },
    {
      "_id" : "52591a12c763d5e4585563c4",
      "name" : "田奕霖",
      "alphabet" : "tianyilin22"
    },
    {
      "_id" : "52591a12c763d5e4585563c6",
      "name" : "王昕",
      "alphabet" : "wangxin23"
    },
    {
      "_id" : "52591a12c763d5e4585563c8",
      "name" : "喻王玮",
      "alphabet" : "yuwangwei24"
    },
    {
      "_id" : "52591a12c763d5e4585563ca",
      "name" : "殷奕蕊",
      "alphabet" : "yinyirui25"
    },
    {
      "_id" : "52591a12c763d5e4585563cc",
      "name" : "周璎泓",
      "alphabet" : "zhouyinghong26"
    },
    {
      "_id" : "52591a12c763d5e4585563ce",
      "name" : "许景凯",
      "alphabet" : "xujingkai27"
    },
    {
      "_id" : "52591a12c763d5e4585563d0",
      "name" : "王欣芸",
      "alphabet" : "wangxinyun28"
    }
];

var React = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var TimerMixin = require('react-timer-mixin');
var LinearGradient = require('react-native-linear-gradient');
var {
  AlertIOS,
  Image,
  LayoutAnimation,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Navigator,
  View,
} = React;

var Thumb = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={[styles.friendRow,]}>
        <Text style={styles.thumbText}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
});

var dataBlob = {};
var sectionIds = "*ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
var rowIds = [];
for (let sectionId of sectionIds) dataBlob[sectionId] = sectionId;
for (let ii of sectionIds.keys()) { rowIds[ii] = []; }
rowIds[0].push("btn_add_friend", "btn_add_group", "btn_join_talk");
for (let item of list) { var rowId = item._id; dataBlob[rowId] = item; rowIds[sectionIds.indexOf(item.alphabet.charAt(0).toUpperCase())].push(rowId); }
var PAGE_SIZE = 4;
var FriendGroupScreen = React.createClass({
  mixins: [TimerMixin],

  timeoutId: (null: any),

  getInitialState: function() {
    var dataSource = new ListView.DataSource({
      getRowData: (dataBlob, sectionId, rowId) => dataBlob[rowId],
      getSectionHeaderData: (dataBlob, sectionId) => dataBlob[sectionId],
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    return {
      dataSource: dataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
      textAlign: "center",
      data: [],
    };
  },

  routeTalk: function(title) {
    this.props.mainScreen.showNavBar();

    this.props.navigator.push({id:"talk", title:title});
  },

  renderRow: function(rowData: string, sectionId: string, rowId: string): ReactElement {
    // if (sectionId === "*") {
    //   switch(rowId) {
    //     case "btn_add_friend":
    //       return (
    //       <TouchableOpacity style={[styles.friendRow,]}>
    //         <View style={styles.btnRow}><Icon name='person-add' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>新的朋友</Text></View>
    //       </TouchableOpacity>
    //       );
    //     break;
    //     case "btn_add_group":
    //       return (
    //       <TouchableOpacity style={[styles.friendRow,]}>
    //         <View style={styles.btnRow}><Icon name='group-add' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>新的群</Text></View>
    //       </TouchableOpacity>
    //       );
    //     break;
    //     case "btn_join_talk":
    //       return (
    //       <TouchableOpacity style={[styles.friendRow,]}>
    //         <View style={styles.btnRow}><Icon name='local-florist' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>讨论组</Text></View>
    //       </TouchableOpacity>
    //       );
    //     break;
    //   }
    // }

    return rowData && (<Thumb text={rowData.name}/>) || null;
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
      <ListView
        style={styles.listview}
        dataSource={this.state.dataSource}
        // renderHeader={this.renderHeader}
        renderSectionHeader={this.renderSectionHeader}
        renderRow={this.renderRow}
        initialListSize={10}
        pageSize={PAGE_SIZE}
        scrollRenderAheadDistance={2000}
      />
    );
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
    backgroundColor: '#dde1dc',
    marginTop: Navigator.NavigationBar.Styles.General.TotalNavHeight,
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
  thumbText: {
    fontSize: 20,
    color: '#888888',
    textAlign: "left",
  },
  friendRow: {
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
  btn: {
    width: 40,
    height: 40,
  },
  btnLabel: {
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#dde1dc',
    borderRadius: 3,
  },
  linearGradient: {
    flex: 1,
    height: 40,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 10,
    marginVertical: 12,
  },
});

module.exports = FriendGroupScreen;
