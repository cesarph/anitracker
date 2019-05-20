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


import SwipeableMedia from '../components/SwipeableMedia';


class CurrentListScreen extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };
  static contextType = UserContext;

  state = {
    result: {},
  }

  _updateStoreAfterDelete = (store, deleted, mediaId) => {
    const userId = this.props.userProvider.user.id;
    const type = this.props.type.toUpperCase();
    const data = store.readQuery({ query: USER_LISTS_QUERY, variables: { 
      "userId": userId,
      "type": type,
      "status": 'CURRENT',
      "perPage": 40
    } });

    // console.log({deleted, type})
    const mediaList = data.Page.mediaList.filter(mediaList => mediaList.mediaId !== mediaId)
    data.Page.mediaList = mediaList;


    store.writeQuery({ query: USER_LISTS_QUERY, variables: { 
      "userId": userId,
      "type": type,
      "status": 'CURRENT',
      "perPage": 40
    }, data })

    
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
    const type = this.props.type.toUpperCase();

    return (
      <View style={styles.container}>
           { user.id &&
            <Query 
                query={USER_LISTS_QUERY}
                variables={{ 
                  "userId": user.id,
                  "type": type,
                  "status": 'CURRENT',
                  "perPage": 40
                }}
              >
                {({ loading, error, data }) => {
                    if (loading) return <Text>Fetching</Text>
                    if (error) {
                      console.log(error)
                      return <Text>Error: {error.message} </Text>
                    }

                    const list = data.Page.mediaList;
    
                    return (
                      <FlatList
                        renderItem={({item, index}) => <SwipeableMedia {...item} updateStoreAfterDelete={this._updateStoreAfterDelete} />}
                        data={list}
                        initialNumToRender={10}
                        ItemSeparatorComponent={this.renderSeparator}
                        keyExtractor={(item,index) => `${item.id}`}
                      />
                    )
               
                      
                }}
              </Query> 
            }
           
      </View>
    );
  }

    
}


export default withUserContext(CurrentListScreen);



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

export const USER_LISTS_QUERY = gql`
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
      mediaList(userId: $userId, userName: $userName, status: $status, type: $type, sort: UPDATED_TIME_DESC) {   
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
  media {       
    id      
    title {           
      userPreferred
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
