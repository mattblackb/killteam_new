import { Fragment, useRef, useState } from "react";
import ActionsWidget from "../components/battleDashboard/ActionsWidget";
import ArmyWidget from "../components/battleDashboard/ArmyWidget";
import FactionRulesWidget from "../components/battleDashboard/FactionRulesWidget";
import { AddWidgetModal, CardModal, LayoutPresetsModal } from "../components/modals/AppModals";
import ObjectivesWidget from "../components/battleDashboard/ObjectivesWidget";
import ScoreboardWidget from "../components/battleDashboard/ScoreboardWidget";
import SummaryWidget from "../components/battleDashboard/SummaryWidget";
import TurnWidget from "../components/battleDashboard/TurnWidget";

function isBreakEntry(entry) {
  return entry && typeof entry === "object" && entry.type === "break" && typeof entry.id === "string";
}

function createBreakEntry() {
  return {
    id: `break-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: "break"
  };
}

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
          title={`Set widget size to ${s}`}
        >
          {s[0].toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function ArmyLayoutPicker({ layout, onChange }) {
  return (
    <div className="army-layout-picker" role="group" aria-label="Army widget layout">
      {[
        { key: "a", label: "A", title: "Layout A: current list" },
        { key: "b", label: "B", title: "Layout B: bottom expandable card" },
        { key: "c", label: "C", title: "Layout C: larger thumbnails" },
      ].map((option) => (
        <button
          key={option.key}
          type="button"
          className={`layout-pill ${layout === option.key ? "active" : ""}`}
          onClick={() => onChange(option.key)}
          aria-label={option.title}
          title={option.title}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ReorderControls({
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onMoveTop,
  onMoveBottom,
}) {
  return (
    <div className="widget-move-controls" role="group" aria-label="Move widget position">
      <button
        type="button"
        className="ghost move-btn"
        onClick={onMoveUp}
        disabled={!canMoveUp}
        aria-label="Move up"
        title="Move up"
      >
        ↑
      </button>
      <button
        type="button"
        className="ghost move-btn"
        onClick={onMoveDown}
        disabled={!canMoveDown}
        aria-label="Move down"
        title="Move down"
      >
        ↓
      </button>
      <button
        type="button"
        className="ghost move-btn move-btn-text"
        onClick={onMoveTop}
        disabled={!canMoveUp}
        aria-label="Move to top"
        title="Move to top"
      >
        Top
      </button>
      <button
        type="button"
        className="ghost move-btn move-btn-text"
        onClick={onMoveBottom}
        disabled={!canMoveDown}
        aria-label="Move to bottom"
        title="Move to bottom"
      >
        Bottom
      </button>
    </div>
  );
}

// ── Presets config ─────────────────────────────────────────────────────────────

const PRESETS = [
  {
    id: "small",
    label: "Compact",
    desc: "Dense view — all widgets visible",
    pattern: [1, 1, 1, 1, 1, 1],
  },
  {
    id: "medium",
    label: "Standard",
    desc: "Balanced layout",
    pattern: [2, 2, 2, 2],
  },
  {
    id: "large",
    label: "Detailed",
    desc: "Full-width, maximum detail",
    pattern: [4, 4],
  },
];

const WIDGET_CATALOG = {
  scoreboard: {
    name: "Battle Scoreboard",
    description: "Track turn, CP, VP, and objective scores for each team in one card."
  },
  turn: {
    name: "Turn Tracker",
    description: "Advance or rewind the battle turn quickly."
  },
  actions: {
    name: "Battle Actions",
    description: "Reset or end the current battle from one place."
  },
  summary: {
    name: "Battle Summary",
    description: "See VP, CP, and alive/out counts for each army."
  }
};

const OBJECTIVES_CATALOG_ENTRY = {
  name: "Objectives",
  description: "Track Crit Op, Tac Op, Kill Op and Primary scores for a team."
};

const FACTION_RULES_CATALOG_ENTRY = {
  name: "Faction Rules",
  description: "View the faction rules for a team during battle."
};

// ── Main component ─────────────────────────────────────────────────────────────

export default function BattleDashboardPage({
  battleState,
  onUpdateTurn,
  onUpdateCounter,
  onUpdateWounds,
  onUpdateMemberState,
  onResetBattle,
  onEndBattle,
  onGoToOverview,
  battleDashboardLayout,
  onUpdateBattleDashboardLayout,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [layoutPickerWidgetId, setLayoutPickerWidgetId] = useState(null);
  const [activeCardId, setActiveCardId] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const dragRef = useRef(null);

  if (!battleState) {
    return (
      <section className="battle-panel">
        <section className="panel overview-panel">
          <h2>No active battle</h2>
          <p className="intro">
            Select one or two saved armies in Overview to launch the tracker.
          </p>
          <button type="button" onClick={onGoToOverview}>
            Go To Overview
          </button>
        </section>
      </section>
    );
  }

  // Build widget definitions
  const armies = battleState.armies ?? [];
  const fixedWidgets = [
    { id: "scoreboard", type: "scoreboard" },
    { id: "turn", type: "turn" },
    { id: "actions", type: "actions" },
    { id: "summary", type: "summary" },
  ];
  const armyWidgets = armies.map((a) => ({ id: `army-${a.id}`, type: "army", armyId: a.id }));
  const objectivesWidgets = armies.map((a) => ({ id: `objectives-${a.id}`, type: "objectives", armyId: a.id }));
  const factionRulesWidgets = armies.map((a) => ({ id: `faction-rules-${a.id}`, type: "faction-rules", armyId: a.id }));
  const allWidgets = [...fixedWidgets, ...armyWidgets, ...objectivesWidgets, ...factionRulesWidgets];
  const allWidgetIds = allWidgets.map((w) => w.id);
  const widgetMetaById = Object.fromEntries(allWidgets.map((w) => [w.id, w]));

  const buildDefaultLayout = () => {
    if (armies.length === 2) {
      return [
        { id: "scoreboard", size: "large" },
        { id: `army-${armies[0].id}`, size: "medium", armyLayout: "a" },
        { id: `army-${armies[1].id}`, size: "medium", armyLayout: "a" },
        { id: "actions", size: "medium" },
      ];
    }

    return [
      ...fixedWidgets.map((widget) => ({ id: widget.id, size: "medium" })),
      ...armyWidgets.map((widget) => ({ id: widget.id, size: "medium", armyLayout: "a" })),
    ];
  };

  // Merge persisted layout
  const normalizedLayout = (() => {
    const hasSavedLayout = Array.isArray(battleDashboardLayout);

    if (!hasSavedLayout) {
      return buildDefaultLayout().map((entry) => {
        const meta = widgetMetaById[entry.id];
        if (meta?.type === "army") {
          return { ...entry, armyLayout: entry.armyLayout ?? "a" };
        }
        return entry;
      });
    }

    const saved = Array.isArray(battleDashboardLayout)
      ? battleDashboardLayout
          .filter((entry) => {
            if (!entry || typeof entry !== "object") {
              return false;
            }
            if (isBreakEntry(entry)) {
              return true;
            }
            return allWidgetIds.includes(entry.id);
          })
          .map((entry) =>
            isBreakEntry(entry)
              ? entry
              : { id: entry.id, size: entry.size ?? "medium", armyLayout: entry.armyLayout }
          )
      : [];
    const savedIds = saved.filter((entry) => !isBreakEntry(entry)).map((entry) => entry.id);
    const missingFixed = hasSavedLayout
      ? []
      : fixedWidgets
          .filter((widget) => !savedIds.includes(widget.id))
          .map((widget) => ({ id: widget.id, size: "medium" }));
    const missingArmies = armyWidgets
      .filter((widget) => !savedIds.includes(widget.id))
      .map((widget) => ({ id: widget.id, size: "medium", armyLayout: "a" }));

    const normalized = [...saved, ...missingFixed, ...missingArmies].map((entry) => {
      if (isBreakEntry(entry)) {
        return entry;
      }
      const meta = widgetMetaById[entry.id];
      if (meta?.type === "army") {
        return { ...entry, armyLayout: entry.armyLayout ?? "a" };
      }
      return entry;
    });

    return normalized;
  })();

  const availableWidgetOptions = fixedWidgets
    .filter((widget) => !normalizedLayout.some((entry) => !isBreakEntry(entry) && entry.id === widget.id))
    .map((widget) => ({
      id: widget.id,
      name: WIDGET_CATALOG[widget.id]?.name ?? widget.id,
      description: WIDGET_CATALOG[widget.id]?.description ?? ""
    }))
    .concat(
      objectivesWidgets
        .filter((widget) => !normalizedLayout.some((entry) => !isBreakEntry(entry) && entry.id === widget.id))
        .map((widget) => {
          const army = armies.find((a) => a.id === widget.armyId);
          return {
            id: widget.id,
            name: `${OBJECTIVES_CATALOG_ENTRY.name} — ${army?.armyName ?? widget.armyId}`,
            description: OBJECTIVES_CATALOG_ENTRY.description
          };
        })
    )
    .concat(
      factionRulesWidgets
        .filter((widget) => !normalizedLayout.some((entry) => !isBreakEntry(entry) && entry.id === widget.id))
        .map((widget) => {
          const army = armies.find((a) => a.id === widget.armyId);
          return {
            id: widget.id,
            name: `${FACTION_RULES_CATALOG_ENTRY.name} — ${army?.armyName ?? widget.armyId}`,
            description: FACTION_RULES_CATALOG_ENTRY.description
          };
        })
    );

  // All cards for the modal
  const allCards = armies.flatMap((army) =>
    army.members
      .filter((m) => m.imageDataUrl)
      .map((m) => ({
        id: m.id,
        armyId: army.id,
        operative: m.operative,
        imageDataUrl: m.imageDataUrl,
        memberNotes: m.memberNotes || "",
        armyName: army.armyName,
      }))
  );

  // Drag handlers
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
    onUpdateBattleDashboardLayout(next);
    setDragIndex(null);
    setOverIndex(null);
    dragRef.current = null;
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
    dragRef.current = null;
  };

  const moveEntryToIndex = (from, to) => {
    if (from < 0 || from >= normalizedLayout.length || to < 0 || to >= normalizedLayout.length || from === to) {
      return;
    }
    const next = [...normalizedLayout];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onUpdateBattleDashboardLayout(next);
  };

  const moveEntryByOffset = (index, offset) => {
    const target = index + offset;
    if (target < 0 || target >= normalizedLayout.length) {
      return;
    }
    moveEntryToIndex(index, target);
  };

  const moveEntryToBoundary = (index, boundary) => {
    if (boundary === "top") {
      moveEntryToIndex(index, 0);
      return;
    }
    moveEntryToIndex(index, normalizedLayout.length - 1);
  };

  const handleSizeChange = (id, size) => {
    onUpdateBattleDashboardLayout(
      normalizedLayout.map((entry) => {
        if (isBreakEntry(entry)) {
          return entry;
        }
        return entry.id === id ? { ...entry, size } : entry;
      })
    );
  };

  const handleArmyLayoutChange = (id, armyLayout) => {
    onUpdateBattleDashboardLayout(
      normalizedLayout.map((entry) => {
        if (isBreakEntry(entry)) {
          return entry;
        }
        return entry.id === id ? { ...entry, armyLayout } : entry;
      })
    );
  };

  const applyPreset = (sizeId) => {
    onUpdateBattleDashboardLayout(
      normalizedLayout.map((entry) => (isBreakEntry(entry) ? entry : { ...entry, size: sizeId }))
    );
    setShowPresets(false);
  };

  const addWidgetToLayout = (widgetId) => {
    if (normalizedLayout.some((entry) => !isBreakEntry(entry) && entry.id === widgetId)) {
      return;
    }
    onUpdateBattleDashboardLayout([...normalizedLayout, { id: widgetId, size: "medium" }]);
    setShowAddWidget(false);
  };

  const removeWidgetFromLayout = (widgetId) => {
    onUpdateBattleDashboardLayout(
      normalizedLayout.filter((entry) => isBreakEntry(entry) || entry.id !== widgetId)
    );
  };

  const addBreakAfter = (index) => {
    const next = [...normalizedLayout];
    next.splice(index + 1, 0, createBreakEntry());
    onUpdateBattleDashboardLayout(next);
  };

  const removeBreak = (breakId) => {
    onUpdateBattleDashboardLayout(
      normalizedLayout.filter((entry) => !(isBreakEntry(entry) && entry.id === breakId))
    );
  };

  const resetLayoutToDefault = () => {
    onUpdateBattleDashboardLayout(buildDefaultLayout());
    setShowAddWidget(false);
    setShowPresets(false);
    setLayoutPickerWidgetId(null);
  };

  return (
    <>
      <section className="battle-panel">
        {/* Top bar */}
        <section className=" battle-topbar">
         
          <div className="battle-actions">
            {isEditing && (
              <button
                type="button"
                className="ghost"
                onClick={() => setShowPresets(true)}
                title="Open layout size presets"
              >
                Layout Presets
              </button>
            )}
            {isEditing && (
              <button
                type="button"
                className="ghost"
                onClick={() => setShowAddWidget(true)}
                disabled={availableWidgetOptions.length === 0}
                title={availableWidgetOptions.length === 0 ? "No widgets available to add" : "Add another widget to the dashboard"}
              >
                Add Widget
              </button>
            )}
            <button
              type="button"
              className={isEditing ? "" : "ghost"}
              onClick={isEditing ? () => {
                setIsEditing(false);
                setShowAddWidget(false);
                setShowPresets(false);
                setLayoutPickerWidgetId(null);
              } : () => setIsEditing(true)}
              title={isEditing ? "Finish editing dashboard layout" : "Edit dashboard layout"}
            >
              {isEditing ? "Done" : "Edit Layout"}
            </button>
            <button
              type="button"
              className="ghost"
              onClick={resetLayoutToDefault}
              title="Restore the default widget layout"
            >
              Reset to Default
            </button>
          </div>
        </section>

        {isEditing && (
          <p className="dashboard-edit-hint" style={{ marginTop: 14 }}>
            Drag or use arrows to reorder · Use <strong>S / M / L</strong> to resize
          </p>
        )}

        {/* Widget grid */}
        <div className={`dashboard-grid${isEditing ? " editing" : ""}`} style={{ marginTop: 14 }}>
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
                        <span className="widget-drag-handle" aria-hidden="true" title="Drag to reorder">⠿</span>
                        <ReorderControls
                          canMoveUp={index > 0}
                          canMoveDown={index < normalizedLayout.length - 1}
                          onMoveUp={() => moveEntryByOffset(index, -1)}
                          onMoveDown={() => moveEntryByOffset(index, 1)}
                          onMoveTop={() => moveEntryToBoundary(index, "top")}
                          onMoveBottom={() => moveEntryToBoundary(index, "bottom")}
                        />
                        <button
                          type="button"
                          className="ghost break-remove-btn"
                          onClick={() => removeBreak(entry.id)}
                          title="Remove this line break"
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
                      title="Insert a line break below"
                    >
                      + Add Line Break
                    </button>
                  ) : null}
                </Fragment>
              );
            }

            const meta = widgetMetaById[entry.id];
            if (!meta) return null;

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
                      <span className="widget-drag-handle" aria-hidden="true" title="Drag to reorder">⠿</span>
                      <div className="widget-edit-actions">
                        <ReorderControls
                          canMoveUp={index > 0}
                          canMoveDown={index < normalizedLayout.length - 1}
                          onMoveUp={() => moveEntryByOffset(index, -1)}
                          onMoveDown={() => moveEntryByOffset(index, 1)}
                          onMoveTop={() => moveEntryToBoundary(index, "top")}
                          onMoveBottom={() => moveEntryToBoundary(index, "bottom")}
                        />
                        <SizePicker
                          size={entry.size}
                          onChange={(s) => handleSizeChange(entry.id, s)}
                        />
                        {meta.type === "army" ? (
                          <>
                            <button
                              type="button"
                              className="ghost layout-toggle-btn"
                              onClick={() =>
                                setLayoutPickerWidgetId((current) => (current === entry.id ? null : entry.id))
                              }
                              aria-label="Change army widget layout"
                              title="Change army widget layout"
                            >
                              ▦
                            </button>
                            {layoutPickerWidgetId === entry.id ? (
                              <ArmyLayoutPicker
                                layout={entry.armyLayout ?? "a"}
                                onChange={(layout) => handleArmyLayoutChange(entry.id, layout)}
                              />
                            ) : null}
                          </>
                        ) : null}
                        {meta.type !== "army" ? (
                          <button
                            type="button"
                            className="ghost break-remove-btn"
                            onClick={() => removeWidgetFromLayout(entry.id)}
                            title="Remove this widget from the layout"
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>
                    </div>
                  )}

                  {meta.type === "turn" && (
                    <TurnWidget
                      turnNumber={battleState.turnNumber}
                      onUpdateTurn={onUpdateTurn}
                      size={entry.size}
                    />
                  )}

                  {meta.type === "scoreboard" && (
                    <ScoreboardWidget
                      battleState={battleState}
                      onUpdateTurn={onUpdateTurn}
                      onUpdateCounter={onUpdateCounter}
                      size={entry.size}
                    />
                  )}

                  {meta.type === "actions" && (
                    <ActionsWidget
                      onResetBattle={onResetBattle}
                      onEndBattle={onEndBattle}
                    />
                  )}

                  {meta.type === "summary" && (
                    <SummaryWidget battleState={battleState} />
                  )}

                  {meta.type === "army" && (() => {
                    const army = armies.find((a) => a.id === meta.armyId);
                    if (!army) return null;
                    return (
                      <ArmyWidget
                        army={army}
                        onUpdateCounter={onUpdateCounter}
                        onUpdateWounds={onUpdateWounds}
                        onUpdateMemberState={onUpdateMemberState}
                        onOpenCard={(id) => setActiveCardId(id)}
                        size={entry.size}
                        layoutMode={entry.armyLayout ?? "a"}
                      />
                    );
                  })()}

                  {meta.type === "objectives" && (() => {
                    const army = armies.find((a) => a.id === meta.armyId);
                    if (!army) return null;
                    return (
                      <ObjectivesWidget
                        army={army}
                        onUpdateCounter={onUpdateCounter}
                        size={entry.size}
                      />
                    );
                  })()}

                  {meta.type === "faction-rules" && (() => {
                    const army = armies.find((a) => a.id === meta.armyId);
                    if (!army) return null;
                    return (
                      <FactionRulesWidget
                        army={army}
                        size={entry.size}
                      />
                    );
                  })()}
                </div>
                {isEditing ? (
                  <button
                    type="button"
                    className="ghost dashboard-insert-break-btn"
                    onClick={() => addBreakAfter(index)}
                    title="Insert a line break below"
                  >
                    + Add Line Break
                  </button>
                ) : null}
              </Fragment>
            );
          })}
        </div>
      </section>

      {/* Card viewer modal */}
      {activeCardId && (
        <CardModal
          allCards={allCards}
          activeId={activeCardId}
          onClose={() => setActiveCardId(null)}
        />
      )}

      <LayoutPresetsModal
        isOpen={showPresets}
        presets={PRESETS}
        onApplyPreset={applyPreset}
        onClose={() => setShowPresets(false)}
      />

      <AddWidgetModal
        isOpen={showAddWidget}
        options={availableWidgetOptions}
        onAddWidget={addWidgetToLayout}
        onClose={() => setShowAddWidget(false)}
      />
    </>
  );
}
