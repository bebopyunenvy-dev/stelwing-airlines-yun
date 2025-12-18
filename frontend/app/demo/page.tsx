'use client';

export default function DemoPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-16 space-y-16 bg-[var(--sw-white)] text-[var(--sw-primary)]">
      {/* =====================
          #1 Color Style
      ===================== */}
      <section className="text-center space-y-6">
        <h2 className="sw-h2">#1 ColorStyle</h2>
        <div className="flex gap-8 justify-center">
          {[
            { name: 'PrimaryBlue', color: 'var(--sw-primary)' },
            { name: 'SecondaryYellow', color: 'var(--sw-accent)' },
            { name: 'SecondaryGrey', color: 'var(--sw-grey)' },
            { name: 'White', color: 'var(--sw-white)', border: true },
            { name: 'Black', color: 'var(--sw-black)' },
          ].map((c) => (
            <div key={c.name} className="text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-2 shadow-sm"
                style={{
                  background: ` ${c.color}`,
                  border: c.border ? '1px solid #E5E7EB' : 'none',
                }}
              />
              <p className="sw-p2">{c.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================
          #2 Text
      ===================== */}
      <section className="text-center space-y-3">
        <h2 className="sw-h2">#2 Text</h2>
        <h1 className="sw-h1">H1 字體樣式</h1>
        <h2 className="sw-h2">H2 字體樣式</h2>
        <h3 className="sw-h3">H3 字體樣式</h3>
        <h4 className="sw-h4">H4 字體樣式</h4>
        <h5 className="sw-h5">H5 字體樣式</h5>
        <h6 className="sw-h6">H6 字體樣式</h6>
        <p className="sw-p1">這是 P1 文字樣式（一般段落）</p>
        <p className="sw-p2">這是 P2 文字樣式（次要說明）</p>
        <p className="sw-caption">這是 Caption 註解文字</p>
      </section>

      {/* =====================
          #3 Buttons
      ===================== */}
      <section className="text-center space-y-4">
        <h2 className="sw-h2">#3 Buttons（金色與灰色版本）</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {/* 🟡 金色系列 */}
          <button className="sw-btn sw-btn--gold-primary">金色全圓</button>
          <button className="sw-btn sw-btn--gold-square">金色方形</button>
          <button className="sw-btn sw-btn--gold-disabled" disabled>
            金色停用
          </button>

          {/* ⚪ 灰色系列 */}
          <button className="sw-btn sw-btn--grey-primary">灰色全圓</button>
          <button className="sw-btn sw-btn--grey-square">灰色方形</button>
          <button className="sw-btn sw-btn--grey-disabled" disabled>
            灰色停用
          </button>

          {/* 線框版 */}
          <button className="sw-btn">線框版</button>
        </div>
      </section>
    </main>
  );
}
