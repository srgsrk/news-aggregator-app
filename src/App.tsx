import './App.css'
import {useEffect, useState, useRef} from "react";
import Article from "./components/Article";
import {useFormStatus} from "react-dom";
import {CommonArticleType, fetchNews} from './api/api.ts'

function App() {
  const [articles, setArticles] = useState<CommonArticleType[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<CommonArticleType[]>([]);
  const [sources, setSources] = useState(new Set<string>());
  const [isDateFiltered, setIsDateFiltered] = useState(false);
  const [isSourceFiltered, setIsSourceFiltered] = useState(false);

  const selectSourcesRef = useRef<HTMLSelectElement>(null);
  const selectDateRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    fetchNews().then((data) => {
      setArticles(data);
      updateSources(data);
    })
  }, []);

  function updateSources(data: CommonArticleType[]) {
    const sources = new Set<string>();
    data.forEach((item) => {
      sources.add(item.source);
    })
    setSources(previousSources => new Set([...previousSources, ...sources]))
  }

  async function search(formData: FormData) {
    const query = formData.get("query") as string;
    if (query) {
      await fetchNews(query)
        .then((data: CommonArticleType[]) => {
          setArticles(data);
        });
    }
    if (selectSourcesRef.current) {
      selectSourcesRef.current.value = "";
    }

    if (selectDateRef.current) {
      selectDateRef.current.value = "";
    }

  }

  function filterBySource(options: HTMLOptionsCollection) {
    const chosen = Array.from(options)
      .filter((item) => item.selected)
      .map((item) => item.value)
    setIsSourceFiltered(chosen.length > 0);

    const articlesToFilter = isDateFiltered ? filteredArticles : articles

    setFilteredArticles(articlesToFilter.filter(article => chosen.includes(article.source)))
  }

  function filterByDate(value: string) {
    setIsDateFiltered(Boolean(value));
    const now = Date.now();
    const timestamp = Number(value) * 60 * 60 * 1000;

    const articlesToFilter = isSourceFiltered ? filteredArticles : articles;

    setFilteredArticles(articlesToFilter.filter(article => {
      const articleTimestamp = new Date(article.publishedAt).getTime();
      return Number(articleTimestamp) > now - timestamp
    }))
  }

  const renderArticles = filteredArticles.length ? filteredArticles : articles;

  function Submit() {
    const {pending} = useFormStatus();
    return (
      <button
        type="submit"
        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
        disabled={pending}
      >
        {pending ? "Searching..." : "Search"}
      </button>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-gray-300 sm:text-5xl">News
            Aggregator</h2>
        </div>

        <div className="mx-auto mt-10 pt-10 border-gray-200 border-t sm:mt-16 sm:pt-16">

          <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-6 sm:grid-cols-3">
            <div className="sm:col-span-2"/>
            <div className="sm:col-span-1">
              <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select
                the date</label>
              <select name="date"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-1.5"
                      onChange={(e) => {
                        filterByDate(e.target.value)
                      }}
                      ref={selectDateRef}
              >
                <option value="">-- --</option>
                <option value="24">Today</option>
                <option value="72">Last 3 days</option>
                <option value="168">This week</option>
              </select>
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="source" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select
                the source</label>
              <select name="source"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-1.5"
                      multiple={true}
                      onChange={(e) => {
                        filterBySource(e.target.options)
                      }}
                      ref={selectSourcesRef}
              >
                <option value="">-- --</option>
                {Array.from(sources).map((source) => (
                  <option value={source} key={source}>{source}</option>
                ))
                }
              </select>
            </div>
            <div className="sm:col-span-2">

              <form action={search}>
                <label htmlFor="query"
                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Search</label>
                <div className="flex items-center gap-x-8">
                  <input
                    name="query"
                    type="text"
                    className="block grow rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    required
                  />
                  <Submit/>
                </div>
              </form>
            </div>
          </div>

          <div
            className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 mt-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">

            {Boolean(renderArticles.length) && renderArticles.map((article: CommonArticleType) => (
              <Article key={article.title} article={article}/>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default App
