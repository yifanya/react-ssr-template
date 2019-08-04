# react-ssr-template
React服务器端渲染，ts版本包含mobx/redux+redux-saga两种版本，按需加载，内部含有一个小demo。

# command
## development
npm run dev:client 开启webpack-dev-server  
npm run dev:server 开启服务器端development版本

## production
npm run build 打包文件  
npm run start 开启服务器端production版本。

# entry
src/client-entry 属于浏览器端渲染文件入口  
src/server-entry 属于服务器端渲染文件入口  

有需要可以拓展。

# router
/config/routers.ts 路由配置文件  
/components/RouterView 一个路由组件的简单封装，比较简单

# server
/node-server 服务器端渲染文件  
