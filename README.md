#Navatar, the Node.js Avatar Generator
## Generate visually-pleasing, unique avatars using Node.js
[cool image][cool image][cool image] 
### Key Features
- Easily add randomly generated avatars to your existing Express application using the built-in middleware
- Generate fast SVG images that look good at any size

### Notes
- For production performance, it is recommended that you cache generated images as PNGs using your exisitng file server

### Usage
- First, install via NPM
```bash
npm install --save navatar
```

- Then, add as `express` MiddleWare...
```javascript
const { getNavatarMiddleware } = require('navatar');
const express = require(`express`);
const app = new express();
app.use('/avatar/:key.svg',getNavatarMiddleware());
app.listen(666);
```

Now, your `/avatar` route will serve up SVGs!

### Options
#### Custom width and height
Pass width and height as query paramaters to modify the size of the generated glyph. (It is recommended to use the same value for width and height.)

```javascript
//example
http://localhost/avatar/this-rocks.svg?height=150&width=150
```
