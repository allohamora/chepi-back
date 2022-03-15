import got, { OptionsOfUnknownResponseBody as GotOptions } from 'got';
import { Lang } from './lang';

interface DebugInfo {
  model_tracking: {
    checkpoint_md5: string;
    launch_doc: string;
  };
}

interface Sentence {
  trans: string;
  orig: string;
  backend: number;
  model_specification: Record<string, unknown>[];
  translation_engine_debug_info: DebugInfo[];
}

interface Translit {
  src_translit: string;
  translit: string;
}

interface LdResult {
  srclangs: Lang[];
  srclangs_confidences: number[];
  extended_srclangs: Lang[];
}

interface GoogleTranslateResponse {
  sentences: [...Sentence[], Translit];
  src: Lang;
  confidence: number;
  spell: Record<string, unknown>;
  ld_result: LdResult;
}

interface Options {
  from: Lang;
  to: Lang;
  text: string;
}

const GOOGLE_TRANSLATE_URL = 'https://translate.google.com';

export const isTranslit = (sentence: Sentence | Translit): sentence is Translit => {
  return typeof (sentence as Sentence).trans !== 'string';
};

const joinSentences = (sentences: GoogleTranslateResponse['sentences']) => {
  return sentences.reduce((state, sentence) => {
    if (isTranslit(sentence)) {
      return state;
    }

    return `${state}${sentence.trans}`;
  }, '');
};

export const translate = async ({ from, to, text }: Options, gotOptions: GotOptions = {}) => {
  const url = [
    `${GOOGLE_TRANSLATE_URL}/translate_a/single`,
    `?client=at&dt=t&dt=ld&dt=qca&dt=rm&dt=bd&dj=1&hl=${to}`,
    '&ie=UTF-8&oe=UTF-8',
    '&inputm=2&otf=2&iid=1dd3b944-fa62-4b55-b330-74909a99969e',
  ].join('');

  const searchParamsData = {
    sl: from,
    tl: to,
    q: text,
  };

  const body = new URLSearchParams(searchParamsData).toString();

  const response = await got(url, {
    method: 'POST',
    encoding: 'utf-8',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'User-Agent': 'AndroidTranslate/5.3.0.RC02.130475354-53000263 5.1 phone TRANSLATE_OPM5_TEST_1',
    },
    body,
    ...gotOptions,
  }).json<GoogleTranslateResponse>();

  const translated = joinSentences(response.sentences);

  return { text: translated, response };
};
