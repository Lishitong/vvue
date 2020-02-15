class Vue {
  constructor(options) {
    this.$options = options
    this.$data = options.data

    this.observe(this.$data)
    new Compile(options.el, this)

    if(options.created){
      options.created()
    }
  }

  observe(data) {
    if (!data || typeof data !== 'object') return
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])

      this.proxyData(key)
    })
  }

  defineReactive(obj, key, val) {

    let dep = new Dep()

    Object.defineProperty(obj, key, {
      get() {
        Dep.target && dep.addDep(Dep.target)
        return val
      },

      set(newVal) {
        if (newVal === val) {
          return
        }
        val = newVal
        dep.notify()
      }
    })

    this.observe(val)
  }

  proxyData(key) {
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key]
      },

      set(newVal) {
        this.$data[key] = newVal
      }
    })
  }
}

class Dep {
  constructor() {
    this.deps = []
  }

  addDep(watcher) {
    this.deps.push(watcher)
  }

  notify() {
    this.deps.forEach(dep => dep.update())
  }
}

class Watcher {
  constructor(vm, key,cb) {
    Dep.target = this
    this.vm = vm
    this.key = key
    this.cb = cb
    this.vm[this.key]
    Dep.target = null
  }

  update() {
    // console.log(`${this.key}数据更新`)
    this.cb.call(this.vm,this.vm[this.key])
  }
}