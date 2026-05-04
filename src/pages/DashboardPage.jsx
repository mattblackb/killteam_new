import { Fragment, useRef, useState } from "react";
import { ConfirmActionModal, LayoutPresetsModal } from "../components/modals/AppModals";

function isBreakEntry(entry) {
  return entry && typeof entry === "object" && entry.type === "break" && typeof entry.id === "string";
}

function createBreakEntry() {
  return {
    id: `break-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: "break"
  };
}

// ── Size picker ────────────────────────────────────────────────────────────────

function SizePicker({ size, onChange }) {
  return (
    <div className="widget-size-picker">
      {["small", "medium", "large"].map((s) => (
        <button
          key={s}
          type="button"
          className={`size-pill ${size === s ? "active" : ""}`}
          onClick={() => onChange(s)}
          aria-label={`${s} size`}
        >
          {s[0].toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// ── Summary widget ─────────────────────────────────────────────────────────────

function SummaryWidget({ savedArmies, battleState }) {
  const totalMembers = savedArmies.reduce((sum, a) => sum + a.members.length, 0);
  return (
    <div className="widget-content summary-widget">
      <p className="widget-eyebrow">App Overview</p>
      <h3 className="widget-title">Kill Team</h3>
      <div className="widget-stat-row">
        <div className="widget-stat">
          <span className="widget-stat-value">{savedArmies.length}</span>
          <span className="widget-stat-label">Armies</span>
        </div>
        <div className="widget-stat">
          <span className="widget-stat-value">{totalMembers}</span>
          <span className="widget-stat-label">Operatives</span>
        </div>
        {battleState ? (
          <div className="widget-stat">
            <span className="widget-stat-value widget-turn-badge">Turn {battleState.turnNumber}</span>
            <span className="widget-stat-label">Active Battle</span>
          </div>
        ) : (
          <div className="widget-stat">
            <span className="widget-stat-value widget-idle-badge">—</span>
            <span className="widget-stat-label">No Battle</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Launcher widget ────────────────────────────────────────────────────────────

function LauncherWidget({ selectedArmies, onLaunchBattle }) {
  const canLaunch = selectedArmies.length >= 1 && selectedArmies.length <= 2;
  return (
    <div className="widget-content launcher-widget">
      <p className="widget-eyebrow">Battle</p>
      <h3 className="widget-title">Launcher</h3>
      {selectedArmies.length === 0 ? (
        <p className="widget-hint">Toggle armies below to add them to a battle.</p>
      ) : (
        <ul className="launcher-army-list">
          {selectedArmies.map((a) => (
            <li key={a.id}>{a.armyName}</li>
          ))}
        </ul>
      )}
      <button
        type="button"
        className="widget-launch-btn"
        onClick={onLaunchBattle}
        disabled={!canLaunch}
      >
        {canLaunch ? "Start Battle →" : "Select 1–2 Armies"}
      </button>
    </div>
  );
}

// ── Army widget ────────────────────────────────────────────────────────────────

function ArmyWidget({ army, isSelected, onToggleSelection, size }) {
  const totalWounds = army.members.reduce(
    (t, m) => t + (typeof m.wounds === "number" ? m.wounds : 0),
    0
  );
  const leaderCount = army.members.filter(
    (m) => Array.isArray(m.tags) && m.tags.includes("Leader")
  ).length;
  const previewCount = size === "large" ? 8 : size === "medium" ? 4 : 2;
  const previewMembers = army.members.filter((m) => m.imageDataUrl).slice(0, previewCount);

  return (
    <div className="widget-content army-widget">
      <div className="widget-army-header">
        <div className="widget-army-titles">
          <p className="widget-eyebrow">{army.armyTypeName}</p>
          <h3 className="widget-title">{army.armyName}</h3>
          <p className="widget-faction">{army.faction}</p>
        </div>
        <button
          type="button"
          className={`widget-select-btn ${isSelected ? "selected" : ""}`}
          onClick={() => onToggleSelection(army.id)}
          aria-label={isSelected ? "Deselect for battle" : "Select for battle"}
          title={isSelected ? "Deselect for battle" : "Select for battle"}
        >
          {isSelected ? "✓ Battle" : "+ Battle"}
        </button>
      </div>

      {size === "small" ? (
        <p className="widget-small-meta">
          {army.members.length} operatives · {totalWounds} wounds
        </p>
      ) : (
        <div className="widget-stats-row">
          <span>{army.members.length} members</span>
          <span>{totalWounds} wounds</span>
          <span>
            {leaderCount} leader{leaderCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {previewMembers.length > 0 && (
        <div className={`widget-preview-row ${size}`}>
          {previewMembers.map((m) => (
            <img
              key={m.id}
              src={m.imageDataUrl}
              alt={m.operative}
              title={m.operative}
              loading="lazy"
            />
          ))}
        </div>
      )}

      {size !== "small" && (
        <p className="widget-saved-at">Saved {army.savedAtLabel}</p>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

const PRESETS = [
  {
    id: "small",
    label: "Compact",
    desc: "Small cards — see everything at once",
    pattern: [1, 1, 1, 1, 1, 1],
  },
  {
    id: "medium",
    label: "Standard",
    desc: "Balanced detail for each army",
    pattern: [2, 2, 2, 2],
  },
  {
    id: "large",
    label: "Detailed",
    desc: "Full-width cards with photo previews",
    pattern: [4, 4],
  },
];

export default function DashboardPage({
  formattedSavedArmies,
  selectedOverviewArmyIds,
  selectedOverviewArmies,
  onToggleSelection,
  onDeleteArmy,
  onLaunchBattle,
  onEditArmy,
  battleState,
  dashboardLayout,
  onUpdateDashboardLayout,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const dragRef = useRef(null);

  // Build canonical widget definitions
  const fixedWidgets = [
    { id: "summary", type: "summary" },
    { id: "launcher", type: "launcher" },
  ];
  const armyWidgets = formattedSavedArmies.map((a) => ({ id: a.id, type: "army" }));
  const allWidgets = [...fixedWidgets, ...armyWidgets];
  const allWidgetIds = allWidgets.map((w) => w.id);
  const widgetTypeById = Object.fromEntries(allWidgets.map((w) => [w.id, w.type]));

  // Merge persisted layout with current widget list
  const normalizedLayout = (() => {
    const saved = Array.isArray(dashboardLayout)
      ? dashboardLayout
          .filter((entry) => {
            if (!entry || typeof entry !== "object") {
              return false;
            }
            if (isBreakEntry(entry)) {
              return true;
            }
            return allWidgetIds.includes(entry.id);
          })
          .map((entry) => (isBreakEntry(entry) ? entry : { id: entry.id, size: entry.size ?? "medium" }))
      : [];
    const savedIds = saved.filter((entry) => !isBreakEntry(entry)).map((entry) => entry.id);
    const missing = allWidgetIds
      .filter((id) => !savedIds.includes(id))
      .map((id) => ({ id, size: "medium" }));
    return [...saved, ...missing];
  })();

  // ── Drag handlers
  const handleDragStart = (e, index) => {
    dragRef.current = index;
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIndex(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const from = dragRef.current;
    if (from === null || from === undefined || from === index) return;
    const next = [...normalizedLayout];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    onUpdateDashboardLayout(next);
    setDragIndex(null);
    setOverIndex(null);
    dragRef.current = null;
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
    dragRef.current = null;
  };

  const handleSizeChange = (id, size) => {
    onUpdateDashboardLayout(
      normalizedLayout.map((entry) => {
        if (isBreakEntry(entry)) {
          return entry;
        }
        return entry.id === id ? { ...entry, size } : entry;
      })
    );
  };

  const applyPreset = (sizeId) => {
    onUpdateDashboardLayout(
      normalizedLayout.map((entry) => (isBreakEntry(entry) ? entry : { ...entry, size: sizeId }))
    );
    setShowPresets(false);
  };

  const addBreakAfter = (index) => {
    const next = [...normalizedLayout];
    next.splice(index + 1, 0, createBreakEntry());
    onUpdateDashboardLayout(next);
  };

  const removeBreak = (breakId) => {
    onUpdateDashboardLayout(
      normalizedLayout.filter((entry) => !(isBreakEntry(entry) && entry.id === breakId))
    );
  };

  const handleDoneEditing = () => {
    setIsEditing(false);
    setShowPresets(false);
  };

  return (
    <>
      <section className="panel dashboard-panel">
        <div className="dashboard-topbar">
          <h2>Dashboard</h2>
          <div className="dashboard-topbar-actions">
            {isEditing && (
              <button type="button" className="ghost" onClick={() => setShowPresets(true)}>
                Layout Presets
              </button>
            )}
            <button
              type="button"
              className={isEditing ? "" : "ghost"}
              onClick={isEditing ? handleDoneEditing : () => setIsEditing(true)}
            >
              {isEditing ? "Done" : "Edit Layout"}
            </button>
          </div>
        </div>

        {isEditing && (
          <p className="dashboard-edit-hint">
            Drag widgets to reorder · Use <strong>S / M / L</strong> to resize
          </p>
        )}

        <div className={`dashboard-grid${isEditing ? " editing" : ""}`}>
          {normalizedLayout.map((entry, index) => {
            const isDragging = dragIndex === index;
            const isOver = overIndex === index && dragIndex !== null && dragIndex !== index;

            if (isBreakEntry(entry)) {
              return (
                <Fragment key={`${entry.id}-${index}`}>
                  <div
                    className={[
                      "dashboard-break-item",
                      isDragging ? "dragging" : "",
                      isOver ? "drag-over" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    draggable={isEditing}
                    onDragStart={isEditing ? (e) => handleDragStart(e, index) : undefined}
                    onDragOver={isEditing ? (e) => handleDragOver(e, index) : undefined}
                    onDrop={isEditing ? (e) => handleDrop(e, index) : undefined}
                    onDragEnd={isEditing ? handleDragEnd : undefined}
                  >
                    {isEditing ? (
                      <div className="widget-edit-bar">
                        <span className="widget-drag-handle" aria-hidden="true">⠿</span>
                        <button
                          type="button"
                          className="ghost break-remove-btn"
                          onClick={() => removeBreak(entry.id)}
                        >
                          Remove Break
                        </button>
                      </div>
                    ) : null}
                    <div className="dashboard-break-line">
                      <span>Line Break</span>
                    </div>
                  </div>
                  {isEditing ? (
                    <button
                      type="button"
                      className="ghost dashboard-insert-break-btn"
                      onClick={() => addBreakAfter(index)}
                    >
                      + Add Line Break
                    </button>
                  ) : null}
                </Fragment>
              );
            }

            const type = widgetTypeById[entry.id];
            if (!type) return null;

            return (
              <Fragment key={`${entry.id}-${index}`}>
                <div
                  className={[
                    "dashboard-widget",
                    `size-${entry.size}`,
                    isDragging ? "dragging" : "",
                    isOver ? "drag-over" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  draggable={isEditing}
                  onDragStart={isEditing ? (e) => handleDragStart(e, index) : undefined}
                  onDragOver={isEditing ? (e) => handleDragOver(e, index) : undefined}
                  onDrop={isEditing ? (e) => handleDrop(e, index) : undefined}
                  onDragEnd={isEditing ? handleDragEnd : undefined}
                >
                  {isEditing && (
                    <div className="widget-edit-bar">
                      <span className="widget-drag-handle" aria-hidden="true">
                        ⠿
                      </span>
                      <SizePicker
                        size={entry.size}
                        onChange={(s) => handleSizeChange(entry.id, s)}
                      />
                    </div>
                  )}

                  {type === "summary" && (
                    <SummaryWidget
                      savedArmies={formattedSavedArmies}
                      battleState={battleState}
                    />
                  )}

                  {type === "launcher" && (
                    <LauncherWidget
                      selectedArmies={selectedOverviewArmies}
                      onLaunchBattle={onLaunchBattle}
                    />
                  )}

                  {type === "army" && (() => {
                    const army = formattedSavedArmies.find((a) => a.id === entry.id);
                    if (!army) return null;
                    return (
                      <>
                        <ArmyWidget
                          army={army}
                          isSelected={selectedOverviewArmyIds.includes(army.id)}
                          onToggleSelection={onToggleSelection}
                          size={entry.size}
                        />
                        <div className="widget-army-actions">
                          <button
                            type="button"
                            className="ghost widget-edit-army-btn"
                            onClick={() => onEditArmy(army)}
                          >
                            Edit Army
                          </button>
                          {isEditing && (
                            <button
                              type="button"
                              className="danger widget-delete-btn"
                              onClick={() => setPendingDelete(army.id)}
                            >
                              Delete Army
                            </button>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
                {isEditing ? (
                  <button
                    type="button"
                    className="ghost dashboard-insert-break-btn"
                    onClick={() => addBreakAfter(index)}
                  >
                    + Add Line Break
                  </button>
                ) : null}
              </Fragment>
            );
          })}

          {formattedSavedArmies.length === 0 && (
            <p className="dashboard-empty">
              No armies saved yet. Build one in the Builder tab first.
            </p>
          )}
        </div>
      </section>

      <LayoutPresetsModal
        isOpen={showPresets}
        presets={PRESETS}
        onApplyPreset={applyPreset}
        onClose={() => setShowPresets(false)}
      />

      <ConfirmActionModal
        isOpen={Boolean(pendingDelete)}
        title="Delete Army?"
        message="This cannot be undone."
        confirmLabel="Delete"
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          onDeleteArmy(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </>
  );
}
