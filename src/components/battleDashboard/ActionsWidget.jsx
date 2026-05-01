export default function ActionsWidget({ onResetBattle, onEndBattle }) {
  return (
    <div className="widget-content bd-actions-widget">
      <p className="widget-eyebrow">Controls</p>
      <h3 className="widget-title">Battle Actions</h3>
      <div className="bd-action-btns">
        <button type="button" onClick={onResetBattle}>
          Reset Battle
        </button>
        <button type="button" className="ghost" onClick={onEndBattle}>
          End Battle
        </button>
      </div>
    </div>
  );
}
