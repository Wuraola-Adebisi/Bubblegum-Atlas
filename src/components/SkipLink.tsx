/**
 * Skip link. A button, not a hash link, because the router uses the hash.
 * Hidden until it takes keyboard focus.
 */
export default function SkipLink() {
  const skip = () => {
    const main = document.getElementById('main')
    if (!main) return
    main.setAttribute('tabindex', '-1')
    main.focus()
    main.scrollIntoView()
  }
  return (
    <button
      type="button"
      onClick={skip}
      className="fixed top-3 left-3 z-50 min-h-11 -translate-y-20 cursor-pointer rounded-pill border-hair border-accent bg-paper px-5 font-medium text-accent focus:translate-y-0"
    >
      Skip to main content
    </button>
  )
}
