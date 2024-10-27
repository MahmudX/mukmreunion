import m from "./assets/mulogo_white.png";
const Footer = () => {


    return (
        <>
            <footer className="footer footer-center bg-green-950 text-white p-10">
                <aside>
                    <img src={m} />
                    <p className="font-bold">
                        Developed by <br />
                        <a href="https://www.mahmudx.com/" target="_blank">Mahmudul Hasan</a> | <a href="https://www.pienteger.com/" target="_blank">Pienteger&reg;</a>
                    </p>
                    <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
                </aside>
                <nav>
                    <div className="grid grid-flow-col gap-4">
                        <a href="https://www.facebook.com/groups/httpmukm.edu.bd"
                            target="_blank">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="fill-current">
                                <path
                                    d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                            </svg>
                        </a>
                    </div>
                </nav>
            </footer>
        </>
    )
}
export default Footer;