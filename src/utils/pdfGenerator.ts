import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction, UserProfile } from '../types';
import { formatDateUz, formatUZS } from './formatters';

export function generateExpensePDF(
  user: UserProfile,
  transactions: Transaction[],
  dateRangeLabel = "Oxirgi 30 kunlik hisobot"
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Primary colors
  const primaryNavy = [15, 23, 42]; // Slate 900
  const emeraldGreen = [16, 185, 129];
  const crimsonRed = [225, 29, 72];
  const slateMuted = [100, 116, 139];

  // Header Background Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Decorative emerald accent line
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 42, pageWidth, 2, 'F');

  // Brand Name & Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('SARMOYA', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text("Talabalar va Yosh Mutaxassislar Moliyaviy Xarajat Nazorati", 14, 26);
  doc.text(`Hisobot davri: ${dateRangeLabel} | Sana: ${formatDateUz(new Date().toISOString())}`, 14, 34);

  // Status Badge in header
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - 65, 12, 51, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(52, 211, 153);
  doc.text("STATUS: TASDIQLANGAN", pageWidth - 60, 19);
  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.text("20+ Yosh Cheklovi O'tgan", pageWidth - 60, 24);

  // User Information Box
  let currentY = 52;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Foydalanuvchi Ma'lumotlari", 14, currentY);

  currentY += 4;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, currentY, pageWidth - 28, 26, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text("Ism va familiya:", 18, currentY + 7);
  doc.text("Ta'lim muassasasi:", 18, currentY + 14);
  doc.text("Elektron pochta:", 18, currentY + 21);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(user.fullName || "Noma'lum", 55, currentY + 7);
  doc.text(user.university || "Kiritilmagan", 55, currentY + 14);
  doc.text(user.email || "-", 55, currentY + 21);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text("Yoshi:", pageWidth - 70, currentY + 7);
  doc.text("Hisob ochilgan:", pageWidth - 70, currentY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${user.age} yosh (Talaba)`, pageWidth - 42, currentY + 7);
  doc.text(user.joinedAt || "2026", pageWidth - 42, currentY + 14);

  // Calculate Aggregates
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  // Key KPI Cards (4 columns)
  currentY += 34;
  const colWidth = (pageWidth - 28 - 9) / 3;

  // Box 1: Kirim
  doc.setFillColor(240, 253, 244); // green-50
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, currentY, colWidth, 20, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(22, 101, 52);
  doc.text("JAMI TUSHUM (KIRIM)", 18, currentY + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`+${formatUZS(totalIncome)}`, 18, currentY + 14);

  // Box 2: Chiqim
  doc.setFillColor(255, 241, 242); // rose-50
  doc.setDrawColor(254, 205, 211);
  doc.roundedRect(14 + colWidth + 4.5, currentY, colWidth, 20, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(159, 18, 57);
  doc.text("JAMI XARAJAT (CHIQIM)", 18 + colWidth + 4.5, currentY + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`-${formatUZS(totalExpense)}`, 18 + colWidth + 4.5, currentY + 14);

  // Box 3: Qoldiq
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14 + (colWidth + 4.5) * 2, currentY, colWidth, 20, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text("JORIY BALANS QOLDIG'I", 18 + (colWidth + 4.5) * 2, currentY + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(netBalance >= 0 ? 16 : 225, netBalance >= 0 ? 185 : 29, netBalance >= 0 ? 129 : 72);
  doc.text(formatUZS(netBalance), 18 + (colWidth + 4.5) * 2, currentY + 14);

  // Section 1: Category Analytics Table
  currentY += 28;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("1. Xarajatlarning Kategoriya Bo'yicha Tahlili", 14, currentY);

  // Group by category
  const categoryStats: Record<string, { name: string; count: number; total: number }> = {};
  const expenseList = transactions.filter((t) => t.type === 'expense');
  expenseList.forEach((tx) => {
    if (!categoryStats[tx.categoryName]) {
      categoryStats[tx.categoryName] = { name: tx.categoryName, count: 0, total: 0 };
    }
    categoryStats[tx.categoryName].count += 1;
    categoryStats[tx.categoryName].total += tx.amount;
  });

  const categoryRows = Object.values(categoryStats)
    .sort((a, b) => b.total - a.total)
    .map((c) => {
      const percentage = totalExpense > 0 ? ((c.total / totalExpense) * 100).toFixed(1) + '%' : '0%';
      return [c.name, c.count.toString(), formatUZS(c.total), percentage];
    });

  autoTable(doc, {
    startY: currentY + 4,
    head: [["Kategoriya", "Tranzaksiyalar", "Jami Sarf (so'm)", "Umumiy Ulush"]],
    body: categoryRows.length > 0 ? categoryRows : [["Xarajat yo'q", "0", "0 so'm", "0%"]],
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 45, halign: 'right', fontStyle: 'bold' },
      3: { cellWidth: 35, halign: 'center' },
    },
    margin: { left: 14, right: 14 },
  });

  // Section 2: Recent Transactions Table
  const finalY = (doc as any).lastAutoTable.finalY + 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("2. Tranzaksiyalar Reestri", 14, finalY);

  const transactionRows = transactions.slice(0, 30).map((tx) => {
    const typeLabel = tx.type === 'income' ? '+ Kirim' : '- Chiqim';
    return [
      `${tx.date} ${tx.time || ''}`,
      typeLabel,
      tx.categoryName,
      tx.description || '-',
      tx.paymentMethod,
      (tx.type === 'income' ? '+' : '-') + formatUZS(tx.amount),
    ];
  });

  autoTable(doc, {
    startY: finalY + 4,
    head: [["Sana", "Turi", "Kategoriya", "Tavsif", "To'lov", "Miqdor"]],
    body: transactionRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
    },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 20, fontStyle: 'bold' },
      2: { cellWidth: 38 },
      3: { cellWidth: 46 },
      4: { cellWidth: 24, halign: 'center' },
      5: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 1) {
        if (data.cell.raw === '+ Kirim') {
          data.cell.styles.textColor = [16, 185, 129];
        } else {
          data.cell.styles.textColor = [225, 29, 72];
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  // Footer note on last page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Sarmoya Xarajatlar Tizimi | Talaba: ${user.fullName} (${user.university}) | Sahifa ${i} / ${totalPages}`,
      14,
      doc.internal.pageSize.getHeight() - 8
    );
  }

  // Save the document
  const fileName = `Sarmoya_Xarajatlar_Hisoboti_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}
