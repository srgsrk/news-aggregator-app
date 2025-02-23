import './Article.css';
import {getDateString} from "../../utils.ts";
import defaultImg from '../../assets/default_image.png';
import {CommonArticleType} from "../../api/api.ts";

interface ArticleCardProps {
  article: CommonArticleType;
}


function Article({article}: ArticleCardProps) {
  return (
    <article key={article.title} className="max-w-xl">
      <a href={article.url} target="_blank" className="flex max-w-xl flex-col items-start justify-between" rel="noreferrer">
        <img src={article.urlToImage ?? defaultImg} className="aspect-16/9 rounded-t-lg object-cover" alt=""/>
        <div className="mt-5 flex items-center gap-x-4 text-xs">
          <time dateTime={article.publishedAt} className="text-gray-500 dark:text-gray-400">
            {getDateString(article.publishedAt)}
          </time>
          <span
            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 dark:bg-gray-300 "
          >
          {article.source}
        </span>
        </div>
        <div className="group relative">
          <h3
            className="mt-3 text-lg/6 font-semibold text-gray-900 dark:text-gray-300 group-hover:text-gray-600 dark:group-hover:text-white">
            {article.title}
          </h3>
          <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600 dark:text-gray-400">{article.description}</p>
        </div>
        <div className="mt-8 flex items-center gap-x-4">
          <p className="font-semibold text-sm/6 text-gray-900 dark:text-white">
            {article.author}
          </p>
        </div>
      </a>
    </article>
  )
}

export default Article;