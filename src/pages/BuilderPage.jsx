import { useState } from "react";
import ArmySetupSection from "../components/builder/ArmySetupSection";
import AddMemberSection from "../components/builder/AddMemberSection";
import ArmyStrategySection from "../components/builder/ArmyStrategySection";
import RosterPanel from "../components/builder/RosterPanel";

function AccordionSection({ id, title, openId, setOpenId, children }) {
  const isOpen = openId === id;
  return (
    <div className={`builder-accordion${isOpen ? " is-open" : ""}`}>
      <button
        type="button"
        className="builder-accordion-header"
        onClick={() => setOpenId(isOpen ? null : id)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span className="builder-accordion-chevron">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && <div className="builder-accordion-body">{children}</div>}
    </div>
  );
}

export default function BuilderPage({
  armyId,
  onChangeArmyId,
  armyName,
  setArmyName,
  armyNotes,
  setArmyNotes,
  memberName,
  setMemberName,
  memberNotes,
  setMemberNotes,
  memberLoadout,
  setMemberLoadout,
  cardFile,
  setCardFile,
  cardFile2,
  setCardFile2,
  members,
  operativeAvailability,
  error,
  saveArmyMessage,
  saving,
  selectedArmy,
  selectedOperative,
  onAddMember,
  onRemoveMember,
  onClearRoster,
  onSaveArmy,
  onGoToOverview,
  onDeleteArmy,
  isEditingArmy,
}) {
  const [openSection, setOpenSection] = useState("details");

  return (
    <section className="builder-grid">
      {isEditingArmy && (
        <div className="builder-edit-banner">
          Editing existing army — saving will overwrite the saved version.
        </div>
      )}
      <form className="panel builder-accordion-panel" onSubmit={onAddMember}>
        <AccordionSection
          id="details"
          title="Army Details"
          openId={openSection}
          setOpenId={setOpenSection}
        >
          <ArmySetupSection
            armyId={armyId}
            onChangeArmyId={onChangeArmyId}
            armyName={armyName}
            setArmyName={setArmyName}
            armyNotes={armyNotes}
            setArmyNotes={setArmyNotes}
          />
        </AccordionSection>

        <AccordionSection
          id="strategy"
          title="Strategy"
          openId={openSection}
          setOpenId={setOpenSection}
        >
          <ArmyStrategySection selectedArmy={selectedArmy} />
        </AccordionSection>

        <AccordionSection
          id="members"
          title="Add Member"
          openId={openSection}
          setOpenId={setOpenSection}
        >
          <AddMemberSection
            memberName={memberName}
            setMemberName={setMemberName}
            memberNotes={memberNotes}
            setMemberNotes={setMemberNotes}
            memberLoadout={memberLoadout}
            setMemberLoadout={setMemberLoadout}
            setCardFile={setCardFile}
            setCardFile2={setCardFile2}
            error={error}
            saveArmyMessage={saveArmyMessage}
            saving={saving}
            selectedArmy={selectedArmy}
            selectedOperative={selectedOperative}
            members={members}
            operativeAvailability={operativeAvailability}
            onClearRoster={onClearRoster}
          />
        </AccordionSection>
      </form>

      <RosterPanel
        members={members}
        armyName={armyName}
        armyNotes={armyNotes}
        selectedArmy={selectedArmy}
        onRemoveMember={onRemoveMember}
        onSaveArmy={onSaveArmy}
        onGoToOverview={onGoToOverview}
        onDeleteArmy={onDeleteArmy}
      />
    </section>
  );
}
