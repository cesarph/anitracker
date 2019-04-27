import React, { Component } from 'react';
const UserContext = React.createContext({
  user: {},
  setUser: () => {}
});

export class UserProvider extends Component {
  state = {
    user: { 
      id: null
    },
  }

  setUser = (user) => {
    this.setState({user})
  }

  getValues = () => {
    return {
        ...this.state,
        setUser: this.setUser
    }
  }


  render() {
    return (
      <UserContext.Provider value={this.getValues()}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export const UserConsumer = UserContext.Consumer;

export default {
  Provider: UserProvider,
  Consumer: UserConsumer,
}

export function withUserContext(Component) {
  
  class ComponentWithContext extends React.Component {
      static navigationOptions = {
        ...Component.navigationOptions
      };

      render() {
          return (
              <UserContext.Consumer>
                  {(value) => <Component {...this.props} userProvider={value} />}
              </UserContext.Consumer>
          );
      };
  }

  return ComponentWithContext;
}