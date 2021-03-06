import React from 'react';
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  } from 'react-native';

import { colors } from '../constants/Colors';
import { Icon, LinearGradient  } from 'expo';
import { Mutation } from 'react-apollo'
class MediaHeader extends React.Component {
  render() {
    const navigation = this.props.navigation;
    // console.log({navigation})
    updateStoreAfterStatusChange = () => {
      
    }

    updateStoreAfterDelete = () => {

    }

    return (
      <ImageBackground
        style={styles.banner}
        imageStyle={styles.backgroundImage}
        source={{uri: navigation.getParam('bannerImage') || navigation.getParam('coverImage') }}  
      >
        {/* <View style={styles.overlay} /> */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)',]}
          style={styles.overlay}
        />
        
        <Text style={styles.headerTitle}>{navigation.getParam('title')}</Text>
        {/* <Text>{navigation.getParam('episodes')}</Text> */}
        <View style={styles.follow}>
             
                {/* !navigation.getParam('mediaListEntry') ? 
                  <Mutation 
                    mutation={STATUS_MUTATION} 
                    variables={{mediaId: navigation.getParam('id'), status:'CURRENT'}}
                    update={(store, { data }) =>
                      this.updateStoreAfterStatusChange(store, data, navigation.getParam('id'))
                    }
                  >
                    { (mutation) => <Icon.Feather size={25} name="plus-square" color={colors.secondary } onPress={() => mutation()} /> }
                  </Mutation> :
                  <Mutation 
                    mutation={DELETE_MUTATION} 
                    variables={{mediaId: navigation.getParam('mediaListEntry').id}}
                    update={(store, { data: deleted }) =>
                      this.updateStoreAfterDelete(store, deleted, navigation.getParam('id'), this.props.type)
                    }
                  >
                    { (mutation) => <Icon.Ionicons size={25} name="md-checkbox" color={colors.secondary} onPress={() => mutation()} /> }
                  </Mutation>
                   */}
              {/* {
                  !navigation.getParam('mediaListEntry') ?
                  <Icon.Feather size={25} name="plus-square" color={colors.white} /> : 
                  <Icon.Ionicons size={25} name="md-checkbox" color={colors.white} />
              } */}
        </View>
       
      </ImageBackground>
    )
  }
}

export default MediaHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
  },
  banner: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: colors.primary,
    flexDirection: 'row',
    width: '100%', 
    maxHeight: 130,
  },
  headerTitle: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
    maxWidth: '80%'
  },
  follow: {
    marginBottom: 9
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  backgroundImage: {
    resizeMode: 'cover',
    opacity: 0.8,
  },

  
})