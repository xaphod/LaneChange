import React from 'react';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';
import Nav from 'app/navigation/nav';
import createReportsReducer from 'app/reducers/reports';
import createUIReducer from 'app/reducers/ui';
import createCameraReducer from 'app/reducers/camera';
import firebase from 'react-native-firebase';
import { signInAnonymously } from 'app/utils/firebase';

const persistConfig = {
  key: 'root',
  storage,
};

const appReducer = combineReducers({
  reports: createReportsReducer(),
  ui: createUIReducer(),
  camera: createCameraReducer(),
});

const persistedReducer = persistReducer(persistConfig, appReducer);

// https://github.com/jhen0409/react-native-debugger/issues/280
const composeEnhancers = compose; // window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const createStoreWithMiddleware = composeEnhancers(
  applyMiddleware(thunk),
)(createStore);

const store = createStoreWithMiddleware(
  persistedReducer,
);

const persistor = persistStore(store);

export default function App() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // signed in
      if (user.isAnonymous) {
        console.log(`DEBUG App.js: signed in anonymously as: ${user.uid}`);
      } else {
        console.log(`DEBUG App.js: signed in to an actual account as: ${user.uid}`);
      }
    } else {
      console.log('DEBUG App.js: no user, calling signInAnonymously()');
      signInAnonymously();
    }
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Nav />
      </PersistGate>
    </Provider>
  );
}
