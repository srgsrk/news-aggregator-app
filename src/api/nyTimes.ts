const NY_TIMES_API_URL = "https://api.nytimes.com/svc";
const NY_TIMES_API_KEY = import.meta.env.VITE_NY_TIMES_API_KEY as string;

enum NyTimesEndpoints {
  MostPopular = 'mostpopular/v2/viewed/7.json',
  Search = 'search/v2/articlesearch.json',
}

enum NyTimesParams {
  ApiKey = 'api-key',
  Query = 'q'
}

interface NyTimesPopularResponseType {
  results: NyTimesPopularArticleType[],
}

export interface NyTimesPopularArticleType {
  url: string,
  byline: string,
  title: string,
  abstract: string,
  published_date: string,
  source: string,
  id: number,
  media: NyTimesPopularMediaType[]
}

interface NyTimesPopularMediaType {
  'media-metadata': [
    {
      url: string,
      format: string,
    }
  ]
}

interface NyTimesSearchResponseType {
  response: {
    docs: NyTimesSearchArticleType[],
  }
}

export interface NyTimesSearchArticleType {
  web_url: string,
  byline: {
    original: string,
  },
  headline: {
    main: string,
  },
  abstract: string,
  pub_date: string,
  source: string,
  _id: number,
  multimedia: [
    {
      url: string,
    }
  ] | []
}

export async function fetchMostPopularNyTimes() {
  const params = new URLSearchParams();

  params.append(NyTimesParams.ApiKey, NY_TIMES_API_KEY);

  const url = `${NY_TIMES_API_URL}/${NyTimesEndpoints.MostPopular}?` + params.toString();

  try {
    const response: Response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${String(response.status)}`);
    }

    return await response.json() as NyTimesPopularResponseType;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}

export async function fetchSearchNyTimes(query: string) {
  const params = new URLSearchParams();

  params.append(NyTimesParams.ApiKey, NY_TIMES_API_KEY);
  params.append(NyTimesParams.Query, query);


  const url = `${NY_TIMES_API_URL}/${NyTimesEndpoints.Search}?` + params.toString();

  try {
    const response: Response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${String(response.status)}`);
    }

    return await response.json() as NyTimesSearchResponseType;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}
