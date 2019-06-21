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
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import Nav from 'app/navigation/nav';
import createReportsReducer from 'app/reducers/reports';
import createUIReducer from 'app/reducers/ui';
import createCitiesReducer from 'app/reducers/cities';
import createCameraReducer from 'app/reducers/camera';
import CitiesRenderless from 'app/components/cities';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
};

const appReducer = combineReducers({
  reports: createReportsReducer(),
  ui: createUIReducer(),
  camera: createCameraReducer(),
  cities: createCitiesReducer(),
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
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Nav />
        <CitiesRenderless />
      </PersistGate>
    </Provider>
  );
}
