import { estypes, RequestParams } from '@elastic/elasticsearch';

export type SearchQuery = RequestParams.Search<estypes.SearchRequest['body']>;
