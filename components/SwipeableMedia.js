import React, {Component} from 'react'
import { Animated, View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import Swipeable  from 'react-native-gesture-handler/Swipeable';
import { Ionicons } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';

import { colors } from '../constants/Colors'
import { Icon, LinearGradient  } from 'expo';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag'
import {withNavigation} from 'react-navigation'

class SwipeableMedia extends Component {
  state = { 

   }

   openMedia = () => {
     const { meedia, ...mediaListEntry } = this.props;
    this.props.navigation.navigate({ 
      routeName: 'Media',
      params: {
        id: this.props.mediaId,
        title: this.props.media.title.userPreferred,
        coverImage: this.props.media.coverImage.extraLarge,
        bannerImage: this.props.media.bannerImage,
        mediaListEntry: mediaListEntry,
        episodes: this.props.media.episodes,
      }
    })
  }

  updateRef = ref => {
    this._swipeableRow = ref;
  };

  close = (mutation) => async () => {
    try {
      await mutation();
      this._swipeableRow.close();
    } catch (error) {
      console.log({error})
    }
   
  };

  updateStoreAfterDelete = (store, { data }) => {
    this.props.updateStoreAfterDelete(store, data, this.props.mediaId)
  }
  


  
  renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton style={styles.leftAction} onResponderMove={this.close}>
        <Animated.View style={[styles.actionView, {
              transform: [{ translateX: trans }],
            }]}>
          <Ionicons style={styles.icon} name="md-checkmark" size={32} color="green" />
        </Animated.View>
      </RectButton>
    );
  };


  renderRightAction = (icon, color, x, progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const mutation = icon === 'minus' ? STATUS_MUTATION : DELETE_MUTATION;
    const variables = icon === 'minus' ? {mediaId: this.props.mediaId, progress: this.props.progress - 1} : {mediaId: this.props.id};
    const update = icon === 'minus' ? () => {} : this.updateStoreAfterDelete;
    return (
      <Mutation 
        mutation={mutation} 
        variables={variables}
        update={update}
      >
      {
        (mutation) => (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={this.close(mutation)}>
          <Icon.Foundation name={icon} size={26} style={styles.actionText} />
        </RectButton>
      </Animated.View>
        )
      }
      </Mutation>
    );
  };
  renderRightActions = progress => (
    <View style={{ width: 192, flexDirection: 'row' }}>
      {this.renderRightAction('minus', colors.blue, 128, progress)}
      {this.renderRightAction('trash', colors.secondary, 64, progress)}
    </View>
  );

  render() {  
    // console.log(`${this.props.media.title.userPreferred} - ${this.props.media.bannerImage}`)
    return (
      <Mutation 
        mutation={STATUS_MUTATION} 
        variables={{mediaId: this.props.mediaId, progress: this.props.progress + 1}}>
      {
        (plusMutation) => (
              <Swipeable
                  ref={this.updateRef}
                  friction={2}
                  leftThreshold={20}
                  rightThreshold={40}
                  renderLeftActions={this.renderLeftActions}
                  renderRightActions={this.renderRightActions}
                  onSwipeableLeftOpen={this.close(plusMutation)}
                  >
                  <TouchableOpacity onPress={this.openMedia}>
                    <ImageBackground 
                      style={styles.container} 
                      imageStyle={[styles.backgroundImage, { backgroundColor: this.props.media.coverImage.color}]} 
                      source={{uri: this.props.media.bannerImage || this.props.media.coverImage.extraLarge}} 
                    >
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.6)',]}
                        style={styles.overlay}
                      />
                      <View style={styles.titleContainer}>
                        <Text style={styles.title}>{this.props.media.title.userPreferred}</Text>
                        <Text style={styles.episode}>Episode {this.props.progress}</Text>
                      </View>
                      
                      {/* <View>
                        <Text>Rating: {this.props.score}</Text>
                      </View> */}

                    </ImageBackground>
                  </TouchableOpacity>
                </Swipeable>
        )
      }
      </Mutation>
     
    );
  }
}

export default withNavigation(SwipeableMedia);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.blackBlue,
    borderRadius: 10,
    height: 130,
    flex: 1,
    justifyContent: 'flex-end',
    minWidth: '98%',
    width: '98%',
  },
  backgroundImage: {
    resizeMode: 'cover',
    width: '100%', 
    height: '100%',
    borderRadius: 5,
  },
  titleContainer: {
    padding: 5,
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold'
  },
  episode: {
    color: colors.white,
    fontSize: 14,
  },
  leftAction: {
    flex: 0.6,
    backgroundColor: colors.success,
    justifyContent: 'center',
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  actionView: {
    
  },
  actionText: {
    color: 'white',
    backgroundColor: 'transparent',
    padding: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

})

const DELETE_MUTATION = gql`
  mutation ($mediaId: Int) {
    DeleteMediaListEntry (id: $mediaId) {
      deleted
    }
  }
`

export const STATUS_MUTATION = gql`
  mutation ($mediaId: Int, $progress: Int, $status: MediaListStatus) {
    SaveMediaListEntry (mediaId: $mediaId, progress: $progress, status: $status) {
        ...mediaListEntry
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