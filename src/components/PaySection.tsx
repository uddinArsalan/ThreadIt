import { useState } from "react";
import PayCard from "./PayCard";
import data from "./data.js"

const PaySection = () => {
    const [plan, setPlan] = useState<string | undefined>(undefined);
    return (
        <div className="bg-blue-900 md:p-16 p-10">
            <h1 className="text-center font-bold text-4xl mb-10 text-gray-300">Ease your content sharing with Thread It</h1>
            <div className="text-center font-semibold text-2xl text-white underline">Select Your plan </div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-0 gap-8">
                {data.map(dataObj => (
                <PayCard key={dataObj.id} plan={dataObj.plan} selectPlan={setPlan} price={dataObj.price} description={dataObj.description}/>
                ))}
            </div>
        </div>
    );
};

export default PaySection;
