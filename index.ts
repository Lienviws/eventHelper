import event from './event'
import { eventHelper } from './eventHelper'

event.on('test1', (arg1, arg2) => {
    // code
})
event.on('test1', (arg1, arg2) => {
    // code
})


event.emit('test1', '1')
event.emit('test1', '1', '2')

const eventTrain = eventHelper({
    on: (eventName, callback) => event.on(eventName, callback),
    once: (eventName, callback) => event.once(eventName, callback),
    emit: (eventName, ...args) => event.emit(eventName, ...args),
    off: (eventName, callback) => event.off(eventName, callback),
    offAll: (eventName) => event.offAll(eventName),
}, {
    keyFunction: {
        /** 测试事件1 */
        test1: (a: string, b?: number) => {},
        /** 测试事件2 */
        test2: (c: string) => {}
    },
    keyValue: {
        TEST_EVENT1: 'TEST_EVENT1',
        TEST_EVENT2: 'TEST_EVENT2',
    }
})

// 对比
eventTrain.on.test1(function(arg1, arg2){
    // arg1: string
    // arg2: number | undefined
})
eventTrain.emit.test1('')

