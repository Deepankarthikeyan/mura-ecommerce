"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  ShopFilterFacet,
  ShopRangeFacet,
} from "@/lib/shopProductFilters";

type ShopProductFiltersProps = {
  facets: ShopFilterFacet[];
  facetsLoading?: boolean;
  selected: Record<string, string[]>;
  ranges: Record<string, { min: string; max: string }>;
  onToggleValue: (queryParam: string, value: string) => void;
  onApplyRange: (minParam: string, maxParam: string, min: string, max: string) => void;
  onClearAll: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  hasActiveFilters: boolean;
};

function RangeInputs({
  facet,
  draft,
  onDraftChange,
  onApply,
}: {
  facet: ShopRangeFacet;
  draft: { min: string; max: string };
  onDraftChange: (next: { min: string; max: string }) => void;
  onApply: () => void;
}) {
  const minBound = Math.floor(facet.min);
  const maxBound = Math.ceil(facet.max);
  return (
    <form
      className="shop-filter-range"
      onSubmit={(e) => {
        e.preventDefault();
        onApply();
      }}
    >
      <div className="shop-filter-range-inputs">
        <label>
          <span>Min</span>
          <input
            type="number"
            min={minBound}
            max={maxBound}
            value={draft.min}
            placeholder={String(minBound)}
            onChange={(e) => onDraftChange({ ...draft, min: e.target.value })}
          />
        </label>
        <label>
          <span>Max</span>
          <input
            type="number"
            min={minBound}
            max={maxBound}
            value={draft.max}
            placeholder={String(maxBound)}
            onChange={(e) => onDraftChange({ ...draft, max: e.target.value })}
          />
        </label>
      </div>
      <div className="shop-filter-range-footer">
        <span>
          ₹{minBound.toLocaleString("en-IN")} — ₹{maxBound.toLocaleString("en-IN")}
        </span>
        <button type="submit">Apply</button>
      </div>
    </form>
  );
}

