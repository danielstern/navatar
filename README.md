#Navatar, the Node.js Avatar Generator
## Generate visually-pleasing, unique avatars using Node.js
 <object data="https://navatar-demo.herokuapp.com/avatar/try-it!.svg">
 
 </object>
 
 ###[Check out the demo!](http://navatar-demo.herokuapp.com/)
### Key Features
- Easily add randomly generated avatars to your existing Express application using the built-in middleware
- Generate fast SVG images that look good at any size

### Notes
- For production performance, it is recommended that you cache generated images as PNGs using your exisitng file server
- No support for PNG files yet (you can optionally read the SVG from the route and convert into a PNG using `svg2png` - this process works but is slow)

### How it works
Navatar uses built-in algorithms to create cellular automata, a la Stephen Wolfram's ["A New Kind of Science"](http://www.wolframscience.com/nksonline/toc.html), which heavily influenced this project.
When the MiddleWare is invoked, an SVG is randomly generated based on the key provided, and sent to the user.
<!--
What you end up with is this:
<object data="https://navatar-demo.herokuapp.com/avatar/larry.svg"></object>
<object data="https://navatar-demo.herokuapp.com/avatar/curly.svg"></object>
<object data="https://navatar-demo.herokuapp.com/avatar/moe.svg"></object>-->

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

### Coming Soon!
- Support for additional tree-generation algorithms
- Better color palette support
- PNG support (one day!)

### License
[CC BY](https://creativecommons.org/licenses/by/4.0/)
