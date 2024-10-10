import Markdoc from '@markdoc/markdoc'
const source = '#Markdoc'
const ast = Markdoc.parse(source)
const content = Markdoc.transform(ast)
const html = Markdoc.renderers.html(content)
console.log(html)
