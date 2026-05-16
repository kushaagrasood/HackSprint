let excelJsLoader

export function loadExcelJS() {
  if (window.ExcelJS) {
    return Promise.resolve(window.ExcelJS)
  }

  if (excelJsLoader) {
    return excelJsLoader
  }

  excelJsLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js'
    script.async = true

    script.onload = () => {
      if (window.ExcelJS) {
        resolve(window.ExcelJS)
        return
      }

      reject(new Error('ExcelJS did not initialize correctly'))
    }

    script.onerror = () => {
      reject(new Error('Failed to load ExcelJS from CDN'))
    }

    document.head.appendChild(script)
  }).catch((error) => {
    excelJsLoader = null
    throw error
  })

  return excelJsLoader
}
