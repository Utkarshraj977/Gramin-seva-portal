import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";


const HamburgerMenu = () => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const handleopen = () => {
            setOpen(false);
        }
        window.addEventListener("resize", handleopen)
        return () => {
            window.removeEventListener("resize", handleopen);
        }
    }, []);

    return (
        <>
            <button onClick={() => setOpen(!open)}>
                {open ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>

            {open && (
                <div className="absolute top-16 left-0 w-full z-50 bg-emerald-900
                        flex flex-col space-y-4 p-6
                        transition-all duration-300">
                    <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                    <Link to="/about" onClick={() => setOpen(false)}>About</Link>
                    <Link to="/services" onClick={() => setOpen(false)}>Services</Link>
                    <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
                </div>
            )}
        </>
    )
}

export default HamburgerMenu;