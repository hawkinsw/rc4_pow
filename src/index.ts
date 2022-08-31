import * as $ from 'jquery'
import { RC4 } from './rc4';
import { fromHex } from './utils';

var nonce_test_element: JQuery<HTMLElement> | null;
var nonce_test_input_element: JQuery<HTMLInputElement> | null;
var raw_data_input_element: JQuery<HTMLInputElement> | null;
var work_result_output_element: JQuery<HTMLElement> | null;

export function configure(): void {
  nonce_test_input_element = $('#nonce_test_input')
  raw_data_input_element = $('#raw_data_input')
  nonce_test_element = $('#nonce_test')
  work_result_output_element = $('#work_result_output')
  RC4.initialize()
}


export function calculate(): void {
  const raw_data_input_value = raw_data_input_element.val() as string
  var raw_data = new Array<number>(raw_data_input_element.length)
  var idx = 0
  for (const c of raw_data_input_value) {
    raw_data[idx++] = c.charCodeAt(0)
  }
  idx = 0
  const nonce_test_input_value = (nonce_test_input_element.val() as string).split(' ')
  var nonce_data = new Array<number>(nonce_test_input_value.length)
  for (const c of nonce_test_input_value) {
    nonce_data[idx++] = fromHex(c)
  }

  var hasher = new RC4()
  hasher.schedule(nonce_data)
  hasher.schedule(raw_data)
  var hashed = hasher.hash(21)

  work_result_output_element.val(hashed.print())
}