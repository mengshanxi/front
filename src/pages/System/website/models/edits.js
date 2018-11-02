import { routerRedux } from 'dva/router';
import { fakeSubmitForm } from '@/services/api';

export default {
  namespace: 'edits',

  state: {
    step: 'form',//success error
  },

  effects: {
    *create1({ payload }, { call, put }) {
      yield put({
        type: 'execute',
        method: 'CREATE',
        payload,
      });
    },
    *submitRegularForm({ payload }, { call, put }) {
      const response = yield call(fakeSubmitForm, payload);
      console.log(response);
      if (response.code === 200) {
        yield put({
          type: 'execute',
          method: 'CREATE_SUCCESS',
          payload,
        });
      } else {
        yield put({
          type: 'execute',
          method: 'CREATE_ERROR',
          payload,
        });
      }
    },
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'execute',
        payload,
      });
      yield put(routerRedux.push('/form/step-form/result'));
    },
    *submitAdvancedForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);

      //message.success('提交成功');
    },
  },

  reducers: {
    execute(state, action) {
      switch (action.method) {
        case 'CREATE':
          return {
            ...state,
            step: "form",
          };
        case 'CREATE_SUCCESS':
          return {
            ...state,
            step: "success",
          };
        case 'CREATE_ERROR':
          return {
            ...state,
            step: "error",
          };
        default:
          return {
            ...state,
            step: "error",
          };
      }
    },
  },
};
