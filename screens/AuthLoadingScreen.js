import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet, 
  View,
} from 'react-native';
import { getAccessToken } from '../util';
import {withUserContext} from '../context/user-context'
import { colors } from '../constants/Colors';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    
  }

  componentDidMount() {
    this._bootstrapAsync();
  }
  

  _bootstrapAsync = async () => {
  
    const credentialsRaw = await AsyncStorage.getItem('credentials');
    const userId =  await AsyncStorage.getItem('userId');
    const credentials = JSON.parse(credentialsRaw);
    if (credentials) {
      // await getAccessToken(credentials.refresh_token, true);
    }
    if (userId) {
      this.props.userProvider.setUser({ id: userId })
    } 

    this.props.navigation.navigate(credentials ? 'Main' : 'Auth');
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />
        <ActivityIndicator size={60} color={colors.secondary}/>
      </View>
    );
  }
}

export default withUserContext(AuthLoadingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
})