/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import WebView from 'react-native-webview';
import {getErrorTpl, getLoadingTpl, getStartTpl} from './src/lib/html';
import {Press} from './src/components/Press';
import {URLFetch} from './src/lib/URLFetch';
import {contentExtract} from './src/lib/Extractor';

const getContent = async (url: string) => {
  try {
    const txt = await URLFetch(url);
    const content = contentExtract(txt);
    return content;
  } catch (err) {
    return getErrorTpl(err as string);
  }
};

function App(): JSX.Element {
  const [url, setUrl] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [content, setContent] = useState(getStartTpl());
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const executeGo = async (newUrl: string) => {
    // TODO if error fetching URL, don't add to the history
    setContent(getLoadingTpl()); // TODO check HTTPS prefix
    const txt = await getContent(newUrl);
    setContent(txt);
  };

  const pushHistory = (newUrl: string) => {
    setHistory([...history, newUrl]);
  };

  const popHistory = () => {
    if (history.length <= 1) {
      return;
    }

    const newUrl = history[history.length - 2];
    setHistory(history.slice(0, history.length - 1));
    executeGo(newUrl);
    setUrl(newUrl);
  };

  const handleBack = () => {
    console.log('handleBack: history', history);

    if (history.length < 2) {
      Alert.alert('OAW', 'End of history');
    } else {
      popHistory();
    }

    return true;
  };

  useEffect(() => {
    console.log('useEffect: seting backhandler', BackHandler, history);

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack,
    );

    return () => backHandler.remove();
  });

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.headerContainer}>
          <View style={styles.headerTextInputCol}>
            <TextInput
              value={url}
              style={styles.textInput}
              inputMode="url"
              placeholder="Enter a URL..."
              onChangeText={txt => setUrl(txt)}
            />
          </View>
          <View style={styles.headerButtonCol}>
            <Press
              onPress={async () => {
                executeGo(url);
                pushHistory(url);
              }}
              title="Go"
            />
          </View>
          <View style={styles.headerButtonCol}>
            <Press onPress={() => setUrl('')} title="X" />
          </View>
          <View style={styles.headerButtonCol}>
            <Press onPress={() => handleBack()} title="<" />
          </View>
        </View>
        <Text>h:{history}</Text>
        <WebView
          source={{html: content, baseUrl: './src/assets/img/'}}
          style={styles.webView}
          onMessage={event => {
            const aUrl = event.nativeEvent.data;
            setUrl(aUrl);
            executeGo(aUrl);
            pushHistory(aUrl);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  webView: {
    margin: 2,
    height: 600,
  },
  headerButtonCol: {
    flex: 1,
  },
  headerTextInputCol: {
    flex: 6,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  textInput: {
    backgroundColor: '#eee',
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
});

export default App;
