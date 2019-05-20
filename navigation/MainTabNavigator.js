import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import { Icon } from 'expo';
import TabBarIcon from '../components/TabBarIcon';
import CurrentListScreen from '../screens/CurrentListScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import MediaDetailsScreen from '../screens/MediaDetailsScreen';

import Colors, { colors } from '../constants/Colors'

import MediaHeader  from '../components/MediaHeader'
import AiringScreen from '../screens/AiringScreen';
import LatestScreen from '../screens/LatestScreen';
import CharacterScreen from '../screens/CharacterScreen';

const WatchListStack = createMaterialTopTabNavigator({
  Watching: {
    screen: () => <CurrentListScreen type="anime" />,
    navigationOptions: {
      tabBarLabel: 'Watch List',
     
    }
  },
  Airing: {
    screen: AiringScreen,
    navigationOptions: {
      tabBarLabel: 'Airing',
    }
  }
}, {
  swipeEnabled: true,
  animationEnabled: true,
  lazy: true,
  initialLayout: {
    height: 100,
    width: 600,
  },
  tabBarOptions: {
    style: {
      backgroundColor: colors.blackBlue,
    },
    indicatorStyle: {
      backgroundColor: colors.secondary
    },
  }
});

WatchListStack.navigationOptions = {
  tabBarLabel: 'Anime',
  tabBarIcon: ({ focused }) => (  
    <Icon.Foundation
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      size={26}
      style={{ marginBottom: -3 }}
      name='list'
    />
  ),
};

const ReadingListStack = createMaterialTopTabNavigator({
  Reading: {
    screen: () => <CurrentListScreen type="manga" />,
    navigationOptions: {
      tabBarLabel: 'Reading List',
     
    }
  },
  Latest: {
    screen: LatestScreen,
    navigationOptions: {
      tabBarLabel: 'Latest',
    }
  }
}, {
  swipeEnabled: true,
  animationEnabled: true,
  lazy: true,
  initialLayout: {
    height: 100,
    width: 600,
  },
  tabBarOptions: {
    style: {
      backgroundColor: colors.blackBlue,
    },
    indicatorStyle: {
      backgroundColor: colors.secondary
    },
  }
});

ReadingListStack.navigationOptions = {
  tabBarLabel: 'Manga',
  tabBarIcon: ({ focused }) => (  
    <Icon.Foundation
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      size={26}
      style={{ marginBottom: -3 }}
      name='list'
    />
  ),
};

const MediaTabs = createMaterialTopTabNavigator({
  Overview: MediaDetailsScreen,
  Characters: CharacterScreen
}, {
  swipeEnabled: true,
  animationEnabled: true,
  backBehavior: 'history',
  navigationOptions: ({ navigation }) => {
    // header: null,
    return { 
      // title: navigation.getParam('title')
      header: <MediaHeader navigation={navigation} />
    }
  },
  tabBarOptions: {
    style: {
      backgroundColor: colors.blackBlue,
    },
    indicatorStyle: {
      backgroundColor: 'red'
    },
  }
});

const DiscoverStack = createStackNavigator({
  Discover: DiscoverScreen,
  Search: SearchScreen,
  Media: MediaTabs
});



DiscoverStack.navigationOptions = {
  tabBarLabel: 'Discover',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
    />
  ),
};

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
    />
  ),
};

export default createBottomTabNavigator({
  WatchListStack,
  ReadingListStack,
  DiscoverStack,
  ProfileStack,
},
{
  tabBarOptions: {
    style: {
      backgroundColor: colors.blackBlue
    },
    activeTintColor: colors.white,
    // activeBackgroundColor: colors.secondary,
    tabStyle: {
      // borderTopWidth: 2,
      // borderTopColor: colors.secondary
    }
  },
});
