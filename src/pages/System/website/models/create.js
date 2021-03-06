import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm } from '@/services/api';

export default {
  namespace: 'forms',

  state: {
    step: 'SHOW_FORM',//success error
  },

  effects: {
    *create({ payload }, { call, put }) {
      yield put({
        type: 'execute',
        method: 'SHOW_FORM',
        payload,
      });
    },
    *submitRegularForm({ payload }, { call, put }) {
      const response = yield call(fakeSubmitForm, payload);
      console.log(response);
      if (response.code === 200) {
        message.success('提交成功');
        yield put({
          type: 'execute',
          method: 'SHOW_PAGE',
          payload,
        });
      } else {
        yield put({
          type: 'execute',
          method: 'SHOW_ERROR',
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
        case 'SHOW_FORM':
          return {
            ...state,
            step: "SHOW_FORM",
          };
        case 'SHOW_SUCCESS':
          return {
            ...state,
            step: "SHOW_SUCCESS",
          };
        case 'SHOW_ERROR':
          return {
            ...state,
            step: "SHOW_ERROR",
          };
        case 'SHOW_PAGE':
          return {
            ...state,
            step: "SHOW_PAGE",
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
