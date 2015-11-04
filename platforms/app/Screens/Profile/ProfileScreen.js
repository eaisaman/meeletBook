'use strict';

var _ = require('lodash')
var React = require('react-native');
var BlurView = require('react-native-blur').BlurView;
var TForm = require('tcomb-form-native');

var Form = TForm.form.Form;

var {
  AsyncStorage,
  AlertIOS,
  Image,
  LayoutAnimation,
  ListView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Navigator
} = React;

var loginUser = {
      "_id" : "52591a12c763d5e4585563b4",
      "name" : "毕嘉利",
      "loginName" : "bijiali14"
    };
var Account = TForm.struct({loginName:TForm.Str, password:TForm.Str}, "Account");
var AccountOptions = {
  fields: {
    loginName: {
      label: '用户名'
    },
    password: {
      label: '密码',
      password: true,
      secureTextEntry: true,
    },
  },
  stylesheet: _.cloneDeep(Form.stylesheet)
};

_.extend(_.property("textbox.normal")(AccountOptions.stylesheet), {
  width: 300,
  backgroundColor: "white",
  borderColor: "#2ecc71",
});

var STORAGE_KEY = "loginedUser";
var dataBlob = {};
var sectionIds = ["*"];
var rowIds = [["btn_album", "btn_collection", "btn_settings"]];
for (let sectionId of sectionIds) dataBlob[sectionId] = sectionId;

var ProfileScreen = React.createClass({
  //获取localstorage中的登录信息
  componentDidMount() {
    this._loadInitialState().done();
  },

  async _loadInitialState() {
    try {
      var value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null){
        var entity = JSON.parse(value);
        this.setState({loginedUser: entity});
      }
    } catch (error) {
      this._appendMessage('AsyncStorage error: ' + error.message);
    }
  },

  getInitialState: function() {
    var dataSource = new ListView.DataSource({
      getRowData: (dataBlob, sectionId, rowId) => rowId,
      getSectionHeaderData: (dataBlob, sectionId) => sectionId,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    return {
      dataSource: dataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
      isModalOpen: false,
      loginedUser: {},
      isTmp: false
    };
  },

  renderRow: function(rowData: string, sectionId: string, rowId: string): ReactElement {
    if (sectionId === "*") {
      switch(rowId) {
        case "btn_album":
          return (
          <TouchableOpacity style={[styles.row,]} onPress={this.routePhotoAlbum}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>相册</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "btn_collection":
          return (
          <TouchableOpacity style={[styles.row,]} onPress={this.routeFavorites}>
            <View style={styles.btnRow}><Icon name='folder-special' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>收藏</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "btn_settings":
          return (
          <TouchableOpacity style={[styles.row,]} onPress={this.routeSettings}>
            <View style={styles.btnRow}><Icon name='settings' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>设置</Text></View>
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

  renderHeader: function() {
    return (
      <TouchableOpacity style={[styles.header,]} onPress={this.openModal}>
        <Icon name='account-circle' size={60} color='#2ecc71' style={styles.avatar}/>
        <View style={styles.nameList}>
          <Text style={styles.userName}>{this.state.loginedUser.name}</Text>
          <Text style={styles.userName}>帐号: {this.state.loginedUser.loginName}</Text>
        </View>
        <View style={styles.arrow}>
          <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
        </View>
      </TouchableOpacity>
    );
  },

  openModal() {
    if(this.state.loginedUser.loginName == null)
      this.setState({isModalOpen: true});
    else
      this.routeProfileDetail("detail");
  },

  closeModal() {
    this.setState({isModalOpen: false});
  },

  async login() {
    this.setState({loginedUser: loginUser});
    var jsonStr = JSON.stringify(loginUser)

    await AsyncStorage.setItem(STORAGE_KEY, jsonStr);
    this.closeModal();
  },

  routeProfileDetail: function(title) {
    this.props.mainScreen.showNavBar();

    this.props.navigator.push({id:"profileInfoDetail", title:title});
  },

  routePhotoAlbum: function(){
    this.props.mainScreen.showNavBar();

    this.props.navigator.push({id:"photoAlbum", title:"相册"});
  },

  routeFavorites: function(){
    this.props.mainScreen.showNavBar();

    this.props.navigator.push({id:"favorites", title:"收藏"});
  },

  routeSettings: function(){
    this.props.mainScreen.showNavBar();

    this.props.navigator.push({id:"settings", title:"设置"});
  },

  render: function() {
      return (
        <View style={styles.screen}>
          <ListView
            style={styles.listview}
            dataSource={this.state.dataSource}
            renderHeader={this.renderHeader}
            renderSectionHeader={this.renderSectionHeader}
            renderRow={this.renderRow}
            initialListSize={10}
          />

          <Modal animated={true} transparent={true} visible={this.state.isModalOpen}>
            <BlurView style={styles.modalBackground} blurType="light">
              <View style={styles.modalContent}>
                <Icon name='wb-incandescent' size={80} color='#2ecc71' style={styles.modalItem}/>
                <View style={[styles.modalItem, styles.formContainer, ]}>
                  <Form ref="accountForm" type={Account} options={AccountOptions} style={styles.accountForm}/>
                </View>
                <TouchableHighlight style={[styles.button, styles.modalItem, ]} onPress={this.login} underlayColor='#27ae60'>
                  <Text style={styles.buttonText}>登录</Text>
                </TouchableHighlight>
                <TouchableHighlight style={[styles.button, styles.modalItem, ]} onPress={this.closeModal} underlayColor='#27ae60'>
                  <Text style={styles.buttonText}>取消</Text>
                </TouchableHighlight>
              </View>
            </BlurView>
          </Modal>
        </View>
      );
    }
})

var styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#dde1dc',
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
  modalBackground: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalItem: {
    flex: 1,
    marginBottom: 10,
    alignSelf: 'center',
  },
  formContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountForm: {
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
    justifyContent: 'center'
  },
});

module.exports = ProfileScreen;