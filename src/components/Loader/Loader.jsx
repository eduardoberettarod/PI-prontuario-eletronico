import { useRef, useEffect } from "react"
import gsap from "gsap"
import "./Loader.css"
import Logo from "/image/logo.svg"

const Loader = ({ onComplete }) => {
    const loaderRef = useRef(null)
    const contentRef = useRef(null)

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                if (onComplete) onComplete()
            }
        })

        gsap.set(contentRef.current, {
            opacity: 0,
            y: 20
        })

        // aparece
        tl.to(contentRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out"
        })

        // pequena pausa
        tl.to({}, { duration: 1 })

        // desaparece
        tl.to(contentRef.current, {
            opacity: 0,
            y: -20,
            duration: 1,
            ease: "power2.inOut"
        })

        // fade do fundo
        tl.to(loaderRef.current, {
            opacity: 0,
            duration: 0.8
        })

    }, [onComplete])

    return (
        <div className="loader-container" ref={loaderRef}>
            <div className="loader-content" ref={contentRef}>
                <img src={Logo} alt="Logo" />
                <span>Prontuário Eletrônico</span>
            </div>
        </div>
    )
}

export default Loader