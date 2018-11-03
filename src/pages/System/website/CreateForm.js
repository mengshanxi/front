import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
  message,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Row, Col, Steps } from 'antd';
import Result from '@/components/Result';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;


@connect(({ forms, loading }) => ({
  forms,
  loading: loading.models.forms,
}))
@Form.create()
class BasicForms extends PureComponent {
  constructor(props) {
    super(props);

  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'forms/create',
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'forms/submitRegularForm',
          payload: values,
        });

      }
    });
  };
  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    //---------------
    const actions = (
      <Fragment>
        <Button type="primary" onClick={this.props.goPage}>
          <FormattedMessage id="app.result.success.btn-return" defaultMessage="Back to list" />
        </Button>
      </Fragment>
    );
    const {
      forms
    } = this.props;

    switch (forms.step) {
      case 'SHOW_PAGE':
        this.props.goPage();
      case 'SHOW_ERROR':
        return (<PageHeaderWrapper>
          <Card bordered={false}>
            <Result
              type="error"
              title={formatMessage({ id: 'app.result.error.title' })}
              description={formatMessage({ id: 'app.result.error.description' })}

              actions={actions}
              style={{ marginTop: 48, marginBottom: 16 }}
            />
          </Card>
        </PageHeaderWrapper>);
      default:

        return (
          <PageHeaderWrapper
            title="新增商户"
            content="请详细填写商户的相关信息。"
          >
            <Card bordered={false}>
              <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
                <FormItem {...formItemLayout} label="商户名">
                  {getFieldDecorator('merchantName', {
                    rules: [
                      {
                        required: true,
                        message: '请输入商户名',
                      },
                    ],
                  })(<Input placeholder="请输入商户名" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="起止日期">
                  {getFieldDecorator('date', {
                    rules: [
                      {
                        required: true,
                        message: '请选择起止日期',
                      },
                    ],
                  })(<RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="商户描述">
                  {getFieldDecorator('desc', {
                    rules: [
                      {
                        required: true,
                        message: '请输入商户描述',
                      },
                    ],
                  })(
                    <TextArea
                      style={{ minHeight: 32 }}
                      placeholder="请输入商户描述"
                      rows={4}
                    />
                  )}
                </FormItem>
              
                <FormItem
                  {...formItemLayout}
                  label={
                    <span>
                      一级行业
                      <em className={styles.optional}>
                        （选填）
                        <Tooltip title="一级行业信息">
                          <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                        </Tooltip>
                      </em>
                    </span>
                  }
                >
                  {getFieldDecorator('client')(
                    <Input placeholder="一级行业信息" />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={
                    <span>
                      二级行业
                      <em className={styles.optional}>（选填）</em>
                    </span>
                  }
                >
                  {getFieldDecorator('invites')(
                    <Input placeholder="二级行业" />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={
                    <span>
                      权重
                      <em className={styles.optional}>（选填）</em>
                    </span>
                  }
                >
                  {getFieldDecorator('weight')(<InputNumber placeholder="请输入" min={0} max={100} />)}
                  <span className="ant-form-text">%</span>
                </FormItem>
                <FormItem {...formItemLayout} label="目标公开" help="客户、邀评人默认被分享">
                  <div>
                    {getFieldDecorator('public', {
                      initialValue: '1',
                    })(
                      <Radio.Group>
                        <Radio value="1">公开</Radio>
                        <Radio value="2">部分公开</Radio>
                        <Radio value="3">不公开</Radio>
                      </Radio.Group>
                    )}
                    <FormItem style={{ marginBottom: 0 }}>
                      {getFieldDecorator('publicUsers')(
                        <Select
                          mode="multiple"
                          placeholder="公开给"
                          style={{
                            margin: '8px 0',
                            display: getFieldValue('public') === '2' ? 'block' : 'none',
                          }}
                        >
                          <Option value="1">同事甲</Option>
                          <Option value="2">同事乙</Option>
                          <Option value="3">同事丙</Option>
                        </Select>
                      )}
                    </FormItem>
                  </div>
                </FormItem>
                <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                    提交
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.props.goBack}>取消</Button>
                </FormItem>
              </Form>
            </Card>
          </PageHeaderWrapper>
        );
    }
  }
}

export default BasicForms;
