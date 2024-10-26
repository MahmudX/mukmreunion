import m from "./assets/mulogo_white.png";
const Footer = () => {


    return (
        <>
            <footer className="footer">
                <div className="bg-green-950 py-10 px-10 flex items-center justify-between">
                    <img src={m} />
                    <img src="https://126477.ebmeb.gov.bd/uploads/etif/159724.jpg" alt="Pienteger" />
                </div>
                <div className="bg-black text-white p-2 md:px-10 flex justify-between">
                    <div>
                        &copy; 2024, All rights reserved
                    </div>
                    <div>
                        Developed by <a href="https://www.linkedin.com/in/mahmudxyz/" target="_blank">Mahmudul Hasan</a> | <a href="https://www.pienteger.com/in/" target="_blank">Pienteger&reg;</a>
                    </div>
                </div>
            </footer>
        </>
    )
}
export default Footer;