/**
 * 测试作者国际化功能的脚本
 * 使用方法: node scripts/test-i18n.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:1337/api';

// 测试数据
const testAuthors = {
  'zh-Hans': {
    username: 'test_author_zh',
    displayName: '测试作者',
    bio: '这是一个测试作者的个人简介',
    email: 'test@example.com',
    socialLinks: {
      github: 'https://github.com/test',
      twitter: 'https://twitter.com/test'
    }
  },
  'en': {
    username: 'test_author_en',
    displayName: 'Test Author',
    bio: 'This is a test author bio',
    email: 'test-en@example.com',
    socialLinks: {
      github: 'https://github.com/test',
      linkedin: 'https://linkedin.com/in/test'
    }
  },
  'ja': {
    username: 'test_author_ja',
    displayName: 'テスト作者',
    bio: 'これはテスト作者の自己紹介です',
    email: 'test-ja@example.com',
    socialLinks: {
      github: 'https://github.com/test',
      website: 'https://test.example.com'
    }
  }
};

async function testI18nAPI() {
  console.log('🚀 开始测试作者国际化 API...\n');

  try {
    // 1. 测试创建不同语言的作者
    console.log('1. 创建不同语言的作者...');
    const createdAuthors = {};
    
    for (const [locale, data] of Object.entries(testAuthors)) {
      try {
        const response = await axios.post(`${BASE_URL}/authors?locale=${locale}`, {
          data: data
        });
        createdAuthors[locale] = response.data.data;
        console.log(`✅ 成功创建 ${locale} 作者:`, response.data.data.displayName);
      } catch (error) {
        console.log(`❌ 创建 ${locale} 作者失败:`, error.response?.data?.error?.message || error.message);
      }
    }

    // 2. 测试获取特定语言的作者
    console.log('\n2. 测试获取特定语言的作者...');
    for (const locale of Object.keys(createdAuthors)) {
      try {
        const response = await axios.get(`${BASE_URL}/authors?locale=${locale}`);
        console.log(`✅ 获取 ${locale} 作者列表:`, response.data.data.length, '个作者');
      } catch (error) {
        console.log(`❌ 获取 ${locale} 作者列表失败:`, error.response?.data?.error?.message || error.message);
      }
    }

    // 3. 测试获取所有作者
    console.log('\n3. 测试获取所有作者...');
    try {
      const response = await axios.get(`${BASE_URL}/authors`);
      console.log('✅ 获取所有作者:', response.data.data.length, '个作者');
    } catch (error) {
      console.log('❌ 获取所有作者失败:', error.response?.data?.error?.message || error.message);
    }

    // 4. 测试获取作者的所有语言版本
    if (Object.keys(createdAuthors).length > 0) {
      console.log('\n4. 测试获取作者的所有语言版本...');
      const firstAuthorId = Object.values(createdAuthors)[0].id;
      try {
        const response = await axios.get(`${BASE_URL}/authors/${firstAuthorId}/all-locales`);
        console.log('✅ 获取作者所有语言版本:', response.data.data.localizations?.length || 0, '个本地化版本');
      } catch (error) {
        console.log('❌ 获取作者所有语言版本失败:', error.response?.data?.error?.message || error.message);
      }
    }

    // 5. 测试获取可用语言
    if (Object.keys(createdAuthors).length > 0) {
      console.log('\n5. 测试获取作者可用语言...');
      const firstAuthorId = Object.values(createdAuthors)[0].id;
      try {
        const response = await axios.get(`${BASE_URL}/authors/${firstAuthorId}/available-locales`);
        console.log('✅ 作者可用语言:', response.data.data);
      } catch (error) {
        console.log('❌ 获取作者可用语言失败:', error.response?.data?.error?.message || error.message);
      }
    }

    // 6. 测试多语言创建
    console.log('\n6. 测试多语言创建...');
    try {
      const response = await axios.post(`${BASE_URL}/authors/multi-locale`, {
        data: {
          username: 'multi_lang_author',
          displayName: '多语言作者',
          bio: '这是一个多语言作者',
          email: 'multi@example.com'
        },
        locales: ['zh-Hans', 'en']
      });
      console.log('✅ 多语言创建成功:', response.data.data.length, '个版本');
    } catch (error) {
      console.log('❌ 多语言创建失败:', error.response?.data?.error?.message || error.message);
    }

    console.log('\n🎉 国际化 API 测试完成！');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  }
}

// 检查服务器是否运行
async function checkServer() {
  try {
    await axios.get(`${BASE_URL.replace('/api', '')}/_health`);
    return true;
  } catch (error) {
    console.log('❌ 服务器未运行，请先启动 Strapi 服务器:');
    console.log('   npm run develop');
    return false;
  }
}

// 主函数
async function main() {
  console.log('🔍 检查服务器状态...');
  const isServerRunning = await checkServer();
  
  if (isServerRunning) {
    await testI18nAPI();
  }
}

main().catch(console.error);
