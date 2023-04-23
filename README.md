## ray for JS
JS implementation for spatie ray.

### Usage
Import  JS file into your DOM.
```html
<script src="ray.js"></script>
```

#### Configuration
There are some values you can configure. Default settings are compatible with ray defaults.
Ray uses `host_name` to bundle your messages. This lib will choose a `host_name` randomly if you don't.   
```javascript
debug.ray.config(
    {
        host: '127.0.0.1',
        port: 23517,
        host_name: 'test-app'
    }
);
```

```javascript
debug.ray.config({host_name: 'test-app'});

debug.ray.dump('hello there');
debug.ray.json({debug:true});
debug.ray.log('this is a log message');
debug.ray.notify('you should see a notification');
debug.ray.time();

debug.ray.custom(true, 'boolean');
debug.ray.custom({debug:true}, 'json');
```

You also can apply colors. Supported colors are
* green
* red
* orange
* gray
* blue
* purple

````javascript
debug.ray.dump('hello there').green();
debug.ray.dump('hello there').red();
````

