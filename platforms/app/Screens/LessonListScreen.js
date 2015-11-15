'use strict';

var React = require('react-native');
var {
  AlertIOS,
  Animated,
  Dimensions,
  Image,
  ListView,
  Navigator,
  ProgressViewIOS,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
  NativeAppEventEmitter,
  } = React;

var _ = require('lodash');
var Icon = require('react-native-vector-icons/MaterialIcons');
var LinearGradient = require('react-native-linear-gradient');
var SideMenu = require('react-native-side-menu');
var TimerMixin = require('react-timer-mixin');

var Dimensions = require('Dimensions');
var window = Dimensions.get('window');

var downloadModeIcons = {
  'waitDownload':'cloud-download',
  'waitRefresh':'cloud-done',
  'inProgress':'cloud-download',
}

var startTime = new Date();
var endTime = startTime.addMinutes(45);
// let list = [
//     {
//       "_id" : "52591a12c763d5e45855639a",
//       "projectId": "56104bec2ac815961944b8bf",
//       "projectName": "创建幸福教室的35个秘密",
//       "creator" : "陈昌申",
//       "title": "马当路小学三年级一班公开课",
//       "mode": 1,
//       "startTime": startTime.toString("yyyy年MM月dd日tthh:mm").replace("AM", "上午").replace("PM", "下午"),
//       "endTime": endTime.toString("yyyy年MM月dd日tthh:mm").replace("AM", "上午").replace("PM", "下午"),
//     }
// ];
let list = AppContext.joinItems;

var PAGE_SIZE = 4;

var LessonListScreen = React.createClass({
  getInitialState: function() {
    return {
      fadeAnim: new Animated.Value(0), // opacity 0
      touchToClose: false,
      isModalOpen: true,
    };
  },



  render: function() {
    return (
        <SideMenu
          menuPosition="right"
          openMenuOffset={200}
          menu={
            <View style={styles.menuContainer}>
              <TouchableOpacity style={[styles.menuRow, ]}>
                <View style={styles.menuIconPlaceholder}>
                  <Icon name="history" size={24} style={[styles.menuIcon, ]}/>
                </View>
                <Text style={styles.menuText}>历史</Text>
              </TouchableOpacity>
              <LinearGradient colors={["#ecf0f1", "#ccc"]} start={[0,0.5]} end={[1, 0.5]} locations={[0.5, 0.75]} style={styles.rowLinearGradient} />
              <TouchableOpacity style={[styles.menuRow, ]}>
                <View style={styles.menuIconPlaceholder}>
                  <Icon name="add-alarm" size={24} style={[styles.menuIcon, ]}/>
                </View>
                <Text style={styles.menuText}>将要开始</Text>
              </TouchableOpacity>
              <LinearGradient colors={["#ecf0f1", "#ccc"]} start={[0,0.5]} end={[1, 0.5]} locations={[0.5, 0.75]} style={styles.rowLinearGradient} />
              <TouchableOpacity style={[styles.menuRow, ]}>
                <View style={styles.menuIconPlaceholder}>
                  <Icon name="av-timer" size={24} style={[styles.menuIcon, ]}/>
                </View>
                <Text style={styles.menuText}>正在进行</Text>
              </TouchableOpacity>
              <LinearGradient colors={["#ecf0f1", "#ccc"]} start={[0,0.5]} end={[1, 0.5]} locations={[0.5, 0.75]} style={styles.rowLinearGradient} />
            </View>
          }
          touchToClose={this.state.touchToClose}
          onChange={this.handleChange}>
          <View style={styles.screen}>
            <Animated.View style={[styles.topContainer, {opacity: this.state.fadeAnim}]}>
              <View style={[styles.searchContainer, ]}>
                <Icon name="search" size={24} style={[styles.navButtonIcon, ]}/>
                <TextInput
                  autoCapitalize="none"
                  placeholder="搜索"
                  autoCorrect={false}
                  returnKeyType="search"
                  onSubmitEditing={(event) => this.updateSearchInput(event.nativeEvent.text) }
                  style={styles.searchInput}
                />
                <TouchableOpacity
                  onPress={this.hideSearchInput}
                  style={styles.normalButton}>
                  <Text style={styles.buttonText}>取消</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
          <LessonListView ref="listView" style={styles.listContainer} />
        </SideMenu>
    );
  },

  fadeInSearchInput: function() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 500,
      },
    ).start();
  },

  hideSearchInput: function() {
    this.setState({fadeAnim: new Animated.Value(0)});
    this.props.mainScreen.hideSearchInput();
  },

  updateSearchInput: function() {},

  handleChange: function() {
      this.setState({
        touchToClose: false,
      });
  },

  showSideMenu: function() {
    this.refs.listView.context.menuActions.open();
    this.setState({
      touchToClose: true,
    });
  },

  closeModal() {
    this.setState({isModalOpen: false});
  }

})

