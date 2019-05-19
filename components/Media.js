import React, {Component} from 'react'
import { Animated, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '../constants/Colors';
import { Icon } from 'expo';
import { withNavigation } from 'react-navigation'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'


function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

class Media extends Component {

  openMedia = () => {
    this.props.navigation.navigate({ 
      routeName: 'Media',
      params: {
        id: this.props.id,
        title: this.props.title.userPreferred,
        coverImage: this.props.coverImage.extraLarge,
        bannerImage: this.props.bannerImage,
        mediaListEntry: this.props.mediaListEntry,
        episodes: this.props.episodes,
      }
    })
  }

  render() {
    const studio = this.props.studios.nodes[0];
    const mediaListEntry = this.props.mediaListEntry;

    return (
      <View style={styles.container}>
        <View style={styles.imageSection}>
          <Image source={{uri: this.props.coverImage.extraLarge} } style={styles.image} />
        </View>
        <TouchableOpacity style={styles.infoSection} onPress={this.openMedia}>
          <Text style={styles.badge}> {this.props.format}</Text>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{this.props.title.userPreferred} </Text>
          </View>
           
          <View>
            {/* <Text style={styles.episodes}>{ mediaListEntry && <>{mediaListEntry.progress}{'/'}</>}{this.props.episodes} episodes</Text> */}
            {/* <Text style={styles.episodes}>{this.props.episodes} episodes</Text> */}
            <Text style={styles.popularity}>{formatNumber(this.props.popularity)} fans</Text>
          </View>
          <View style={styles.scoresSection}>
              { this.props.averageScore && 
                <Text style={styles.score}>
                  <Icon.Ionicons size={18} name="md-star-outline" color={colors.secondary} /> {this.props.averageScore}
                </Text> 
              }
              {/* { mediaListEntry && <Text style={styles.score}> <Icon.Ionicons size={18} name="md-star" color={colors.secondary} /> {mediaListEntry.score} </Text> } */}
            </View>
          <View>
          {studio && <Text style={styles.studio}>{studio.name}</Text> }
          </View>
 
            
        </TouchableOpacity>
        <View style={styles.topRight} >
              { 
                !mediaListEntry ? 
                  <Mutation 
                    mutation={STATUS_MUTATION} 
                    variables={{mediaId: this.props.id, status:'CURRENT'}}
                    update={(store, { data }) =>
                      this.props.updateStoreAfterStatusChange(store, data, this.props.id)
                    }
                  >
                    { (mutation) => <Icon.Feather size={25} name="plus-square" color={colors.secondary } onPress={() => mutation()} /> }
                  </Mutation> :
                  <Mutation 
                    mutation={DELETE_MUTATION} 
                    variables={{mediaId: this.props.mediaListEntry.id}}
                    update={(store, { data: deleted }) =>
                      this.props.updateStoreAfterDelete(store, deleted, this.props.id, this.props.type)
                    }
                  >
                    { (mutation) => <Icon.Ionicons size={25} name="md-checkbox" color={colors.secondary} onPress={() => mutation()} /> }
                  </Mutation>
                  
              }
            </View>
      </View>

    );
  }
}
// Entypo - squared-plus
// Feather - check-square
// Feather - plus-square
export default withNavigation(Media);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 100,
    maxWidth: '90%',
    alignSelf: 'center',
    borderRadius: 20,
  },
  imageSection: {
    
  },
  badge: {
    marginLeft: -10,
    paddingRight: 20,
    paddingLeft: 3,
    backgroundColor: colors.secondary,
    fontSize: 10,
    color: colors.white,
    alignSelf: 'flex-start',
    borderBottomRightRadius: 10,
    // borderRadius: 5,
  },
  image: {
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    width: 90, 
    height: 100
  },
  infoSection: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    justifyContent: 'space-between',
    flex:1,
    backgroundColor: colors.blackBlue,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    borderTopWidth: 3,
    borderTopColor: colors.secondary
  },
  titleSection: {
    maxWidth: '85%',
    flexDirection: 'row',
  },
  title: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14
  },
  addButton: {
    borderWidth: 2,
    borderRadius: 3,
    borderColor: colors.secondary,
    alignSelf: 'flex-start',
    paddingHorizontal: 3,
  },
  topRight: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  addIcon: {
    color: colors.secondary
  },
  popularity: {
    color: colors.white,
    fontSize: 14
  },
  scoresSection: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  score: {
    color: colors.white,
    fontSize: 14
  },
  studio: {
    color: colors.grey,
    fontSize: 10
  }
})

const STATUS_MUTATION = gql`
  mutation ($mediaId: Int, $progress: Int, $status: MediaListStatus) {
    SaveMediaListEntry (mediaId: $mediaId, progress: $progress, status: $status) {
        id
        status
        score
        progress
        media {
          type
        }
    }
  }
`
const DELETE_MUTATION = gql`
  mutation ($mediaId: Int) {
    DeleteMediaListEntry (id: $mediaId) {
      deleted
    }
  }
`