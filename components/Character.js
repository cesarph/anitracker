import React, {Component} from 'react'
import { Animated, View, Text,ImageBackground, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '../constants/Colors';
import { Icon, LinearGradient } from 'expo';
import { withNavigation } from 'react-navigation'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'


function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

class Character extends Component {

  openMedia = () => {
    this.props.navigation.navigate({ 
      routeName: 'Media',
      params: {
        id: this.props.media.id,
        title: this.props.media.title.userPreferred,
        coverImage: this.props.media.coverImage.extraLarge,
        bannerImage: this.props.media.bannerImage,
        mediaListEntry: this.props.media.mediaListEntry,
        episodes: this.props.media.episodes,
      }
    })
  }

  render() {

    return (
      <View style={styles.container} >
        {/* <TouchableOpacity onPress={this.openMedia}> */}
          <ImageBackground 
            source={{uri: this.props.node.image.large} } 
            style={styles.cover}
            imageStyle={styles.image}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)',]}
              style={styles.overlay}
            />
            <Text style={styles.badge}> {this.props.role}</Text>
            <View style={styles.titleSection}>
              <Text style={styles.title}>{this.props.node.name.first} {this.props.node.name.last}</Text>
          {this.props.voiceActors.length > 0 && <Text style={styles.episode}>{this.props.voiceActors[0].name.first} {this.props.voiceActors[0].name.last} </Text>}
            </View>
          </ImageBackground> 
      </View>

    );
  }
}
// Entypo - squared-plus
// Feather - check-square
// Feather - plus-square
export default withNavigation(Character);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginRight: 10,
    borderTopWidth: 3,
    borderRadius: 5,
    borderTopColor: colors.secondary,
  },
  badge: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingRight: 20,
    paddingLeft: 3,
    backgroundColor: colors.secondary,
    fontSize: 10,
    color: colors.white,
    
    // borderTopLeftRadius:3,
    alignSelf: 'flex-start',
    borderBottomRightRadius: 10,
    // borderRadius: 5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 5,
  },
  image: {
    borderTopRightRadius: 1,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    marginBottom: -2
  },
  cover: {
    // paddingBottom: 10,
    // justifyContent: 'space-between',
    borderRadius: 5,
   
    width: 150, 
    height: 210,
    
    // borderBottomColor: colors.secondary
  },
  titleSection: {
    // alignSelf: 'baseline',
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 10,
    // marginBottom: -1,
    
    width:'100%',
    minHeight: '30%',
    // backgroundColor: colors.blackBlue
  },
  title: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14
  },
  episode: {
    color: colors.grey,
    fontSize: 12,
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

})
