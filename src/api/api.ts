import {fetchEverythingNewsApi, fetchTopHeadlinesNewsApi, NewsApiArticleType} from "./newsApi.ts";
import {fetchTheGuardian, TheGuardianArticleType} from "./theGuardian.ts";
import {fetchMostPopularNyTimes, fetchSearchNyTimes, NyTimesPopularArticleType, NyTimesSearchArticleType} from "./nyTimes.ts";

export interface CommonArticleType {
  source: string,
  author?: string,
  title: string,
  description: string,
  url: string,
  urlToImage?: string,
  publishedAt: string,
}

export function normalizeNewsApiArticleData(apiData: NewsApiArticleType): CommonArticleType {
  return {
    source: apiData.source.name,
    author: apiData.author,
    title: apiData.title,
    description: apiData.description,
    url: apiData.url,
    urlToImage: apiData.urlToImage,
    publishedAt: apiData.publishedAt,
  };
}

export function normalizeTheGuardianArticleData(apiData: TheGuardianArticleType): CommonArticleType {
  return {
    source: 'The Guardian',
    author: apiData.tags?.[0]?.webTitle,
    title: apiData.webTitle,
    description: apiData.fields.trailText,
    url: apiData.webUrl,
    urlToImage: apiData.elements.find(element => element.relation === "thumbnail")?.assets[0].file,
    publishedAt: apiData.webPublicationDate,
  };
}

export function normalizeNyTimesPopularArticleData(apiData: NyTimesPopularArticleType): CommonArticleType {
  return {
    source: apiData.source,
    author: apiData.byline,
    title: apiData.title,
    description: apiData.abstract,
    url: apiData.url,
    urlToImage: apiData.media[0]?.["media-metadata"].find(meta => meta.format === "mediumThreeByTwo440")?.url,
    publishedAt: apiData.published_date,
  };
}

export function normalizeNyTimesSearchArticleData(apiData: NyTimesSearchArticleType): CommonArticleType {
  return {
    source: apiData.source,
    author: apiData.byline.original,
    title: apiData.headline.main,
    description: apiData.abstract,
    url: apiData.web_url,
    urlToImage: apiData.multimedia.length ? "https://www.nytimes.com/" + apiData.multimedia[0].url : undefined,
    publishedAt: apiData.pub_date,
  };
}

export async function fetchNews(query?: string): Promise<CommonArticleType[]> {
  let newsApiArticlesResponse;
  let theGuardianArticlesResponse;
  let nyTimesArticlesResponse;

  try {
    newsApiArticlesResponse = query ? await fetchEverythingNewsApi(query) : await fetchTopHeadlinesNewsApi();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  try {
    theGuardianArticlesResponse = await fetchTheGuardian(query);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  let news: CommonArticleType[] = [];

  const newsApiArticles = newsApiArticlesResponse?.articles;
  const theGuardianArticles = theGuardianArticlesResponse?.response.results;

  const normalizedNewsApiArticles = newsApiArticles?.map((article) => normalizeNewsApiArticleData(article))
  const normalizedTheGuardianArticles = theGuardianArticles?.map((article) => normalizeTheGuardianArticleData(article))

  let nyTimesArticles;
  let normalizedNyTimesArticles;
  if (query) {
    try {
      nyTimesArticlesResponse = await fetchSearchNyTimes(query);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
    nyTimesArticles = nyTimesArticlesResponse?.response.docs;
    normalizedNyTimesArticles = nyTimesArticles?.map((article) => normalizeNyTimesSearchArticleData(article))
  } else {
    try {
      nyTimesArticlesResponse = await fetchMostPopularNyTimes();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
    nyTimesArticles = nyTimesArticlesResponse?.results;
    normalizedNyTimesArticles = nyTimesArticles?.map((article) => normalizeNyTimesPopularArticleData(article))
  }

  if (normalizedNewsApiArticles) {
    news = news.concat(normalizedNewsApiArticles);
  }

  if (normalizedTheGuardianArticles) {
    news = news.concat(normalizedTheGuardianArticles);
  }

  if (normalizedNyTimesArticles) {
    news = news.concat(normalizedNyTimesArticles);
  }

  shuffle(news);

  return news;
}

function shuffle(array: CommonArticleType[]): void {
  let currentIndex = array.length;

  while (currentIndex !== 0) {

    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}