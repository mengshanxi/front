import { queryJob, removeJob, addJob, updateJob,queryWebsite,importWebsite } from '@/services/api';

export default {
  namespace: 'website',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //--查询website列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryWebsite, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addJob, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeJob, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateJob, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    }, 
    *import({ payload }, { call, put }) {
      const response = yield call(importWebsite, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
