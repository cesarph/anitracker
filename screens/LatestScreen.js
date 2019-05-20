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


import PortraitMedia from '../components/PortraitMedia';


class CurrentListScreen extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };
  static contextType = UserContext;

  state = {
    result: {},
  }

  static defaultProps = {
    numColumns: 2
  };

  getWeekDayAnime = (weekDay, schedules) => {
    return schedules.filter(schedule => new Date(schedule.airingAt*1000).getDay() === weekDay);
  }

  renderSeparator = () => {
    return (
      <View
        style={styles.separator}
      />
    );
  };

  _renderItem = ({ section, index }) => {
    const { numColumns } = this.props;

    if (index % numColumns !== 0) return null;

    const items = [];

    for (let i = index; i < index + numColumns; i++) {
      if (i >= section.data.length) {
        break;
      }

      items.push(<PortraitMedia key={section.data[i].id} {...section.data[i]} />);
    }

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {items}
      </View>
    );
  }

  render() {

    return (
      <View style={styles.container}>
           {
            <Query 
                query={LATEST_QUERY}
                variables={{
                  "page": 1
                }}
              >
                {({ loading, error, data }) => {
                    if (loading) return <Text>Fetching</Text>
                    if (error) {
                      console.log(error)
                      return <Text>Error: {error.message} </Text>
                    }
                    
                    const list = data.Page.media;
                    {/* console.log({weekDaysNumber}) */}
                    
                    {/* console.log({list: this.getWeekDayAnime(4, list)}) */}
                    return (
                      <FlatList
                        style={styles.list}
                        renderItem={({item, index}) => <PortraitMedia media={item} />}
                        data={list}
                        numColumns={2}
                        initialNumToRender={10}
                        ItemSeparatorComponent={this.renderSeparator}
                        keyExtractor={(item,index) => `${item.id}`}
                      />
                    )
               
                      
                }}
              </Query> 
            }
           
      </View>
    );
  }

    
}


export default withUserContext(CurrentListScreen);



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

const LATEST_QUERY = gql`
  query ($page: Int) {
    Page(page: $page) {
      pageInfo {
        hasNextPage
        total
      }
      media(status: RELEASING, sort: START_DATE_DESC, type:MANGA) {
        id
        title {
          userPreferred
        }
        format 
        bannerImage
        coverImage {
          extraLarge
        }
      }
    }
  }
`
