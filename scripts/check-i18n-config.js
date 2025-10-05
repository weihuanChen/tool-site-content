/**
 * 检查国际化配置的脚本
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:1337';

async function checkI18nConfig() {
  console.log('🔍 检查国际化配置...\n');

  try {
    // 1. 检查服务器状态
    console.log('1. 检查服务器状态...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/_health`);
      console.log('✅ 服务器运行正常');
    } catch (error) {
      console.log('❌ 服务器未响应:', error.message);
      return;
    }

    // 2. 检查 i18n 插件状态
    console.log('\n2. 检查 i18n 插件状态...');
    try {
      const i18nResponse = await axios.get(`${BASE_URL}/api/i18n/locales`);
      console.log('✅ i18n 插件已启用');
      console.log('📋 可用语言:', i18nResponse.data);
    } catch (error) {
      console.log('❌ i18n 插件未启用或配置错误:', error.response?.data?.error?.message || error.message);
    }

    // 3. 检查作者 API 的国际化支持
    console.log('\n3. 检查作者 API 的国际化支持...');
    try {
      // 尝试获取作者列表（可能需要认证）
      const authorsResponse = await axios.get(`${BASE_URL}/api/authors`);
      console.log('✅ 作者 API 可访问');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ 作者 API 可访问（需要认证）');
      } else {
        console.log('❌ 作者 API 访问失败:', error.response?.data?.error?.message || error.message);
      }
    }

    // 4. 检查内容类型配置
    console.log('\n4. 检查内容类型配置...');
    try {
      const contentTypeResponse = await axios.get(`${BASE_URL}/api/content-type-builder/content-types`);
      console.log('✅ 内容类型构建器可访问');
      
      // 查找作者内容类型
      const authorContentType = contentTypeResponse.data.data?.find(ct => ct.uid === 'api::author.author');
      if (authorContentType) {
        console.log('✅ 找到作者内容类型');
        if (authorContentType.pluginOptions?.i18n?.localized) {
          console.log('✅ 作者内容类型已启用国际化');
        } else {
          console.log('❌ 作者内容类型未启用国际化');
        }
      } else {
        console.log('❌ 未找到作者内容类型');
      }
    } catch (error) {
      console.log('❌ 内容类型构建器访问失败:', error.response?.data?.error?.message || error.message);
    }

    console.log('\n🎉 国际化配置检查完成！');
    console.log('\n📝 下一步：');
    console.log('1. 访问 http://localhost:1337/admin 创建管理员账户');
    console.log('2. 在管理后台查看作者内容类型是否有多语言选项');
    console.log('3. 创建测试作者数据验证国际化功能');

  } catch (error) {
    console.error('❌ 检查过程中发生错误:', error.message);
  }
}

checkI18nConfig().catch(console.error);
