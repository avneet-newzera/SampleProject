/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useRef} from 'react';
import type {Node} from 'react';
import {Dimensions} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  SafeAreaView,
  Modal,
  Button,
  StyleSheet,
  Text,
  Image,
  TextInput,
  useColorScheme,
  View,
  TouchableHighlight,
} from 'react-native';
import {useQuery, useMutation, gql} from '@apollo/client';
import {Colors} from 'react-native/Libraries/NewAppScreen';

let interval;

const GET_USER_QUERY = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      description
      profilePic
    }
  }
`;
const ADD_CHANGE_PROFILE_PIC = gql`
  mutation ChangeProfilePicMutation($id: ID!, $profilePic: String!) {
    updatePic(id: $id, profilePic: $profilePic) {
      id
      profilePic
    }
  }
`;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const Profile: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [profilePic, setProfilePic] = useState(
    'file:///Users/avneet/Documents/experiments/SampleReactProject/assets/upload_new_image.png',
  );
  const [storyMedia, setStoryMedia] = useState('');
  const [storyViewed, setStoryViewed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [storyModalVisible, setStoryModalVisible] = useState(false);
  const [modalStoryHeadlineVisible, setModalStoryHeadlineVisible] =
    useState(false);
  const [storyHeadline, setStoryHeadline] = useState('');
  const [storyRunning, setStoryRunning] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const [profileName, setProfileName] = useState('Loading ...');
  const [profileBio, setProfileBio] = useState('Loading...');
  const [currentGalleryPic, setCurrentGalleryPic] = useState(
    'file:///Users/avneet/Documents/experiments/SampleReactProject/assets/upload_new_image.png',
  );
  const {loading, error, data, refetch} = useQuery(GET_USER_QUERY, {
    variables: {id: 1},
  });

  useEffect(() => {
    // console.log("Hello");
    setProfileName(data ? data.user.name : profileName);
    setProfileBio(data ? data.user.description : profileBio);
    setProfilePic(data ? data.user.profilePic : profilePic);
    // if(data) setProfilePic(data.user.profilePic)
    // console.log(profileName);
    // console.log(profileBio);
    // console.log('hellooo', profilePic);
    // console.log(profilePic);
  }, [data]);

  // console.log("profilePic,",profilePic);

  useEffect(() => {
    if (storyRunning) {
      interval = setInterval(() => {
        setStoryProgress(prev => prev + 1);
      }, 10);
    } else {
      clearInterval(interval);
    }
  }, [storyRunning]);

  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      console.log('heello');
      initialRender.current = false;
    } else {
      console.log(currentGalleryPic);
      updatePic();
    }
  }, [currentGalleryPic]);

  useEffect(() => {
    if (storyProgress === windowWidth) {
      setStoryRunning(false);
      clearInterval(interval);
      setStoryProgress(0);
      setStoryModalVisible(!storyModalVisible);
    }
  }, [storyProgress]);

  const [updatePic] = useMutation(ADD_CHANGE_PROFILE_PIC, {
    variables: {
      id: 1,
      profilePic: currentGalleryPic,
    },
    onCompleted: ({updatePic}) => {
      console.log(currentGalleryPic);
      console.log(updatePic.profilePic);
      console.log('completed');
      setProfilePic(updatePic.profilePic);
    },
  });

  const addOrChangeProfilePic = () => {
    let options = {
      // mediaType: type,
      // maxWidth: 300,
      // maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      } else {
        //  console.log(response.assets[0].uri);
        //  useMutation(ADD_CHANGE_PROFILE_PIC, {
        //   variables : {
        //     id: 1,
        //     profilePic: response.assets[0].uri
        //   }
        //  })
        //  console.log(profilePic);
        setCurrentGalleryPic(response.assets[0].uri);
        //  updatePic().then(({data})=> {console.log(data)});
        //  console.log(currentGalleryPic);
        //  setProfilePic({uri: response.assets[0].uri});
      }
    });
  };
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const showStory = () => {
    setStoryModalVisible(true);
    setStoryViewed(true);
    // setTimeout(() => {
    //   setStoryModalVisible(false);
    // }, 5000);
  };

  const addStory = () => {
    let options = {
      // mediaType: type,
      // maxWidth: 300,
      // maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      } else {
        console.log(response.assets[0].uri);
        setStoryMedia({uri: response.assets[0].uri});
        setStoryViewed(false);
        console.log(storyMedia);
      }
    });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <Modal
        animationType={'fade'}
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}>
        {/*All views of Modal*/}
        <View style={styles.modal}>
          <Button
            title="Click To change/add photos"
            onPress={() => {
              addOrChangeProfilePic();
              setModalVisible(!modalVisible);
            }}
          />
          <Button
            title="Click To Add a Story"
            onPress={() => {
              addStory();
              setModalVisible(!modalVisible);
            }}
          />
          <Button
            title="Click to Add story Headline"
            onPress={() => {
              setModalVisible(!modalVisible);
              setModalStoryHeadlineVisible(!modalStoryHeadlineVisible);
            }}
          />
          <Button
            title="Click To Remove photos"
            onPress={() => {
              setCurrentGalleryPic(
                'file:///Users/avneet/Documents/experiments/SampleReactProject/assets/upload_new_image.png',
              );
              console.log('current ', currentGalleryPic);
              // updatePic().then(({data})=> {console.log(data)});
              setModalVisible(!modalVisible);
            }}
          />
          <Button
            title="Click to Remove Story"
            onPress={() => {
              setStoryMedia('');
              setModalVisible(!modalVisible);
            }}
          />
          <Button
            title="Go back"
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          />
        </View>
      </Modal>
      <Modal
        animationType={'fade'}
        transparent={false}
        visible={modalStoryHeadlineVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}>
        {/*All views of Modal*/}
        <View style={styles.modal}>
          <TextInput
            placeholder="Input your story headline headline"
            defaultValue={storyHeadline}
            onChangeText={newStoryHeadline =>
              setStoryHeadline(newStoryHeadline)
            }
          />
          <Button
            title="Save Headline"
            onPress={() => {
              console.log(storyHeadline);
              setModalStoryHeadlineVisible(!modalStoryHeadlineVisible);
            }}
          />
          <Button
            title="Click to Remove Headline"
            onPress={() => {
              setStoryHeadline('');
              setModalStoryHeadlineVisible(!modalStoryHeadlineVisible);
            }}
          />
          <Button
            title="Go back"
            onPress={() => {
              setModalStoryHeadlineVisible(!modalStoryHeadlineVisible);
            }}
          />
        </View>
      </Modal>

      <Modal
        animationType={'fade'}
        transparent={false}
        visible={storyModalVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}>
        {/*All views of Modal*/}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#00000069',
          }}>
          <View
            style={{
              padding: 20,
              backgroundColor: '#fff',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={styles.progressBarContainer}>
              <View
                style={{
                  width: storyProgress,
                  backgroundColor: 'blue',
                  height: 5,
                }}
              />
            </View>
            <Text style={{fontSize: 30, color: 'red'}}>{storyHeadline}</Text>
            <Image style={{width: 400, height: 400}} source={storyMedia} />
            <Button
              title="Go back"
              onPress={() => {
                setStoryViewed(true);
                setStoryModalVisible(!storyModalVisible);
              }}
            />
          </View>
        </View>
      </Modal>
      <View style={styles.imageAlign}>
        <TouchableHighlight
          onLongPress={() => {
            setModalVisible(prev => !prev);
          }}
          onPress={() => {
            if (storyMedia === '') {
              return;
            }
            showStory();
            setStoryRunning(!storyRunning);
          }}>
          <View style={styles.profileImage}>
            <Image
              style={[
                styles.image,
                storyMedia === ''
                  ? styles.storyNotPresent
                  : storyViewed
                  ? styles.storyViewed
                  : styles.storyNotViewed,
              ]}
              source={{uri: profilePic}}
            />
          </View>
        </TouchableHighlight>
        {/* {story!='NULL' &&
       <View style={styles.story}></View>

       } */}
        <Text style={styles.profileName}>{profileName}</Text>
        <Text style={styles.prfileBio}>H{profileBio}</Text>
      </View>
      {/* <Button
        title="Click Me!"
        onPress={() => {
          console.log(profilePic);
          console.log(modalVisible);
        }}></Button> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  // storyText: {
  //   fontSize: 12,
  //   alignContent: 'center',
  // },
  highlight: {
    fontWeight: '700',
  },
  profileImage: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageAlign: {
    alignItems: 'center',
    marginTop: 100,
  },
  profileName: {
    fontSize: 40,
    color: 'black',
  },
  profileBio: {
    fontSize: 20,
    color: 'grey',
  },
  image: {
    height: 190,
    width: 190,
    borderRadius: 95,
    borderWidth: 5,
    overflow: 'hidden',
  },
  storyNotPresent: {
    borderColor: 'transparent',
  },
  storyNotViewed: {
    borderColor: '#0827F5',
  },
  storyViewed: {
    borderColor: '#5DD6F5',
  },
  // story: {
  //   height: 190,
  //   width: 190,
  //   borderRadius: 95,
  //   borderWidth: 5,
  //   borderColor: 'red',
  //   // color: '#ff0000'
  // },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyModal: {
    width: '100%',
    height: 'auto',
  },
  progressBarContainer: {
    width: windowWidth,
    height: 5,
    backgroundColor: 'lightgrey',
  },
});

export default Profile;
