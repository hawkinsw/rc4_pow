import { ProofOfWorkCompleteEvent, ProofOfWorkEvent, ProofOfWorkRequestEvent } from './proofofwork'
import { RC4, ProofOfWorkRequest } from './rc4';

function* noncer(size: number): Generator<[Array<number>, number], any, unknown> {
    var count: number = 0
    var nonce_index: number = 0
    var nonce_data = new Array<number>(size).fill(0)
    while (nonce_index >= 0) {
        nonce_data[nonce_index] += 1
        if (nonce_data[nonce_index] == 255) {
            nonce_data[nonce_index] = 0
            nonce_index -= 1
        } else {
            if (nonce_index + 1 < size) {
                nonce_index += 1
            }
            count++
            yield [nonce_data, count]
        }
    }
}

function difficult_enough(difficulty: number, result: Array<string>): Boolean {
    var counter = 0
    for (const byte of result) {
        if (byte != '00') {
            return false
        }
        counter++
        if (counter == difficulty) {
            return true
        }
    }
    // If we get all the way through, then we saw all zeros -- there's no way
    // this could not be satisfactory for the user!
    return true
}

function doRC4(request: ProofOfWorkRequest) {
    RC4.initialize()

    var raw_data = new Array<number>(request.data.length)
    var idx = 0
    for (const c of request.data) {
        raw_data[idx++] = c.charCodeAt(0)
    }
    idx = 0
    const difficulty = request.difficulty

    // We're on our own now! We have to generate our own nonces.
    // Size of the nonce? We fix it at 16!
    var nonce_values = noncer(32)
    for (const [nonce_data, attempt] of nonce_values) {
        var hasher = new RC4()
        hasher.schedule(nonce_data)
        hasher.schedule(raw_data)
        var hashed = hasher.hash(32)

        if (difficult_enough(difficulty, hashed.print().split(' '))) {
            var complete = ProofOfWorkCompleteEvent.New(hashed.print(), attempt)
            postMessage(complete)
            break
        }
    }
}

function generateListenerWrapper<T>(listener: (powEvent: ProofOfWorkEvent<T>) => void): (me: MessageEvent) => void {
    return (me: MessageEvent) => {
        return listener(me.data)
    }

}
addEventListener('message', generateListenerWrapper((message: ProofOfWorkRequestEvent) => {
    doRC4(message.data)
}));