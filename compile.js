class Compile {
  constructor(el, vm) {
    this.$vm = vm
    this.$el = document.querySelector(el)
    this.$fragment = this.node2Fragment(this.$el)
    this.compile(this.$fragment)
    this.$el.appendChild(this.$fragment)
  }

  node2Fragment(node) {
    const fragment = document.createDocumentFragment()
    let child
    while (child = node.firstChild) {
      fragment.appendChild(child)
    }

    return fragment
  }

  compile(el) {
    const childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if (node.nodeType == 1) {
        console.log(`元素节点${node.nodeName}`)
        this.compileElement(node)
      } else if (this.isInter(node)) {
        console.log(`文本节点${node.nodeValue}`)
        this.compileText(node)
      }

      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })

  }

  isInter(node) {
    return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
  compileElement(node) {
    let attrs = node.attributes
    Array.from(attrs).forEach(attr => {
      const attrName = attr.name
      const exp = attr.value
      if (attrName.indexOf('v-') == 0) {
        const dir = attrName.substring(2)
        this[dir] && this[dir](node, exp)
      }
    })
  }
  compileText(node) {
    const exp = RegExp.$1
    this.update(node, exp, 'text')
  }

  update(node, exp, dir) {
    let updator = this[dir + 'Updator']
    let value = this.$vm[exp]

    updator && updator(node, value)

    new Watcher(this.$vm, exp, function (value) {
      updator && updator(node, value)
    })
  }

  textUpdator(node, value) {
    node.textContent = value
  }

  text(node, exp) {
    this.update(node, exp, 'text')
  }

  htmlUpdator(node, value) {
    node.innerHTML = value
  }
  html(node, exp) {
    this.update(node, exp, 'html')
  }
}