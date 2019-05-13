import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { colors } from '../constants/Colors'

const ListStack = createMaterialTopTabNavigator({
  Watching: {
    screen: () => <HomeScreen status="current" />,
    // path: 'list/:type',
    navigationOptions: {
      tabBarLabel: 'Watching',
      tabBarIcon: <TabBarIcon name={'md-eye'} />
    }
  },
  Paused: {
    screen: () => <HomeScreen status="paused" />,
    navigationOptions: {
      tabBarLabel: 'Paused',
      tabBarIcon: <TabBarIcon name={'md-pause'} />
    }
  },
  Dropped: {
    screen: () => <HomeScreen status="dropped" />,
    navigationOptions: {
      tabBarLabel: 'Dropped',
      tabBarIcon: <TabBarIcon name={'md-remove-circle'} />
    }
  },
  Completed: {
    screen: () => <HomeScreen status="completed" />,
    navigationOptions: {
      tabBarLabel: 'Completed',
      tabBarIcon: <TabBarIcon name={'md-checkmark-circle'} />
    }
  },
  Planning: {
    screen: () => <HomeScreen status="planning" />,
    navigationOptions: {
      tabBarLabel: 'Planning',
      tabBarIcon: <TabBarIcon name={'md-calendar'} />
    }
  },
}, {
  swipeEnabled: true,
  animationEnabled: true,
  lazy: true,
  initialLayout: {
    height: 100,
    width: 600,
  },
  order: ["Watching", "Completed", "Planning", "Paused", "Dropped"],
  tabBarOptions: {
    showIcon: true,
    showLabel: true,
    labelStyle: {
      fontSize: 12,
      marginBottom: -3
    },
    upperCaseLabel: false,
    tabStyle: {
       marginTop: 15,
       width: 120,
       height: 80
    },
    style: {
      backgroundColor: colors.blackBlue,
    },
    iconStyle: {
      color: colors.white,
      marginBottom: -3,
    },
    indicatorStyle: {
      backgroundColor: 'red'
    },
    scrollEnabled: true
  }
});

ListStack.navigationOptions = {
  tabBarLabel: 'Anime',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const DiscoverStack = createStackNavigator({
  Discover: LinksScreen,
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
  Profile: SettingsScreen,
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
  ListStack,
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
