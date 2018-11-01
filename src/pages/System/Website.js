import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Upload,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import WebsiteDetail from '@/pages/System/WebsiteDetail';
import CreateForm from '@/pages/System/BasicForm';

import styles from './Website.less';

//http://lucifier129.github.io/ant-design/components/upload/

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const attentionMap = ['default', 'processing'];
const attention = ['高', '低'];

@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        ipAddress: props.values.ipAddress,
        confPath: props.values.confPath,
        key: props.values.key,
      }
    }
  }
  render() {
    const { form, handleUpdate, updateModalVisible, handleUpdateModalVisible } = this.props;
    const { formVals } = this.state;
    //console.log(formVals)
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleUpdate(fieldsValue);
      });
    };
    return (
      <Modal
        destroyOnClose
        title="更新商户"
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="网站名">
          {form.getFieldDecorator('websiteName', {
            jobs: [{ required: true, message: '请输入网站名！', min: 20 }],
            initialValue: formVals.websiteName,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="域名">
          {form.getFieldDecorator('domainName', {
            jobs: [{ required: true, message: '请输入域名！', min: 20 }],
            initialValue: formVals.domainName,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="一级分类">
          {form.getFieldDecorator('industry1', {
            jobs: [{ required: true, message: '请输入一级分类！', min: 20 }],
            initialValue: formVals.industry1,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="二级分类">
          {form.getFieldDecorator('industry2', {
            jobs: [{ required: true, message: '请输入二级分类！', min: 20 }],
            initialValue: formVals.industry2,
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

@Form.create()
class CreateForm1 extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        ipAddress: '',
        confPath: '',
        key: '',
        target: '0',
        version: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }


  handleNext = currentStep => {
    //console.log(this.props)
    //console.log(this.state)
    const { form, handleAdd } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      //console.log(formVals)
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            //console.log(formVals)
            handleAdd(formVals);
          }
        }
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  cancel = () => {
    const { handleModalVisible } = this.props;
    this.setState({
      currentStep: 0,
    });
    handleModalVisible();
  };

  renderContent = (currentStep, formVals) => {
    const { form } = this.props;

    if (currentStep === 1) {
      return [
        <FormItem key="attention" {...this.formLayout} label="重要度">
          {form.getFieldDecorator('attention', {
            initialValue: formVals.attention,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">低</Option>
              <Option value="1">高</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="type" {...this.formLayout} label="立即生效">
          {form.getFieldDecorator('type', {
            initialValue: formVals.type,
          })(
            <RadioGroup>
              <Radio value="0">否</Radio>
              <Radio value="1">是</Radio>
            </RadioGroup>
          )}
        </FormItem>,
      ];
    }
    if (currentStep === 2) {
      return [
        <FormItem key="time" {...this.formLayout} label="开始时间">
          {form.getFieldDecorator('time', {
            jobs: [{ required: true, message: '请选择开始时间！' }],
          })(
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择开始时间"
            />
          )}
        </FormItem>,
      ];
    }
    return [
      <FormItem key="merchantName" {...this.formLayout} label="商户名">
        {form.getFieldDecorator('merchantName', {
          initialValue: formVals.merchantName,
          jobs: [{ required: true, message: '请输入商户名！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="websiteName" {...this.formLayout} label="网站名">
        {form.getFieldDecorator('websiteName', {
          initialValue: formVals.websiteName,
          jobs: [{ required: true, message: '请输入网站名！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="domainName" {...this.formLayout} label="域名">
        {form.getFieldDecorator('domainName', {
          initialValue: formVals.domainName,
          jobs: [{ required: true, message: '请输入域名！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="industry1" {...this.formLayout} label="一级分类">
        {form.getFieldDecorator('industry1', {
          initialValue: formVals.industry1,
          jobs: [{ required: true, message: '请输入一级分类！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="industry2" {...this.formLayout} label="二级分类">
        {form.getFieldDecorator('industry2', {
          initialValue: formVals.industry2,
          jobs: [{ required: true, message: '请输入二级分类！', min: 5 }],
        })(<TextArea rows={4} placeholder="请输入二级分类" />)}
      </FormItem>,
    ];
  };

  renderFooter = currentStep => {
    const { handleModalVisible } = this.props;
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={this.cancel}>
          取消
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          下一步
        </Button>,
      ];
    }
    if (currentStep === 2) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={this.cancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          完成
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={this.cancel}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ];
  };

  render() {
    const { modalVisible, handleModalVisible } = this.props;
    const { currentStep, formVals } = this.state;

    //console.log(this.state)
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="接口配置"
        visible={modalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleModalVisible()}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="基本信息" />
          <Step title="版本信息" />
          <Step title="设定调度周期" />
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

@Form.create()
class ImportForm extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { importModalVisible, handleImportModalVisible } = this.props;


    const props = {
      name: 'file',
      action: '/api/website/import',
      listType: 'picture',
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          //handleImportModalVisible();
          message.success(`${info.file.name} 上传成功。`);
        } else if (info.file.status === 'error') {
          //handleImportModalVisible();
          message.error(`${info.file.name} 上传失败。`);
        }
      }
    };
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="批量导入"
        visible={importModalVisible}
        footer={[<Button key="back" type="ghost" onClick={() => handleImportModalVisible()}>取消</Button>]}

      >
        <Upload {...props}>
          <Button type="ghost">
            <Icon type="upload" /> 点击上传
    </Button>
        </Upload>
      </Modal>
    );
  }
}
/* eslint react/no-multi-comp:0 */
@connect(({ website, loading }) => ({
  website,
  loading: loading.models.website,
}))
@Form.create()
class Website extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    importModalVisible: false,
    isPage: true,
    isCreate: false,
  };

  columns = [
    {
      title: '商户名',
      dataIndex: 'merchantName',
    },
    {
      title: '域名',
      dataIndex: 'domainName',
    },
    {
      title: '网站名',
      dataIndex: 'websiteName',
    },
    {
      title: '一级分类',
      dataIndex: 'industry1',
    },
    {
      title: '二级分类',
      dataIndex: 'industry2',
    },

    {
      title: '重要度',
      dataIndex: 'attention',
      filters: [
        {
          text: attention[0],
          value: 0,
        },
        {
          text: attention[1],
          value: 1,
        },
      ],
      render(val) {
        return <Badge status={attentionMap[val]} text={attention[val]} />;
      },
    },
    {
      title: '最近更新时间',
      dataIndex: 'updatedAt',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a icon="edit" onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.goDetail(record)}>详情</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'website/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'website/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'website/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'website/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'website/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  goDetail = (record) => {
    this.setState({ isPage: false, values: record });
  };
  goCreate = () => {
    this.setState({ isCreate: true, isPage: false });
  };
  goBack = () => { this.setState({ isPage: true }); }


  goPage = () => { this.setState({ isCreate: false, isPage: true }); }

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'website/add',
      payload: {
        merchantName: fields.merchantName,
        websiteName: fields.websiteName,
        domainName: fields.domainName,
        industry1: fields.industry1,
        industry2: fields.industry2,
        attention: fields.attention,
      },
    });
    message.success('添加成功');
    //this.handleModalVisible(false, 0);
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'website/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  handleImportModalVisible = (flag) => {
    this.setState({
      importModalVisible: !!flag,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="商户名">
              {getFieldDecorator('merchantName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="重要度">
              {getFieldDecorator('attention')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">低</Option>
                  <Option value="1">高</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="商户名">
              {getFieldDecorator('merchantName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="网站名">
              {getFieldDecorator('websiteName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="域名">
              {getFieldDecorator('domainName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="一级分类">
              {getFieldDecorator('industry1')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="二级分类">
              {getFieldDecorator('industry2')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="重要度">
              {getFieldDecorator('attention')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">低</Option>
                  <Option value="1">高</Option>
                </Select>
              )}
            </FormItem>
          </Col>

        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>

        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      website: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues, importModalVisible, isPage, isCreate } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    if (isPage) {
      return (
        <PageHeaderWrapper title="">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.goCreate()}>
                  新建
              </Button>
                <Button icon="arrow-down" type="ghost" onClick={() => this.handleImportModalVisible(true, 0)}>
                  批量导入
              </Button>
                <Button icon="plus" type="ghost" onClick={() => this.handleModalVisible(true, 0)}>
                  批量导出
              </Button>
                <Button icon="plus" type="ghost" onClick={() => this.handleModalVisible(true, 0)}>
                  模板下载
              </Button>
                {selectedRows.length > 0 && (
                  <span>
                    <Button>批量操作</Button>
                    <Dropdown overlay={menu}>
                      <Button>
                        更多操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                )}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          <ImportForm handleImportModalVisible={this.handleImportModalVisible} importModalVisible={importModalVisible} />
          <CreateForm1 {...parentMethods} modalVisible={modalVisible} />
          {stepFormValues && Object.keys(stepFormValues).length ? (
            <UpdateForm
              {...updateMethods}
              updateModalVisible={updateModalVisible}
              values={stepFormValues}
            />
          ) : null}
        </PageHeaderWrapper>
      );
    }
    if (isCreate) {
      return (<CreateForm goPage={this.goPage.bind(this)}></CreateForm>);
    }
    return (<WebsiteDetail values={this.state.values} goBack={this.goBack.bind(this)}></WebsiteDetail>);
  }
}

export default Website;
