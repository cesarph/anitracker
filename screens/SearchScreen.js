import React from 'react';
import { ScrollView, StyleSheet, TextInput, View, StatusBar, Text, Image, TouchableOpacity, SectionList } from 'react-native';
import { Icon } from 'expo';
import { colors } from '../constants/Colors';
import { SEARCH_MEDIA_QUERY } from './DiscoverScreen'
import { FlatList } from 'react-native-gesture-handler/GestureHandler';
import { Query } from 'react-apollo'
import { USER_LISTS_QUERY } from './CurrentListScreen'
import { withUserContext } from '../context/user-context';



import Media from '../components/Media'

class SearchScreen extends React.Component {
  static navigationOptions = {
    // title: `${navigation.getParam('type')}'s search`,
    header: null
  };


  typingTimeout = null;

  state = {
    searchString: this.props.navigation.state.params.searchString
  }

  _updateStoreAfterStatusChange = (store, newData, mediaId) => {
    const {media, ...mediaListEntry} = newData.SaveMediaListEntry;
    // console.log({media})
    const data = store.readQuery({ query: SEARCH_MEDIA_QUERY, variables: {
      "search": this.state.searchString,
      "type": media.type,
      "perPage": 4,
    } });
    const data2 = store.readQuery({ query: USER_LISTS_QUERY, variables: {
      "userId": this.props.userProvider.user.id,
      "type": media.type,
      "status": 'CURRENT',
      "perPage": 40
    } });

    // console.log({mediaId});
    const mediaClicked = data.Page.media.find(media => media.id === mediaId)
    data2.Page.mediaList = [ newData.SaveMediaListEntry, ...data2.Page.mediaList  ];
    
    mediaClicked.mediaListEntry = mediaListEntry;
    // console.log({mediaClicked, type:media.type})

    store.writeQuery({ query: SEARCH_MEDIA_QUERY, variables: {
      "search": this.state.searchString,
      "type": media.type,
      "perPage": 4,
    }, data })

    store.writeQuery({ query: USER_LISTS_QUERY, variables: {
      "userId": this.props.userProvider.user.id,
      "type": media.type,
      "status": 'CURRENT',
      "perPage": 40
    }, data: data2 })
    // const animeClick = result.
    
  }

  _updateStoreAfterDelete = (store, deleted, mediaId, type) => {
    
    const data = store.readQuery({ query: SEARCH_MEDIA_QUERY, variables: {
      "search": this.state.searchString,
      "type": type,
      "perPage": 20,
    } });
    const data2 = store.readQuery({ query: USER_LISTS_QUERY, variables: {
      "userId": this.props.userProvider.user.id,
      "type": type,
      "status": 'CURRENT',
      "perPage": 40
    } });

    // console.log({d: data2.Page.mediaList.filter(media => media.id !== mediaId)})
    const mediaClicked = data.Page.media.find(media => media.id === mediaId)
    data2.Page.mediaList = data2.Page.mediaList.filter(mediaList => mediaList.media.id !== mediaId)
    mediaClicked.mediaListEntry = null;


    store.writeQuery({ query: SEARCH_MEDIA_QUERY, variables: {
      "search": this.state.searchString,
      "type": type,
      "perPage": 20,
    }, data })

    store.writeQuery({ query: USER_LISTS_QUERY, variables: {
      "userId": this.props.userProvider.user.id,
      "type": type,
      "status": 'CURRENT',
      "perPage": 40
    }, data: data2 });

    
  }


  searchMedia = (searchString) => {
    clearTimeout(this.typingTimeout);
    // this.typingTimeout = setTimeout(() => this.setState({searchString}), 1200)
    this.setState({searchString})
  }

  renderSeparator = () => {
    return (
      <View
        style={styles.separator}
      />
    );
  };

