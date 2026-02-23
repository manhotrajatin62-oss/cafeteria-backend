import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

export const normalizeAnalyticsData = (data: any) => {
  const normalized: any = {};

  for (const key of Object.keys(data)) {
    const value = data[key];

    if (Array.isArray(value)) {
      normalized[key] = value.map((row: any) => {
        const newRow: any = {};

        for (const field of Object.keys(row)) {
          if (field === "_id") continue;

          newRow[field] = row[field];
        }

        return newRow;
      });
    } else if (typeof value === "number") {
      normalized[key] = [{ VALUE: value }];
    } else if (typeof value === "object" && value !== null) {
      const newRow: any = {};
      for (const field of Object.keys(value)) {
        if (field === "_id") continue;
        newRow[field] = value[field];
      }
      normalized[key] = [newRow];
    }
  }

  return normalized;
};

export const generateExcel = async (
  analyticsData: any,
  type: string,
  rangeLabel: string,
  res: any,
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Analytics");

  let currentRow = 1;

  const greyFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD9D9D9" },
  };

  const borderStyle = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  const getColumnLetter = (colNumber: number) => {
    let letter = "";
    while (colNumber > 0) {
      let remainder = (colNumber - 1) % 26;
      letter = String.fromCharCode(65 + remainder) + letter;
      colNumber = Math.floor((colNumber - 1) / 26);
    }
    return letter;
  };

  const formatHeader = (text: string) => {
    return text
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .toUpperCase()
      .trim();
  };

  let maxColumns = 1;

  for (const key of Object.keys(analyticsData)) {
    const section = analyticsData[key];
    if (Array.isArray(section) && section.length > 0) {
      const cols = Object.keys(section[0]).length + 1; // +1 for S.NO
      maxColumns = Math.max(maxColumns, cols);
    }
  }

  const lastColLetter = getColumnLetter(maxColumns);

  const reportTitle = `${type.toUpperCase()} ANALYTICS REPORT (${rangeLabel.toUpperCase()})`;

  worksheet.mergeCells(`A${currentRow}:${lastColLetter}${currentRow}`);

  const mainCell = worksheet.getCell(`A${currentRow}`);
  mainCell.value = reportTitle;
  mainCell.font = { bold: true, size: 16 };
  mainCell.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };
  mainCell.fill = greyFill;

  currentRow += 3;

  for (const sectionKey of Object.keys(analyticsData)) {
    const sectionData = analyticsData[sectionKey];
    if (!Array.isArray(sectionData) || sectionData.length === 0) continue;

    const headers = Object.keys(sectionData[0]);
    const finalHeaders = ["S.NO", ...headers];

    const sectionLastColLetter = getColumnLetter(finalHeaders.length);

    worksheet.mergeCells(`A${currentRow}:${sectionLastColLetter}${currentRow}`);

    const sectionCell = worksheet.getCell(`A${currentRow}`);
    sectionCell.value = formatHeader(sectionKey);
    sectionCell.font = { bold: true, size: 13 };
    sectionCell.alignment = { horizontal: "center" };
    sectionCell.fill = greyFill;

    currentRow += 2;

    const startRow = currentRow;

    finalHeaders.forEach((header, colIndex) => {
      const cell = worksheet.getCell(currentRow, colIndex + 1);
      cell.value = formatHeader(header);
      cell.font = { bold: true };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.fill = greyFill;
      cell.border = borderStyle;
    });

    currentRow++;

    sectionData.forEach((row: any, index: number) => {
      finalHeaders.forEach((header, colIndex) => {
        const cell = worksheet.getCell(currentRow, colIndex + 1);

        if (header === "S.NO") {
          cell.value = index + 1;
        } else {
          cell.value = row[header] ?? "";
        }

        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };

        cell.border = borderStyle;
      });

      currentRow++;
    });

    const endRow = currentRow - 1;

    for (let r = startRow; r <= endRow; r++) {
      for (let c = 1; c <= finalHeaders.length; c++) {
        worksheet.getCell(r, c).border = borderStyle;
      }
    }

    currentRow += 2;
  }

  for (let i = 1; i <= worksheet.columnCount; i++) {
    const column = worksheet.getColumn(i);
    let maxLength = 10;

    column.eachCell({ includeEmpty: true }, (cell) => {
      const val = cell.value ? cell.value.toString() : "";
      maxLength = Math.max(maxLength, val.length);
    });

    column.width = Math.min(maxLength + 4, 40);
  }

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${type}-analytics.xlsx`,
  );

  await workbook.xlsx.write(res);
  res.end();
};

export const generatePDF = (
  analyticsData: any,
  type: string,
  rangeLabel: string,
  res: any
) => {
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 40,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${type}-analytics.pdf`
  );

  doc.pipe(res);

  let pageWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;

  const startX = doc.page.margins.left;
  let currentY = doc.page.margins.top;

  const baseRowHeight = 28;
  const headerGrey = "#D9D9D9";
  const sectionGrey = "#EDEDED";

  const updatePageMetrics = () => {
    pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;
  };

  const ensureSpace = (requiredHeight: number) => {
    if (currentY + requiredHeight > doc.page.height - 50) {
      doc.addPage({
        size: "A4",
        layout: "landscape",
        margin: 40,
      });
      currentY = doc.page.margins.top;
      updatePageMetrics();
    }
  };

  const formatHeader = (text: string) =>
    text.replace(/([A-Z])/g, " $1").toUpperCase().trim();

  const formatDate = (value: any) => {
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatValue = (value: any) => {
  if (value === null || value === undefined) return "";

  // If it's already a Date object
  if (value instanceof Date) {
    return formatDate(value);
  }

  // If it's a valid date string
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (!isNaN(parsed)) {
      return formatDate(value);
    }
    return value;
  }

  // Nested object case (orderTrend)
  if (typeof value === "object") {
    if (value.year && value.month && value.day) {
      return formatDate(
        new Date(value.year, value.month - 1, value.day)
      );
    }
    return Object.values(value).join("-");
  }

  return String(value);
};

  /* ================= MAIN TITLE ================= */

  doc.rect(startX, currentY, pageWidth, 40).fill(headerGrey);

  doc
    .fillColor("black")
    .font("Helvetica-Bold")
    .fontSize(16)
    .text(
      `${type.toUpperCase()} ANALYTICS REPORT (${rangeLabel.toUpperCase()})`,
      startX,
      currentY + 12,
      { width: pageWidth, align: "center" }
    );

  currentY += 60;

  /* ================= SECTIONS ================= */

  for (const sectionKey of Object.keys(analyticsData)) {
    let sectionData = analyticsData[sectionKey];
    if (!sectionData) continue;

    if (!Array.isArray(sectionData)) {
      sectionData = [sectionData];
    }

    if (sectionData.length === 0) continue;

    const headers = ["S.NO", ...Object.keys(sectionData[0])];
    const colWidth = pageWidth / headers.length;

    ensureSpace(80);

    /* ---------- SECTION TITLE ---------- */

    doc.rect(startX, currentY, pageWidth, 30).fill(sectionGrey);

    doc
      .fillColor("black")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(formatHeader(sectionKey), startX, currentY + 8, {
        width: pageWidth,
        align: "center",
      });

    currentY += 40;

    const drawHeaderRow = () => {
      headers.forEach((header: string, i: number) => {
        const x = startX + i * colWidth;

        doc.rect(x, currentY, colWidth, baseRowHeight).fill(headerGrey);
        doc.rect(x, currentY, colWidth, baseRowHeight).stroke();

        doc
          .fillColor("black")
          .font("Helvetica-Bold")
          .fontSize(9)
          .text(formatHeader(header), x + 5, currentY + 8, {
            width: colWidth - 10,
            align: "center",
          });
      });

      currentY += baseRowHeight;
    };

    drawHeaderRow();

    /* ---------- DATA ROWS ---------- */

    sectionData.forEach((row: any, index: number) => {
      const values = headers.map((header) =>
        header === "S.NO"
          ? index + 1
          : formatValue(row[header])
      );

      let rowHeight = baseRowHeight;

      values.forEach((val) => {
        const h = doc.heightOfString(String(val), {
          width: colWidth - 10,
        });
        rowHeight = Math.max(rowHeight, h + 10);
      });

      ensureSpace(rowHeight);

      if (currentY === doc.page.margins.top) {
        drawHeaderRow();
      }

      headers.forEach((header: string, i: number) => {
        const x = startX + i * colWidth;

        doc.rect(x, currentY, colWidth, rowHeight).stroke();

        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor("black")
          .text(String(values[i]), x + 5, currentY + 6, {
            width: colWidth - 10,
            align: "center",
          });
      });

      currentY += rowHeight;
    });

    currentY += 25;
  }

  doc.end();
};