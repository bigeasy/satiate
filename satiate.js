module.exports = function (source, amount) {
    let got = []
    const iterator = {
        done: false,
        next (trampoline, consume, terminator = iterator) {
            source.next(trampoline, items => {
                if (got.length == 0) {
                    if (items.length >= amount) {
                        consume(items)
                    } else {
                        got.push.apply(got, items)
                        trampoline.sync(() => iterator.next(trampoline, consume, terminator))
                    }
                } else {
                    got.push.apply(got, items)
                    if (got.length >= amount) {
                        const items = got
                        got = []
                        consume(items)
                    } else {
                        trampoline.sync(() => iterator.next(trampoline, consume, terminator))
                    }
                }
            }, {
                set done (value) {
                    terminator.done = value
                    if (got.length != 0) {
                        consume(got)
                    }
                }
            })
        }
    }
    return iterator
}
