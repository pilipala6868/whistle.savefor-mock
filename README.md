# whistle.savefor-mock

#### whistle 懒人插件
在需要新建mock数据时，自动保存 responseBody 到指定路径，并生成对应规则到剪切板

#### 使用示例
- 接口：豆瓣 - 影视分类
- 找到接口 API 后，建立规则：`movie.douban.com/j/new_search_subjects savefor-mock://movie`
- 下一次刷新页面后，该接口数据便自动保存到 `默认路径/movie.json`（默认路径可配置）
- 此时还会自动生成代理规则，并拷贝到剪切板，形如：`**/j/new_search_subjects file://默认路径/movie.json`，粘贴到 `Rules` 后即可开始代理

#### 配置面板
![image](https://user-images.githubusercontent.com/25118028/128326648-93664ed0-bcf0-4549-80fd-4ad39135e3b7.png)
