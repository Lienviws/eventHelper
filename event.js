class Event {
    on(eventName, callback){}
    /** 只触发一次 */
    once(eventName, callback){}
    emit(eventName, ...args){}
    off(eventName, callback){}
    /** 删除该event下的所有事件 */
    offAll(eventName){}
}

export default new Event
