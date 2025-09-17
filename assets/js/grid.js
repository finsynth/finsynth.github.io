class ExcelGridBackground {
  constructor() {
    this.baseCellWidth = 80
    this.baseCellHeight = 20
    this.mobileCellWidth = 50
    this.mobileCellHeight = 15
    
    this.cellWidth = this.getResponsiveCellWidth()
    this.cellHeight = this.getResponsiveCellHeight()
    
    this.cells = []
    this.resizeTimeout = null
    this.handleResize = this.handleResize.bind(this)

    this.currentRowNumber = 1 // Track continuous row numbers
    window.addEventListener('resize', this.handleResize)
    this.init()
  }

  getResponsiveCellWidth() {
    return window.innerWidth < 540 ? this.mobileCellWidth : this.baseCellWidth
  }

  getResponsiveCellHeight() {
    return window.innerWidth < 540 ? this.mobileCellHeight : this.baseCellHeight
  }

  init() {

    this.createExcelGrids()
  }

  createExcelGrids() {
    this.cleanup()
    this.currentRowNumber = 1 // Reset row counter
    this.createHeroTopGrid()
    this.createHeroMiddleGrid()
    this.createHeroBottomGrid()
  }

  createHeroTopGrid() {
    const heroTop = document.querySelector('.hero-top')
    if (!heroTop) return

    const rect = heroTop.getBoundingClientRect()
    const heroContentWidth = document.querySelector('.hero-middle-content').getBoundingClientRect().width
    const columns = Math.ceil((rect.width - heroContentWidth) / this.cellWidth)+1
    const middleColIndex = Math.floor(columns / 2)
    const rows = 3 // Column header + 2 normal rows

    // Create grid container for hero-top
    let gridContainer = heroTop.querySelector('.excel-grid')
    if (!gridContainer) {
      gridContainer = document.createElement('div')
      gridContainer.className = 'excel-grid'
      gridContainer.style.position = 'absolute'
      gridContainer.style.top = '0'
      gridContainer.style.left = '0'
      gridContainer.style.width = '100%'
      gridContainer.style.height = '100%'
      gridContainer.style.pointerEvents = 'none'
      heroTop.style.position = 'relative'
      heroTop.appendChild(gridContainer)
    }

    gridContainer.innerHTML = ''

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns+1; col++) {
        const cell = document.createElement('div')

        cell.className = 'excel-cell'
        
        // Column header styling
        if (row === 0) {
          if (col === 0) {
            // Corner cell in header row
            cell.classList.add('excel-corner-cell')
            cell.style.backgroundColor = '#f6f8fa'
          } else {
            cell.classList.add('excel-header')
            cell.textContent = this.getColumnLetter(col - 1) // Adjust column letter for offset
          }
        } else {
          // Row header styling
          if (col === 0) {
            cell.classList.add('excel-row-header')
            cell.textContent = this.currentRowNumber + (row - 1)
          } else {
            cell.classList.add('excel-data-cell')
          }
        }

        // Apply positioning and sizing (other styles handled by CSS classes)
        cell.style.left = col === 0 ? '0px' : `${this.cellWidth/4 + (col - 1) * this.cellWidth + (col > middleColIndex ? heroContentWidth-this.cellWidth : 0)}px`
        cell.style.top = `${row * this.cellHeight}px`
        cell.style.width = col === 0 ? `${this.cellWidth/4}px` : `${this.cellWidth}px`
        cell.style.width = col === middleColIndex ? `${heroContentWidth}px` : cell.style.width
        cell.style.height = `${this.cellHeight}px`
        
        if (row === 0 && col === 0) {
          // Corner cell styling
          cell.style.backgroundColor = 'rgba(246, 248, 250, 0.3)'
        } else if (row === 0) {
          // Header cell styling
          cell.style.backgroundColor = 'rgba(246, 248, 250, 0.3)'
        } 
        else {
          // Data cell styling
          cell.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
        }

        this.cells.push({ element: cell, container: gridContainer })
        gridContainer.appendChild(cell)
      }
    }
    
    // Update row counter after creating hero-top grid (3 rows: header + 2 data rows)
    this.currentRowNumber += 2
  }

  createHeroMiddleGrid() {
    const heroMiddle = document.querySelector('.hero-middle')
    if (!heroMiddle) return

    const rect = heroMiddle.getBoundingClientRect()
    const heroContentWidth = document.querySelector('.hero-middle-content').getBoundingClientRect().width
    const columns = Math.ceil((rect.width - heroContentWidth) / this.cellWidth)+1
    const middleColIndex = Math.floor(columns / 2)
    const rows = 1 // Single row

    // Create separate grid overlay div
    let gridOverlay = heroMiddle.querySelector('.excel-grid-overlay')
    if (!gridOverlay) {
      gridOverlay = document.createElement('div')
      gridOverlay.className = 'excel-grid-overlay'
      gridOverlay.style.position = 'absolute'
      gridOverlay.style.top = '0'
      gridOverlay.style.left = '0'
      gridOverlay.style.width = '100%'
      gridOverlay.style.height = '100%'
      gridOverlay.style.pointerEvents = 'none'
      gridOverlay.style.zIndex = '1' // Lower than content
      heroMiddle.style.position = 'relative'
      heroMiddle.appendChild(gridOverlay)
    }

    gridOverlay.innerHTML = ''

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns+1; col++) {
        const cell = document.createElement('div')
        cell.className = 'excel-cell'
        
        // Row header styling
        if (col === 0) {
          cell.classList.add('excel-row-header')
          cell.textContent = this.currentRowNumber
        } else {
          cell.classList.add('excel-data-cell')
        }
        
        // Apply positioning and sizing (other styles handled by CSS classes)
        cell.style.left = col === 0 ? '0px' : `${this.cellWidth/4 + (col - 1) * this.cellWidth + (col > middleColIndex ? heroContentWidth-this.cellWidth : 0)}px`
        cell.style.top = '0px' // Always at top
        cell.style.width = col === 0 ? `${this.cellWidth/4}px` : `${this.cellWidth}px`
        cell.style.width = col === middleColIndex ? `${heroContentWidth}px` : cell.style.width
        cell.style.height = '100%' // Full height of parent

        this.cells.push({ element: cell, container: gridOverlay })
        gridOverlay.appendChild(cell)
      }
    }
    
    // Update row counter after creating hero-middle grid (1 data row)
    this.currentRowNumber += 1
  }

  createHeroBottomGrid() {
    const heroBottom = document.querySelector('.hero-bottom')
    if (!heroBottom) return

    const rect = heroBottom.getBoundingClientRect()
    const heroContentWidth = document.querySelector('.hero-middle-content').getBoundingClientRect().width
    const columns = Math.ceil((rect.width - heroContentWidth) / this.cellWidth)+1
    const middleColIndex = Math.floor(columns / 2)
    const rows = Math.ceil(rect.height / this.cellHeight)+1

    // Create separate grid overlay div
    let gridOverlay = heroBottom.querySelector('.excel-grid-overlay')
    if (!gridOverlay) {
      gridOverlay = document.createElement('div')
      gridOverlay.className = 'excel-grid-overlay'
      gridOverlay.style.position = 'absolute'
      gridOverlay.style.top = '0'
      gridOverlay.style.left = '0'
      gridOverlay.style.width = '100%'
      gridOverlay.style.height = '100%'
      gridOverlay.style.pointerEvents = 'none'
      gridOverlay.style.zIndex = '1' // Lower than content
      heroBottom.style.position = 'relative'
      heroBottom.appendChild(gridOverlay)
    }

    gridOverlay.innerHTML = ''

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns+1; col++) {
        const cell = document.createElement('div')
        cell.className = 'excel-cell'
        
        // Row header styling
        if (col === 0) {
          cell.classList.add('excel-row-header')
          cell.textContent = this.currentRowNumber + row
        } else {
          cell.classList.add('excel-data-cell')
        }
        
        // Calculate transparency - linear fade from top to bottom
        const fadeProgress = row / (rows - 1) // Linear progress from 0 to 1
        const baseOpacity = 0.3 // Start with same subtle opacity as other grids
        const minOpacity = 0.05 // Minimum opacity at bottom
        const fadeOpacity = baseOpacity - (fadeProgress * (baseOpacity - minOpacity)) // Linear fade from 0.3 to 0.05
        const backgroundColor = col === 0 
          ? `rgba(246, 248, 250, ${fadeOpacity})` 
          : `rgba(255, 255, 255, ${fadeOpacity})`
        
        // Apply positioning and sizing (other styles handled by CSS classes)
        cell.style.left = col === 0 ? '0px' : `${this.cellWidth/4 + (col - 1) * this.cellWidth + (col > middleColIndex ? heroContentWidth-this.cellWidth : 0)}px`
        cell.style.top = `${row * this.cellHeight}px`
        cell.style.width = col === 0 ? `${this.cellWidth/4}px` : `${this.cellWidth}px`
        cell.style.width = col === middleColIndex ? `${heroContentWidth}px` : cell.style.width
        cell.style.height = `${this.cellHeight}px`
        
        // Apply fade-specific styles
        cell.style.backgroundColor = backgroundColor
        cell.style.color = `rgba(36, 41, 47, ${fadeOpacity})`
        cell.style.borderColor = `rgba(208, 215, 222, ${fadeOpacity})`

        this.cells.push({ element: cell, container: gridOverlay })
        gridOverlay.appendChild(cell)
      }
    }
    
    // Update row counter after creating hero-bottom grid
    this.currentRowNumber += rows
  }

  getColumnLetter(col) {
    let result = ''
    while (col >= 0) {
      result = String.fromCharCode(65 + (col % 26)) + result
      col = Math.floor(col / 26) - 1
    }
    return result
  }

  cleanup() {

    this.cells.forEach(({ element, container }) => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element)
      }
    })
    this.cells = []
  }

  handleResize() {
    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = setTimeout(() => {
      // Update responsive dimensions
      this.cellWidth = this.getResponsiveCellWidth()
      this.cellHeight = this.getResponsiveCellHeight()
      requestAnimationFrame(() => this.createExcelGrids())
    }, 150)
  }

  destroy() {
    this.cleanup()
    window.removeEventListener('resize', this.handleResize)

    
    // Remove all grid containers and overlays
    const gridContainers = document.querySelectorAll('.excel-grid, .excel-grid-overlay')
    gridContainers.forEach(container => {
      if (container.parentNode) {
        container.parentNode.removeChild(container)
      }
    })
  }
}

// Initialize grid when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {

  window.excelGridBackground = new ExcelGridBackground()
})