var LessonListView = React.createClass({
  contextTypes: {
    menuActions: React.PropTypes.object.isRequired,
  },

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

  componentWillMount: function() {
    var self = this;

    NativeAppEventEmitter.addListener(AppEvents.getJoinItemsEvent, ({result}) => {
        list = result;

        var dataSource = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1._id !== row2._id,
        });

        self.setState({
          dataSource: dataSource.cloneWithRows(list),
        });
    });
  },

  //Project Item mode: 1.Wait Download; 2.Wait Refresh; 3. Download or Refresh in Progress
  checkDownloadMode: function(lessonList) {
    return new Promise((resolve, reject) => {
      LocalAppAPI.checkDownloadMode(_.pluck(lessonList, "projectId"), function(result) {
        if (result && result.length === lessonList.length) {
          lessonList.forEach(function(lesson, i) {
            lesson.mode = result[i].mode;
            lesson.downloadProgress = result[i].progress;
          });
        }
        resolve();
      });
    });
  },

  downloadBook: function({projectId}) {
    return new Promise((resolve, reject) => {
      LocalAppAPI.downloadProject(projectId, () => {
        resolve();
      });
    });
  },

  routeLesson: function(lesson) {
    return this.checkDownloadMode([lesson]).then(() => {
      switch (lesson.mode) {
        case "waitDownload":
        case "inProgress":
          return this.downloadBook(lesson);
        case "waitRefresh":
          return new Promise((resolve, reject) => {
            LocalAppAPI.openLesson(lesson._id,  lesson.projectId, () => {
              resolve();
            }, (error) => {
              AlertIOS.alert("error", error);
            });
          });
      }
      return new Promise((resolve, reject) => {
        reject(new Error("Unrecognizable download mode value " + lesson.mode));
      });
    });
  },

  renderRow: function(rowData: string, sectionId: string, rowId: string): ReactElement {
    return rowData && (<LessonItemView data={rowData} onPress={() => { this.routeLesson(rowData); }}/>) || null;
  },

  render: function() {
    return (
      <View style={styles.listHolder}>
        <Image style={styles.backgroundImage} source={require('image!lessonBackground')}></Image>
        <ListView
          contentContainerStyle={styles.list}
          style={styles.listview}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          initialListSize={10}
          pageSize={PAGE_SIZE}
          scrollRenderAheadDistance={2000}
        />
      </View>
    );
  },
});

