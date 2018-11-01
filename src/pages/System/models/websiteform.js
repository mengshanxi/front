import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm } from '@/services/api';

export default {
  namespace: 'form',

  state: {
    step: 'form',//success error
  },

  effects: {
    *submitRegularForm({ payload }, { call, put }) {
      const response = yield call(fakeSubmitForm, payload);
      if (response) {
        yield put({
          type: 'saveSuccess',
          payload,
        });
      } else {
        yield put({
          type: 'saveError',
          payload,
        });
      }
    },
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
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
    saveError(state, { payload }) {
      return {
        ...state,
        step: "error",
      };
    }, saveSuccess(state, { payload }) {
      return {
        ...state,
        step: "success",
      };
    },
  },
};
