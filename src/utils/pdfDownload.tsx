// utils/pdfDownload.ts

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// 모든 이미지와 폰트가 로드될 때까지 대기
const waitForResources = async () => {
  // 이미지 로딩 대기
  const images = Array.from(document.images);
  await Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );

  // 폰트 로딩 대기
  if (document.fonts) {
    await document.fonts.ready;
  }

  // 추가 딜레이 (애니메이션 완료 대기)
  await new Promise((resolve) => setTimeout(resolve, 500));
};

// oklch 색상을 일반 색상으로 변환하는 함수
const convertOklchColors = (element: HTMLElement) => {
  const allElements = element.querySelectorAll("*");
  const originalStyles: Array<{
    element: Element;
    property: string;
    value: string;
  }> = [];

  allElements.forEach((el) => {
    const computed = window.getComputedStyle(el);
    const properties = [
      "color",
      "backgroundColor",
      "borderColor",
      "borderTopColor",
      "borderRightColor",
      "borderBottomColor",
      "borderLeftColor",
    ];

    properties.forEach((prop) => {
      const value = computed.getPropertyValue(prop);
      if (value && value.includes("oklch")) {
        originalStyles.push({
          element: el,
          property: prop,
          value: (el as HTMLElement).style.getPropertyValue(prop),
        });

        (el as HTMLElement).style.setProperty(prop, value, "important");
      }
    });
  });

  return originalStyles;
};

// 원래 스타일로 복원
const restoreStyles = (
  originalStyles: Array<{ element: Element; property: string; value: string }>
) => {
  originalStyles.forEach(({ element, property, value }) => {
    if (value) {
      (element as HTMLElement).style.setProperty(property, value);
    } else {
      (element as HTMLElement).style.removeProperty(property);
    }
  });
};

// 전체 다운로드 (AnalysisResult + AnalysisResultDetail)
export const downloadFullPDF = async () => {
  const element = document.getElementById("full-analysis-content");

  if (!element) {
    console.error("Element not found");
    alert("다운로드할 콘텐츠를 찾을 수 없습니다.");
    return;
  }

  let originalStyles: Array<{
    element: Element;
    property: string;
    value: string;
  }> = [];

  try {
    console.log("PDF 생성 준비 중...");

    // 리소스 로딩 대기
    await waitForResources();

    // oklch 색상 변환
    originalStyles = convertOklchColors(element);

    console.log("캡처 시작...");

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true,
      backgroundColor: "#F7F7F8",
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    console.log("Canvas 생성 완료:", canvas.width, "x", canvas.height);

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    console.log("PDF 페이지 생성 중...");

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = `발표분석결과_전체_${new Date()
      .toLocaleDateString("ko-KR")
      .replace(/\. /g, "-")
      .replace(/\./g, "")}.pdf`;
    pdf.save(fileName);

    console.log("PDF 다운로드 완료!");
  } catch (error) {
    console.error("PDF 생성 중 오류 발생:", error);
    throw error;
  } finally {
    restoreStyles(originalStyles);
  }
};

// AnalysisResult만 다운로드
export const downloadBasicPDF = async () => {
  const element = document.getElementById("basic-analysis-content");

  if (!element) {
    console.error("Element not found");
    alert("다운로드할 콘텐츠를 찾을 수 없습니다.");
    return;
  }

  let originalStyles: Array<{
    element: Element;
    property: string;
    value: string;
  }> = [];

  try {
    console.log("PDF 생성 준비 중...");

    // 리소스 로딩 대기
    await waitForResources();

    // oklch 색상 변환
    originalStyles = convertOklchColors(element);

    console.log("캡처 시작...");

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true,
      backgroundColor: "#F7F7F8",
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    console.log("Canvas 생성 완료:", canvas.width, "x", canvas.height);

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    console.log("PDF 페이지 생성 중...");

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = `발표분석결과_기본_${new Date()
      .toLocaleDateString("ko-KR")
      .replace(/\. /g, "-")
      .replace(/\./g, "")}.pdf`;
    pdf.save(fileName);

    console.log("PDF 다운로드 완료!");
  } catch (error) {
    console.error("PDF 생성 중 오류 발생:", error);
    throw error;
  } finally {
    restoreStyles(originalStyles);
  }
};
