
![Maintained][maintained-badge]
[![Make a pull request][prs-badge]][prs]
[![License][license-badge]](LICENSE)

[![Linux Build][linux-build-badge]][linux-build]
[![MacOS Build][macos-build-badge]][macos-build]
[![Windows Build][windows-build-badge]][windows-build]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

# Branchie：超级简单的开源 HTML5 互动视频播放器

![fsm](https://raw.githubusercontent.com/oldrev/branchie/master/docs/screen-shot.jpg)


本项目基于有限状态机原理实现了一个功能类似《哔哩哔哩》网站的 HTML5 互动视频播放器，支持视频分支计分和条件判断表达式等高级功能。

为了便于演示本项目使用 Electron + Angular 框架开发了本机 GUI App，但播放器本身为纯前端 TypeScript 实现，无需服务器后端特殊支持。用户有需要可以很轻易的修改为在线播放器。

本项目的介绍视频：

* [YouTube: TODO]()
* [哔哩哔哩: TODO]()

演示用的视频片段已打包在构建好的 `zip` 包中，右边“Releases”中可以直接下载测试。

如果觉得项目有用，可以帮我点个星星，这对我非常有帮助。

# 上手指南

## 启动及运行

本项目使用 `pnpm` 安装包和管理项目。

首先通过命令行进入本项目根目录，通过 `pnpm` 安装依赖：

```bash
$> pnpm install -g @angular/cli
$> pnpm install 
$> cd app
$> pnpm install
```

开发模式运行：

```bash
$> npm start
```

构建可执行文件（构建结果根据当前操作系统而定）：
```bash
$> npm run electron:build
```

编译完成即可在 `./release` 中看到。

## 关于演示视频

演示视频在 `demo-video` 中，可以参考 `branchie-video.xml` 中的格式，具体请见介绍视频及源代码。

# 版权

版权所有 &copy; 2022-TODAY 李维。保留所有权利。

本项目采用 [GPL-3.0](https://github.com/oldrev/branchie/blob/master/LICENSE) 和私有双重授权，可免费用于开源项目，商业闭源项目使用请联系[作者](https://github.com/oldrev)获取商业版授权（还有 .NET WPF 实现的版本等）。

**注意：本项目为演示项目，作者不提供任何担保。**

## 联系作者

* 邮箱： `oldrev<AT>gmail.com`
* QQ: 55431671

**超巨型广告：没事儿时可以承接PCB 画板打样/STM32/ESP32/压水晶头/后端/前端/中老年陪聊等软硬件项目开发业务**

## 鸣谢

没有如下开源项目和素材的支持本项目不可能轻易实现，非常感谢：

* 初始项目模板：[AngularElectron](https://img.shields.io/badge/maintained-yes-brightgreen)
* [stateless]()
* [toml-js]()
* [xml2js]()
* [`expression-eval`]()
* [三连动画](https://www.bilibili.com/video/av96347968/)


[maintained-badge]: https://img.shields.io/badge/maintained-yes-brightgreen
[license-badge]: https://img.shields.io/badge/license-GPL3.0-blue.svg
[license]: https://github.com/oldrev/branchie/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-red.svg
[prs]: http://makeapullrequest.com

[linux-build-badge]: https://github.com/oldrev/branchie/workflows/Linux%20Build/badge.svg
[linux-build]: https://github.com/oldrev/branchie/actions?query=workflow%3A%22Linux+Build%22
[macos-build-badge]: https://github.com/oldrev/branchie/workflows/MacOS%20Build/badge.svg
[macos-build]: https://github.com/oldrev/branchie/actions?query=workflow%3A%22MacOS+Build%22
[windows-build-badge]: https://github.com/oldrev/branchie/workflows/Windows%20Build/badge.svg
[windows-build]: https://github.com/oldrev/branchie/actions?query=workflow%3A%22Windows+Build%22

[github-watch-badge]: https://img.shields.io/github/watchers/oldrev/branchie.svg?style=social
[github-watch]: https://github.com/oldrev/branchie/watchers
[github-star-badge]: https://img.shields.io/github/stars/oldrev/branchie.svg?style=social
[github-star]: https://github.com/oldrev/branchie/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%Branchie!%20https://github.com/oldrev/branchie%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/oldrev/branchie.svg?style=social
