# fis-deploy-delete-unused-images
# fis 产出到某个目录后，删除未被引用到的图片

### 需求场景
+ 合并雪碧图之后的原图
+ 视觉调整，更换或加入图片
上面两种场景下，fis 产出的目录中都会存在没有被引用的图片。

===
### 解决方式
重写 deploy，使用新的产出方式，在产出之前，做图片的过滤处理，未被引用的图片不产出到指定目录。
+ 获取所有图片 allList
+ 获取 html （原来的 scss inline到 html 中了）和 js （xxx.async.scss 异步 css 会以 js 的方式引入）中引用的图片 usedList， 
  通过在内容中查找 allList 中相应的图片
+ 求差值，得到未被引用的图片 list， 这部分图片不产出到目录。

**疑问： 为啥不直接把 usedList 对应的图片产出到目录？**

`这里因为有 sprite 的问题，产出时会生成新的图片，但是不包含在 usedList 中`


===
### 安装

```
npm install -g fis-deploy-delete-unused-images
```

===
### 配置
+ modules 里面加上
  
  ```
  fis.config.merge({
      modules: {
          deploy: ['default', 'delete-unused-images']
      }
  });
  ```

+ settings 加上

  ```
  fis.config.set('settings.deploy.delete-unused-images', {
      publish : {
          from : '/',
          to: '../dist'
      }
  });
  
  ```
