import React from 'react';
import { Card, Form, Input, Button, Row, Col, Upload, Typography, message, Radio, Space } from 'antd';
import { SaveOutlined, InboxOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

interface MediaItem {
  url: string;
  type: 'image' | 'video';
  caption: string;
}

interface PopupConfig {
  title: string;
  topDescription: string;
  bottomDescription: string;
  media: {
    left: MediaItem;
    right: MediaItem;
  };
}

const IntroPopupConfig: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Saved values:', values);
    message.success('介绍弹窗配置已保存');
  };

  const initialValues: PopupConfig = {
    title: '返乡创业园详情',
    topDescription: '鹤峰乡返乡创业园是重庆市奉节县重点建设的市级农民工返乡创业园，已建成标准化厂房6600平方米，以食品及农产品加工为主导产业，通过政策扶持吸引企业入驻，带动地方经济发展。',
    bottomDescription: '园区配套设施完善，提供一站式企业服务。包括工商注册、税务登记、法律咨询等。未来规划建设二期工程，预计新增厂房面积10000平方米，进一步扩大产业规模。',
    media: {
      left: {
        url: '',
        type: 'image',
        caption: '园区全景图'
      },
      right: {
        url: '',
        type: 'image',
        caption: '标准化厂房实景'
      }
    }
  };

  // Mock upload props
  const uploadProps = {
    name: 'file',
    multiple: false,
    action: 'https://run.mocky.io/v3/435ba68c-f2a8-40c4-8e1e-078421337b29', // Mock URL
    onChange(info: any) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} 上传成功.`);
      } else if (status === 'error') {
        // message.error(`${info.file.name} 上传失败.`); // Suppress error for mock
        message.success(`${info.file.name} 上传成功 (模拟).`);
      }
    },
    onDrop(e: any) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const renderMediaUpload = (position: 'left' | 'right', label: string) => (
    <Card type="inner" title={label} className="bg-gray-50">
      <Form.Item
        name={['media', position, 'type']}
        label="媒体类型"
        initialValue="image"
      >
        <Radio.Group>
          <Radio value="image">图片</Radio>
          <Radio value="video">视频</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="上传文件"
        extra="支持 JPG, PNG, MP4 格式"
      >
        <Dragger {...uploadProps} style={{ background: '#fff' }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        </Dragger>
      </Form.Item>

      <Form.Item
        name={['media', position, 'caption']}
        label="标题/描述"
      >
        <Input placeholder="请输入媒体描述文字" />
      </Form.Item>
    </Card>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Title level={3} style={{ margin: 0 }}>介绍弹窗配置</Title>
          <span className="text-gray-500">配置大屏中点击详情后弹出的图文介绍内容</span>
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
        <Row gutter={24}>
          {/* Left Column: Text Content */}
          <Col xs={24} lg={12}>
            <Card title="文本内容配置" className="shadow-sm h-full" bordered={false}>
              <Form.Item label="弹窗标题" name="title" rules={[{ required: true }]}>
                <Input size="large" placeholder="例如：返乡创业园详情" />
              </Form.Item>

              <Form.Item label="上部简介内容" name="topDescription">
                <TextArea
                  rows={6}
                  placeholder="请输入展示在媒体上方的简介文本..."
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <Form.Item label="下部详细内容" name="bottomDescription">
                <TextArea
                  rows={8}
                  placeholder="请输入展示在媒体下方的详细文本..."
                  showCount
                  maxLength={1000}
                />
              </Form.Item>
            </Card>
          </Col>

          {/* Right Column: Media Content */}
          <Col xs={24} lg={12}>
            <Card title="多媒体展示配置" className="shadow-sm h-full" bordered={false}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {renderMediaUpload('left', '左侧媒体位')}
                {renderMediaUpload('right', '右侧媒体位')}
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default IntroPopupConfig;
