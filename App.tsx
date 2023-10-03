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
  StyleSheet,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';

import WebView from 'react-native-webview';
import {getErrorTpl, getLoadingTpl, getStartTpl} from './src/lib/html';
import {Press} from './src/components/Press';
import {URLFetch} from './src/lib/URLFetch';
import {contentExtract} from './src/lib/Extractor';
import {Theme} from './src/lib/Theme';

const getContent = async (url: string, isDarkTheme = false) => {
  try {
    const {txt, finalUrl} = await URLFetch(url);
    return {txt: contentExtract(txt, finalUrl, isDarkTheme), finalUrl};
  } catch (err) {
    return {txt: getErrorTpl(err as string), finalUrl: url};
  }
};

function App(): JSX.Element {
  const isDarkTheme = useColorScheme() === 'dark';
  const {height} = useWindowDimensions();
  const [url, setUrl] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [content, setContent] = useState(getStartTpl(isDarkTheme));
  const themeStyle = isDarkTheme ? Theme.dark : Theme.light;

  const executeGo = async (newUrl: string, pushToHistory = true) => {
    // TODO if error fetching URL, don't add to the history
    setContent(getLoadingTpl(isDarkTheme));
    const {txt, finalUrl} = await getContent(newUrl, isDarkTheme);
    setContent(txt);
    setUrl(finalUrl);

    if (pushToHistory && history[history.length - 1] !== finalUrl) {
      setHistory([...history, finalUrl]);
    }
  };

  const popHistory = () => {
    if (history.length <= 1) {
      return;
    }

    const newUrl = history[history.length - 2];
    setHistory(history.slice(0, history.length - 1));
    executeGo(newUrl, false);
    setUrl(newUrl);
  };

  const handleBack = () => {
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
  }, [history]);

  return (
    <SafeAreaView style={themeStyle.mainBg}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.headerContainer}>
          <View style={styles.headerTextInputCol}>
            <TextInput
              value={url}
              placeholderTextColor={themeStyle.placeHolderText}
              style={[styles.textInput, themeStyle.textInput]}
              inputMode="url"
              placeholder="Enter URL..."
              onChangeText={txt => setUrl(txt)}
            />
          </View>

          <View style={styles.headerButtonCol}>
            <Press
              onPress={async () => {
                if (url !== '') {
                  executeGo(url);
                } else {
                  Alert.alert('Error', 'RLY? No URL?');
                }
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

        <WebView
          source={{html: content, baseUrl: './src/assets/img/'}}
          style={[styles.webView, {height: height - 80}]}
          onMessage={event => {
            const aUrl = event.nativeEvent.data;
            setUrl(aUrl);
            executeGo(aUrl);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  webView: {
    margin: 5,
    marginTop: 1,
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
    padding: 5,
  },
  textInput: {
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginRight: 2,
  },
});

export default App;