var LessonItemView = React.createClass({
  getInitialState: function() {
    return {
      progress:0,
      isDownload:false
    };
  },
  componentWillMount: function() {
      NativeAppEventEmitter.addListener(AppEvents.downloadProjectProgressEvent, (eventObj) => {
        if (this.props.data.projectId === eventObj.projectId){
          this.setState({ isDownload : true, progress : eventObj.progress/100 });
        }
      });
  },

  _renderProgress:function(){
    if(this.state.isDownload){
      return (
        <View style={styles.progressViewContainer}>
          <ProgressViewIOS style={styles.progressView} progress={this.state.progress}/>
        </View>
      );
    }
  },

  render: function() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        underlayColor='rgba(192, 192, 192, 0.4)'>
        <View style={styles.contentRow}>
          <Icon name={downloadModeIcons[this.props.data.mode]} size={36} style={[styles.downloadLessonIcon, ]}/>
          <View style={[styles.lessonTitle, ]}>
            <Text numberOfLines={2} style={[styles.titleText]}>{this.props.data.title}</Text>
          </View>
          <LocalImage style={[styles.lessonImageContainer, ]} imgStyle={styles.lessonImg} source={this.props.data.thumbnail} alt={require('image!default-lesson')}/>
          <View style={[styles.lessonTextContainer, ]}>
            <Text style={styles.lessonTextDesc}>书名</Text>
            <Text numberOfLines={1} style={[styles.lessonText, ]}>{this.props.data.projectName}</Text>
          </View>
          <View style={[styles.lessonTextContainer, ]}>
            <Text style={styles.lessonTextDesc}>{this.props.data.joinType=='invitation'?'邀请人':'创建人'}</Text>
            <Text numberOfLines={1} style={[styles.lessonText, ]}>{this.props.data.userName}</Text>
          </View>
          {this._renderProgress()}
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  screen: {
    left: 0,
    right: 0,
    height: Navigator.NavigationBar.Styles.General.TotalNavHeight,
    backgroundColor: '#dde1dc',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  menuContainer: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: 'rgba(80, 80, 80, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    flexDirection: 'column',
    paddingTop: Navigator.NavigationBar.Styles.General.TotalNavHeight,
  },
  topContainer: {
    flex: 1,
    height: Navigator.NavigationBar.Styles.General.TotalNavHeight,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchContainer: {
    flex: 1,
    marginTop: Navigator.NavigationBar.Styles.General.TotalNavHeight - Navigator.NavigationBar.Styles.General.NavBarHeight,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  navButtonIcon: {
    alignSelf: 'center',
    color: "#2ecc71",
    width: 24,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    alignSelf: "center",
    color: "white",
    backgroundColor: 'transparent',
    borderRadius: 3,
    marginLeft: 10,
    height: 24,
    fontSize: 18,
    textAlign: "left",
  },
  normalButton: {
    width: 120,
    height: Navigator.NavigationBar.Styles.General.NavBarHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  buttonText: {
    flex: 1,
    fontSize: 18,
    color: '#2ecc71',
    textAlign: 'right',
    marginRight: 10,
  },
  menuRow: {
    width: 180,
    height: Navigator.NavigationBar.Styles.General.NavBarHeight,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  rowLinearGradient: {
    marginVertical: 2,
    width: 180,
    height: 1,
  },
  menuText: {
    flex: 1,
    fontSize: 18,
    color: 'white',
    textAlign: 'left',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  menuIconPlaceholder: {
    width: 24,
    height: Navigator.NavigationBar.Styles.General.NavBarHeight,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: "transparent",
  },
  menuIcon: {
    flex: 1,
    alignSelf: 'center',
    color: "white",
  },
  listContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: Navigator.NavigationBar.Styles.General.TotalNavHeight,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  listHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  backgroundImage: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  listview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  list: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  contentRow: {
    margin: 10,
    width: 300,
    height: 360,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    shadowRadius: 2,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {height: 5},
  },
  downloadLessonIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 36,
    height: 36,
    color: '#dde1dc',
  },
  lessonTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    width: 200,
    textAlign: 'center',
  },
  lessonContent: {
    flex: 1,
  },
  lessonImageContainer: {
    flex: 1,
  },
  lessonImg: {
    width: 240,
    height: 180,
  },
  lessonTextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  lessonTextDesc: {
    width: 60,
    marginRight: 10,
    fontSize: 18,
    lineHeight: 24,
    textAlign: "left",
  },
  lessonText: {
    width: 180,
    fontSize: 18,
    lineHeight: 24,
  },
  progressView: {
    height:20,
    flex:1,
  },
  progressViewContainer:{
    position: "absolute",
    left:10,
    right:10,
    bottom:5,
    height:5
  }
});

module.exports = LessonListScreen;
