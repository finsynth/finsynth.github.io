class GridBackground {
  constructor() {
    this.container = document.querySelector('.grid-background')
    this.cellWidth = 80
    this.cellHeight = 25
    this.cells = []
    this.resizeTimeout = null
    this.handleResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.handleResize)
    this.init()
  }

  init() {
    this.createGrid()
  }

  createGrid() {
    const fragment = document.createDocumentFragment()
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const columns = Math.ceil(windowWidth / this.cellWidth)
    const rows = Math.ceil(windowHeight / this.cellHeight)

    this.cleanup()
    this.container.innerHTML = ''

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const cell = document.createElement('div')
        cell.className = 'grid-cell'
        cell.style.transform = `translate(${col * this.cellWidth}px, ${row * this.cellHeight}px)`
        cell.style.width = `${this.cellWidth}px`
        cell.style.height = `${this.cellHeight}px`

        const mouseenterHandler = () => cell.classList.add('grid-cell-active')
        const transitionendHandler = () => cell.classList.remove('grid-cell-active')

        cell.addEventListener('mouseenter', mouseenterHandler)
        cell.addEventListener('transitionend', transitionendHandler)

        this.cells.push({
          element: cell,
          listeners: {
            mouseenter: mouseenterHandler,
            transitionend: transitionendHandler
          }
        })

        fragment.appendChild(cell)
      }
    }

    this.container.appendChild(fragment)
  }

  cleanup() {
    this.cells.forEach(({ element, listeners }) => {
      element.removeEventListener('mouseenter', listeners.mouseenter)
      element.removeEventListener('transitionend', listeners.transitionend)
    })
    this.cells = []
  }

  handleResize() {
    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = setTimeout(() => {
      requestAnimationFrame(() => this.createGrid())
    }, 150)
  }

  destroy() {
    this.cleanup()
    window.removeEventListener('resize', this.handleResize)
    this.container.innerHTML = ''
  }
}

// Initialize grid when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.gridBackground = new GridBackground()
})
