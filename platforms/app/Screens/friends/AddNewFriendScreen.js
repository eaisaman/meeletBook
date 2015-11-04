'use strict';

var now = new Date();
let list = [
  {
  "_id" : "52591a12c763d5e45855639a",
    "name" : "陈昌申",
    "desc" : "通过xx查找加入",
    "status": "accept",
    "img_url":'book-1.png'
  },
  {
  "_id" : "52591a12c763d5r45855639a",
  "name" : "张三",
  "desc" : "我是xxxx",
  "status": "request",
  "img_url":'book-1.png'
  },

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
} = React;

var Thumb = React.createClass({
  getInitialState: function() {
    return {
      btnValue:'accept'
    };
    // return {};
  },
  componentDidMount: function () {
    // if(this.props.data.status !== 'accept'){
    //   this.state.opacity = 0;
    // }
    this.state.btnValue = this.props.data.status;
  },
  onAccept: function(){
    // alert('zzzz');
    // this.state.btnValue = 'accept';
    // alert(this.state.btnValue );
  },
  render: function() {
    var TouchableElement = TouchableHighlight;
    return (
      <TouchableHighlight underlayColor='#dddddd'
        onPress={()=> {
            this.props.selectSubView(this.props.data.name);
        }}>
				<View>
					<View style={styles.rowContainer}>
						<Image style={styles.thumb} source={{ uri: this.props.data.img_url }} />
						<View style={styles.textContainer}>
							<Text style={styles.name}>{this.props.data.name}</Text>
							<Text style={styles.title} numberOfLines={1}>{this.props.data.desc}</Text>
						</View>
            <View style={[styles.rowVertical]}>
              {
                this.props.data.status === 'accept' ?
                  <Text style={styles.status} >已接受</Text> :
                  <TouchableElement
                    style={styles.btnWarp}
                    onPress={()=>this.onAccept()}>
                      <Text style={styles.btn}>未接受</Text>
                  </TouchableElement>
              }
            </View>
					</View>
					<View style={styles.separator} />
				</View>
			</TouchableHighlight>
    );
  }
  // render: function() {
  //   return (
  //     <TouchableOpacity
  //       onPress={this.props.onPress}
  //       style={[styles.friendRow,]}>
  //       <Text style={styles.thumbText}>{this.props.text}</Text>
  //     </TouchableOpacity>
  //   );
  // }
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
    };
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

  routeTalk: function(title) {
    // this.props.mainScreen.showNavBar();
    //
    // this.props.navigator.push({id:"talk", title:title});
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

    return rowData && (<Thumb data={rowData} selectSubView={this.selectSubView}/>) || null;
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
        renderHeader={this.renderHeader}
        // renderSectionHeader={this.renderSectionHeader}
        renderRow={this.renderRow}
        initialListSize={10}
        pageSize={PAGE_SIZE}
        scrollRenderAheadDistance={2000}
      />
    );
  },

  selectSubView:function(title){
    this.props.navigator.push({
      title:title,
      component:FriendUserScreen,
      passProps:{navigator: this.props.navigator}
    })
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
    marginTop: Navigator.NavigationBar.Styles.General.TotalNavHeight,
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
//   header: {
//     height: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#dde1dc',
//     flexDirection: 'row',
//   },
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
