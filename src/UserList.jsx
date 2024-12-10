import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const UserList = () => {
  const [text, setText] = useState('');
  const [contacts, setContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [duringMomentum, setDuringMomentum] = useState(false);

  // Fetch contacts data from the API
  const getContacts = useCallback(async () => {
    setLoading(true);

    try {
      const { data: { results: fetchedContacts } } = await axios.get(
        `https://randomuser.me/api?results=10&page=${page}`,
      );

      const updatedContacts = [...contacts, ...fetchedContacts];

      if (refreshing) {
        updatedContacts.reverse();
      }

      setContacts(updatedContacts);
      setAllContacts(updatedContacts);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setLoading(false);
    }
  }, [contacts, page, refreshing]);

  useEffect(() => {
    getContacts();
  }, [page, refreshing, getContacts]);

  const onRefresh = () => {
    setPage(1);
    setRefreshing(true);
  };

  const loadMore = () => {
    if (!duringMomentum) {
      setPage(prevPage => prevPage + 1);
      setDuringMomentum(true);
    }
  };

  const renderContactsItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          { backgroundColor: index % 2 === 0 ? 'white' : '#efefef' },
        ]}>
        <Image source={{ uri: item.picture.medium }} style={styles.image} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{item.name.first}</Text>
          <Text style={styles.company}>{item.location.state}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={{ paddingVertical: 30 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <TextInput
        onFocus={() => setDuringMomentum(true)}
        onBlur={() => setDuringMomentum(false)}
        onChangeText={text => {
          setText(text);
          searchFilter(text);
        }}
        value={text}
        style={styles.myInput}
        secureTextEntry={false}
        autoCapitalize="words"
        placeholder="Bir isim giriniz"
      />
    );
  };

  const searchFilter = (text) => {
    const filteredContacts = allContacts.filter(item => {
      const listItem = `${item.name.first.toLowerCase()}${item.location.state.toLowerCase()}`;
      return listItem.indexOf(text.toLowerCase()) > -1;
    });
    setContacts(filteredContacts);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderHeader}
        renderItem={renderContactsItem}
        data={contacts}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={isIOS ? 0.5 : 20}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ddd',
    justifyContent: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    height: 100,
    borderBottomWidth: 1,
    borderColor: '#eeee',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginHorizontal: 12,
  },
  nameContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  company: {
    marginTop: 5,
  },
  myInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#dddd',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 12,
  },
});

export default UserList;
