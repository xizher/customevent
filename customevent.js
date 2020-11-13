const ERROR_MUST_STRING = 'the first argument type is requird as string'
const ERROR_MUST_FUNCTION = 'the second argument fn is requird as function'

export class CustomEvent {


  //#region 构造函数
  constructor() {
    /**
     * 事件集合
     */
    this.events = {}
  }
  //#endregion

  //#region 公有方法
  /**
   * 绑定事件
   * @param {String} name 事件名称
   * @param {Function} fn 事件处理函数
   * @param {any} scope 事件处理函数上下文
   * @returns {Function} 事件处理函数
   */
  on(name, fn, scope) {
    if (typeof name !== 'string') {
      console.error(ERROR_MUST_STRING)
    } else if (typeof fn !== 'function') {
      console.error(ERROR_MUST_FUNCTION)
    } else {
      name = name.toLowerCase()
      // this.events[name] || (this.events[name] = [])
      this.events?.[name] ?? (this.events[name] = [])
      this.events[name].push(scope ? [fn, scope] : [fn])
    }
    return fn
  }
  /**
   * 触发事件
   * @param {String} name 触发的事件名称
   * @param {any} data 触发传递的数据
   */
  fire(name, data) {
    name = name.toLowerCase()
    const eventArr = this.events[name]
    if (eventArr) {
      const event = Object.assign({
        name, // 事件类型
        origin: this, // 绑定的源
      }, data)
      const len = eventArr.length
      for (let i = 0; i < eventArr.length; i++) {
        const item = eventArr[i]
        let fn = item[0]
        event.scope = item[1] ?? {}
        // event.scope = item[1] || {}
        fn(event)
        if (eventArr.length < len) {
          i--
        }
      }
    }
  }

  /**
   * 取消特定的绑定事件
   * @param {String} name 取消的绑定事件
   * @param {Function} fn 需要的判定事件处理函数（null则移除全部）
   */
  off(name, fn) {
    name = name.toLowerCase()
    const eventArr = this.events[name]
    if (!eventArr || eventArr.length === 0) {
      return
    }
    if (fn) {
      for (let i = 0; i < eventArr.length; i++) {
        if (fn === eventArr[i][0]) {
          eventArr.splice(i, 1)
          i-- // 可能存在一个事件一个函数绑定多次的情况
        }
      }
    } else {
      eventArr.splice(0, eventArr.length)
    }
  }
  /**
   * 绑定一次性事件
   * @param {String} name 事件名称
   * @param {Function} fn 事件处理函数
   * @param {any} scope 事件处理函数上下文
   * @returns {Function} 事件处理函数
   */
  one(name, fn, scope) {
    const nfn = () => {
      this.off(name, nfn)
      fn.apply(scope, arguments)
    }
    this.on(name, nfn, scope)
    return fn
  }
  //#endregion

}

export default CustomEvent
