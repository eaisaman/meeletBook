'use strict';

var React = require('react-native');
// var RCTActionSheetManager = require('NativeModules').ActionSheetManager;

var {
  AsyncStorage,
  Navigator,
  StyleSheet,
  ListView,
  Text,
  TouchableOpacity,
  View,
  SegmentedControlIOS
} = React;
var BUTTONS = [
    'Option 0',
    'Option 1',
    'Option 2',
    'Destruct',
    'Cancel',
];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

var loginedUser = null;

var ModifyNicknameScreen = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  changeNickname:function(event){
    loginedUser.name = event.nativeEvent.text;
  },
  render() {
    return (
      <View style={styles.subView}>
          <TextInput
            autoCapitalize="none"
            placeholder="请输入昵称"
            autoCorrect={false}
            defaultValue={loginedUser.name}
            onChange={this.changeNickname}
            style={styles.textInput}>
          </TextInput>
      </View>
    );
  }
});

var QRCodeScreen = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render() {
    return (
      <View style={styles.subView}>
      </View>
    );
  }
});

var GENDER_OPTIONS = {
  male: {
    name: '男'
  },
  female: {
    name: '女'
  }
};

var ModifyGenderScreen = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  changeGender:function(event){
    loginedUser.gender = event.nativeEvent.selectedSegmentIndex;
  },
  render() {
    return (
      <View style={styles.subView}>
        <SegmentedControlIOS values={['男', '女']} selectedIndex={loginedUser.gender}
          onChange={this.changeGender}/>
      </View>
    );
  }
});

var ModifyRegionScreen = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  changeRegion:function(event){
    loginedUser.region = event.nativeEvent.text;
  },
  render() {
    return (
      <View style={styles.subView}>
          <TextInput
            autoCapitalize="none"
            placeholder="请输入昵称"
            autoCorrect={false}
            defaultValue={loginedUser.region}
            onChange={this.changeRegion}
            style={styles.textInput}>
          </TextInput>
      </View>
    );
  }
});

var ModifySignatureScreen = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  changeSignature:function(event){
    loginedUser.signature = event.nativeEvent.text;
  },
  render() {
    return (
      <View style={styles.subView}>
          <TextInput
            autoCapitalize="none"
            placeholder="此人很懒..."
            autoCorrect={false}
            defaultValue={loginedUser.signature}
            onChange={this.changeSignature}
            style={[styles.textInput, {height: 100}]}>
          </TextInput>
      </View>
    );
  }
});

var rowIds = [["profilePhoto", "nickname", "id", "QRCode", "gender", "region", "signature"]];
var dataBlob = {};
var sectionIds = ["*"];
for (let sectionId of sectionIds) {
  dataBlob[sectionId] = sectionId;
}

var ProfileInfoDetailScreen = React.createClass({
  componentDidMount() {
    this._loadInitialState().done();
  },
  async _loadInitialState() {
    try {
      var value = await AsyncStorage.getItem(GLOBAL.LOGIN_USER_STORAGE_KEY);
      if (value !== null){
        var entity = JSON.parse(value);
        loginedUser = entity;
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
      loginedUser: {}
    };
  },

  showAction:function(){
    // alert('xxx');
    ActionSheetIOS.showActionSheetWithOptions({
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: DESTRUCTIVE_INDEX,
            }, (buttonIndex) => {
                this.setState({
                    clicked: BUTTONS[buttonIndex]
                });
            });

            // RCTActionSheetManager.showActionSheetWithOptions(
            //   options,
            //   callback
            // );
  },

  renderRow: function(rowData: string, sectionId: string, rowId: string): ReactElement {
    if (sectionId === "*") {
      switch(rowId) {
        case "profilePhoto":
          return (
            <TouchableOpacity style={[styles.row,]} onPress={() => {this.selectSubView('profilePhoto')}}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>头像</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "nickname":
          return (
          <TouchableOpacity style={[styles.row,]} onPress={() => {this.selectSubView('nickname')}}>
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
            <View style={styles.arrow}>
              <Text style={styles.btnLabel}>{this.state.loginedUser._id}</Text>
            </View>
          </TouchableOpacity>
          );
        break;
        case "QRCode":
          return (
          <TouchableOpacity style={[styles.row,]} onPress={() => {this.selectSubView('QRCode')}}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>二维码</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "gender":
          return (
          <TouchableOpacity style={[styles.row,]} onPress={() => {this.selectSubView('gender')}}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>性别</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "region":
          return (
          <TouchableOpacity style={[styles.row,]} onPress={() => {this.selectSubView('region')}}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>地区</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "signature":
          return (
          <TouchableOpacity style={[styles.row,]} onPress={() => {this.selectSubView('signature')}}>
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
  },
  selectSubView:function(id){
    let component = ModifyNicknameScreen;
    let subName = "";
    switch(id){
      case 'profilePhoto':
        subName = "头像设置";
        component = ModifyPhotoScreen;
        break;
      case 'nickname':
        subName = "昵称设置";
        component = ModifyNicknameScreen;
        break;
      case 'notify':
        subName = "新通知";
        component = NotificationScreen;
        break;
      case 'QRCode':
        subName = "二维码";
        component = QRCodeScreen;
        break;
      case 'gender':
        subName = "性别";
        component = ModifyGenderScreen;
        break;
      case 'region':
        subName = "地区设置";
        component = ModifyRegionScreen;
        break;
      case 'signature':
        subName = "个性签名";
        component = ModifySignatureScreen;
        break;
    }
    this.props.navigator.push({
      id: id,
      title:subName,
      component:component,
      passProps:{navigator: this.props.navigator},
      rightButtonTitle: 'Done',
      onRightButtonPress: () => this.saveLocalStorage(id)
    })
  },
  async saveLocalStorage: function(id) {
    this.setState({loginedUser: loginedUser});
    var jsonStr = JSON.stringify(loginedUser);
    AsyncStorage.setItem(GLOBAL.LOGIN_USER_STORAGE_KEY, jsonStr).then().catch().done();
    this.props.navigator.pop();
  },
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
  textInput:{
    height: 30,
    borderWidth: 0.5,
    borderColor: '#0f0f0f',
    fontSize: 13,
    padding: 4,
    margin: 10,
    backgroundColor: '#ffffff'
  },
  subView: {
    flex: 1,
    backgroundColor: '#dde1dc',
    marginTop: Navigator.NavigationBar.Styles.General.TotalNavHeight
  },
});

module.exports = ProfileInfoDetailScreen;