  clear = () => {
    // console.log('clear')
    clearTimeout(this.typingTimeout);
    this.setState({searchString: ''})
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <>
        <ScrollView contentContainerStyle={styles.container} >
          <View style={styles.searchSection}>
            <Icon.Ionicons style={styles.goBack} onPress={this.goBack} name="md-arrow-back" size={30}/> 
            <Text style={styles.type}>
              <Icon.Ionicons style={styles.searchIcon} name="md-search" size={14}/> 
              {' '}{this.props.navigation.state.params.type}
            </Text>
            {/* <TouchableOpacity style={styles.typeAlt} onPress={this.goBack} >
              <Icon.Ionicons style={styles.goBack} name="md-arrow-back" size={30}/>
              <Text style={styles.typeText}>
                {this.props.navigation.state.params.type}
              </Text>
            </TouchableOpacity> */}
            <TextInput
                style={styles.input}
                placeholder="Search for an Anime or Manga"
                onChangeText={this.searchMedia}
                value={this.state.searchString}
                underlineColorAndroid="transparent"
            />
            { this.state.searchString.length > 0 && 
              <TouchableOpacity onPress={this.clear}>
                <Icon.Ionicons 
                  style={styles.searchIcon} 
                  name="md-close" 
                  size={20} 
                  
                />
              </TouchableOpacity>
               }
          </View>
          <View style={styles.resultSection}>

            { this.state.searchString.length > 3 && <Query 
                query={SEARCH_MEDIA_QUERY}
                variables={{ 
                  "search": this.state.searchString,
                  "type": this.props.navigation.state.params.type.toUpperCase(),
                  "perPage": 20,
                }}
              >
                {
                  ({data, error, loading}) => {
                    if (loading) return <Text>Fetching</Text>
                    if (error) {
                      console.log(error)
                      return <Text>Error: {error.message} </Text>
                    }


                    return (
                      
                      <FlatList
                        renderItem={({item}) => <Media 
                              {...item}
                              updateStoreAfterStatusChange={this._updateStoreAfterStatusChange} 
                              updateStoreAfterDelete={this._updateStoreAfterDelete}
                            />}
                        data={data.Page.media}
                        initialNumToRender={10}
                        ItemSeparatorComponent={this.renderSeparator}
                        keyExtractor={(item) => `${item.id}`}
                      />
                      
                    )
                    
                  }
                }
              </Query>
            }

          </View>

          
            
         
          
        </ScrollView>
      </>
    );
  }
}

export default withUserContext(SearchScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.primary,
    paddingBottom: 80,
    // marginBottom: 50,

  },
  searchSection: {
    // width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.white,
    backgroundColor: colors.blackBlue,
    alignSelf: 'center' ,
    marginBottom: 10,
    borderRadius: 3
  },
  sectionHeader: {
    backgroundColor: colors.blackBlue,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding:5,
    width: '95%',
    alignSelf: 'center' ,
    borderBottomWidth: 3,
    borderBottomColor: colors.secondary,
    // marginVertical: 10,
    // flexDirection: 'row',
    // justifyContent: 'space-between'
  },
  type: {
    paddingHorizontal: 3,
    backgroundColor: colors.secondary,
    marginRight: 5,
    color: colors.white,
    borderRadius: 5,
    
  },
  typeText: {
    color: colors.white,
  },
  typeAlt: {
    paddingHorizontal: 10,
    backgroundColor: colors.secondary,
    marginRight: 5,
    color: colors.white,
    // borderRadius: 5,
    // height: 50,
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionFooter: {
    // height: 15,
    backgroundColor: '#3a3b3d',
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginBottom: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15
  },
  resultSection: {
    // backgroundColor: 'red',
    // alignSelf: 'center' ,
  },
  more: {
    color: colors.secondary,

    // lineHeight: 25,
    alignSelf: 'center',
    // padding: 5,
    fontSize: 14
  },
  
  mediaSection: {
    backgroundColor: '#3a3b3d',
    paddingTop:10,
    width: '95%',
    alignSelf: 'center' ,
  },
  searchIcon: {
    padding: 10,
    color: colors.white,
  },
  goBack: {
    padding: 10,
    color: colors.white,
  },
  input: {
      flex: 1,
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 0,
      backgroundColor: colors.blackBlue,
      color: colors.white
     },
  separator: {
    height: 15,
    width: '95%',
    alignSelf: 'center' ,
  },

});
