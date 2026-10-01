/**
 * Download a table Excel opens correctly whatever the Windows region settings:
 * UTF-16LE with BOM and tab delimiters (Excel's own "Unicode text"), so Vietnamese
 * stays intact and columns split without depending on the list separator.
 */
export function downloadTable(filename: string, rows: (string | number)[][]) {
  const cell = (v: string | number) => String(v).replace(/[\t\r\n]+/g, ' ')
  const text = rows.map(r => r.map(cell).join('\t')).join('\r\n')
  const bytes = new Uint8Array(2 + text.length * 2)
  bytes[0] = 0xFF
  bytes[1] = 0xFE
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i)
    bytes[2 + i * 2] = c & 0xFF
    bytes[3 + i * 2] = c >> 8
  }
  const url = URL.createObjectURL(new Blob([bytes], { type: 'text/csv;charset=utf-16le' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
