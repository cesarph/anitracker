import React from 'react';
import {
  Image,
  AsyncStorage,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from 'react-native';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import UserContext, {withUserContext} from '../context/user-context';

import { colors } from '../constants/Colors';


import { MonoText } from '../components/StyledText';
import AnimeEntry from '../components/AnimeEntry';

import { RectButton } from 'react-native-gesture-handler';
import Swipe from '../components/Swipe';

import { logout } from '../util'

class HomeScreen extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };
  static contextType = UserContext;

  state = {
    result: {},
  }


  _logout = async () => {
    await logout();
    this.props.navigation.navigate('Auth');
  }

  renderSeparator = () => {
    return (
      <View
        style={styles.separator}
      />
    );
  };

  render() {
    const user = this.props.userProvider.user
    const status = this.props.status.toUpperCase();
    console.log(status)
    return (
      <View style={styles.container}>
           { user.id &&
            <Query 
                query={USER_LISTS_QUERY}
                variables={{ 
                  "userId": user.id,
                  "type": "ANIME",
                  "status": status,
                  "perPage": 40
                }}
              >
                {({ loading, error, data }) => {
                    if (loading) return <Text>Fetching</Text>
                    if (error) {
                      console.log(error)
                      return <Text>Error: {error.message} </Text>
                    }
                    

                    {/* const order = data.MediaListCollection.user.mediaListOptions.animeList.sectionOrder; */}
                    {/* const watchingList = data.MediaListCollection.lists.filter(list => list.name === "Watching")[0]; */}
                    const list = data.Page.mediaList;
                    {/* const orderedLists = order.map(order => lists.filter(list => list.name === order)[0]).filter(list => list) */}
                    
                    {/* const filterList = watchingList.entries; */}
                    {/* console.log({filterList, orderedLists}) */}
                    {/* console.log({order, orderedLists}) */}
                    return (
                      <FlatList
                        renderItem={({item, index}) => <AnimeEntry {...item} />}
                        data={list}
                        initialNumToRender={10}
                        ItemSeparatorComponent={this.renderSeparator}
                        keyExtractor={(item,index) => `${item.id}`}
                      />
                    )
               
                      
                }}
              </Query> 
            }
            <TouchableOpacity onPress={this._logout}>
              <Text>Logout</Text>
            </TouchableOpacity>
      </View>
    );
  }

    
}


export default withUserContext(HomeScreen);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  rectButton: {
    flex: 1,
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  separator: {
    height: 15,
  },
});

const USER_LISTS_QUERY = gql`
  query (
    $userId: Int, 
    $userName: String, 
    $type: MediaType, 
    $status: MediaListStatus,
    $page: Int,
    $perPage: Int
  ) {    
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      mediaList(userId: $userId, userName: $userName, status: $status, type: $type) {   
        ...mediaListEntry                
      }
    }
  } 


fragment mediaListEntry on MediaList {   
  id   
  mediaId   
  status   
  score   
  progress   
  progressVolumes  
  repeat   
  priority   
  private   
  hiddenFromStatusLists   
  advancedScores     
  updatedAt   
  startedAt {       
    year       
    month       
    day   
  }   
  completedAt {       
    year       
    month      
    day   
  }   
  media {       
    id      
    title {           
      userPreferred
      romaji
      english
      native
    }      
    studios(isMain: true) {
      nodes {
        name
      }
    } 
    coverImage {
			extraLarge
      color
  	}
    bannerImage
    type       
    format       
    status       
    episodes       
    volumes       
    chapters      
  }
}

`
