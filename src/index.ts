import * as $ from 'jquery'
import { ProofOfWorkRequest } from './rc4';

import { ProofOfWorkCompleteEvent, ProofOfWorkRequestEvent } from './proofofwork';

const worker = new Worker(new URL('./worker.ts', import.meta.url));

var difficulty_input: JQuery<HTMLInputElement> | null;
var raw_data_input_element: JQuery<HTMLInputElement> | null;
var work_result_output_element: JQuery<HTMLElement> | null;
var work_attempts_output_element: JQuery<HTMLElement> | null;

export function configure(): void {
  difficulty_input = $('#difficulty_input')
  raw_data_input_element = $('#raw_data_input')
  work_result_output_element = $('#work_result_output')
  work_attempts_output_element = $('#work_attempts_output')
}

/*
 * A function generator that will generate a function that unwraps
 * the event (a MessageEvent) and invokes the *real* handler with
 * the underlying data.
 */
function eventDispatcher(handler: (evt: any) => any) {
  return (actualEvt: MessageEvent) => {
    handler(actualEvt.data)
  }
}

function proofOfWorkResponseHandler(powResponse: ProofOfWorkCompleteEvent) {
  work_result_output_element.val(powResponse.result)
  work_attempts_output_element.val(powResponse.attempts)
}

export function calculate(): void {
  worker.addEventListener('message', eventDispatcher(proofOfWorkResponseHandler))
  const raw_data_input_value = raw_data_input_element.val() as string
  const difficulty_input_value = (difficulty_input.val() as number)
  const request = new ProofOfWorkRequest(raw_data_input_value, difficulty_input_value)
  const requestEvent = ProofOfWorkRequestEvent.New(request)
  worker.postMessage(requestEvent)
}
