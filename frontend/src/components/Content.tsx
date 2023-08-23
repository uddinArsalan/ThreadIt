const Content = ({ textBody, arrImgs, click ,codeText}: any) => {
  return (
    <div>
      <div>
      {textBody}
      </div>
      {click && arrImgs.map((src: string,index :number) => {
        return <><img key={index} src={src} alt="" /></>
      })}
      <div className="flex justify-center flex-col items-center">
        {codeText.map((code : string,index : number) => (<div className="bg-black m-2 md:w-1/2 overflow-scroll p-10 h-96 text-white font-bold" key={index}>{code.split('\n').map((line,ind) => (
          <div className="my-2" key={ind}>{line}</div>
        ))}</div>))}
        {/* {click && <TwitterCard textContent={body} srcArr={imageArr} />} */}
      </div>
    </div>
  )
}

export default Content