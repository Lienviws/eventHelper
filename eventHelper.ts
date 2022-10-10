type IAnyFunction<T = any> = (...args: any) => T

interface IEventLike {
    on?: (eventName: string, callback: IAnyFunction) => any
    once?: (eventName: string, callback: IAnyFunction) => any
    emit?: (eventName: string, ...args: any) => any
    off?: (eventName: string, callback: IAnyFunction) => any
    offAll?: (eventName: string) => any
}

interface IEventOnOptions {
    /** 只触发一次 */
    once?: boolean
}

/** 使用函数的形式, 可以取到对应的类型或者注释 */
export function eventHelper<
    KV extends Record<string, string> = Record<string, string>,
    KF extends Record<string, IAnyFunction> = Record<string, IAnyFunction>
> (event: IEventLike, options: {
    keyValue?: KV
    keyFunction?: KF
} = {}) {
    type EventTypes = KV & KF

    const { keyValue, keyFunction } = options;

    // 把函数形式的event key取出来，生成 { key: key }
    const keyFnName = {} as {
        [T in keyof KF]: T
    };

    if (keyFunction) {
        Object.keys(keyFunction).forEach((key: keyof typeof keyFnName) => {
            keyFnName[key] = key;
        });
    }

    // 所有event的keyname
    const eventKeys = {
        ...keyValue,
        ...keyFnName,
    };

    const emitPropertyDescriptorMap: PropertyDescriptorMap = {};
    const onPropertyDescriptorMap: PropertyDescriptorMap = {};
    const offPropertyDescriptorMap: PropertyDescriptorMap = {};

    Object.keys(eventKeys).forEach((key) => {
        const realKey = eventKeys[key];

        // emit
        emitPropertyDescriptorMap[realKey] = {
            get: () => (...args) => {
                if (event.emit) {
                    return event.emit(realKey, ...args);
                }
            }
        };

        // on
        onPropertyDescriptorMap[realKey] = {
            get: () => (callback, options: IEventOnOptions = {}) => {
                if (options.once && event.once) {
                    return event.once(realKey, callback);
                }
                if (event.on) {
                    return event.on(realKey, callback);
                }
            }
        };

        // off
        offPropertyDescriptorMap[realKey] = {
            get: () => (callback) => {
                if (!callback && event.offAll) {
                    return event.offAll(realKey);
                }
                if (event.off) {
                    return event.off(realKey, callback);
                }
            }
        };
    });

    const emit = Object.defineProperties({} as {
        [T in keyof EventTypes]: EventTypes[T] extends IAnyFunction ?
        EventTypes[T] :
        (...args: any) => void
    }, emitPropertyDescriptorMap);

    const on = Object.defineProperties({} as {
        [T in keyof EventTypes]: EventTypes[T] extends IAnyFunction ?
        (callback: EventTypes[T], options?: IEventOnOptions) => void :
        (callback: (...args: any) => void, options?: IEventOnOptions) => void
    }, onPropertyDescriptorMap);

    const off = Object.defineProperties({} as {
        [T in keyof EventTypes]: (/** 如果不传callback，则删除该event下的所有事件 */callback?: IAnyFunction) => void
    }, offPropertyDescriptorMap);

    return {
        emit,
        on,
        off
    };
}

