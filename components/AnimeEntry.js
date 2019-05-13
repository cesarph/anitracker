import React, {Component} from 'react'
import { Animated, View, Text, ImageBackground, StyleSheet } from 'react-native';
import Swipeable  from 'react-native-gesture-handler/Swipeable';
import { Ionicons } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';

import { colors } from '../constants/Colors'

class AnimeEntry extends Component {
  state = { 

   }

   renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton style={styles.leftAction} onPress={this.close}>
        <Animated.View style={[styles.actionView, {
              transform: [{ translateX: trans }],
            }]}>
          <Ionicons style={styles.icon} name="md-checkmark" size={32} color="green" />
        </Animated.View>
      </RectButton>
    );
  };

  updateRef = ref => {
    this._swipeableRow = ref;
  };

  close = () => {
    this._swipeableRow.close();
  };


  render() {  
    // console.log(`${this.props.media.title.userPreferred} - ${this.props.media.bannerImage}`)
    return (
      <Swipeable
        ref={this.updateRef}
        friction={1}
        leftThreshold={30}
        renderLeftActions={this.renderLeftActions}
        >
          <ImageBackground 
            style={styles.container} 
            imageStyle={[styles.backgroundImage, { backgroundColor: this.props.media.coverImage.color}]} 
            source={{uri: this.props.media.bannerImage || this.props.media.coverImage.extraLarge}} 
          >
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{this.props.media.title.userPreferred} #{this.props.progress}</Text>
            </View>
            
            {/* <View>
              <Text>Rating: {this.props.score}</Text>
            </View> */}

          </ImageBackground>
      </Swipeable>
    );
  }
}

export default AnimeEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '98%',
    width: '98%',
    alignSelf: 'center',
    height: 130,
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    resizeMode: 'cover',
    width: '100%', 
    // borderWidth: 3,
    // borderColor: colors.blackBlue,
    borderRadius: 5,
  },
  // innerContainer: {
  //   flex: 1,
  //   width: '100%',
  // },
  titleContainer: {
    borderRadius: 10,
    backgroundColor: colors.primary,
    padding: 5,
    alignSelf: 'flex-start',
    marginHorizontal: 5,
    marginBottom: 10,
    opacity: 0.8,
    // maxWidth: '99%',
  },
  title: {
    color: colors.white,
    fontSize: 17,
    opacity: 1,
    fontWeight: 'bold'
  },
  leftAction: {
    flex: 1,
    borderWidth: 3,
    borderColor: colors.blackBlue,
    backgroundColor: colors.success,
    justifyContent: 'center',
  },

})

const styles2 = StyleSheet.create({
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
    opacity: 0.5,
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
  leftAction: {
    flex: 1,
    backgroundColor: colors.success,
    justifyContent: 'center',
  },
  actionView: {
    borderWidth: 3,
    borderColor: colors.blackBlue,
    
  }

})