import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { withAuthenticator } from 'aws-amplify-react-native';

import { API, graphqlOperation } from 'aws-amplify'
import { listCitys as ListCities} from './src/graphql/queries'
import { createCity as CreateCity } from './src/graphql/mutations'
import { ListItem, Button, FormInput } from 'react-native-elements' 

class App extends Component<Props> {
  state = { cities: [], name: '', country: ''}

  async componentDidMount(){
    try {
      const {data: {listCitys: {items }}} = await API.graphql(graphqlOperation(ListCities))
      this.setState({ cities:items })
      console.log('cities: ', items)
    } catch (err) {
      console.log('error fetching data: ', err)
    }
  }

  onChange = (key,value) => {
    this.setState({ [key]: value})
  }

  createCity = async () => {
    const city = {
      name: this.state.name,
      country: this.state.country,
    }
    const cities = [...this.state.cities, city] //takes the old array and put the new city
    this.setState({cities, name:'', country:''})
    try {
      await API.graphql(graphqlOperation(CreateCity, {input: city}))
      console.log('city successfully created!!')

    }catch (err){
      console.log('error: ', err)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <FormInput
          onChangeText={v => this.onChange('name', v)}
          placeholder = 'City Name'
          value={this.state.name}
        />
        <FormInput
          onChangeText={v => this.onChange('country', v)}
          placeholder = 'Country'
          value={this.state.country}
        />
        <Button
          style={{margin:20}}
          onPress={this.createCity}
          title= 'Add City'
          backgroundColor='#ffa100'
        />
        {
          this.state.cities.map((item, i) => (
            <ListItem
              key={i}
              title={item.name}
              subtitle={item.description}
            />
          ))
        }
      </View>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true})  //greetings add logout  button sign out button

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
