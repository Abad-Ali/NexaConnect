import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className='flex-1 flex flex-col items-center py-7 mt-12 md:mt-0'>
      <Posts/>
    </div>
  )
}

export default Feed;