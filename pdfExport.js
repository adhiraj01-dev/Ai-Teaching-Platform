/**
 * Generates and downloads a PDF from notes text using jsPDF
 * @param {string} topic - Topic name
 * @param {string} content - Notes text content
 * @param {string} difficulty - Difficulty level
 */
export async function downloadAsPDF(topic, content, difficulty) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  const pageW = doc.internal.pageSize.getWidth()
  const margin = 20
  const maxW = pageW - margin * 2
  let y = margin

  // Header background
  doc.setFillColor(108, 99, 255)
  doc.rect(0, 0, pageW, 40, 'F')

  // Title
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('EduAI Study Notes', margin, 18)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Topic: ${topic}  |  Level: ${difficulty}  |  ${new Date().toLocaleDateString()}`, margin, 30)

  y = 55

  // Body text
  doc.setTextColor(30, 30, 50)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  const lines = content.split('\n')
  for (const line of lines) {
    if (y > 270) {
      doc.addPage()
      y = margin
    }

    const trimmed = line.trim()
    if (!trimmed) { y += 4; continue; }

    // Section headers (lines starting with ##)
    if (trimmed.startsWith('##') || trimmed.startsWith('**')) {
      y += 4
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(108, 99, 255)
      const heading = trimmed.replace(/^#+\s*|^\*\*|\*\*$/g, '')
      doc.text(heading, margin, y)
      y += 7
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(30, 30, 50)
    } else {
      const wrapped = doc.splitTextToSize(trimmed, maxW)
      doc.text(wrapped, margin, y)
      y += wrapped.length * 6
    }
  }

  // Footer
  const pages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setTextColor(160, 160, 180)
    doc.text(`EduAI — Page ${i} of ${pages}`, margin, 290)
  }

  doc.save(`EduAI-Notes-${topic.replace(/\s+/g, '-')}.pdf`)
}
