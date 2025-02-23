const NEWS_API_URL = 'https://newsapi.org/v2';
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY as string;

enum NewsApiEndpoints {
  Everything = 'everything',
  TopHeadlines = 'top-headlines',
}

enum NewsApiParams {
  ApiKey = 'apiKey',
  // Country = 'country',
  // Category = 'category',
  // Sources = 'sources',
  Query = 'q',
  PageSize = 'pageSize',
  // Page = 'page',
  Language = 'language'
}

export interface NewsApiResponseType {
  articles: NewsApiArticleType[],
}

export interface NewsApiArticleType {
  source: {
    id: string | null,
    name: string,
  }
  author: string,
  title: string,
  description: string,
  url: string,
  urlToImage?: string,
  publishedAt: string,
  content: string,
}

export async function fetchNewsApi(endpoint: NewsApiEndpoints, query?: string) {
  const params = new URLSearchParams();
  const defaultLanguage = navigator.language.slice(0, 2);

  params.append(NewsApiParams.ApiKey, NEWS_API_KEY);
  params.append(NewsApiParams.Language, defaultLanguage);
  params.append(NewsApiParams.PageSize, "10");

  if (query) {
    params.append(NewsApiParams.Query, query);
  }

  const url = `${NEWS_API_URL}/${endpoint}?` + params.toString();
  const response: Response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${String(response.status)}`);
  } else {
    return await response.json() as NewsApiResponseType;

  }
}

export async function fetchEverythingNewsApi(query?: string) {
  return fetchNewsApi(NewsApiEndpoints.Everything, query)
}

export async function fetchTopHeadlinesNewsApi(query?: string) {
  return fetchNewsApi(NewsApiEndpoints.TopHeadlines, query)
}
