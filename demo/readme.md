1. 根目录下 run, lerna bootstrap ,保证所有package 依赖健全
1. 根目录下npm i, 安装增加的rollup 包
1. 项目根目录下 npm run build, roll up 所有包成三种js模块化文件
1. demo目录下 npm i
1. npm link,链接命令
1. 在命令行里输入rsktest --compile,编译合约,确保本地全局安装了 truffle
1. 在命令行里输入rsktest --migrate,部署合约,成功之后会自动运行mint 和 send 合约函数