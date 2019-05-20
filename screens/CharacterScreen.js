import React from 'react';
import {
  Image,
  AsyncStorage,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  SectionList,
  View,
  FlatList
} from 'react-native';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import UserContext, {withUserContext} from '../context/user-context';

import { colors } from '../constants/Colors';


import Character from '../components/Character';


class CharacterScreen extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };
  static contextType = UserContext;

  state = {
    result: {},
  }

  renderSeparator = () => {
    return (
      <View
        style={styles.separator}
      />
    );
  };


  render() {
    console.log(this.props.navigation.getParam('id'));
    return (
      <View style={styles.container}>
           {
            <Query 
                query={CHARACTERS_QUERY}
                variables={{
                  "id": this.props.navigation.getParam('id')
                }}
              >
                {({ loading, error, data }) => {
                    if (loading) return <Text>Fetching</Text>
                    if (error) {
                      console.log(error)
                      return <Text>Error: {error.message} </Text>
                    }
                    
                   {/* console.log({data}) */}
                   const list = data.Media.characters.edges
                    {/* console.log({weekDaysNumber}) */}
                    
                    {/* console.log({list: this.getWeekDayAnime(4, list)}) */}
                    return (
                      <FlatList
                        renderItem={({item, index}) => <Character {...item} />}
                        data={list}
                        numColumns={2}
                        initialNumToRender={10}
                        ItemSeparatorComponent={this.renderSeparator}
                        keyExtractor={(item,index) => `${item.id}${index}`}
                      />
                   
                    )
               
                      
                }}
              </Query> 
            }
           
      </View>
    );
  }

    
}


export default withUserContext(CharacterScreen);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  header:{ 
    fontSize: 20,
    marginLeft: 10,
    color: colors.white,
    fontWeight: 'bold',
    width: '90%',
    borderBottomWidth: 5,
    marginVertical: 10,
    borderColor: colors.secondary,
  },
  separator: {
    height: 15,
  },
  list: {
    flexWrap : 'wrap'
  }
});

const CHARACTERS_QUERY = gql`
query (
  $id: Int, 
) {    
  Media(id: $id, type: ANIME) {   
     characters{
      edges {
        role,
        voiceActors(language: JAPANESE) {
          id
          name {
            first
            last
          }
        }
        node {
          id
          name {
            first
            last
          }
          image {
            large
          }

        }
      }
    }          
  }
} 
`