export default function ShopProductFilters({
  facets,
  facetsLoading = false,
  selected,
  ranges,
  onToggleValue,
  onApplyRange,
  onClearAll,
  onRefresh,
  isRefreshing = false,
  hasActiveFilters,
}: ShopProductFiltersProps) {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rangeDrafts, setRangeDrafts] = useState<Record<string, { min: string; max: string }>>({});

  useEffect(() => {
    setRangeDrafts((prev) => {
      const next = { ...prev };
      for (const facet of facets) {
        if (facet.type !== "range") continue;
        next[facet.key] = ranges[facet.key] ?? { min: "", max: "" };
      }
      return next;
    });
  }, [facets, ranges]);

  useEffect(() => {
    const activeKeys = facets
      .filter((facet) => {
        if (facet.type === "range") {
          const range = ranges[facet.key];
          return Boolean(range?.min || range?.max);
        }
        return (selected[facet.queryParam] ?? []).length > 0;
      })
      .map((facet) => facet.key);
    if (!activeKeys.length) return;
    setOpenKeys((current) => Array.from(new Set([...current, ...activeKeys])));
  }, [facets, selected, ranges]);

  const selectedCount = useMemo(
    () =>
      Object.values(selected).reduce((sum, values) => sum + values.length, 0) +
      Object.values(ranges).reduce(
        (sum, range) => sum + (range.min ? 1 : 0) + (range.max ? 1 : 0),
        0
      ),
    [selected, ranges]
  );

  const toggleOpen = (key: string) => {
    setOpenKeys((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    );
  };

  return (
    <aside className="shop-dynamic-filters">
      <button
        type="button"
        className="shop-filters-mobile-toggle"
        onClick={() => setMobileOpen((open) => !open)}
        aria-expanded={mobileOpen}
      >
        Filters{selectedCount ? ` (${selectedCount})` : ""}
        <i className={`fa-regular fa-chevron-${mobileOpen ? "up" : "down"}`} />
      </button>

      <div className={`shop-filters-panel${mobileOpen ? " is-open" : ""}`}>
        <div className="shop-filters-heading">
          <h5>Filters</h5>
          <div className="shop-filters-heading-actions">
            {onRefresh ? (
              <button
                type="button"
                className="shop-filters-refresh"
                onClick={onRefresh}
                disabled={isRefreshing || facetsLoading}
                aria-label="Refresh filters"
                title="Refresh filters"
              >
                <i className={`fa-regular fa-arrows-rotate${isRefreshing ? " is-spinning" : ""}`} />
              </button>
            ) : null}
            {hasActiveFilters ? (
              <button type="button" className="shop-filters-clear" onClick={onClearAll}>
                Clear all
              </button>
            ) : null}
          </div>
        </div>

        {facetsLoading ? (
          <p className="shop-filters-empty">Loading filters...</p>
        ) : facets.length === 0 ? (
          <p className="shop-filters-empty">No filters available yet.</p>
        ) : (
          facets.map((facet) => {
            const isOpen = openKeys.includes(facet.key);
            return (
              <div className="shop-filter-accordion" key={facet.key}>
                <button
                  type="button"
                  className="shop-filter-accordion-trigger"
                  aria-expanded={isOpen}
                  onClick={() => toggleOpen(facet.key)}
                >
                  <span>{facet.label}</span>
                  <i className={`fa-regular fa-chevron-down${isOpen ? " is-open" : ""}`} />
                </button>
                {isOpen ? (
                  <div className="shop-filter-accordion-body">
                    {facet.type === "range" ? (
                      <RangeInputs
                        facet={facet}
                        draft={rangeDrafts[facet.key] ?? { min: "", max: "" }}
                        onDraftChange={(next) =>
                          setRangeDrafts((current) => ({ ...current, [facet.key]: next }))
                        }
                        onApply={() => {
                          const draft = rangeDrafts[facet.key] ?? { min: "", max: "" };
                          onApplyRange(facet.minParam, facet.maxParam, draft.min, draft.max);
                        }}
                      />
                    ) : (
                      <ul className="shop-filter-options">
                        {facet.options.map((option) => {
                          const checked = (selected[facet.queryParam] ?? []).includes(option.value);
                          const inputId = `shop-filter-${facet.key}-${option.value}`;
                          return (
                            <li key={option.value}>
                              <label htmlFor={inputId}>
                                <input
                                  id={inputId}
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => onToggleValue(facet.queryParam, option.value)}
                                />
                                <span className="shop-filter-option-label">{option.label}</span>
                                <span className="shop-filter-option-count">{option.count}</span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .shop-dynamic-filters {
          background: #fff;
        }
        .shop-filters-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding-bottom: 14px;
          border-bottom: 1px solid #ececec;
          margin-bottom: 4px;
          flex-wrap: nowrap;
        }
        .shop-filters-heading h5 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #1d1d1d;
          white-space: nowrap;
          word-break: keep-all;
          flex: 0 0 auto;
        }
        .shop-filters-heading-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 0 0 auto;
        }
        .shop-filters-refresh {
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: var(--color-primary);
          padding: 0;
          cursor: pointer;
          line-height: 1;
        }
        .shop-filters-refresh:disabled {
          opacity: 0.55;
          cursor: default;
        }
        .shop-filters-refresh i {
          font-size: 14px;
        }
        .shop-filters-refresh i.is-spinning {
          display: inline-block;
          animation: shop-filter-spin 0.8s linear infinite;
        }
        @keyframes shop-filter-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .shop-filters-clear {
          border: none;
          background: transparent;
          color: var(--color-primary);
          font-size: 13px;
          font-weight: 600;
          padding: 0;
          cursor: pointer;
          white-space: nowrap;
          flex: 0 0 auto;
          line-height: 1;
        }
        .shop-filters-empty {
          margin: 16px 0 0;
          color: #74787c;
          font-size: 14px;
        }
        .shop-filter-accordion {
          border-bottom: 1px solid #ececec;
        }
        .shop-filter-accordion-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 0;
          border: none;
          background: transparent;
          color: #2c3c28;
          font-size: 15px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
        }
        .shop-filter-accordion-trigger i {
          color: var(--color-primary);
          font-size: 12px;
          transition: transform 0.2s ease;
        }
        .shop-filter-accordion-trigger i.is-open {
          transform: rotate(180deg);
        }
        .shop-filter-accordion-body {
          padding: 0 0 16px;
        }
        .shop-filter-options {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .shop-filter-options label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          margin: 0;
          font-size: 14px;
          color: #2c3c28;
        }
        .shop-filter-options input {
          width: 16px;
          height: 16px;
          margin: 0;
          accent-color: var(--color-primary);
          flex: 0 0 auto;
        }
        .shop-filter-option-label {
          flex: 1 1 auto;
        }
        .shop-filter-option-count {
          color: #8a8a8a;
          font-size: 12px;
        }
        .shop-filter-range-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .shop-filter-range-inputs label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin: 0;
          font-size: 12px;
          color: #74787c;
        }
        .shop-filter-range-inputs input {
          height: 38px;
          border: 1px solid #e2e2e2;
          border-radius: 4px;
          padding: 0 10px;
          color: #2c3c28;
          outline: none;
        }
        .shop-filter-range-inputs input:focus {
          border-color: var(--color-primary);
        }
        .shop-filter-range-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: 12px;
          font-size: 13px;
          color: #2c3c28;
        }
        .shop-filter-range-footer button {
          height: 34px;
          padding: 0 14px;
          border: none;
          border-radius: 4px;
          background: var(--color-primary);
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }
        .shop-filters-mobile-toggle {
          display: none;
          width: 100%;
          height: 44px;
          align-items: center;
          justify-content: space-between;
          padding: 0 14px;
          margin-bottom: 12px;
          border: 1px solid #e2e2e2;
          border-radius: 6px;
          background: #fff;
          color: #2c3c28;
          font-weight: 600;
        }
        @media (max-width: 1199px) {
          .shop-filters-mobile-toggle {
            display: flex;
          }
          .shop-filters-panel {
            display: none;
            margin-bottom: 24px;
          }
          .shop-filters-panel.is-open {
            display: block;
          }
        }
      `}</style>
    </aside>
  );
}
