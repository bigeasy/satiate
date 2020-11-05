require('proof')(3, async okay => {
    const satiate = require('..')
    const Trampoline = require('reciprocate')
    const advance = require('advance')

    {
        const advanced = advance([[], [ 1, 2, 3 ], [ 4 ], [ 5 ], [ 6 ]])
        const iterator = satiate(advanced, 3)
        const gathered = [], trampoline = new Trampoline
        while (! iterator.done) {
            iterator.next(trampoline, items => gathered.push(items))
            while (trampoline.seek()) {
                await trampoline.shift()
            }
        }
        okay(gathered, [[ 1, 2, 3 ], [ 4, 5, 6 ]], 'gathering')
    }

    {
        const advanced = advance([[ 1, 2 ]])
        const iterator = satiate(advanced, 3)
        const gathered = [], trampoline = new Trampoline
        while (! iterator.done) {
            iterator.next(trampoline, items => gathered.push(items))
            while (trampoline.seek()) {
                await trampoline.shift()
            }
        }
        okay(gathered, [[ 1, 2 ]], 'remainder')
    }

    {
        const advanced = advance([[], []])
        const iterator = satiate(advanced, 3)
        const gathered = [], trampoline = new Trampoline
        while (! iterator.done) {
            iterator.next(trampoline, items => gathered.push(items))
            while (trampoline.seek()) {
                await trampoline.shift()
            }
        }
        okay(gathered, [], 'straight done')
    }
})
