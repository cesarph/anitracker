import React from 'react';
import { ScrollView, StyleSheet, TextInput, View, StatusBar, Text, Image, TouchableOpacity, SectionList } from 'react-native';
import { Icon } from 'expo';
import { colors } from '../constants/Colors';
import { FlatList } from 'react-native-gesture-handler/GestureHandler';
import { Query, withApollo } from 'react-apollo'
import gql from 'graphql-tag'

import Media from '../components/Media'

class DiscoverScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
    header: null,
  };

  typingTimeout = null;

  state = {
    searchString: 'one piece'
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

  moreMedia = (type) => () => {
    this.props.navigation.navigate({ 
      routeName: 'Search',
      params: {
        searchString: this.state.searchString,
        type
      }
    })
  }

  _updateStoreAfterStatusChange = (store, newData, mediaId) => {
    const {media, ...mediaListEntry} = newData.SaveMediaListEntry;
    const data = store.readQuery({ query: SEARCH_MEDIA_QUERY, variables: {
      "search": this.state.searchString,
      "type": media.type,
      "perPage": 4,
    } });

    // console.log({mediaId});
    const mediaClicked = data.Page.media.find(media => media.id === mediaId)
    mediaClicked.mediaListEntry = mediaListEntry;
    // console.log({mediaClicked, type:media.type})

    store.writeQuery({ query: SEARCH_MEDIA_QUERY, variables: {
      "search": this.state.searchString,
      "type": media.type,
      "perPage": 4,
    }, data })
    // const animeClick = result.
    
  }

  _updateStoreAfterDelete = (store, deleted, mediaId, type) => {
    
    const data = store.readQuery({ query: SEARCH_MEDIA_QUERY, variables: {
      "search": this.state.searchString,
      "type": type,
      "perPage": 4,
    } });

    // console.log({deleted, type})
    const mediaClicked = data.Page.media.find(media => media.id === mediaId)
    mediaClicked.mediaListEntry = null;


    store.writeQuery({ query: SEARCH_MEDIA_QUERY, variables: {
      "search": this.state.searchString,
      "type": type,
      "perPage": 4,
    }, data })

    
  }

  render() {
    return (
      <>
        <ScrollView contentContainerStyle={styles.container} >
          <View style={styles.searchSection}>
            <Icon.Ionicons style={styles.searchIcon} name="md-search" size={20}/>
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

          
          { this.state.searchString.length > 3 &&
            <Query 
              query={SEARCH_MEDIA_QUERY}  
              variables={{ 
                "search": this.state.searchString,
                "type": 'ANIME',
                "perPage": 4,
              }}
            >
              {({ loading: loadingAnime, data: Anime, error: animeError }) => (
                this.state.searchString.length > 3 && <Query 
                  query={SEARCH_MEDIA_QUERY}
                  variables={{ 
                    "search": this.state.searchString,
                    "type": 'MANGA',
                    "perPage": 4,
                  }}
                >
                  {({ loading: loadingManga, data: Manga, error: mangaError }) => {
                    if (loadingAnime || loadingManga) return <Text>Fetching</Text>
                    if (animeError || mangaError) {
                      const error = animeError || mangaError;
                      return <Text>Error: {error.message} </Text>
                    }

                   
                    const sections = [{
                      title: 'Anime', data: Anime.Page.media,
                    }, {
                      title: 'Manga', data: Manga.Page.media
                    }];

                    {/* console.log({Anime, Manga, sections}) */}

                    return (
                      <SectionList
                        renderItem={({item}) => 
                          <View style={styles.mediaSection}>
                            <Media 
                              {...item}
                              updateStoreAfterStatusChange={this._updateStoreAfterStatusChange} 
                              updateStoreAfterDelete={this._updateStoreAfterDelete}
                            />
                          </View> 
                        }
                        sections={sections}
                        initialNumToRender={10}
                        renderSectionHeader={({section: {title}}) => (
                          <TouchableOpacity onPress={this.moreMedia(title)} style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{title}</Text>
                            {/* <Text style={styles.more}>More ></Text> */}
                          </TouchableOpacity>
                        )}
                        renderSectionFooter={({section: {title}}) => (
                          <TouchableOpacity 
                            style={styles.sectionFooter}
                            onPress={this.moreMedia(title)}
                          >
                            {/* <Text style={styles.more}>More</Text> */}
                            <Icon.FontAwesome name="chevron-down" color={colors.secondary} size={25} />
                          </TouchableOpacity>
                        )}
                        stickySectionHeadersEnabled={false}
                        ItemSeparatorComponent={this.renderSeparator}
                        keyExtractor={(item) => `${item.id}`}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps='always'
                      />
                    )
                  }}
                </Query>
              )}
            </Query>
          }
          </View>

            {/* { this.state.searchString.length > 3 && <Query 
                query={SEARCH_MEDIA_QUERY}
                variables={{ 
                  "search": this.state.searchString,
                  "type": 'MANGA',
                  "perPage": 3,
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
                        renderItem={({item}) => <Media {...item} />}
                        data={data.Page.media}
                        initialNumToRender={3}
                        ItemSeparatorComponent={this.renderSeparator}
                        keyExtractor={(item) => `${item.id}`}
                      />
                      
                    )
                    
                  }
                }
              </Query>
            } */}
            
         
          
        </ScrollView>
      </>
    );
  }
}

export default withApollo(DiscoverScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.primary,
    paddingBottom: 80,
    // marginBottom: 50,

  },
  searchSection: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.white,
    backgroundColor: colors.blackBlue,
    alignSelf: 'center' ,
    marginVertical: 10,
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
    height: 5,
    backgroundColor: '#3a3b3d',
    width: '95%',
    alignSelf: 'center' ,
  },

});

export const SEARCH_MEDIA_QUERY = gql`
  query (
    $page: Int,
    $perPage: Int,
    $search: String,
    $type: MediaType,
  ) {    
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        perPage
      }
      media(search: $search, type: $type) {
        id
        title {
          userPreferred
        }
        type
        bannerImage
        coverImage {
          extraLarge
        }
        format
        episodes
        averageScore
        studios(isMain: true) {
          nodes {
            name
          }
        }
        popularity
        mediaListEntry {
          id
          status
          score
          progress
        }
      }
    }
        
  }
`//mediaListEntry

