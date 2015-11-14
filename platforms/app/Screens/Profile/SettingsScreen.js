'use strict';

var React = require('react-native');

var {
  AsyncStorage,
  Navigator,
  StyleSheet,
  ListView,
  Text,
  TouchableOpacity,
  View,
  SwitchIOS,
  TextInput
} = React;

var loginedUser = null;

var ModifyPasswordScreen = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  changePassword:function(event){
    loginedUser.password = event.nativeEvent.text;
  },
  render() {
    return (
      <View style={styles.subView}>
          <TextInput
            autoCapitalize="none"
            placeholder="请输入原始密码"
            autoCorrect={false}
            password={true}
            style={styles.textInput}>
          </TextInput>
          <TextInput
            autoCapitalize="none"
            placeholder="请输入新密码"
            autoCorrect={false}
            password={true}
            onChange={this.changePassword}
            style={styles.textInput}>
          </TextInput>
          <TextInput
            autoCapitalize="none"
            placeholder="请确认新密码"
            autoCorrect={false}
            password={true}
            style={styles.textInput}>
          </TextInput>
      </View>
    );
  }
});

var NotificationScreen = React.createClass({
  getInitialState: function() {
    if(loginedUser.notify == null){
      loginedUser.notify = {
        sound: true,
        vibrate: true
      }
    }
    return {
      notify: loginedUser.notify
    };
  },
  changeSound:function(value){
    loginedUser.notify.sound = value;
    this.setState({notify: loginedUser.notify});
  },
  changeVibrate:function(value){
    loginedUser.notify.vibrate = value;
    this.setState({notify: loginedUser.notify});
  },
  render() {
    return (
      <View style={styles.subView}>
          <View style={styles.switchRow}>
            <Text style={[styles.btnLabel, {marginLeft: 10}]}>声音</Text>
            <SwitchIOS
              onValueChange={this.changeSound}
              style={[styles.arrow, {margin: 10}]}
              value={this.state.notify.sound} />
          </View>
          <View style={styles.switchRow}>
            <Text style={[styles.btnLabel, {marginLeft: 10}]}>振动</Text>
            <SwitchIOS
              onValueChange={this.changeVibrate}
              style={[styles.arrow, {margin: 10}]}
              value={this.state.notify.vibrate} />
          </View>
      </View>
    );
  }
});

var PrivacyScreen = React.createClass({
  getInitialState: function() {
    if(loginedUser.privacy == null){
      loginedUser.privacy = {
        friendConfirmation: true,
        changeFindMeById: true
      }
    }
    return {
      privacy: loginedUser.privacy
    };
  },
  changeFriendConfirmation:function(value){
    loginedUser.privacy.friendConfirmation = value;
    this.setState({privacy: loginedUser.privacy});
  },
  changeFindMeById:function(value){
    loginedUser.privacy.findMeById = value;
    this.setState({privacy: loginedUser.privacy});
  },
  render() {
    return (
      <View style={styles.subView}>
          <View style={styles.switchRow}>
            <Text style={[styles.btnLabel, {marginLeft: 10}]}>加我为好友时需要验证</Text>
            <SwitchIOS
              onValueChange={this.changeFriendConfirmation}
              style={[styles.arrow, {margin: 10}]}
              value={this.state.privacy.friendConfirmation} />
          </View>
          <View style={styles.switchRow}>
            <Text style={[styles.btnLabel, {marginLeft: 10}]}>可以通过帐号查找到我</Text>
            <SwitchIOS
              onValueChange={this.changeFindMeById}
              style={[styles.arrow, {margin: 10}]}
              value={this.state.privacy.findMeById} />
          </View>
      </View>
    );
  }
});

var CommonScreen = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render() {
    return (
      <View style={styles.subView}>
          <TextInput
            autoCapitalize="none"
            placeholder="请输入原始密码"
            autoCorrect={false}
            password={true}
            autoFocus={true}
            style={styles.textInput}>
          </TextInput>
          <TextInput
            autoCapitalize="none"
            placeholder="请输入新密码"
            autoCorrect={false}
            password={true}
            onChange={(event) => newPassword = event.nativeEvent.text}
            style={styles.textInput}>
          </TextInput>
          <TextInput
            autoCapitalize="none"
            placeholder="请确认新密码"
            autoCorrect={false}
            password={true}
            style={styles.textInput}>
          </TextInput>
      </View>
    );
  }
});

var AboutScreen = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render() {
    return (
      <View style={styles.subView}>
          <Text style={{flex: 1, magin: 10, backgroundColor: '#ffffff'}}>关于我们</Text>
      </View>
    );
  }
});

// var rowIds = [["security", "notification", "privacy", "common", "about", "logout"]];
var rowIds = [["security", "notification", "privacy", "about", "logout"]];
var dataBlob = {};
var sectionIds = ["*"];
for (let sectionId of sectionIds) {
  dataBlob[sectionId] = sectionId;
}

var SettingsScreen = React.createClass({
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
      loginedUser: null
    };
  },
  renderRow: function(rowData: string, sectionId: string, rowId: string): ReactElement {
    if (sectionId === "*") {
      switch(rowId) {
        case "security":
          return (
            <TouchableOpacity style={[styles.row,]} onPress={() => {this.selectSubView('modifyPassword')}}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>帐号与安全</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "notification":
          return (
          <TouchableOpacity style={[styles.row,]} onPress={() => {this.selectSubView('notify')}}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>消息&通知</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "privacy":
          return (
          <TouchableOpacity style={[styles.row,]} onPress={() => {this.selectSubView('private')}}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>隐私</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "common":
          return (
          <TouchableOpacity style={[styles.row,]} onPress={() => {this.selectSubView('common')}}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>通用</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "about":
          return (
          <TouchableOpacity style={[styles.row,]} onPress={() => {this.selectSubView('about')}}>
            <View style={styles.btnRow}><Icon name='photo-album' size={40} color='#2ecc71' style={styles.btn}/><Text style={styles.btnLabel}>关于我们</Text></View>
            <View style={styles.arrow}>
              <Icon name='keyboard-arrow-right' size={40} color='#2ecc71'/>
            </View>
          </TouchableOpacity>
          );
        break;
        case "logout":
          return (
          <TouchableOpacity style={[styles.row]} onPress={this.logout}>
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
  },
  selectSubView:function(id){
    let component = ModifyPasswordScreen;
    let subName = "";
    switch(id){
      case 'modifyPassword':
        subName = "修改密码";
        component = ModifyPasswordScreen;
        break;
      case 'notify':
        subName = "消息通知";
        component = NotificationScreen;
        break;
      case 'private':
        subName = "隐私";
        component = PrivacyScreen;
        break;
      case 'common':
        subName = "通用";
        component = CommonScreen;
        break;
      case 'about':
        subName = "关于我们";
        component = AboutScreen;
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
  async logout: function(id) {
    this.setState({loginedUser: null});
    AsyncStorage.removeItem(GLOBAL.LOGIN_USER_STORAGE_KEY);
    this.props.navigator.pop();
  }
});

var styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#dde1dc'
  },
  subView: {
    flex: 1,
    backgroundColor: '#dde1dc',
    marginTop: Navigator.NavigationBar.Styles.General.TotalNavHeight
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 10
  },
  btn: {
    width: 40,
    height: 40,
  },
  btnLabel: {
    fontSize: 16,
  },
  logoutBtn: {
    flex: 1,
    margin: 10
  }
});

module.exports = SettingsScreen;