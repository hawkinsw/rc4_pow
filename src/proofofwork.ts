import { ProofOfWorkRequest } from "./rc4"

export class ProofOfWorkEvent<T> {
  data: T

  protected constructor(data: T) {
    this.data = data
  }
}

export class ProofOfWorkRequestEvent extends ProofOfWorkEvent<ProofOfWorkRequest> {
  private constructor(request: ProofOfWorkRequest) {
    super(request)
  }
  public static New(request: ProofOfWorkRequest) {
    return new ProofOfWorkRequestEvent(request)
  }
}

export class ProofOfWorkCompleteEvent extends ProofOfWorkEvent<string> {
  result: string
  attempts: number
  private constructor(result: string, attempts: number) {
    super('complete')
    this.result = result
    this.attempts = attempts
  }
  public static New(result: string, attempts: number) {
    return new ProofOfWorkCompleteEvent(result, attempts)
  }
}