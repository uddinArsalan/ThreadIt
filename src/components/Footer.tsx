import logo_1 from "../assets/logos/logo-2-removebg.png";

const Footer = () => {
    return(
        <div className="bg-footer h-64 grid grid-rows-2 text-white">
            <div className="col-span-2"><img src={logo_1} alt="" className="w-56"/></div>
            <div className="grid md:grid-cols-4 p-6 grid-cols-2 gap-y-10 place-items-center">
            <div>What is Thread It ?</div>
            <div>How It works</div>
            <div>Join Premium</div>
            {/* <div className="flex"> */}
            
            </div>
            {/* </div> */}
        </div>
    )
}

export default Footer