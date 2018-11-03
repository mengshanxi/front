import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
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
import Result from '@/components/Result';
import styles from './style.less';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;


@connect(({ edits, loading }) => ({
  edits,
  loading: loading.effects['edits/create'],
}))
@Form.create()
class EditForm extends PureComponent {
  constructor(props) {
    super(props);

  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'edits/create',
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'edits/submitRegularForm',
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

    const dateFormat = 'YYYY/MM/DD';
    const actions = (
      <Fragment>
        <Button type="primary" onClick={this.props.goPage}>
          <FormattedMessage id="app.result.success.btn-return" defaultMessage="Back to list" />
        </Button>
        <Button>
          <FormattedMessage id="app.result.success.btn-project" defaultMessage="View project" />
        </Button>
      </Fragment>
    );
    const {
      edits, formVals
    } = this.props;

    if (edits.step === 'success') {
      return (<PageHeaderWrapper>
        <Card bordered={false}>
          <Result
            type="success"
            title={formatMessage({ id: 'app.result.success.title' })}
            description={formatMessage({ id: 'app.result.success.description' })}
            actions={actions}
            style={{ marginTop: 48, marginBottom: 16 }}
          />
        </Card>
      </PageHeaderWrapper>);
    }
    if (edits.step === 'error') {
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
    }


    return (

      <PageHeaderWrapper
        title="编辑商户"
        content="表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="商户名">
              {getFieldDecorator('merchantName', {
                initialValue: formVals.merchantName,
                rules: [
                  {
                    required: true,
                    message: '请输入商户名',
                  },
                ],
              })(<Input placeholder="给目标起个名字" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="起止日期">
              {getFieldDecorator('updatedAt', {
                initialValue: [moment(formVals.start, dateFormat), moment(formVals.end, dateFormat)],
                rules: [
                  {
                    required: true,
                    message: '请选择起止日期',
                  },
                ],
              })(<RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator('desc', {
                initialValue: formVals.desc,
                rules: [
                  {
                    required: true,
                    message: '请输入描述',
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="请输入描述"
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  一级分类
                  <em className={styles.optional}>
                    （选填）
                    <Tooltip title="一级分类">
                      <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                    </Tooltip>
                  </em>
                </span>
              }
            >
              {getFieldDecorator('industry1',
                {
                  initialValue: formVals.industry1,
                })(
                  < Input placeholder="一级分类" />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  二级分类
                  <em className={styles.optional}>（选填）</em>
                </span>
              }
            >
              {getFieldDecorator('industry2',
                {
                  initialValue: formVals.industry2,
                })(
                  <Input placeholder="二级分类" />
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
              {getFieldDecorator('weight', { initialValue: formVals.weight, })(<InputNumber placeholder="请输入" min={0} max={100} />)}
              <span className="ant-form-text">%</span>
            </FormItem>

            <FormItem {...formItemLayout} label="目标公开" help="客户、邀评人默认被分享">
              <div>
                {getFieldDecorator('public', {
                  initialValue: formVals.public,
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
                      <Option value="1" >同事甲</Option>
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
      </PageHeaderWrapper >
    );
  }
}

export default EditForm;
