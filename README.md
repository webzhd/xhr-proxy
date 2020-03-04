### 前端HTTP代理
****    


#### 主要功能：

1. 拦截页面所有http请求：

    > 实现方式参考

    1. 注入XMLHttpRequest和fetch接口拦截页面所有Ajax请求。
    2. 通过MutationObserver拦截所有DOM src产生的http请求。



2. 拦截服务器的Response响应，可返回新的Response。



#### API：


```js
​	start() // 注入拦截

​	destroy() // 销毁拦截

​	get(url, callback ) // 拦截指定url的get请求，callback(requst, response, next, skip)

​	post(url,  callback) // 拦截指定url的post请求，callback(requst, response, next, skip)

```


##### callback回调参数

    1. request:

        1. setUrl(<string>) - 设置请求url

        2. setMethod(<string>) - 设置请求方法

        3. setBody(<any>) - 设置请求实体，或src资源路径



    2. response:

        1. setStatus(<number>) - 设置响应状态（如： 200）

        2. setBody(<any>) - 设置响应实体，或src资源



    3. next() 忽略所有设置，返回和发送真实数据



    4. skip() 跳过xhr，不往服务器发送数据，直接返回设置数据

