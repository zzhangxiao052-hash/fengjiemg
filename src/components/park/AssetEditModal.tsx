import React, { useEffect } from 'react';
import { ModalForm, ProFormText, ProFormSelect, ProFormDigit, ProFormDateRangePicker, ProFormDependency } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space } from 'antd';
import { Asset, AssetStatus, Zone } from '../../types/asset';

interface AssetEditModalProps {
  visible: boolean;
  onOpenChange: (visible: boolean) => void;
  onFinish: (values: any) => Promise<boolean>;
  asset: Asset | null;
  onTerminate: (assetId: string) => Promise<void>;
  zoneOptions?: { label: string; value: any }[];
}

export const AssetEditModal: React.FC<AssetEditModalProps> = ({
  visible,
  onOpenChange,
  onFinish,
  asset,
  onTerminate,
  zoneOptions
}) => {
  const isLeased = asset?.status === AssetStatus.LEASED;
  const isEditMode = !!asset; // 判断是否为编辑模式

  return (
    <ModalForm
      title="资产编辑"
      open={visible}
      onOpenChange={onOpenChange}
      onFinish={onFinish}
      initialValues={asset || {}}
      modalProps={{
        destroyOnClose: true
      }}
      width={600}
      submitter={{
        render: (props, defaultDoms) => {
          return [
            isLeased && (
              <Popconfirm
                key="terminate"
                title="确定要退租吗？"
                description="退租后资产状态将变更为空闲中，且清除租赁信息。"
                onConfirm={async () => {
                  if (asset) {
                    await onTerminate(asset.id);
                    onOpenChange(false);
                  }
                }}
                okText="确认退租"
                cancelText="取消"
              >
                <Button danger>
                  退租
                </Button>
              </Popconfirm>
            ),
            ...defaultDoms
          ];
        },
      }}
    >
      {zoneOptions && (
        <ProFormSelect
          name="zone"
          label="区域"
          rules={[{ required: true, message: '请选择区域' }]}
          options={zoneOptions}
          readonly={isEditMode}
        />
      )}
      <ProFormText
        name="addressCode"
        label="地址/房号"
        rules={[{ required: true, message: '请输入地址/房号' }]}
        readonly={isEditMode}
      />
      <ProFormDigit
        name="floorLevel"
        label="楼层"
        rules={[{ required: true, message: '请输入楼层' }]}
        fieldProps={{ precision: 0 }}
        readonly={isEditMode}
      />
      <ProFormDigit
        name="area"
        label="面积 (㎡)"
        rules={[{ required: true, message: '请输入面积' }]}
        fieldProps={{ precision: 2 }}
        readonly={isEditMode}
      />
      
      <ProFormSelect
        name="status"
        label="使用状态"
        rules={[{ required: true, message: '请选择状态' }]}
        options={[
          { label: '空闲中', value: AssetStatus.VACANT },
          { label: '租赁中', value: AssetStatus.LEASED },
          { label: '装修中', value: AssetStatus.DECORATION },
        ]}
        readonly={isEditMode}
      />

      <ProFormDependency name={['status']}>
        {({ status }) => {
          if (status === AssetStatus.LEASED) {
            return (
              <>
                <ProFormText
                  name="tenantName"
                  label="承租方"
                  rules={[{ required: true, message: '请输入承租方' }]}
                  readonly={isEditMode}
                />
                <ProFormDateRangePicker
                  name="leaseRange"
                  label="租赁周期"
                  rules={[{ required: true, message: '请选择租赁周期' }]}
                  transform={(values) => ({
                    leaseStartDate: values[0],
                    leaseEndDate: values[1],
                  })}
                />
              </>
            );
          }
          return null;
        }}
      </ProFormDependency>
    </ModalForm>
  );
};
