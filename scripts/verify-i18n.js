/**
 * 验证国际化插件是否正确安装和配置
 */

const fs = require('fs');
const path = require('path');

function checkI18nInstallation() {
  console.log('🔍 验证国际化插件安装...\n');

  // 1. 检查 package.json 中的依赖
  console.log('1. 检查 package.json 依赖...');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (dependencies['@strapi/i18n']) {
      console.log('✅ @strapi/i18n 插件已安装:', dependencies['@strapi/i18n']);
    } else {
      console.log('❌ @strapi/i18n 插件未安装');
      return false;
    }
  } catch (error) {
    console.log('❌ 无法读取 package.json:', error.message);
    return false;
  }

  // 2. 检查 node_modules 中的插件
  console.log('\n2. 检查 node_modules 中的插件...');
  const i18nPath = path.join('node_modules', '@strapi', 'i18n');
  if (fs.existsSync(i18nPath)) {
    console.log('✅ @strapi/i18n 插件文件存在');
  } else {
    console.log('❌ @strapi/i18n 插件文件不存在');
    return false;
  }

  // 3. 检查插件配置
  console.log('\n3. 检查插件配置...');
  try {
    const pluginsConfig = fs.readFileSync('config/plugins.ts', 'utf8');
    if (pluginsConfig.includes('i18n') && pluginsConfig.includes('enabled: true')) {
      console.log('✅ 插件配置正确');
    } else {
      console.log('❌ 插件配置不正确');
      console.log('当前配置:', pluginsConfig);
      return false;
    }
  } catch (error) {
    console.log('❌ 无法读取插件配置:', error.message);
    return false;
  }

  // 4. 检查作者模型配置
  console.log('\n4. 检查作者模型配置...');
  try {
    const schemaPath = 'src/api/author/content-types/author/schema.json';
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    
    if (schema.pluginOptions?.i18n?.localized) {
      console.log('✅ 作者模型已启用国际化');
    } else {
      console.log('❌ 作者模型未启用国际化');
      return false;
    }

    // 检查哪些字段启用了国际化
    const localizedFields = [];
    Object.entries(schema.attributes).forEach(([fieldName, fieldConfig]) => {
      if (fieldConfig.pluginOptions?.i18n?.localized) {
        localizedFields.push(fieldName);
      }
    });
    
    if (localizedFields.length > 0) {
      console.log('✅ 可本地化的字段:', localizedFields.join(', '));
    } else {
      console.log('⚠️  没有字段启用国际化');
    }
  } catch (error) {
    console.log('❌ 无法读取作者模型配置:', error.message);
    return false;
  }

  // 5. 检查默认语言配置
  console.log('\n5. 检查默认语言配置...');
  try {
    const pluginsConfig = fs.readFileSync('config/plugins.ts', 'utf8');
    if (pluginsConfig.includes("defaultLocale: 'ja'")) {
      console.log('✅ 默认语言设置为日文 (ja)');
    } else {
      console.log('❌ 默认语言未设置为日文');
    }
  } catch (error) {
    console.log('❌ 无法检查默认语言配置:', error.message);
  }

  console.log('\n🎉 国际化插件验证完成！');
  console.log('\n📝 如果所有检查都通过，请：');
  console.log('1. 访问 http://localhost:1337/admin');
  console.log('2. 在管理后台查看作者内容类型');
  console.log('3. 应该能看到多语言选项和日文作为默认语言');
  
  return true;
}

checkI18nInstallation();
