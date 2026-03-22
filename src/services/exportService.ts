import jsPDF from 'jspdf'

// ===== Excel (CSV) 내보내기 =====

export function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const BOM = '\uFEFF'
  const csv = BOM + [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportStudentData(
  students: { name: string; email: string; orgCode: string; completedLessons: number; totalLessons: number; loginDays: number; lastLogin: string }[]
) {
  downloadCSV(
    `동치미학교_학생데이터_${new Date().toISOString().split('T')[0]}`,
    ['이름', '이메일', '기관코드', '완료 수업', '전체 수업', '진도율(%)', '학습 일수', '마지막 접속'],
    students.map(s => [
      s.name,
      s.email,
      s.orgCode,
      String(s.completedLessons),
      String(s.totalLessons),
      String(s.totalLessons > 0 ? Math.round((s.completedLessons / s.totalLessons) * 100) : 0),
      String(s.loginDays),
      s.lastLogin,
    ])
  )
}

// ===== PDF 리포트 =====

export function generateOrgReport(orgName: string, stats: {
  totalStudents: number
  avgProgress: number
  totalLessons: number
  period: string
  programType: string
}) {
  const doc = new jsPDF()
  const now = new Date().toLocaleDateString('ko-KR')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('동치미학교 교육 성과 보고서', 105, 30, { align: 'center' })

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`기관: ${orgName}`, 20, 50)
  doc.text(`프로그램: ${stats.programType === 'senior' ? '큰동치미 (초시니어)' : '작은동치미 (중장년층)'}`, 20, 60)
  doc.text(`기간: ${stats.period}`, 20, 70)
  doc.text(`작성일: ${now}`, 20, 80)

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('교육 현황', 20, 100)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`전체 학생 수: ${stats.totalStudents}명`, 30, 115)
  doc.text(`평균 진도율: ${stats.avgProgress}%`, 30, 125)
  doc.text(`전체 수업 수: ${stats.totalLessons}개`, 30, 135)

  doc.setFontSize(10)
  doc.text('본 보고서는 동치미학교 시스템에서 자동 생성되었습니다.', 105, 280, { align: 'center' })

  doc.save(`동치미학교_보고서_${orgName}_${now}.pdf`)
}

// ===== 수료증 PDF =====

export function generateCertificate(studentName: string, courseName: string, orgName: string, completedDate: string) {
  const doc = new jsPDF('landscape')

  // 테두리
  doc.setDrawColor(45, 106, 79)
  doc.setLineWidth(3)
  doc.rect(10, 10, 277, 190)
  doc.setLineWidth(1)
  doc.rect(15, 15, 267, 180)

  // 제목
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(32)
  doc.setTextColor(45, 106, 79)
  doc.text('수 료 증', 148.5, 50, { align: 'center' })

  // 이름
  doc.setFontSize(24)
  doc.setTextColor(26, 26, 46)
  doc.text(studentName, 148.5, 80, { align: 'center' })

  // 내용
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text(`위 사람은 동치미학교 ${courseName} 과정을`, 148.5, 100, { align: 'center' })
  doc.text('성실히 이수하였으므로 이 증서를 수여합니다.', 148.5, 112, { align: 'center' })

  // 날짜
  doc.setFontSize(12)
  doc.text(`수료일: ${completedDate}`, 148.5, 135, { align: 'center' })
  doc.text(`기관: ${orgName}`, 148.5, 147, { align: 'center' })

  // 발급처
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(45, 106, 79)
  doc.text('동치미학교', 148.5, 175, { align: 'center' })

  doc.save(`수료증_${studentName}_${completedDate}.pdf`)
}
