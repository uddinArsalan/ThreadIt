import React from "react"

interface propsType {
    plan : string
    price : number
    selectPlan : React.Dispatch<React.SetStateAction<string | undefined>>;
    description : string[]
}

const PayCard = ({plan,selectPlan,price,description} : propsType) => {
    return (
        <div className = 'min-h-fit grid md:m-6 p-8 rounded-md bg-blue-300 shadow-md '>
            <div className='text-2xl font-bold text-center text-zinc-900 text-outline'>{plan}</div>
            <div className="text-gray-600 font-bold text-lg text-center">${price}</div>
            <hr className="mb-0"/>
            <ul className="grid grid-cols-1 mt-6 mb-2 row-span-2 font-semibold list-disc ml-6 gap-y-3">
                {description.map(desc => (
                   <li key={desc} >{desc}</li>
                ))}
            </ul>
            <button onClick={() => selectPlan} className='bg-green-500 mt-4 p-3 rounded-3xl text-white text-sm font-bold hover:bg-green-600 transition-colors'>Select this Plan</button>
        </div>
    )
}

export default PayCard