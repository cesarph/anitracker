import React from 'react';
import {
  AsyncStorage,
  ImageBackground,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image
  } from 'react-native';
import { Icon, LinearGradient  } from 'expo';

import { colors } from '../constants/Colors';
import gql from 'graphql-tag'
import { Query, withApollo, Mutation } from 'react-apollo'
import {withNavigation} from 'react-navigation'
import MediaHeader  from '../components/MediaHeader'

class MediaDetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    // header: null,
    return { 
      // title: navigation.getParam('title')
      header: <MediaHeader navigation={navigation}/>
    }
  };

  state = {
    progress: 0
  }

 

  render() {
    // console.log({p: this.props.navigation.getParam('id')});
    // const { animatedY, onScroll } = this.props.collapsible;
    return (
       <Query 
          query={MEDIA_QUERY}  
          variables={{ 
            "id": this.props.navigation.getParam('id')
          }}
        >
          {
            ({ loading, data, error }) => {
              const media = data.Media;
             
              if (loading) return <Text>Fetching...</Text>
              if (error) {
                  console.log(error)
                  return <Text>Error: {error.message} </Text>
                }
              return (
                <ScrollView contentContainerStyle={styles.container} >
                  <View style={styles.detailsSection}>
                    <View style={styles.coverSection}>
                      <Image source={{uri: media.coverImage.extraLarge}} style={styles.coverImage} />
                    </View>
                    <View style={styles.infoSection}>
                      <Text style={styles.title}>{media.title.userPreferred}</Text>
                      {/* <Text style={[styles.text]}>Status: {media.status}</Text> */}
                      { media.mediaListEntry ? <View style={[styles.progressSection]}>
                        <Mutation mutation={PROGRESS_MUTATION} variables={{ progress: media.mediaListEntry.progress - 1, mediaId: media.id  }}>
                          {progressMutation =>  <Icon.Feather style={styles.progressIcon} size={18} name="minus-square" color={colors.secondary} onPress={() => progressMutation()} />}
                        </Mutation>
                        <Text style={[styles.text]}>{media.mediaListEntry.progress}/{media.episodes ? media.episodes : media.nextAiringEpisode ? media.nextAiringEpisode.episode : '?'} episodes</Text>
                        <Mutation mutation={PROGRESS_MUTATION} variables={{ progress: media.mediaListEntry.progress + 1, mediaId: media.id  }}>
                          {progressMutation =>  <Icon.Feather style={styles.progressIcon} size={18} name="plus-square" color={colors.secondary} onPress={() => progressMutation()} />}
                        </Mutation>
                      </View> :
                        <Text style={[styles.text]}>{media.episodes ? media.episodes :  media.nextAiringEpisode ? media.nextAiringEpisode.episode : '?' } episodes</Text>
                      }
                      <Text style={[styles.text]}>{media.popularity} Fans</Text>

                    </View>
                  </View>
                  {/* <View style={styles.dateSection}>
                      <Text>Start Date: {media.startDate.day}/{media.startDate.month}/{media.startDate.year} </Text>
                      <Text>End Date:  {media.endDate.day}/{media.endDate.month}/{media.endDate.year} </Text>
                  </View>
                   */}
                  <Text>Description</Text>
                  {media.description.split('<br><br>').map(text=><Text key={text}>{text}</Text>)}
                  <Text>Trailer</Text>
                  <Text>Characters</Text>
                  {/* <Text>Staff</Text>
                  <Text>Studios</Text> */}

                </ScrollView>
              )
            }
          }
        </Query>
    
    );
  }
  
}


export default withNavigation(MediaDetailsScreen);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    minHeight: '100%',

    backgroundColor: colors.primary,
  },
  coverImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  detailsSection: {
    flexDirection: 'row',
    padding: 10,
  },
  infoSection: {
    maxWidth: '70%',
    paddingLeft: 10,
  },
  dateSection: {
    flexDirection: 'row',
    
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold'
  },
  progressSection: {
    flexDirection: 'row',
    color: colors.white,
    paddingVertical: 10,
  },
  progressIcon: {
    paddingHorizontal: 5
  },
  text: {
    color: colors.white,
  }
  
})

const MEDIA_QUERY = gql`
  query (
    $id: Int, 
  ) {    
    Media(id: $id) {   
      id      
      title {           
        userPreferred
      }      
      studios(isMain: true) {
        nodes {
          name
        }
      } 
      description
      coverImage {
        extraLarge
        color
      }
      type       
      format       
      status       
      episodes       
      volumes       
      chapters
      popularity
      mediaListEntry {
        id
        status
        score
        progress
        
      }  
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      nextAiringEpisode {
        episode
      }          
    }
  } 
`

const PROGRESS_MUTATION = gql`
  mutation ($mediaId: Int, $progress: Int) {
    SaveMediaListEntry (mediaId: $mediaId, progress: $progress) {
        id
        progress
        status
    }
  }
`