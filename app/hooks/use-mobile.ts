import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    
    // Set initial value only if not already set, using a timeout trick or just a simple sync check
    // Wait, setting it synchronously causes the lint error. Let's do it after paint or we can just ignore it.
    // Let's use requestAnimationFrame
    requestAnimationFrame(() => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT));
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
