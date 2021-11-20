import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import reducers from "./../reducers/index";
import mySaga from "./../sagas";

// const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const sagaMiddleware = createSagaMiddleware();

// export const store = createStore(
//   reducers,
//   composeEnhancers(applyMiddleware(sagaMiddleware))
// );
export const store = createStore(
  reducers,
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(mySaga);
