// import { useRef } from 'react'

const TwitterCard = ({srcArr,textContent} :any) => {
  // const textRef = useRef<HTMLTextAreaElement>();
  // textRef.current.value =  textContent
  return (
    <div style={{ WebkitOverflowScrolling: 'touch' }} className='bg-white p-6 h-96 overflow-scroll border-2 rounded-md w-3/4 border-blue-400 grid grid-rows-3 relative md:m-6 m-3'>
        <div><img src={srcArr.at(0)} className='w-12 rounded-full' alt="" /></div>
        <textarea className='p-16 pl-2 pt-2 text-gray-400 text-2xl h-36' placeholder='Insert Text Here'/>
        <div className='bg-blue-500 rounded-md p-4 pt-2 pb-2 text-white w-fit absolute right-4 bottom-4'>Tweet</div>
    </div>
  )
}

export default TwitterCard