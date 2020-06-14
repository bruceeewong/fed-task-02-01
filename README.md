# 拉勾教育 Part02 - Module01 脚手架&自动化构建

> 项目：模块 2 - Part 1 作业
>
> 提交者：王思哲 | 时间： 2020/06/13

## 简答题

### 1、谈谈你对工程化的初步认识，结合你之前遇到过的问题说出三个以上工程化能够解决问题或者带来的价值。

初步认识：工程化是指借助**脚手架工具**以及设计**自动化构建的工作流**，定义 **项目的创建-编码-预览/测试-代码提交-代码部署** 整个流程的规范与自动化实现。

问题 or 价值：

**1 重复页面模板代码的手动创建，低效且易错**

自己在做管理系统时有很多查询页格式多相似，仅仅是字段配置上不同；然而之前并不熟悉脚手架，只能写好一份代码模板，然后手动拷贝。并且页面代码不利于共享，有些依赖项手工复制容易遗漏，导致其他人使用不顺利。

学习完 Yeoman、Plop 等生成器工具以及 CLI 的实现的课程后，我觉得可以着手编写一个代码模板生成器解决重复且易出错的手工劳作。

**2 搞不清工程化、脚手架、自动化构建的关系**

工程化是借助工具去规范和定义整个编码的流程，脚手架是执行任务的工具，自动化构建是项目、代码的处理方案。

起码搞清楚了脚手架和自动化构建解决方案不是同一回事，Vue-CLI / create-react-app 等都是基于脚手架的项目集成方案。

课程中有使用 Yeoman 模拟实现 Vue-CLI 的项目创建，以及 CLI 的问答和任务执行的细节，搞明白了项目框架创建的流程。

后续学习的 grunt 和 gulp 更是让我对前端项目的自动化构建有了比较清晰的思路：

1. 对前端三大件: HTML / CSS / JS 都有各自的编译和压缩处理的过程，之间的引用也需要做处理
2. 对于静态资源仅仅是打包上线才做处理，本地开发减少这部分的处理有助于开发效率提升
3. 强化了插件化的思想，借助现有或者自己编写的插件，可以解决很多问题

**3 让团队工作更易配合、共享**

通过统一的工程化规范，让团队的成员拥有一致的开发环境和规范，减少沟通成本以及冲突的风险，提升团队协作能力。

### 2、你认为脚手架除了为我们创建项目结构，还有什么更深的意义？

脚手架我认为仅仅是一个执行命令的工具，更重要的是在其的能力之上去为实际的项目设计适合的方案，来高效解决实际问题。

跟了课程，体会到工程化的妙处，通过精心设计的解决方案来定制出不同的任务组合，搭配一系列工具的执行，将我们日常工作中重复、低效的工作得以规范和自动化。

所以更深的意义是，脚手架加上插件、解决方案，让灵活、强大的定制方案成为可能，去应对实际的各种需求。

## 编程题

### 1 概述脚手架实现的过程，并使用 NodeJS 完成一个自定义的小型脚手架工具

脚手架实现的过程：

1. 通过命令行交互询问用户问题
2. 根据用户回答，在指定的位置生成相应的文件。

基于 Yeoman 实现了一个后台管理系统的前端项目的快速搭建。

功能点：

1. 根据用户输入的工程名，创建 node package、页面的标题
2. 生成文件后，自动执行 npm 依赖包的安装

Github 地址：[https://github.com/bruceeewong/generator-bue-cms](https://github.com/bruceeewong/generator-bue-cms)

### 2 尝试使用 Gulp 完成 项目 的自动化构建

思考开发环境和生产环境的任务

#### 开发环境

整体思路：

1. 主要关注 HTML/SCSS/JS 资源的实时编译与加载
2. 静态资源不做特殊处理
3. 需要起一个本地服务器供我们开发调试代码。
4. 目录清理
5. 输出到指定目录，为了与正式环境目录区分开发，定义临时目录存放开发环境编译的代码。

##### 代码编译

1. HTML 的模板编译(借助`gulp-swig`)
2. Scss 的编译(借助`gulp-sass`)
3. JS 新特性代码编译成浏览器可执行的代码（借助`gulp-babel`）

#####　本地开发与代码热更新

借助 `browser-sync` 提供本地服务器功能;

配合 gulp 提供的 `watch` 监听开发目录下文件的变化，告知服务器重载资源 `bs.reload`

##### 处理引用

使用　`browser-sync` 的路由 `router` 功能将引用依赖项映射到本地资源去获取

##### 目录清理

使用 `del` 模块清理目录

#### 正式环境

整体思路：

1. HTML/SCSS/JS 资源的编译与压缩
2. 静态资源的压缩;
3. 根据引用注释，处理引用的关联以及第三方代码合并;
4. 目录清理
5. 将构建完成的文件输出到指定位置

#### 最终完成功能

##### 开发环境

1. 构建前目录清理
2. html/js/css 源代码编译,输出到临时目录
3. 本地服务器加载临时目录文件，监听 src 文件夹改动，热更新

##### 生产环境

1. 构建前目录清理
2. html/js/css 源代码编译,输出到临时目录
3. 处理文件引用，根据构建注释合并引用文件，html/css/js,静态资源文件压缩

### 3 使用 Grunt 完成 项目 的自动化构建

#### 最终完成功能

##### 开发环境

1. 构建前目录清理
2. html/js/css 源代码编译,输出到临时目录
3. 本地服务器加载临时目录文件

未完成：

1. 热更新（没搞懂并行任务怎么设置）

##### 生产环境

1. 构建前目录清理
2. html/js/css 源代码编译,输出到临时目录
3. html/css/js,静态资源文件压缩

未完成:

1. 引用部分的处理（不会用 grunt 的 useref）

## 解题思路视频（百度云盘）

辛苦老师检查，感恩

链接: [https://pan.baidu.com/s/1XDIbb3sJx7VVofTZn-8zow](https://pan.baidu.com/s/1XDIbb3sJx7VVofTZn-8zow)　提取码: `hhyw`
