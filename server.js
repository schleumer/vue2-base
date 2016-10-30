process.env.VUE_ENV = 'server'
const isProd = process.env.NODE_ENV === 'production'

const fs = require('fs')
const path = require('path')
const resolve = file => path.resolve(__dirname, file)
const express = require('express')
const favicon = require('serve-favicon')
const serialize = require('serialize-javascript')
const compression = require('compression')
const pug = require('pug')

const template = pug.compile(fs.readFileSync(resolve('./index.pug')), {});

// https://github.com/vuejs/vue/blob/next/packages/vue-server-renderer/README.md#why-use-bundlerenderer
const createBundleRenderer = require('vue-server-renderer').createBundleRenderer

const app = express()

// setup the server renderer, depending on dev/prod environment
let renderer

if (isProd) {
  // create server renderer from real fs
  const bundlePath = resolve('./dist/server-bundle.js')
  renderer = createRenderer(fs.readFileSync(bundlePath, 'utf-8'))
} else {
  require('./build/setup-dev-server')(app, bundle => {
    renderer = createRenderer(bundle)
  })
}

function createRenderer(bundle) {
  return createBundleRenderer(bundle, {
    cache: require('lru-cache')({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })
  })
}

app.use(compression({ threshold: 0 }))
app.use('/dist', express.static(resolve('./dist')))
app.use(favicon(resolve('./src/assets/logo.png')))

app.get('*', (req, res) => {
  const styles = []

  const scripts = [
    '/dist/client-vendor-bundle.js',
    '/dist/app-bundle.js'
  ]

  if (isProd)
    styles.push('/dist/styles.css')
  else
    scripts.push('/dist/style-bundle.js')

  if (req.query[ 'no-state' ]) {
    return res.end(template({
      styles,
      scripts,
      state: {
        title: 'App'
      },
      chunk: null
    }));
  }

  if (!renderer) {
    return res.end('waiting for compilation... refresh in a moment.')
  }

  var s = Date.now()
  const context = { url: req.url }
  const renderStream = renderer.renderToStream(context)
  let firstChunk = true

  renderStream.on('data', chunk => {
    res.end(template({
      chunk,
      styles,
      scripts,
      state: context.initialState,
      initialState: serialize(context.initialState, { isJSON: true })
    }))
  })

  renderStream.on('end', () => {
    console.log(`whole request: ${Date.now() - s}ms`)
  })

  renderStream.on('error', err => {
    // Render Error Page or Redirect
    res.status(500).end('Internal Error 500')
    console.error(`error during render : ${req.url}`, { err })
  })
})

const port = process.env.PORT || 7070
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
