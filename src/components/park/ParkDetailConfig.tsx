import React from 'react';
import { Card, Form, Input, InputNumber, Button, Select, Row, Col, Space, Typography, Divider, message } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title } = Typography;

const ParkDetailConfig: React.FC = () => {
  const [form] = Form.useForm();

  // Mock data for video sources
  const videoOptions = [
    { label: "大门监控", value: "gate" },
    { label: "厂房A区", value: "factory_a" },
    { label: "厂房B区", value: "factory_b" },
    { label: "物流通道", value: "logistics" },
    { label: "暂无信号", value: "none" },
  ];

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
    message.success('配置已保存');
  };

  // Helper to calculate usage rate if needed, though we might just let user input it
  const handleAreaChange = () => {
    const total = form.getFieldValue(['basicInfo', 'totalArea']);
    const used = form.getFieldValue(['basicInfo', 'usedArea']);
    if (total && used) {
      const rate = ((used / total) * 100).toFixed(1);
      form.setFieldValue(['basicInfo', 'usageRate'], rate);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Title level={3} style={{ margin: 0 }}>园区详情页配置</Title>
          <span className="text-gray-500">配置大屏展示的园区基础信息、企业列表及各项统计指标</span>
        </div>
        <Button type="primary" icon={<SaveOutlined />} size="large" onClick={() => form.submit()}>
          保存配置
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          basicInfo: {
            intro: '鹤峰乡返乡创业园是重庆市奉节县重点建设的市级农民工返乡创业园，已建成标准化厂房6600平方米，以食品及农产品加工为主导产业，通过政策扶持吸引企业入驻，带动地方经济发展。',
            totalArea: 1250,
            usedArea: 980,
            usageRate: 78.4,
            adminName: '曾老师',
            contact: '13983886666'
          },
          enterprises: [
            { name: '奉节工业园区地块名称' },
            { name: '奉节工业园区地块名称' },
            { name: '奉节工业园区地块名称' },
            { name: '奉节工业园区地块名称' },
          ],
          videoSources: ['gate', 'factory_a', 'factory_b', 'logistics'],
          outputValue: {
            quarterly: 0.38,
            quarterlyGrowth: 6.8,
            annual: 1.51,
            annualGrowth: 12.3,
          },
          industries: [
            { name: '工业', value: 210 },
            { name: '科技', value: 210 },
            { name: '农业', value: 210 },
            { name: '物流', value: 210 },
            { name: '其他', value: 210 },
          ],
          employment: {
            total: 4320,
            totalGrowth: 8.5,
            driven: 5832,
            drivenGrowth: 10.2,
            trendData: '1500, 3000, 2800, 3200, 2500, 3500, 4000, 3800, 4200, 4500, 5000, 5500'
          },
          finance: {
            totalLoan: 4320,
            growthRate: 8.5,
            chartData: '2000, 3000, 2500, 4000, 3500, 4500, 5000, 4800, 5200, 5500, 6000, 5800'
          }
        }}
      >
        <Row gutter={24}>
          {/* Left Column: Basic Info, Enterprises, Video */}
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              
              {/* Card A: 园区基础信息 */}
              <Card title="园区基础信息" bordered={false} className="shadow-sm">
                <Form.Item label="园区介绍文本" name={['basicInfo', 'intro']}>
                  <TextArea rows={4} placeholder="请输入园区介绍..." />
                </Form.Item>
                
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="总面积 (亩)" name={['basicInfo', 'totalArea']}>
                      <InputNumber style={{ width: '100%' }} onChange={handleAreaChange} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="已使用面积 (亩)" name={['basicInfo', 'usedArea']}>
                      <InputNumber style={{ width: '100%' }} onChange={handleAreaChange} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="使用率 (%)" name={['basicInfo', 'usageRate']}>
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="管理员姓名" name={['basicInfo', 'adminName']}>
                      <Input placeholder="请输入管理员姓名" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="联系方式" name={['basicInfo', 'contact']}>
                      <Input placeholder="请输入联系电话" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Card B: 入驻企业列表 */}
              <Card title="入驻企业列表" bordered={false} className="shadow-sm" extra={<span className="text-gray-400 text-xs">动态展示在大屏左侧列表</span>}>
                <Form.List name="enterprises">
                  {(fields, { add, remove }) => (
                    <>
                      <div className="max-h-[300px] overflow-y-auto pr-2">
                        {fields.map(({ key, name, ...restField }, index) => (
                          <div key={key} className="flex items-center mb-3 gap-2">
                            <span className="w-8 text-gray-400 font-mono">{index + 1}.</span>
                            <Form.Item
                              {...restField}
                              name={[name, 'name']}
                              noStyle
                              rules={[{ required: true, message: '请输入企业名称' }]}
                            >
                              <Input placeholder="企业名称" />
                            </Form.Item>
                            <Button 
                              type="text" 
                              danger 
                              icon={<DeleteOutlined />} 
                              onClick={() => remove(name)} 
                            />
                          </div>
                        ))}
                      </div>
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          添加企业
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Card>

              {/* Card C: 视频监控源设置 */}
              <Card title="视频监控源设置" bordered={false} className="shadow-sm">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item label="左上窗口" name={['videoSources', 0]}>
                      <Select options={videoOptions} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="右上窗口" name={['videoSources', 1]}>
                      <Select options={videoOptions} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="左下窗口" name={['videoSources', 2]}>
                      <Select options={videoOptions} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="右下窗口" name={['videoSources', 3]}>
                      <Select options={videoOptions} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

            </Space>
          </Col>

          {/* Right Column: Output Value, Employment, Finance */}
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              
              {/* Card D: 园区产值指标 */}
              <Card title="园区产值指标" bordered={false} className="shadow-sm">
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="季度产值(亿元)" name={['outputValue', 'quarterly']}>
                      <InputNumber style={{ width: '100%' }} step={0.01} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="环比增长(%)" name={['outputValue', 'quarterlyGrowth']}>
                      <InputNumber style={{ width: '100%' }} step={0.1} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="年度产值(亿元)" name={['outputValue', 'annual']}>
                      <InputNumber style={{ width: '100%' }} step={0.01} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="同比增长(%)" name={['outputValue', 'annualGrowth']}>
                      <InputNumber style={{ width: '100%' }} step={0.1} />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Divider orientation="left" plain>产业占比 (饼图数据)</Divider>
                
                <Form.List name="industries">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row key={key} gutter={8} align="middle" className="mb-2">
                          <Col span={10}>
                            <Form.Item
                              {...restField}
                              name={[name, 'name']}
                              noStyle
                              rules={[{ required: true, message: '请输入产业名称' }]}
                            >
                              <Input placeholder="产业名称" />
                            </Form.Item>
                          </Col>
                          <Col span={10}>
                            <Form.Item
                              {...restField}
                              name={[name, 'value']}
                              noStyle
                              rules={[{ required: true, message: '请输入数值' }]}
                            >
                              <InputNumber placeholder="数值" style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Button 
                              type="text" 
                              danger 
                              icon={<DeleteOutlined />} 
                              onClick={() => remove(name)} 
                            />
                          </Col>
                        </Row>
                      ))}
                      <Form.Item className="mt-2">
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          添加产业数据
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Card>

              {/* Card E: 用工统计指标 */}
              <Card title="用工统计指标" bordered={false} className="shadow-sm">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="用工总数 (人)" name={['employment', 'total']}>
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="用工增长 (%)" name={['employment', 'totalGrowth']}>
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="带动就业 (人)" name={['employment', 'driven']}>
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="就业增长 (%)" name={['employment', 'drivenGrowth']}>
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item 
                  label="趋势图数据 (逗号分隔数值)" 
                  name={['employment', 'trendData']}
                  help="请输入12个月份的数值，用英文逗号分隔，如: 100,200,150..."
                >
                  <Input.TextArea rows={2} />
                </Form.Item>
              </Card>

              {/* Card F: 金融贷款指标 */}
              <Card title="金融贷款指标" bordered={false} className="shadow-sm">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="贷款总额 (亿元)" name={['finance', 'totalLoan']}>
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="增长率 (%)" name={['finance', 'growthRate']}>
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item 
                  label="柱状图数据 (逗号分隔数值)" 
                  name={['finance', 'chartData']}
                  help="请输入各阶段贷款金额，用英文逗号分隔"
                >
                  <Input.TextArea rows={2} />
                </Form.Item>
              </Card>

            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ParkDetailConfig;
