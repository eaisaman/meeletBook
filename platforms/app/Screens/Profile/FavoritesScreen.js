'use strict';

var React = require('react-native');

var {
  Navigator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListView,
  TextInput
} = React;

var TimerMixin = require('react-timer-mixin');
var Icon = require('react-native-vector-icons/MaterialIcons');

var PAGE_SIZE = 4;
var now = new Date();
let list = [ 
    {
    "_id" : "52591a12c763d5e45855639a",
      "name" : "陈昌申",
      "content" : "自2009年推出风靡一时《愤怒的小鸟》游戏以来，Rovio至今并未推出一款能与之匹敌的新游戏。去年12月，Rovio已经宣布裁员110人，占员工总数的14%。",
      "time": now.toString("yyyy年MM月dd日tthh:mm").replace("AM", "上午").replace("PM", "下午"),
    },
    {
      "_id" : "52591a12c763d5e45855639c",
      "name" : "冯智豪",
      "content" : "自2009年推出风靡一时《愤怒的小鸟》游戏以来，Rovio至今并未推出一款能与之匹敌的新游戏。去年12月，Rovio已经宣布裁员110人，占员工总数的14%。",
      "time": now.toString("yyyy年MM月dd日tthh:mm").replace("AM", "上午").replace("PM", "下午"),
    },
    {
      "_id" : "52591a12c763d5e45855639e",
      "name" : "梁天祐",
      "content" : "自2009年推出风靡一时《愤怒的小鸟》游戏以来，Rovio至今并未推出一款能与之匹敌的新游戏。去年12月，Rovio已经宣布裁员110人，占员工总数的14%。",
      "time": now.toString("yyyy年MM月dd日tthh:mm").replace("AM", "上午").replace("PM", "下午"),
    },
    {
      "_id" : "52591a12c763d5e4585563a0",
      "name" : "李壮",
      "content" : "自2009年推出风靡一时《愤怒的小鸟》游戏以来，Rovio至今并未推出一款能与之匹敌的新游戏。去年12月，Rovio已经宣布裁员110人，占员工总数的14%。",
      "time": now.toString("yyyy年MM月dd日tthh:mm").replace("AM", "上午").replace("PM", "下午"),
    },
    {
      "_id" : "52591a12c763d5e4585563a2",
      "name" : "林振远",
      "content" : "自2009年推出风靡一时《愤怒的小鸟》游戏以来，Rovio至今并未推出一款能与之匹敌的新游戏。去年12月，Rovio已经宣布裁员110人，占员工总数的14%。",
      "time": now.toString("yyyy年MM月dd日tthh:mm").replace("AM", "上午").replace("PM", "下午"),
    },
    {
      "_id" : "52591a12c763d5e4585563a4",
      "name" : "钱辛杰",
      "content" : "自2009年推出风靡一时《愤怒的小鸟》游戏以来，Rovio至今并未推出一款能与之匹敌的新游戏。去年12月，Rovio已经宣布裁员110人，占员工总数的14%。",
      "time": now.toString("yyyy年MM月dd日tthh:mm").replace("AM", "上午").replace("PM", "下午"),
    },
    {
      "_id" : "52591a12c763d5e4585563a6",
      "name" : "孙越凡",
      "content" : "自2009年推出风靡一时《愤怒的小鸟》游戏以来，Rovio至今并未推出一款能与之匹敌的新游戏。去年12月，Rovio已经宣布裁员110人，占员工总数的14%。",
      "time": now.toString("yyyy年MM月dd日tthh:mm").replace("AM", "上午").replace("PM", "下午"),
    },
    {
      "_id" : "52591a12c763d5e4585563a8",
      "name" : "田奕恒",
      "content" : "自2009年推出风靡一时《愤怒的小鸟》游戏以来，Rovio至今并未推出一款能与之匹敌的新游戏。去年12月，Rovio已经宣布裁员110人，占员工总数的14%。",
      "time": now.toString("yyyy年MM月dd日tthh:mm").replace("AM", "上午").replace("PM", "下午"),
    },
    {
      "_id" : "52591a12c763d5e4585563aa",
      "name" : "王臻萱",
      "content" : "自2009年推出风靡一时《愤怒的小鸟》游戏以来，Rovio至今并未推出一款能与之匹敌的新游戏。去年12月，Rovio已经宣布裁员110人，占员工总数的14%。",
      "time": now.toString("yyyy年MM月dd日tthh:mm").replace("AM", "上午").replace("PM", "下午"),
    },
    {
      "_id" : "52591a12c763d5e4585563ac",
      "name" : "杨钧文",
      "content" : "自2009年推出风靡一时《愤怒的小鸟》游戏以来，Rovio至今并未推出一款能与之匹敌的新游戏。去年12月，Rovio已经宣布裁员110人，占员工总数的14%。",
      "time": now.toString("yyyy年MM月dd日tthh:mm").replace("AM", "上午").replace("PM", "下午"),
    },
];

var Thumb = React.createClass({  
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={[styles.contentRow,]}>
        <Icon name='textsms' size={40} color='#2ecc71' style={[styles.smallAvatar, ]}/>
        <View style={[styles.thumbItem, styles.textContainer, ]}>
          <View style={[styles.compositeItem, ]}>
            <Text numberOfLines={1} style={[styles.thumbText, ]}>{this.props.data.name}</Text>
            <Text style={[styles.thumbDate, ]}>{this.props.data.time}</Text>
          </View>
          <View style={[styles.textItem, ]}>
            <Text numberOfLines={1} style={[styles.thumbText]}>{this.props.data.content}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
});

var FavoritesScreen = React.createClass({
  getInitialState: function() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1._id !== row2._id,
    });

    return {
      dataSource: dataSource.cloneWithRows(list),
    };
  },
  routeTalk: function(title) {
    this.props.mainScreen.showNavBar();

    this.props.navigator.push({id:"talk", title:title});
  },
  renderRow: function(rowData: string, sectionId: string, rowId: string): ReactElement {
    return rowData && (<Thumb data={rowData} onPress={() => { this.routeTalk(rowData.name); }}/>) || null;
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

  render() {
    return (
      <ListView
        style={[styles.screen, styles.listview]}
        dataSource={this.state.dataSource}
        renderHeader={this.renderHeader}
        renderRow={this.renderRow}
        initialListSize={10}
        pageSize={PAGE_SIZE}
        scrollRenderAheadDistance={2000}></ListView>
    );
  },

  updateSearchInput: function(text) {
    this.clearTimeout(this.timeoutId);
    this.timeoutId = this.setTimeout(() => this.doSearch(text), 100);
  },

  doSearch: function(text) {
    this.timeoutId = null;
  }
});

var styles = StyleSheet.create({
  screen: {
    marginTop: Navigator.NavigationBar.Styles.General.TotalNavHeight,
    flex: 1,
    backgroundColor: '#dde1dc'
  },
  listview: {
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
  avartar: {
    flex: 1,
  },
  nameList: {
    flex: 1,
    marginHorizontal: 5,
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
  btn: {
    width: 40,
    height: 40,
  },
  btnLabel: {
    fontSize: 16,
  }
});

module.exports = FavoritesScreen;