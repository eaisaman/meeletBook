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

var rowIds = [["profilePhoto", "name", "id", "QRCode", "gender", "region", "signature"]];
var dataBlob = {};
var sectionIds = ["*"];
for (let sectionId of sectionIds) {
  dataBlob[sectionId] = sectionId;
}

var ProfileInfoDetailScreen = React.createClass({
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
        case "profilePhoto":
          return (
            <TouchableOpacity style={[styles.row,]}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>头像</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "name":
          return (
          <TouchableOpacity style={[styles.row,]}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>昵称</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "id":
          return (
          <TouchableOpacity style={[styles.row,]}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>帐号</Text></View>
          </TouchableOpacity>
          );
        break;
        case "QRCode":
          return (
          <TouchableOpacity style={[styles.row,]}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>二维码</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "gender":
          return (
          <TouchableOpacity style={[styles.row,]}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>性别</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "region":
          return (
          <TouchableOpacity style={[styles.row,]}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>地区</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "signature":
          return (
          <TouchableOpacity style={[styles.row,]}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>个性签名</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
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
            initialListSize={10}
          ></ListView>
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
  },
});

module.exports = ProfileInfoDetailScreen;