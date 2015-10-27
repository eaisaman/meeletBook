var React = require('react-native');
var {
  Image,
  ListView,
  Navigator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
} = React;
var TimerMixin = require('react-timer-mixin');
var Icon = require('react-native-vector-icons/MaterialIcons');
var RefreshableListView = require('react-native-refreshable-listview')

var start = new Date(), end = start.addMinutes(1);
let list = [
  {
    "type": "timeMark",
    "content": start.toString("yyyy年MM月dd日tthh:mm").replace("AM", "上午").replace("PM", "下午"),
    "start": start,
    "end": end,
  },
  {
    "type": "myTalk",
    "content": "我在吃早饭",
    "userId": "66591a12c763d5e45855637e",
  },
  {
    "type": "myTalk",
    "content": "凤凰楼的点心好正点哦",
    "userId": "66591a12c763d5e45855637e",
  },
  {
    "type": "friendTalk",
    "content": "请客",
    "userId": "66591a12c763d5e45855637e",
  },
  {
    "type": "friendTalk",
    "content": "浙江将中医药知识纳入中小学课程",
    "userId": "66591a12c763d5e45855637e",
  },
  {
    "type": "friendTalk",
    "content": "Evernote似乎正在陷入危机之中。这家曾经被认为是“独角兽公司”最为完美的注脚的企业，在本月初宣布将裁员47人，并将关闭位于台湾、新加坡和莫斯科的三个办公室。此外，Evernote还关闭了一些运营不太顺利的功能，比如用于记录菜谱的“食记(Evernote Food)”。联系到今年七月的换帅和九月中国区总经理谷懿的辞职，以及意外停办的Evernote开发者大会，种种迹象都表明，这只独角兽已经处于泥潭的边缘。",
    "userId": "66591a12c763d5e45855637e",
  },
  {
    "type": "friendTalk",
    "content": "种子起源于3亿6千万年前，是种子植物产生的最为复杂的器官之一，为裸子植物和被子植物所特有。",
    "userId": "66591a12c763d5e45855637e",
  },
];

var Thumb = React.createClass({  
  getInitialState: function() {
    return {};
  },
  render: function() {
    switch(this.props.data.type) {
      case "timeMark":
        return (
          <View
            style={[styles.contentRow,]}>
            <View style={[styles.talkItem, ]}>
              <Text style={[styles.talkDate]}>{this.props.data.content}</Text>
            </View>
          </View>
        );
        break;
      case "myTalk":
        return (
          <View
            style={[styles.contentRow,]}>
            <View style={styles.avatarItem} />
            <View style={[styles.talkItem, styles.talkTextContainer, ]}>
              <Text style={[styles.talkText, styles.myTalkText, ]} numberOfLines={4}>{this.props.data.content}</Text>
            </View>
            <View style={[styles.avatarItem, styles.myAvatar, ]}>
              <LocalImage style={[styles.avatarImg, ]} source='fox-character.png' alt={require('image!default-avatar')}/>
            </View>
          </View>
        );
        break;
      case "friendTalk":
        return (
          <View
            style={[styles.contentRow,]}>
            <View style={styles.avatarItem}>
              <LocalImage style={[styles.avatarImg, ]} source='dog1-character.png' alt={require('image!default-avatar')}/>
            </View>
            <View style={[styles.talkItem, styles.talkTextContainer, ]}>
              <Text style={[styles.talkText, ]} numberOfLines={4}>{this.props.data.content}</Text>
            </View>
            <View style={styles.avatarItem} />
          </View>
        );
        break;
    }
  }
});

var TalkScreen = React.createClass({
  mixins: [TimerMixin],

  timeoutId: (null: any),

  getInitialState: function() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1._id !== row2._id,
    });

    return {
      dataSource: dataSource.cloneWithRows(list),
    };
  },

  renderRow: function(rowData: string, sectionId: string, rowId: string): ReactElement {
    return rowData && (<Thumb style={[styles.thumb,]} data={rowData}/>) || null;
  },

  reloadTalk: function() {

  },

  render() {
    return (
      <RefreshableListView style={styles.listview}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        loadData={this.reloadTalk}
        refreshDescription="Refreshing articles"
      />
    )
  },
});

var styles = StyleSheet.create({
  listview: {
    marginTop: Navigator.NavigationBar.Styles.General.TotalNavHeight,
    backgroundColor: '#dde1dc',
  },
  thumb: {
    flex: 1,
  },
  contentRow: {
    position: "relative",
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  talkItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 80,
    marginHorizontal: 80,
    overflow: "hidden"
  },
  avatarItem: {
    position: "absolute",
    width: 60,
    height: 60,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myAvatar: {
    right: 0,
  },
  avatarImg: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    height: 60,
  },
  talkTextContainer: {
  },
  talkText: {
    position: "absolute",
    left: 0,
    right: 0,
    color: '#888',
    fontSize: 18,
    height: 80,
    lineHeight: 20,
    right: 0,
    textAlign: "left",
  },
  myTalkText: {
    textAlign: "right",
  },
  talkDate: {
    borderRadius: 10,
    color: '#888',
    backgroundColor: 'rgba(192, 192, 192, 0.4)',
    flex: 1,
    fontSize: 14,
    height: 24,
    marginVertical: 18,
    textAlign: "center",
    width: 200,
  },
});

module.exports = TalkScreen;