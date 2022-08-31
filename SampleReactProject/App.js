/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState, useEffect} from 'react';
import type {Node} from 'react';
import { Dimensions } from 'react-native';
import ImageModal from 'react-native-image-modal';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Modal,
  Button,
  StyleSheet,
  ImageBackground,
  Text,
  Image,
  TextInput,
  useColorScheme,
  View,
  TouchableHighlight,
} from 'react-native';
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  useQuery,
  useMutation,
  gql
} from '@apollo/client';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Profile from './Profile';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

const App: () => Node = () => {
  return (<ApolloProvider client={client}>
    <Profile />
  </ApolloProvider>
  )
};



export default App;
