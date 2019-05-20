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
                query={AIRING_SCHEDULE_QUERY}
                variables={{
                  "weekStart": 1558155600, 
                  "weekEnd": 1558760400,
                  "page": 1
                }}
              >
                {({ loading, error, data }) => {
                    if (loading) return <Text>Fetching</Text>
                    if (error) {
                      console.log(error)
                      return <Text>Error: {error.message} </Text>
                    }
                    
                    let firstDay = new Date(data.Page.airingSchedules[0].airingAt*1000).getDay();
                    const weekDaysNumber = [firstDay, ++firstDay   % 7, ++firstDay % 7, ++firstDay % 7, ++firstDay % 7, ++firstDay % 7, ++firstDay % 7]
                    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    //
                    const list = weekDaysNumber.map(weekDay =>  ({ weekDay, data: this.getWeekDayAnime(weekDay, data.Page.airingSchedules) }));
                    {/* console.log({weekDaysNumber}) */}
                    
                    {/* console.log({list: this.getWeekDayAnime(4, list)}) */}
                    return (
                      <SectionList
                        style={styles.list}
                        renderItem={this._renderItem}
                        sections={list}
                        renderSectionHeader={({section: {weekDay}}) => (
                          <Text style={styles.header}>{weekDays[weekDay]}</Text>
                        )}
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

const AIRING_SCHEDULE_QUERY = gql`
query ($weekStart: Int, $weekEnd: Int, $page: Int) {
  Page(page: $page) {
    pageInfo {
      hasNextPage
      total
    }
    airingSchedules(airingAt_greater: $weekStart, airingAt_lesser: $weekEnd) {
      id
      episode
      airingAt
      media {
        id
        idMal
        title {
          userPreferred
        }
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        status
        season
        format
        genres
        synonyms
        duration
        popularity
        episodes
        source(version: 2)
        countryOfOrigin
        hashtag
        averageScore
        siteUrl
        description
        bannerImage
        isAdult
        coverImage {
          extraLarge
          color
        }
        trailer {
          id
          site
          thumbnail
        }
        externalLinks {
          site
          url
        }
        mediaListEntry {
          id,
          status,
          progress,
          score
        }
        rankings {
          rank
          type
          season
          allTime
        }
        studios(isMain: true) {
          nodes {
            id
            name
            siteUrl
          }
        }
        relations {
          edges {
            relationType(version: 2)
            node {
              id
              title {
                romaji
                native
                english
              }
              siteUrl
            }
          }
        }
      }
    }
  }
}
`
