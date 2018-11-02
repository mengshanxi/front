import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };



  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          {login.status === 'error' &&
            login.type === 'account' &&
            !submitting &&
            this.renderMessage('账户或密码错误（admin/888888）')}
          <UserName name="userName" placeholder="admin/user" />
          <Password
            name="password"
            placeholder="888888/123456"
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
          </div>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            <Link className={styles.register} to="/User/Register">
              忘记密码
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
