import React from 'react';
import {
  AsyncStorage,
  ImageBackground,
  View,
  Text,
  StyleSheet,
  Image
  } from 'react-native';
import { login } from '../util';
import { PrimaryButton } from '../components/Button' 
import { colors } from '../constants/Colors';
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'
import UserContext, {withUserContext} from '../context/user-context';


class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  _login = async () => {
    const result = await login();

    if (result.ok)  {
      const result = await this.props.client.query({
        query: USER_QUERY,
      })
      const user = result.data.Viewer;
      this.props.userProvider.setUser(user);
      await AsyncStorage.setItem('userId', `${user.id}`)
      this.props.navigation.navigate('Main');
    }
  };


  render() {
    return (
      <ImageBackground 
        source={require('../assets/images/sao.jpg')} 
        style={styles.container} 
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={{uri: 'https://anilist.co/img/icons/android-chrome-512x512.png'}} />
          <Text style={styles.title}>AniTracker</Text>
        </View>

        <View>
          <PrimaryButton size="small" onPress={this._login}>
              Log In
          </PrimaryButton>
          <View style={styles.poweredBy}>
            <Text style={styles.poweredByText}>Powered By</Text>
            <Image style={styles.anilistLogo} source={{uri: 'https://anilist.co/img/icons/android-chrome-512x512.png'}} />
          </View>
        </View>
      </ImageBackground>
    );
  }
  
}


export default withApollo(withUserContext(LoginScreen));

const USER_QUERY = gql`
  query {
    Viewer {
      id
      name
    }
  }
`

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.primary,
    width: '100%', 
    height: '100%',
  },
  backgroundImage: {
    resizeMode: 'cover'
  },
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 25,
    paddingTop: 20,
    fontWeight: 'bold'
  },
  logo: {
    width: 100, 
    height: 100,
  },
  poweredBy: {
    alignItems: 'center',
    padding: 20,
  },
  poweredByText: {
    color: colors.white,
    marginBottom: 10,
  },
  anilistLogo: {
    width: 50, 
    height: 50
  }
  
})