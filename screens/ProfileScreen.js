import React from 'react';
import { Text, ScrollView, StyleSheet, ImageBackground, Image, View, TouchableOpacity } from 'react-native';
import { withUserContext } from '../context/user-context'
import { colors } from '../constants/Colors';
import { Query } from 'react-apollo'
import gql from 'graphql-tag';
import { Icon, LinearGradient  } from 'expo';
import { logout } from '../util'


class ProfileScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  _logout = async () => {
    await logout();
    this.props.navigation.navigate('Auth');
  }

  render() {

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Query query={USER_QUERY} variables={{"id": this.props.userProvider.user.id }}>
          {
            ({data, loading, error}) => {
              if (loading) return <Text>Fetching</Text>
              if (error) {
                console.log(error, this.props.userProvider.user.id )
                return <Text>Error: {error.message} </Text>
              }
              
              const user = data.User;
              
              return (
                <>
                <ImageBackground 
                  style={styles.banner}
                  imageStyle={styles.backgroundImage}
                  source={{uri: user.bannerImage || 'https://assets.bigcartel.com/product_images/183133846/000.png?auto=format&fit=max&w=2000'}}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)',]}
                    style={styles.overlay}
                  />
                </ImageBackground>
                <View style={styles.avatarSection}>
                  <Image source={{uri: user.avatar.medium}} style={styles.avatar}></Image>
                  <Text style={styles.name}>{user.name}</Text>
                </View>
                <Text style={styles.statsHeader}>Stats</Text>
                <View style={styles.statsSection}>
                  <View>
                    <Text style={styles.stats}>{user.stats.animeStatusDistribution.reduce((total, stat) => total + stat.amount, 0)} Anime watched</Text>
                    <Text style={styles.stats}><Icon.FontAwesome name="television" color={colors.white} /> {(user.stats.watchedTime/60).toFixed(2)} hrs</Text>
                  </View>
                  <View>
                    <Text style={styles.stats}>{user.stats.mangaStatusDistribution.reduce((total, stat) => total + stat.amount, 0)} Manga read</Text>
                   
                    <Text style={styles.stats}><Icon.Feather name="book-open" color={colors.white} /> {user.stats.chaptersRead} chapters</Text>
                  </View>
                 
                </View> 
                
                </>
              );
            }
          }
        </Query>
        <TouchableOpacity style={styles.logout} onPress={this._logout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

export default withUserContext(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: colors.primary,
    height: '100%'
  },
  banner: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: colors.primary,
    flexDirection: 'row',
    width: '100%', 
    minHeight: 130,
    height: 160,
    maxHeight:160,
  },
  avatarSection: {
    borderTopWidth: 5,
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    borderRadius: 10,
    marginTop: -40,
    width: 80, 
    height: 80
  },
  name: {
    color: colors.white,
    fontSize: 24,
    padding: 10,
    fontWeight: 'bold'
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
  },
  statsSection:  {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-around'
  },
  statsHeader:{ 
    fontSize: 20,
    marginLeft: 20,
    color: colors.white,
    fontWeight: 'bold',
    width: '90%',
    borderBottomWidth: 5,
    borderColor: colors.secondary,
  },
  stats: {
    color: colors.white
  },
  logout: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxWidth:200,
    alignSelf: 'center',
  },
  logoutText: {
    color: colors.white,
    fontSize: 15,
    textAlign: 'center'
  }
})

const USER_QUERY = gql`
query (
    $id: Int, 
  ) {
    User(id: $id) {
      name
      avatar {
        large
        medium
      }
      bannerImage
      favourites {
        anime {
          edges {
            id
          }
        }
        manga {
          edges {
            id
          }
        }
      }
      stats {
        watchedTime
        chaptersRead
        animeStatusDistribution {
          amount
        }
       	mangaStatusDistribution {
          amount
        }
      }
    }
  }
`

