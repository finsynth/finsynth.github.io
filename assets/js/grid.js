class GridBackground {
  constructor() {
    this.container = document.querySelector('.grid-background')
    this.cellWidth = 80
    this.cellHeight = 25
    this.init()
    this.handleResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.handleResize)
  }

  init() {
    this.createGrid()
  }

  createGrid() {
    // Clear existing grid
    this.container.innerHTML = ''

    // Calculate number of cells needed
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const columns = Math.ceil(windowWidth / this.cellWidth)
    const rows = Math.ceil(windowHeight / this.cellHeight)

    // Create cells
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const cell = document.createElement('div')
        cell.className = 'grid-cell'
        cell.style.width = `${this.cellWidth}px`
        cell.style.height = `${this.cellHeight}px`
        cell.style.left = `${col * this.cellWidth}px`
        cell.style.top = `${row * this.cellHeight}px`

        // Add column label (A, B, C, etc.) for first row
        if (row === 0) {
          cell.setAttribute('data-column', this.getColumnLabel(col))
        }

        // Add row number for first column
        if (col === 0) {
          cell.setAttribute('data-row', row + 1)
        }

        this.container.appendChild(cell)
      }
    }
  }

  getColumnLabel(index) {
    let label = ''
    while (index >= 0) {
      label = String.fromCharCode(65 + (index % 26)) + label
      index = Math.floor(index / 26) - 1
    }
    return label
  }

  handleResize() {
    requestAnimationFrame(() => this.createGrid())
  }
}

// Initialize grid when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GridBackground()
})
