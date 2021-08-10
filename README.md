# whistle.savefor-mock

### whistle 懒人插件
在需要新建mock数据时，自动保存 responseBody 到指定路径，并生成对应规则到剪切板

### 安装
#### whistle
请参考：[https://github.com/avwo/whistle#whistle](https://github.com/avwo/whistle#whistle)

#### whistle.savefor-mock
- `$ npm install -g whistle.savefor-mock`
- 在 Plugins 模块中开启插件

### 使用示例
![image](https://user-images.githubusercontent.com/25118028/128805193-dbe1e460-7793-49f9-919c-d0d4a3c0d8c1.gif)

- 接口：豆瓣 - 影视分类
- 找到接口 API 后，建立规则：`movie.douban.com/j/new_search_subjects savefor-mock://movie`
- 下一次刷新页面后，该接口数据便自动保存到 `默认路径/movie.json`（默认路径可配置）
- 可配置自动打开保存的文件，以立刻编辑 mock 数据（需先[配置 VS Code 环境变量](https://doc.zzax.io/t/vscode/setup/config-code-env/)）
- 此时还会自动生成代理规则，并拷贝到剪切板，形如：`**/j/new_search_subjects file://默认路径/movie.json`，粘贴到 `Rules` 后即可开始代理

### 配置面板
![image](https://user-images.githubusercontent.com/25118028/128805352-127801f3-d6cf-4878-b0d4-755d51b7c823.png)