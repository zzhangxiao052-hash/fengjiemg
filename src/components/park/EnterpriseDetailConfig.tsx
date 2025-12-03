import React from 'react';
import { Card, Form, Input, InputNumber, DatePicker, Button, Select, Row, Col, Space, Typography, Divider, message, Table } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface EnterpriseBasicInfo {
  name: string;
  creditCode: string;
  phone: string;
  legalRep: string;
  email: string;
  regCapital: number;
  regDate: dayjs.Dayjs;
  industry: string;
  address: string;
  intro: string;
}

interface Metric {
  value: number;
  growthRate: number;
}

interface MonthlyData {
  month: string;
  value: number;
}

interface EnterpriseConfigData {
  basicInfo: EnterpriseBasicInfo;
  metrics: {
    employees: Metric;
    annualOutput: Metric;
    totalLoan: Metric;
  };
  monthlyTrend: MonthlyData[];
}

const EnterpriseDetailConfig: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Saved values:', values);
    message.success('企业详情页配置已保存');
  };

  // Initial values mock
  const initialValues = {
    basicInfo: {
      name: '重庆奉节生态农业科技有限公司',
      creditCode: '91500236MA60XXXXXX',
      phone: '023-56568888',
      legalRep: '王建国',
      email: 'info@fengjie-eco.com',
      regCapital: 1000,
      regDate: dayjs('2021-05-18'),
      industry: '农副食品加工业',
      address: '重庆市奉节县返乡创业园B区12栋',
      intro: '公司成立于2021年，是一家集农产品种植、加工、销售于一体的现代化农业企业。主要产品包括脐橙深加工系列、高山腊肉等，致力于通过科技创新提升农产品附加值，带动周边农户共同致富。',
    },
    metrics: {
      employees: { value: 158, growthRate: 12.5 },
      annualOutput: { value: 8500, growthRate: 23.4 },
      totalLoan: { value: 1200, growthRate: -5.2 },
    },
    monthlyTrend: Array.from({ length: 12 }, (_, i) => ({
      month: `${i + 1}月`,
      value: Math.floor(Math.random() * 500) + 300,
    })),
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Title level={3} style={{ margin: 0 }}>企业详情页配置</Title>
          <span className="text-gray-500">配置大屏展示的企业基础信息、经营指标及产值趋势</span>
        </div>
        <Button type="primary" icon={<SaveOutlined />} size="large" onClick={() => form.submit()}>
          保存配置
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onFinish}
      >
        {/* Area 1: Basic Info */}
        <Card title="企业基础信息配置" className="mb-6 shadow-sm" bordered={false}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="企业名称" name={['basicInfo', 'name']} rules={[{ required: true }]}>
                <Input placeholder="请输入企业全称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="统一社会信用代码" name={['basicInfo', 'creditCode']}>
                <Input placeholder="请输入18位信用代码" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="法定代表人" name={['basicInfo', 'legalRep']}>
                <Input placeholder="请输入法人姓名" />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item label="联系电话" name={['basicInfo', 'phone']}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="电子邮箱" name={['basicInfo', 'email']}>
                <Input placeholder="请输入电子邮箱" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="注册资本 (万元)" name={['basicInfo', 'regCapital']}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入注册资本" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="成立日期" name={['basicInfo', 'regDate']}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="所属行业" name={['basicInfo', 'industry']}>
                <Select placeholder="请选择行业">
                  <Select.Option value="农副食品加工业">农副食品加工业</Select.Option>
                  <Select.Option value="电子信息制造业">电子信息制造业</Select.Option>
                  <Select.Option value="现代物流业">现代物流业</Select.Option>
                  <Select.Option value="生物医药">生物医药</Select.Option>
                  <Select.Option value="其他">其他</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="企业地址" name={['basicInfo', 'address']}>
                <Input placeholder="请输入详细地址" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="企业介绍" name={['basicInfo', 'intro']}>
                <TextArea rows={4} placeholder="请输入企业简介，将展示在大屏详情页中..." showCount maxLength={500} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Area 2: Statistics & Trends */}
        <Card title="经营统计与趋势配置" className="shadow-sm" bordered={false}>
          
          <Divider orientation="left" plain>核心指标 (Key Metrics)</Divider>
          <Row gutter={24}>
            {/* Employee Count */}
            <Col span={8}>
              <Card type="inner" title="员工人数" size="small" className="bg-gray-50">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="当前人数 (人)" name={['metrics', 'employees', 'value']} style={{ marginBottom: 0 }}>
                      <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="同比涨跌 (%)" name={['metrics', 'employees', 'growthRate']} style={{ marginBottom: 0 }}>
                      <InputNumber 
                        style={{ width: '100%' }} 
                        formatter={value => `${value}%`} 
                        parser={value => value?.replace('%', '') as unknown as number} 
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Annual Output */}
            <Col span={8}>
              <Card type="inner" title="年产值" size="small" className="bg-gray-50">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="产值金额 (万元)" name={['metrics', 'annualOutput', 'value']} style={{ marginBottom: 0 }}>
                      <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="同比涨跌 (%)" name={['metrics', 'annualOutput', 'growthRate']} style={{ marginBottom: 0 }}>
                      <InputNumber 
                        style={{ width: '100%' }} 
                        formatter={value => `${value}%`} 
                        parser={value => value?.replace('%', '') as unknown as number} 
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Total Loan */}
            <Col span={8}>
              <Card type="inner" title="贷款总额" size="small" className="bg-gray-50">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="贷款金额 (万元)" name={['metrics', 'totalLoan', 'value']} style={{ marginBottom: 0 }}>
                      <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="同比涨跌 (%)" name={['metrics', 'totalLoan', 'growthRate']} style={{ marginBottom: 0 }}>
                      <InputNumber 
                        style={{ width: '100%' }} 
                        formatter={value => `${value}%`} 
                        parser={value => value?.replace('%', '') as unknown as number} 
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Divider orientation="left" plain style={{ marginTop: 32 }}>月度产值趋势 (Monthly Output Trend)</Divider>
          <div className="bg-gray-50 p-4 rounded-md">
            <Text type="secondary" className="block mb-4">请录入1-12月的产值数据，将用于生成大屏右侧的柱状图趋势。</Text>
            <Form.List name="monthlyTrend">
              {(fields) => (
                <Row gutter={[16, 16]}>
                  {fields.map((field, index) => (
                    <Col key={field.key} xs={12} sm={8} md={6} lg={4} xl={3}>
                      <div className="bg-white p-3 rounded border border-gray-200 text-center">
                        <div className="mb-2 font-medium text-gray-600">{index + 1}月</div>
                        <Form.Item
                          {...field}
                          name={[field.name, 'value']}
                          noStyle
                          rules={[{ required: true, message: '请输入' }]}
                        >
                          <InputNumber placeholder="产值" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'month']}
                          hidden
                          initialValue={`${index + 1}月`}
                        >
                          <Input />
                        </Form.Item>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </Form.List>
          </div>

        </Card>
      </Form>
    </div>
  );
};

export default EnterpriseDetailConfig;
