import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

function mapReasonToText(reason) {
  switch (reason) {
    case "cancelled":
      return {
        title: "پرداخت لغو شد",
        desc: "پرداخت توسط کاربر لغو شد یا در درگاه ناموفق بود.",
      };
    case "invalid-authority":
      return {
        title: "اطلاعات پرداخت نامعتبر است",
        desc: "کد رهگیری (Authority) از سمت درگاه دریافت نشد.",
      };
    case "order-not-found":
      return {
        title: "سفارش پیدا نشد",
        desc: "سفارشی برای این پرداخت در سیستم پیدا نشد.",
      };
    case "verification-failed":
      return {
        title: "تأیید پرداخت ناموفق بود",
        desc: "پرداخت انجام شد/برگشت داده شد اما تأیید نهایی با خطا مواجه شد.",
      };
    default:
      return {
        title: "پرداخت ناموفق بود",
        desc: "پرداخت با موفقیت تکمیل نشد. در صورت کسر وجه، طی چند دقیقه به حساب شما بازمی‌گردد.",
      };
  }
}

export default function PaymentFailed() {
  const [params] = useSearchParams();

  const authority = params.get("authority") || "";
  const reason = params.get("reason") || "";

  const ui = useMemo(() => mapReasonToText(reason), [reason]);

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>{ui.title}</h1>
      <p style={{ color: "#444", lineHeight: 1.9 }}>{ui.desc}</p>

      {authority && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: "#f6f6f6",
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 13, color: "#666" }}>Authority</div>
          <div style={{ fontFamily: "monospace" }}>{authority}</div>
        </div>
      )}

      <div
        style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}
      >
        <Link to="/checkout" style={btnStyle}>
          بازگشت به تسویه‌حساب
        </Link>
        <Link to="/cart" style={btnStyleSecondary}>
          مشاهده سبد خرید
        </Link>
        <Link to="/" style={btnStyleSecondary}>
          صفحه اصلی
        </Link>
      </div>
    </div>
  );
}

const btnStyle = {
  display: "inline-block",
  padding: "10px 14px",
  background: "#c62828",
  color: "white",
  borderRadius: 8,
  textDecoration: "none",
};

const btnStyleSecondary = {
  display: "inline-block",
  padding: "10px 14px",
  background: "#e0e0e0",
  color: "#111",
  borderRadius: 8,
  textDecoration: "none",
};
