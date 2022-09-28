import React from 'react'
import Articles from '../components/Articles';

//component
import articleContent from "./article-content";

const ArticlesList = () => {
  return (
    <div>
      <h1 className='sm:text-4xl text-2xl font-bold my-6 text-gray-900'>Articles</h1>
      <div className='container py-4 mx-auto'>
        <div className='flex flex-warp -m-4'>
          <Articles articles={articleContent} />
        </div>
      </div>


    </div>
  )
}

export default ArticlesList