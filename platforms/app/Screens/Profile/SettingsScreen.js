'use strict';

var React = require('react-native');

var {
  Navigator,
  StyleSheet,
  ListView,
  Text,
  TouchableOpacity,
  View
} = React;

var rowIds = [["security", "notification", "private", "common", "about", "logout"]];
var dataBlob = {};
var sectionIds = ["*"];
for (let sectionId of sectionIds) {
  dataBlob[sectionId] = sectionId;
}

var SettingsScreen = React.createClass({
  getInitialState: function() {
    var dataSource = new ListView.DataSource({
      getRowData: (dataBlob, sectionId, rowId) => rowId,
      getSectionHeaderData: (dataBlob, sectionId) => sectionId,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    return {
      dataSource: dataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
      clicked: 'none'
    };
  },
  renderRow: function(rowData: string, sectionId: string, rowId: string): ReactElement {
    if (sectionId === "*") {
      switch(rowId) {
        case "security":
          return (
            <TouchableOpacity style={[styles.row,]}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>帐号与安全</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "notification":
          return (
          <TouchableOpacity style={[styles.row,]}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>消息&通知</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "private":
          return (
          <TouchableOpacity style={[styles.row,]}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>隐私</Text></View>
          </TouchableOpacity>
          );
        break;
        case "common":
          return (
          <TouchableOpacity style={[styles.row,]}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>通用</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "about":
          return (
          <TouchableOpacity style={[styles.row,]}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>关于我们</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "logout":
          return (
          <TouchableOpacity style={[styles.row]}>
            <View><Text>退出</Text></View>
          </TouchableOpacity>
          );
        break;
      }
    }

    return rowData && (<Thumb text={rowData.name}/>) || null;
  },
  renderSectionHeader: function(sectionData: string, sectionId: string) {
    return null;
  },
  render: function() {
    return (
      <View style={styles.screen}>
        <ListView
            style={styles.listview}
            dataSource={this.state.dataSource}
            renderSectionHeader={this.renderSectionHeader}
            renderRow={this.renderRow}
            initialListSize={10}></ListView>
        </View>
    );
  }
});

var styles = StyleSheet.create({
  screen: {
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

module.exports = SettingsScreen;