const THE_GUARDIAN_API_URL = ' https://content.guardianapis.com';
const THE_GUARDIAN_API_KEY = import.meta.env.VITE_THE_GUARDIAN_API_KEY as string;

enum TheGuardianEndpoints {
  Content = 'search',
  // Tags = 'tags',
}

enum TheGuardianParams {
  ApiKey = 'api-key',
  Query = 'q',
  // Page = 'page',
  // PageSize = 'page-size',
  ShowElements = 'show-elements',
  ShowTags = 'show-tags',
  ShowFields = 'show-fields'
}

interface TheGuardianResponseType {
  response: {
    results: TheGuardianArticleType[],
  }
}

export interface TheGuardianArticleType {
  id: string,
  type: string,
  sectionId: string,
  sectionName: string,
  tags?: [
    {
      webTitle: string,
    }
  ],
  webPublicationDate: string,
  webTitle: string,
  webUrl: string,
  apiUrl: string,
  elements: TheGuardianArticleElementType[],
  fields: {
    trailText: string;
  }
  isHosted: boolean,
  pillarId: string,
  pillarName: string,
}

interface TheGuardianArticleElementType {
  assets: TheGuardianArticleElementAssetType[],
  relation: string,
}

interface TheGuardianArticleElementAssetType {
  file: string,
}

export async function fetchTheGuardian(query?: string) {
  const params = new URLSearchParams();
  const endpoint = TheGuardianEndpoints.Content;

  params.append(TheGuardianParams.ApiKey, THE_GUARDIAN_API_KEY);
  params.append(TheGuardianParams.ShowElements, 'image');
  params.append(TheGuardianParams.ShowTags, 'contributor');
  params.append(TheGuardianParams.ShowFields, 'trailText');

  if (query) {
    params.append(TheGuardianParams.Query, query);
  }

  const url = `${THE_GUARDIAN_API_URL}/${endpoint}?` + params.toString();

  try {
    const response: Response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${String(response.status)}`);
    }

    return await response.json() as TheGuardianResponseType;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}
