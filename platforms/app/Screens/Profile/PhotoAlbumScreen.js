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

let list = [ 
    {
    "_id" : "52591a12c763d5e45855639a",
      "name" : "book-1"
    },
    {
      "_id" : "52591a12c763d5e45855639c",
      "name" : "book-2"
    },
    {
      "_id" : "52591a12c763d5e45855639e",
      "name" : "book-3"
    },
    {
      "_id" : "52591a12c763d5e4585563a0",
      "name" : "book-1"
    },
    {
      "_id" : "52591a12c763d5e4585563a2",
      "name" : "book-2"
    },
    {
      "_id" : "52591a12c763d5e4585563a4",
      "name" : "book-3"
    },
    {
      "_id" : "52591a12c763d5e4585563a6",
      "name" : "book-1"
    },
    {
      "_id" : "52591a12c763d5e4585563a8",
      "name" : "book-2"
    },
    {
      "_id" : "52591a12c763d5e4585563aa",
      "name" : "book-3"
    },
    {
      "_id" : "52591a12c763d5e4585563ac",
      "name" : "book-1"
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
        <LocalImage source={this.props.data.name + ".png"}/>
      </TouchableOpacity>
    );
  }
});

var PhotoAlbumScreen = React.createClass({
  getInitialState: function() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1._id !== row2._id,
    });

    return {
      dataSource: dataSource.cloneWithRows(list),
    };
  },
  renderRow: function(rowData: string, sectionId: string, rowId: string): ReactElement {
    return rowData && (<Thumb data={rowData} onPress={() => { }}/>) || null;
  },

  render() {
    return (
      <ListView
        contentContainerStyle={styles.list}
        style={[styles.screen, styles.listview]}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        initialListSize={10}
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
  list:{
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap'
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
  contentRow: {
    justifyContent: 'center',
    padding: 5,
    margin: 3,
    width: 100,
    height: 100,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#CCC'
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

module.exports = PhotoAlbumScreen;